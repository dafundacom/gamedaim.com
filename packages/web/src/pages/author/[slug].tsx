import * as React from "react"
import Head from "next/head"
import parse from "html-react-parser"
import { useRouter } from "next/router"
import dynamic from "next/dynamic"
import env from "@/env"
import { getSeoDatas } from "@/lib/wp-seo"
import {
  wpGetPostsByAuthorSlug,
  useWpGetPostsByAuthorSlug,
} from "@/lib/wp-posts"
import { QueryClient, dehydrate } from "@tanstack/react-query"
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
  posts: any
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
  return (
    <>
      <Head>{seo.success === true && parse(seo.head)}</Head>
      <HomeLayout>
        <section className="mx-auto w-full md:max-[991px]:max-w-[750px] min-[992px]:max-[1199px]:max-w-[970px] min-[1200px]:max-w-[1170px] flex flex-row lg:px-4">
          <div className="w-full px-4 flex flex-col lg:mr-4">
            {getPostsByAuthorSlug?.isSuccess == true && (
              <InfiniteScroll
                pageType="author"
                posts={getPostsByAuthorSlug?.data?.posts}
                id={slug}
                pageInfo={getPostsByAuthorSlug?.data?.pageInfo}
              />
            )}
          </div>

          <aside className="w-4/12 hidden px-4 lg:block">
            <div className="rounded-xl border border-gray-100 dark:border-gray-700 p-4 sticky top-8">
              <div className="mb-4">
                <Heading as="h4" className="!text-transparent">
                  <span className="after:absolute after:border after:border-[#1e3799] after:bg-[#1e3799] after:h-[3px] after:w-[50px] after:ml-[-25px] after:left-1/2 after:top-[40px]">
                    Trending
                  </span>
                </Heading>
              </div>
              {getPostsByAuthorSlug?.data?.posts.map(
                (post: {
                  id: number
                  featuredImage: {
                    sourceUrl: string
                    altText: string
                  }
                  title: string
                  slug: string
                  excerpt: string
                  categories: any
                  uri: string
                }) => {
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

  const seo = await getSeoDatas(`https://${env.DOMAIN}/author/${params.slug}`)

  const queryClient = new QueryClient()
  const slug = params?.slug
  let isError = false
  try {
    await queryClient.prefetchQuery(["authorPosts", slug], () =>
      wpGetPostsByAuthorSlug(slug),
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
