import * as React from "react"
import NextLink from "next/link"
import { GetServerSideProps } from "next"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { QueryClient, dehydrate } from "@tanstack/react-query"
import { getTopicBySlug, useGetTopicBySlug } from "@/lib/topics"
import { PostCard } from "@/components/Card"

const PostCardSide = dynamic(() =>
  import("@/components/Card").then((mod) => mod.PostCardSide),
)

const HomeLayout = dynamic(() =>
  import("@/layouts/Home").then((mod) => mod.HomeLayout),
)

const Heading = dynamic(() => import("ui").then((mod) => mod.Heading))

export default function Topic() {
  const router = useRouter()

  const {
    query: { slug },
  } = router
  const { getTopicBySlugData }: any = useGetTopicBySlug(slug as string)

  if (getTopicBySlugData?.isError) {
    router.push("/404")
  }
  return (
    <>
      <HomeLayout>
        {getTopicBySlugData?.isSuccess === true && (
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
                          {"Topics"}
                        </span>
                      </div>
                    </li>
                  </ol>
                </nav>
              </div>
              <div className="self-center">
                <Heading size="4xl" className="text-white">
                  {getTopicBySlugData?.data?.topic?.title}
                </Heading>
              </div>
            </div>
            <div className="mx-auto flex w-full flex-row md:max-[991px]:max-w-[750px] min-[992px]:max-[1199px]:max-w-[970px] lg:mx-auto lg:px-4 min-[1200px]:max-w-[1170px]">
              <div className="flex w-full flex-col px-4 lg:mr-4">
                {getTopicBySlugData?.data?.topic?.articles.map(
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
                  {getTopicBySlugData?.data?.topic?.articles.map(
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

export const getServerSideProps: GetServerSideProps = async ({
  params,
  res,
}: any) => {
  const queryClient = new QueryClient()
  const slug = params?.slug
  let isError = false

  try {
    await queryClient.prefetchQuery(["topicsPosts", slug], () =>
      getTopicBySlug(slug),
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
  }
}
