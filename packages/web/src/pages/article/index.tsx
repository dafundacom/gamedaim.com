import * as React from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { BreadcrumbJsonLd, NextSeo } from "next-seo"
import { MdChevronRight } from "react-icons/md"

import env from "@/env"

import { getArticles, getArticlesCount } from "@/lib/articles"
import { ArticlesDataProps, ArticleDataProps } from "@/lib/data-types"
import { InfiniteScrollArticle } from "@/components/InfiniteScroll"
import { Breadcrumb } from "ui"

import { HomeLayout } from "@/layouts/Home"
import { getSettingsSite } from "@/lib/settings"
const PostCardSide = dynamic(() =>
  import("@/components/Card").then((mod) => mod.PostCardSide),
)

const Heading = dynamic(() => import("ui").then((mod) => mod.Heading))

interface ArticlesProps {
  articles: ArticlesDataProps
  settingsSite: any
  articlesCount: number
}

export default function Articles(props: ArticlesProps) {
  const { articles, articlesCount, settingsSite } = props
  const totalPage = Math.ceil(articlesCount / 10)
  const router = useRouter()

  return (
    <>
      <NextSeo
        title={`Article | ${settingsSite.title?.value || env.SITE_TITTLE}`}
        description={settingsSite.description?.value || env.DESCRIPTION}
        canonical={`https://${settingsSite.url?.value || env.DOMAIN}${
          router.pathname
        }`}
        openGraph={{
          url: `https://${settingsSite.url?.value || env.DOMAIN}${
            router.pathname
          }`,
          title: `Article | ${settingsSite.title?.value || env.SITE_TITTLE}`,
          description: settingsSite.description?.value || env.DESCRIPTION,
        }}
      />
      <BreadcrumbJsonLd
        itemListElements={[
          {
            position: 1,
            name: settingsSite.url?.value || env.DOMAIN,
            item: `https://${settingsSite.url?.value || env.DOMAIN}`,
          },
          {
            position: 2,
            name: "Article",
            item: `https://${settingsSite.url?.value || env.DOMAIN}${
              router.pathname
            }`,
          },
        ]}
      />
      <HomeLayout>
        <section className="flex w-full flex-col">
          <div className="relative mb-10 flex flex-col bg-gradient-to-r !from-[#1e3799] !to-[#0984e3] py-10">
            <div className="absolute top-1 ml-4">
              <Breadcrumb separator={<MdChevronRight className="text-white" />}>
                <Breadcrumb.Item bold>
                  <Breadcrumb.Link className="text-white" href="/">
                    Home
                  </Breadcrumb.Link>
                </Breadcrumb.Item>

                <Breadcrumb.Item currentPage>
                  <Breadcrumb.Link className="text-white" href="article">
                    Article
                  </Breadcrumb.Link>
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <div className="self-center">
              <Heading size="4xl" className="text-white">
                Gamedaim
              </Heading>
            </div>
          </div>
          <div className="mx-auto flex w-full flex-row md:max-[991px]:max-w-[750px] min-[992px]:max-[1199px]:max-w-[970px] lg:mx-auto lg:px-4 min-[1200px]:max-w-[1170px]">
            <div className="flex w-full flex-col px-4 lg:mr-4">
              <InfiniteScrollArticle
                index={2}
                posts={articles}
                pageType="articles"
                totalPage={totalPage}
              />
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
                {articles.map((article: ArticleDataProps) => {
                  return (
                    <PostCardSide
                      key={article.id}
                      src={article.featuredImage.url}
                      alt={article.featuredImage.alt}
                      title={article.title}
                      slug={article.slug}
                      isWP={false}
                    />
                  )
                })}
              </div>
            </aside>
          </div>
        </section>
      </HomeLayout>
    </>
  )
}

export const getServerSideProps = async () => {
  const { articles } = await getArticles()
  const { articlesCount } = await getArticlesCount()
  const { settingsSite } = await getSettingsSite()

  if (!articles) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      articles: articles,
      articlesCount: articlesCount,
      settingsSite,
    },
  }
}
