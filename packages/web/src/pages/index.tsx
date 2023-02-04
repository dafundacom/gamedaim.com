import * as React from "react"
import Head from "next/head"
import parse from "html-react-parser"
import dynamic from "next/dynamic"
import env from "@/env"
import { wpGetAllPosts, useWpGetAllPosts } from "../lib/wp-posts"
import { getSeoDatas } from "@/lib/wp-seo"
import { QueryClient, dehydrate } from "@tanstack/react-query"
import { wpGetMenusByName } from "@/lib/wp-menus"

const HomeLayout = dynamic(() =>
  import("@/layouts/HomeLayout").then((mod) => mod.HomeLayout),
)
const PostCardSide = dynamic(() =>
  import("@/components/Card").then((mod) => mod.PostCardSide),
)
const ListPostFeatured = dynamic(() =>
  import("@/components/Card").then((mod) => mod.ListPostFeatured),
)
const InfiniteScroll = dynamic(() =>
  import("@/components/InfiniteScroll").then((mod) => mod.InfiniteScroll),
)
const Heading = dynamic(() => import("ui").then((mod) => mod.Heading))

interface HomeProps {
  posts: any
  pageInfo: any
  seo: {
    head: string
    success: boolean
  }
}

export default function Home(props: HomeProps) {
  const { seo } = props
  const { getAllPostsData } = useWpGetAllPosts()
  const { data }: any = getAllPostsData
  const featured = data?.posts?.slice(0, 7)

  return (
    <>
      <Head>{seo.success === true && parse(seo.head)}</Head>
      <HomeLayout>
        <section className="flex w-full flex-col">
          <ListPostFeatured featured={featured} />
          <div className="mx-auto w-full md:max-[991px]:max-w-[750px] min-[992px]:max-[1199px]:max-w-[970px] min-[1200px]:max-w-[1170px] flex flex-row">
            <div className="w-full flex flex-col px-4 lg:mr-4">
              <InfiniteScroll
                pageType="home"
                posts={data?.posts}
                pageInfo={data?.pageInfo}
              />
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
                {data?.posts.map(
                  (post: {
                    id: number
                    featuredImage: {
                      sourceUrl: string
                      altText: string
                    }
                    slug: string
                    title: string
                    excerpt: string
                    categories: any
                    uri: string
                  }) => {
                    return (
                      <PostCardSide
                        key={post.id}
                        src={post.featuredImage.sourceUrl}
                        alt={post.featuredImage.altText}
                        title={post.title}
                        slug={post.uri}
                      />
                    )
                  },
                )}
              </div>
            </aside>
          </div>
        </section>
      </HomeLayout>
    </>
  )
}

export async function getStaticProps() {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery(["menus"], () =>
    wpGetMenusByName(env.MENU_PRIMARY),
  )
  await queryClient.prefetchQuery(["posts"], () => wpGetAllPosts())
  const seo = await getSeoDatas(`https://${env.DOMAIN}`)

  return {
    props: { dehydratedState: dehydrate(queryClient), seo },
    revalidate: 60,
  }
}
