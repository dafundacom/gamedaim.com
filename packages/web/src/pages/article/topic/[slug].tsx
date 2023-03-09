import * as React from "react"
import dynamic from "next/dynamic"
import { BreadcrumbJsonLd, NextSeo } from "next-seo"

import { getArticlesByTopic, getDownloadsByTopic } from "@/lib/topics"
import { ArticleDataProps, TopicDataProps } from "@/lib/data-types"
import { InfiniteScrollTopic } from "@/components/InfiniteScroll"
import { MdChevronRight } from "react-icons/md"
const PostCardSide = dynamic(() =>
  import("@/components/Card").then((mod) => mod.PostCardSide),
)

import { HomeLayout } from "@/layouts/Home"
import { Breadcrumb } from "ui"
import { getSettingsSite } from "@/lib/settings"
const Heading = dynamic(() => import("ui").then((mod) => mod.Heading))

interface TopicProps {
  topic: TopicDataProps
  download: any
  settingsSite: any
}

export default function TopicArticle(props: TopicProps) {
  const { topic, settingsSite } = props
  const totalPage = Math.ceil(topic._count.articles / 10)

  return (
    <>
      <NextSeo
        title={`${topic.meta_title || topic.title} Articles | ${
          settingsSite.title?.value || ""
        }`}
        description={
          topic.meta_description ||
          topic.description ||
          `${topic.title} Articles | ${settingsSite.title?.value || ""}`
        }
        canonical={`https://${settingsSite.url?.value || ""}/article/topic/${
          topic.slug
        }`}
        openGraph={{
          title: `${topic.meta_title || topic.title} Articles | ${
            settingsSite.title?.value || ""
          }`,
          description:
            topic.meta_description ||
            topic.description ||
            `${topic.title} Articles | ${settingsSite.title?.value || ""}`,

          url: `https://${settingsSite.url?.value || ""}/article/topic/${
            topic.slug
          }`,
        }}
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
            position: 2,
            name: topic.meta_title || topic.title,
            item: `https://${settingsSite.url?.value || ""}/article/topic/${
              topic.slug
            }`,
          },
        ]}
      />
      <HomeLayout>
        <section className="flex w-full flex-col">
          <div className="relative mb-10 flex flex-col bg-gradient-to-r !from-[#1e3799] !to-[#0984e3] py-10">
            <div className="absolute top-1 ml-4">
              <Breadcrumb
                className="!text-white"
                separator={<MdChevronRight className="!text-white" />}
              >
                <Breadcrumb.Item bold>
                  <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Breadcrumb.Link href="/article">Article</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item currentPage>
                  <Breadcrumb.Link href={`/${topic?.slug}`}>
                    {topic?.title}
                  </Breadcrumb.Link>
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <div className="self-center">
              <Heading size="4xl" className="text-white">
                {topic.title}
              </Heading>
            </div>
          </div>
          <div className="mx-auto flex w-full flex-row md:max-[991px]:max-w-[750px] min-[992px]:max-[1199px]:max-w-[970px] lg:mx-auto lg:px-4 min-[1200px]:max-w-[1170px]">
            <div className="flex w-full flex-col px-4 lg:mr-4 lg:!w-2/3">
              <InfiniteScrollTopic
                index={2}
                id={topic.slug}
                posts={topic.articles}
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
                {topic.articles.map((article: ArticleDataProps) => {
                  return (
                    <PostCardSide
                      key={article.id}
                      src={article.featuredImage?.url}
                      alt={article.featuredImage?.alt}
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

export const getServerSideProps = async ({ params }: any) => {
  const { topic } = await getArticlesByTopic(params.slug)
  const { topic: download } = await getDownloadsByTopic(params?.slug)
  const { settingsSite } = await getSettingsSite()

  if (!topic) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      topic,
      settingsSite,
      download,
    },
  }
}
