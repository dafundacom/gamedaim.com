import * as React from "react"
import dynamic from "next/dynamic"
import { QueryClient, dehydrate } from "@tanstack/react-query"
import { useRouter } from "next/router"
import { NextSeo } from "next-seo"
import NextLink from "next/link"
import env from "@/env"
import { wpGetMenusByName } from "@/lib/wp-menus"
import { getArticles, useGetArticles } from "@/lib/articles"
import { PostCard } from "@/components/Card"

const HomeLayout = dynamic(() =>
  import("@/layouts/Home").then((mod) => mod.HomeLayout),
)
const PostCardSide = dynamic(() =>
  import("@/components/Card").then((mod) => mod.PostCardSide),
)

const Heading = dynamic(() => import("ui").then((mod) => mod.Heading))

export default function Articles() {
  const router = useRouter()
  const { getArticlesData } = useGetArticles()

  return (
    <>
      <NextSeo
        title={`${env.SITE_TITLE} | Everlasting Gaming Knowledge`}
        description={env.DESCRIPTION}
        canonical={`https/${env.DOMAIN}${router.pathname}`}
        openGraph={{
          url: `https/${env.DOMAIN}${router.pathname}`,
          title: `${env.SITE_TITLE} | Everlasting Gaming Knowledge`,
          description: env.DESCRIPTION,
        }}
      />
      <HomeLayout>
        {getArticlesData?.isSuccess === true && (
          <section className="flex w-full flex-col">
            <div className="relative mb-10 flex flex-col bg-gradient-to-r !from-[#1e3799] !to-[#0984e3] py-10">
              <div className="absolute top-1">
                <nav className="ml-2 flex" aria-label="Breadcrumb">
                  <ol className="inline-flex items-center text-white">
                    <li className="inline-flex items-center">
                      <NextLink
                        href="/"
                        className="inline-flex items-center text-sm font-medium text-white after:ml-2 after:mr-2 after:inline-block after:align-top after:font-normal after:not-italic after:content-['>'] dark:text-gray-400 dark:hover:text-white"
                      >
                        Home
                      </NextLink>
                    </li>
                    <li aria-current="page">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-white dark:text-gray-400">
                          {"Articles"}
                        </span>
                      </div>
                    </li>
                  </ol>
                </nav>
              </div>
              <div className="self-center">
                <Heading size="4xl" className="text-white">
                  Gamedaim
                </Heading>
              </div>
            </div>
            <div className="mx-auto flex w-full flex-row md:max-[991px]:max-w-[750px] min-[992px]:max-[1199px]:max-w-[970px] lg:mx-auto lg:px-4 min-[1200px]:max-w-[1170px]">
              <div className="flex w-full flex-col px-4 lg:mr-4">
                {getArticlesData?.data?.articles.map(
                  (post: {
                    id: string
                    featuredImage: { url: string; alt: string }
                    slug: string
                    title: string
                    description: string
                    author: {
                      name: string
                      profilPicture: string
                      username: string
                    }
                    createdAt: string
                  }) => {
                    return (
                      <PostCard
                        key={post.id}
                        src={post.featuredImage?.url}
                        alt={post.featuredImage?.alt}
                        slug={post.slug}
                        title={post.title}
                        excerpt={post.description}
                        authorName={post.author?.name}
                        authorAvatarUrl={post.author?.profilPicture}
                        authorUri={post.author?.username}
                        date={post.createdAt}
                        isWP={false}
                      />
                    )
                  },
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
                  {getArticlesData?.data?.articles.map(
                    (post: {
                      id: string
                      featuredImage: { url: string; alt: string }
                      title: string
                      slug: string
                    }) => {
                      return (
                        <PostCardSide
                          key={post.id}
                          src={post.featuredImage?.url}
                          alt={post.featuredImage?.alt}
                          title={post.title}
                          slug={post.slug}
                          isWP={false}
                        />
                      )
                    },
                  )}
                </div>
              </aside>
            </div>
          </section>
        )}
      </HomeLayout>
    </>
  )
}

export async function getServerSideProps() {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery(["menus"], () =>
    wpGetMenusByName(env.MENU_PRIMARY),
  )
  await queryClient.prefetchQuery(["articles"], () => getArticles())

  return {
    props: { dehydratedState: dehydrate(queryClient) },
  }
}
