import * as React from "react"
import { QueryClient, dehydrate } from "@tanstack/react-query"
import { useRouter } from "next/router"
import Head from "next/head"
import dynamic from "next/dynamic"
import { GetStaticProps, GetStaticPaths } from "next"
import parse from "html-react-parser"
const HomeLayout = dynamic(() =>
  import("@/layouts/HomeLayout").then((mod) => mod.HomeLayout),
)
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

interface PostProps {
  post: {
    title: string
    content: string
    author: {
      name: string
      slug: string
      avatar: {
        url: string
      }
    }
    slug: string
    categories: any
    featuredImage: {
      altText: string
      sourceUrl: string
      caption: string
    }
    tags: any
    date: string
  }
  seo: {
    head: string
    success: boolean
  }
  posts: any
}

export default function Post(props: PostProps) {
  const { seo } = props
  const router = useRouter()
  const {
    query: { slug },
  } = router
  const { getAllPostsData } = useWpGetAllPosts()

  const { getPostBySlug } = useWpGetPostBySlug(slug as string)
  return (
    <>
      <Head>{seo?.success === true && parse(seo?.head)}</Head>
      <HomeLayout>
        {getPostBySlug?.data !== undefined &&
          getAllPostsData?.data !== undefined && (
            <SinglePostLayout
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
