import * as React from "react"
import { QueryClient, dehydrate } from "@tanstack/react-query"
import { useRouter } from "next/router"
import Head from "next/head"
import dynamic from "next/dynamic"
import { GetServerSideProps } from "next"
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
} from "@/lib/wp-posts"
import { SinglePostLayout } from "@/layouts/SinglePost"

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

export const getServerSideProps: GetServerSideProps = async ({
  params,
  res,
}: any) => {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=120, stale-while-revalidate=600",
  )

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
  }
}
