import * as React from "react"
import NextLink from "next/link"
import dynamic from "next/dynamic"
import { BreadcrumbJsonLd, NextSeo } from "next-seo"

import env from "@/env"
import { getArticlesByTopic, getDownloadsByTopic } from "@/lib/topics"
import { ArticleDataProps, TopicDataProps } from "@/lib/data-types"
import { ListDownload } from "@/components/List"
import { MdChevronRight } from "react-icons/md"
const PostCardSide = dynamic(() =>
  import("@/components/Card").then((mod) => mod.PostCardSide),
)

import { HomeLayout } from "@/layouts/Home"
import { Breadcrumb } from "ui"
import { ListArticleFeatured } from "@/components/Card"
const Heading = dynamic(() => import("ui").then((mod) => mod.Heading))
const Text = dynamic(() => import("ui").then((mod) => mod.Text))

interface TopicProps {
  topic: TopicDataProps
  download: any
}

export default function Topic(props: TopicProps) {
  const { topic, download } = props

  return (
    <>
      <NextSeo
        title={`${topic.title} | ${env.SITE_TITLE}`}
        description={topic.description}
        canonical={`https://${env.DOMAIN}/${topic.slug}`}
        openGraph={{
          url: `https://${env.DOMAIN}/${topic.slug}`,
          title: `${topic.title} | ${env.SITE_TITLE}`,
          description: topic.description,
        }}
      />
      <BreadcrumbJsonLd
        itemListElements={[
          {
            position: 1,
            name: env.DOMAIN,
            item: `https://${env.DOMAIN}`,
          },
          {
            position: 2,
            name: "Topic",
            item: `https://${env.DOMAIN}/topic`,
          },
          {
            position: 3,
            name: topic.title,
            item: `https://${env.DOMAIN}/topic/${topic.slug}`,
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
              <div className="px-4">
                <div className={"my-2 flex flex-row justify-between"}>
                  <Heading as="h2" size="2xl" bold>
                    Downloads
                  </Heading>
                  <NextLink href={`/download/topic/${topic.slug}`}>
                    <Text size="sm" colorScheme="blue">
                      See more
                    </Text>
                  </NextLink>
                </div>
                <ListDownload listDownloads={download?.downloads} />
              </div>
              <div>
                <div className={"my-2 flex flex-row justify-between"}>
                  <Heading as="h2" size="2xl" bold>
                    Article
                  </Heading>
                  <NextLink href={`/article/topic/${topic.slug}`}>
                    <Text size="sm" colorScheme="blue">
                      See more
                    </Text>
                  </NextLink>
                </div>
                <ListArticleFeatured featured={topic.articles} />
              </div>
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
  if (!topic) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      topic,
      download,
    },
  }
}
