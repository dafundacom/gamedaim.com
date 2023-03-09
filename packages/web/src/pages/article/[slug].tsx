import * as React from "react"
import dynamic from "next/dynamic"
import { NextSeo, ArticleJsonLd, BreadcrumbJsonLd } from "next-seo"

import env from "@/env"
import { HomeLayout } from "@/layouts/Home"

import { PostCardSide } from "@/components/Card"
import { Article } from "@/components/Article"
import { getArticleBySlug, getArticles } from "@/lib/articles"
import {
  ArticleDataProps,
  ArticlesDataProps,
  TopicDataProps,
} from "@/lib/data-types"
import { getSettingsSite } from "@/lib/settings"

const Heading = dynamic(() => import("ui").then((mod) => mod.Heading))

interface SingleArticleProps {
  article: ArticleDataProps
  articles: ArticlesDataProps
  settingsSite: any
}

export default function SingleArticle(props: SingleArticleProps) {
  const { article, articles, settingsSite } = props

  const articleData = {
    content: article.content,
    excerpt: article.excerpt,
    title: article.title,
    authorName: article.author.name,
    authorUrl: article.author.username,
    authorUsername: article.author.username,
    authorImg: article.author.profilePicture?.url,
    categories: article.topics,
    featuredImageUrl: article.featuredImage.url,
    featuredImageAlt: article.featuredImage.name,
    featuredImageCaption: article.title,
    date: article.createdAt,
    slug: article.slug,
  }

  return (
    <>
      <NextSeo
        title={`${article.meta_title || article.title} | ${
          settingsSite.title?.value || ""
        }`}
        description={article.meta_description || article.excerpt}
        canonical={`https://${settingsSite.url?.value || ""}/${article.slug}`}
        openGraph={{
          url: `https://${settingsSite.url?.value || ""}/${article.slug}`,
          title: `${article.meta_title || article.title} | ${
            settingsSite.title?.value || ""
          }`,
          description: article.meta_description || article.excerpt,
          images: [
            {
              url: article.featuredImage.url,
              alt: article.title,
              width: 1280,
              height: 720,
              type: "image/webp",
            },
          ],
          article: {
            publishedTime: article.createdAt,
            modifiedTime: article.updatedAt,
            section: article.topics[0]?.title,
            authors: [
              `https://${settingsSite.url?.value || ""}/user/${
                article.author.username
              }`,
            ],
            tags: [
              article.topics?.map((topic: TopicDataProps) => {
                return topic?.title
              }),
            ],
          },
        }}
      />
      <ArticleJsonLd
        url={`https://${settingsSite.url?.value || ""}/${article.slug}`}
        title={`${article.meta_title || article.title} | ${
          settingsSite.title?.value || ""
        }`}
        images={[article.featuredImage.url]}
        datePublished={article.createdAt}
        dateModified={article.createdAt}
        authorName={[
          {
            name: article.author.name,
            url: `https://${settingsSite.url?.value || ""}/user/${
              article.author.username
            }`,
          },
        ]}
        publisherName={settingsSite.title?.value || ""}
        publisherLogo={env.LOGO_URL}
        description={article.meta_description || article.excerpt}
        isAccessibleForFree={true}
      />
      <BreadcrumbJsonLd
        itemListElements={[
          {
            position: 1,
            name: settingsSite.url?.value || "",
            item: `https://${settingsSite.url?.value || ""}`,
          },
          {
            position: 2,
            name: "Article",
            item: `https://${settingsSite.url?.value || ""}/article`,
          },
          {
            position: 3,
            name: article.topics[0]?.title,
            item: `https://${settingsSite.url?.value || ""}/topic/${
              article.topics[0]?.slug
            }`,
          },
        ]}
      />
      <HomeLayout>
        <div className="mx-auto flex w-full md:max-[991px]:max-w-[750px] min-[992px]:max-[1199px]:max-w-[970px] min-[1200px]:max-w-[1170px]">
          <section className="w-full lg:w-8/12">
            {/*FIX: later*/}
            {/*@ts-ignore*/}
            <Article isMain={true} posts={articles} postData={articleData} />
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
              {articles.map(
                (article: {
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
                      key={article.id}
                      src={article.featuredImage.url}
                      alt={article.featuredImage.alt}
                      slug={`/article/${article.slug}`}
                      title={article.title}
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

export const getServerSideProps = async ({
  params,
}: {
  params: { slug: string }
}) => {
  const { article } = await getArticleBySlug(params.slug)
  const { articles } = await getArticles()
  const { settingsSite } = await getSettingsSite()

  if (!article) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      article: article,
      articles: articles,
      settingsSite,
    },
  }
}
