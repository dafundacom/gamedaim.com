import * as React from "react"
import Head from "next/head"
import dynamic from "next/dynamic"
import { QueryClient, dehydrate } from "@tanstack/react-query"
import { useRouter } from "next/router"

import { HomeLayout } from "@/layouts/Home"
import {
  getArticleBySlug,
  getArticles,
  useGetArticleBySlug,
  useGetArticles,
} from "@/lib/articles"

import { PostCardSide } from "@/components/Card"
import { Article } from "@/components/Article"

const Heading = dynamic(() => import("ui").then((mod) => mod.Heading))

export default function Post() {
  const router = useRouter()
  const {
    query: { slug },
  } = router
  const { getArticlesData } = useGetArticles(1)

  const { getArticleBySlugData } = useGetArticleBySlug(slug as string)

  const articleRef = React.useRef(null)
  const article: any = articleRef.current

  const postData = {
    content: getArticleBySlugData?.data?.article?.content,
    title: getArticleBySlugData?.data?.article?.title,
    authorName: getArticleBySlugData?.data?.article?.author.name,
    authorUrl: getArticleBySlugData?.data?.article?.author.username,
    authorImg: getArticleBySlugData?.data?.article?.author.profilePicture,
    categories: getArticleBySlugData?.data?.article?.topics,
    featuredImageUrl: getArticleBySlugData?.data?.article?.featuredImage.url,
    featuredImageAlt: getArticleBySlugData?.data?.article?.featuredImage.name,
    featuredImageCaption:
      getArticleBySlugData?.data?.article?.featuredImage.name,
    date: getArticleBySlugData?.data?.article?.date,
    slug: getArticleBySlugData?.data?.article?.slug,
  }

  React.useEffect(() => {
    if (article) {
      const toc = article.querySelector(".ez-toc-title")
      if (toc) {
        toc.addEventListener("click", () => {
          toc.classList.toggle("open-list")
        })
      }
    }
  }, [article])
  return (
    <>
      <HomeLayout>
        <Head>
          <title>{getArticleBySlugData?.data?.article?.title}</title>
        </Head>
        <div className="flex w-full md:max-[991px]:max-w-[750px] min-[992px]:max-[1199px]:max-w-[970px] min-[1200px]:max-w-[1170px] mx-auto">
          <section className="w-full lg:w-8/12">
            <Article
              isMain={true}
              posts={getArticlesData?.data?.articles}
              postData={postData}
            />
            {/* {articles.map(
              (
                post: {
                  title: string
                  content: string
                  author: {
                    name: string
                    slug: string
                    avatar: { url: string }
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
                },
                i: number,
                arr: { [x: string]: { slug: string } },
              ) => {
                const postData = {
                  content: post.content,
                  title: post.title,
                  authorName: post.author.name,
                  authorUrl: post.author.slug,
                  authorImg: post.author.avatar.url,
                  categories: post.categories,
                  featuredImageUrl: post.featuredImage.sourceUrl,
                  featuredImageAlt: post.featuredImage.altText,
                  featuredImageCaption: post.featuredImage.caption,
                  date: post.date,
                  slug: post.slug,
                  tags: post.tags,
                }
                if (i > 0 && arr[i].slug == post.slug) {
                  return null
                }
                return (
                  <Article
                    key={i}
                    posts={posts}
                    ref={articleRef}
                    postData={postData}
                  />
                )
              },
            )} */}
            {/* <div ref={LoaderRef}>
              <Button
                loading={hasNextPage == true}
                loadingText="Loading ..."
                colorScheme="blue"
                className="!w-full !cursor-default"
              >
                No More Posts
              </Button>
            </div> */}
          </section>
          <aside className="w-4/12 px-4 hidden lg:!block">
            <div className="rounded-xl border border-gray-100 dark:border-gray-700 p-4 sticky top-8">
              <div className="mb-4">
                <Heading as="h4" className="!text-transparent">
                  <span className="after:absolute after:border after:border-[#1e3799] after:bg-[#1e3799] after:h-[3px] after:w-[50px] after:ml-[-25px] after:left-1/2 after:top-[40px]">
                    Trending
                  </span>
                </Heading>
              </div>
              {getArticlesData?.data?.articles.map(
                (post: {
                  id: number
                  featuredImage: {
                    url: string
                    alt: string
                  }
                  title: string
                  slug: string
                  excerpt: string
                  categories: any
                }) => {
                  return (
                    <PostCardSide
                      key={post.id}
                      src={post.featuredImage.url}
                      alt={post.featuredImage.alt}
                      slug={`/article/${post.slug}`}
                      title={post.title}
                    />
                  )
                },
              )}
            </div>
          </aside>
        </div>
      </HomeLayout>
    </>
  )
}

export const getServerSideProps = async ({ params, res }: any) => {
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
    // revalidate: 100,
  }
}
// export const getStaticPaths: GetStaticPaths = async () => {
//   const { articles }: any = await getArticles(1)

//   const paths = articles.map((post: any) => {
//     const { slug } = post
//     return {
//       params: {
//         slug: slug,
//       },
//     }
//   })
//   return {
//     paths,
//     fallback: "blocking",
//   }
// }
