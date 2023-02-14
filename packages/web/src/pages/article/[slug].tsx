import * as React from "react"
import { QueryClient, dehydrate } from "@tanstack/react-query"
import { useRouter } from "next/router"
import { GetStaticProps, GetStaticPaths } from "next"

import env from "@/env"
import { getSeoDatas } from "@/lib/wp-seo"

import { SinglePostLayout } from "@/layouts/SinglePost"
import { HomeLayout } from "@/layouts/Home"
import {
  getArticleBySlug,
  getArticles,
  useGetArticleBySlug,
  useGetArticles,
} from "@/lib/articles"
import axios from "axios"

export default function Post(props) {
  const router = useRouter()
  const {
    query: { slug },
  } = router
  const { getArticlesData } = useGetArticles(1)
  const getArticles = async (page: number) => {
    let articlesData
    try {
      const { data } = await axios.get(`/article/page/${page}`)
      articlesData = data
    } catch (e) {
      console.log(`Failed to query post data: ${e}`)
      throw e
    }

    return { articles: articlesData }
  }
  React.useEffect(() => {
    const aS = async () => {
      const { articles } = await getArticles(1)
      const paths = articles.map((post: any) => {
        const { slug } = post
        return {
          params: {
            slug: slug,
          },
        }
      })
      console.log(paths)
    }
    aS()
  }, [])
  const { getArticleBySlugData } = useGetArticleBySlug(slug as string)
  return (
    <>
      <HomeLayout>sasas</HomeLayout>
    </>
  )
}

export const getStaticProps = async ({ params, res }: any) => {
  const queryClient = new QueryClient()

  let isError = false

  await queryClient.prefetchQuery(["articles", 1], () => getArticles(1))
  try {
    await queryClient.prefetchQuery(["article", params?.slug], () =>
      getArticleBySlug(params?.slug),
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
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 100,
  }
}
export const getStaticPaths: GetStaticPaths = async () => {
  const { articles }: any = await getArticles(1)

  const paths = articles.map((post: any) => {
    const { slug } = post
    return {
      params: {
        slug: slug,
      },
    }
  })
  return {
    paths,
    fallback: "blocking",
  }
}
