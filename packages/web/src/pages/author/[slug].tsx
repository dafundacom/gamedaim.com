import * as React from "react"
import Head from "next/head"
import dynamic from "next/dynamic"
import parse from "html-react-parser"
import { QueryClient, dehydrate, QueryCache } from "@tanstack/react-query"
import { useRouter } from "next/router"

import env from "@/env"
import { getSeoDatas } from "@/lib/wp-seo"
import {
  wpGetPostsByAuthorSlug,
  useWpGetPostsByAuthorSlug,
  wpGetAllPosts,
  useWpGetAllPosts,
} from "@/lib/wp-posts"
import { WpPostsDataProps, WpSinglePostDataProps } from "@/lib/wp-data-types"

const PostCardSide = dynamic(() =>
  import("@/components/Card").then((mod) => mod.PostCardSide),
)
const HomeLayout = dynamic(() =>
  import("@/layouts/Home").then((mod) => mod.HomeLayout),
)
const InfiniteScroll = dynamic(() =>
  import("@/components/InfiniteScroll").then((mod) => mod.InfiniteScroll),
)
const Heading = dynamic(() => import("ui").then((mod) => mod.Heading))

interface AuthorProps {
  posts: WpPostsDataProps
  pageInfo: any
  seo: {
    head: string
    success: boolean
  }
}

export default function Author(props: AuthorProps) {
  const { seo } = props

  const router: any = useRouter()
  const {
    query: { slug },
  } = router

  const { getPostsByAuthorSlug }: any = useWpGetPostsByAuthorSlug(slug)
  const { getAllPostsData }: any = useWpGetAllPosts()

  return (
    <>
      <Head>{seo.success === true && parse(seo.head)}</Head>
      <HomeLayout>
        <section className="mx-auto flex w-full flex-row md:max-[991px]:max-w-[750px] min-[992px]:max-[1199px]:max-w-[970px] lg:px-4 min-[1200px]:max-w-[1170px]">
          <div className="flex w-full flex-col px-4 lg:mr-4">
            {getPostsByAuthorSlug?.isSuccess === true && (
              <InfiniteScroll
                pageType="author"
                posts={getPostsByAuthorSlug?.data?.posts}
                id={slug}
                pageInfo={getPostsByAuthorSlug?.data?.pageInfo}
              />
            )}
          </div>

          <aside className="hidden w-4/12 px-4 lg:block">
            <div className="sticky top-8 rounded-xl border border-gray-100 p-4 dark:border-gray-700">
              <div className="mb-4">
                <Heading as="h4" className="!text-transparent">
                  <span className="after:absolute after:left-1/2 after:top-[40px] after:ml-[-25px] after:h-[3px] after:w-[50px] after:border after:border-[#1e3799] after:bg-[#1e3799]">
                    Trending
                  </span>
                </Heading>
              </div>
              {getAllPostsData?.data?.posts?.map(
                (post: WpSinglePostDataProps) => {
                  return (
                    <PostCardSide
                      key={post.id}
                      src={post.featuredImage.sourceUrl}
                      alt={post.featuredImage.altText}
                      slug={post.uri}
                      title={post.title}
                    />
                  )
                },
              )}
            </div>
          </aside>
        </section>
      </HomeLayout>
    </>
  )
}

export const getServerSideProps = async ({ params, res }: any) => {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=120, stale-while-revalidate=600",
  )

  let isError = false

  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onSuccess: async (data: any) => {
        if (data.error) {
          isError = true
        }
      },
    }),
  })

  const seo = await getSeoDatas(`https://${env.DOMAIN}/author/${params.slug}`)

  const slug = params?.slug

  try {
    await queryClient.prefetchQuery(["authorPosts", slug], () =>
      wpGetPostsByAuthorSlug(slug),
    )
    await queryClient.prefetchQuery(["posts"], () => wpGetAllPosts())
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
