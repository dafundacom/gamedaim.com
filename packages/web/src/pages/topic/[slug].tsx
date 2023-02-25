import * as React from "react"
import NextLink from "next/link"
import dynamic from "next/dynamic"
import { BreadcrumbJsonLd, NextSeo } from "next-seo"

import env from "@/env"
import { PostCard } from "@/components/Card"
import { getTopicBySlug } from "@/lib/topics"
import { ArticleDataProps, TopicDataProps } from "@/lib/data-types"

const PostCardSide = dynamic(() =>
  import("@/components/Card").then((mod) => mod.PostCardSide),
)
const HomeLayout = dynamic(() =>
  import("@/layouts/Home").then((mod) => mod.HomeLayout),
)
const Heading = dynamic(() => import("ui").then((mod) => mod.Heading))

interface TopicProps {
  topic: TopicDataProps
}

export default function Topic(props: TopicProps) {
  const { topic } = props

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
                {topic.title}
              </Heading>
            </div>
          </div>
          <div className="mx-auto flex w-full flex-row md:max-[991px]:max-w-[750px] min-[992px]:max-[1199px]:max-w-[970px] lg:mx-auto lg:px-4 min-[1200px]:max-w-[1170px]">
            <div className="flex w-full flex-col px-4 lg:mr-4">
              {topic.articles.map((article: ArticleDataProps) => {
                return (
                  <PostCard
                    key={article.id}
                    src={article.featuredImage?.url}
                    alt={article.featuredImage?.alt}
                    slug={article.slug}
                    title={article.title}
                    excerpt={article.description}
                    authorName={article.author?.name}
                    authorAvatarUrl={article.author.profilePicture.url}
                    authorUri={article.author?.username}
                    date={article.createdAt}
                    isWP={false}
                  />
                )
              })}
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
  const { topic } = await getTopicBySlug(params.slug)

  if (!topic) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      topic: topic,
    },
  }
}
