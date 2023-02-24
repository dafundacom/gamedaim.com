import * as React from "react"
import dynamic from "next/dynamic"
import { QueryClient, dehydrate } from "@tanstack/react-query"
import { useRouter } from "next/router"
import { NextSeo, ArticleJsonLd, BreadcrumbJsonLd } from "next-seo"

import env from "@/env"
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
      <NextSeo
        title={`${article.title} — ${env.SITE_TITLE}`}
        description={article.excerpt}
        canonical={`https://${env.DOMAIN}/${article.slug}`}
        openGraph={{
          url: `https://${env.DOMAIN}/${article.slug}`,
          title: `${article.title} — ${env.SITE_TITLE}`,
          description: article.excerpt,
        }}
      />
      <ArticleJsonLd
        url={`https://${env.DOMAIN}/${article.slug}`}
        title={`${article.title} — ${env.SITE_TITLE}`}
        images={[article.featuredImage.url]}
        datePublished={article.createdAt}
        dateModified={article.createdAt}
        authorName={[
          {
            name: article.author.name,
            url: `https://${env.DOMAIN}/user/${article.author.username}`,
          },
        ]}
        publisherName={env.SITE_TITLE}
        publisherLogo={env.LOGO_URL}
        description={article.excerpt}
        isAccessibleForFree={true}
      />
      <BreadcrumbJsonLd
        itemListElements={[
          {
            position: 1,
            name: "Article",
            item: `https://${env.domain}/article`,
          },
          {
            position: 2,
            name: article.topics[0].title,
            item: `https://${env.domain}/topic/${article.topics[0].slug}`,
          },
        ]}
      />
      <HomeLayout>
        <div className="mx-auto flex w-full md:max-[991px]:max-w-[750px] min-[992px]:max-[1199px]:max-w-[970px] min-[1200px]:max-w-[1170px]">
          <section className="w-full lg:w-8/12">
            {getArticleBySlugData?.isSuccess && (
              <Article
                isMain={true}
                posts={getArticlesData?.data?.articles}
                postData={postData}
              />
            )}
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
          <aside className="hidden w-4/12 px-4 lg:!block">
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
  }
}
