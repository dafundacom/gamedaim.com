import * as React from "react"
import { QueryClient, dehydrate } from "@tanstack/react-query"
import { useRouter } from "next/router"
import { GetStaticProps, GetStaticPaths } from "next"

import env from "@/env"
import { getSeoDatas } from "@/lib/wp-seo"
import {
  wpGetPostBySlug,
  wpGetAllPosts,
  useWpGetAllPosts,
  useWpGetPostBySlug,
  wpGetAllSlug,
} from "@/lib/wp-posts"
import { SinglePostLayout } from "@/layouts/SinglePost"
import { wpPrimaryCategorySlug } from "@/lib/wp-categories"
import { HomeLayout } from "@/layouts/Home"

export default function Post(props: { seo: any }) {
  const { seo } = props
  const router = useRouter()
  const {
    query: { slug },
  } = router
  const { getAllPostsData } = useWpGetAllPosts()

  const { getPostBySlug } = useWpGetPostBySlug(slug as string)
  return (
    <>
      <HomeLayout>
        {getPostBySlug?.data !== undefined &&
          getAllPostsData?.data !== undefined && (
            <SinglePostLayout
              seoData={seo}
              post={getPostBySlug?.data?.post}
              posts={getAllPostsData?.data?.posts}
            />
          )}
      </HomeLayout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ params, res }: any) => {
  const queryClient = new QueryClient()

  let isError = false

  const seo = await getSeoDatas(
    `https://${env.DOMAIN}/${params.category}/${params.slug}`,
  )
  await queryClient.prefetchQuery(["posts"], () => wpGetAllPosts())
  try {
    await queryClient.prefetchQuery(["post", params?.slug], () =>
      wpGetPostBySlug(params?.slug),
    )
  } catch (error: any) {
    isError = true
    res.statusCode = error.response.status
  }
  if (isError) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      seo,
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 100,
  }
}
export const getStaticPaths: GetStaticPaths = async () => {
  const { posts }: any = await wpGetAllSlug()

  const paths = posts.map((post: any) => {
    const { slug, categories } = post
    const { primary } = wpPrimaryCategorySlug(categories)
    return {
      params: {
        category: primary.slug,
        slug: slug,
      },
    }
  })
  return {
    paths,
    fallback: "blocking",
  }
}
