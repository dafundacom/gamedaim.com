import * as React from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { BreadcrumbJsonLd, NextSeo, SiteLinksSearchBoxJsonLd } from "next-seo"
import env from "@/env"

import { wpGetAllPosts } from "@/lib/wp-posts"
import { WpSinglePostDataProps } from "@/lib/wp-data-types"

import { HomeLayout } from "@/layouts/Home"
import { splitUriWP } from "@/utils/split-html"
import { getSettingsSite } from "@/lib/settings"
import { PostCardSide, ListPostFeatured } from "@/components/Card"

import { InfiniteScrollWP } from "@/components/InfiniteScroll"
const Heading = dynamic(() => import("ui").then((mod) => mod.Heading))

export default function Home(props: { postsHome: any; settingsSite: any }) {
  const { postsHome, settingsSite } = props

  const router = useRouter()
  const featured = postsHome?.posts?.slice(0, 9)
  const listPost = postsHome?.posts?.slice(
    postsHome?.posts?.length / 2,
    postsHome?.posts?.length,
  )

  return (
    <>
      <NextSeo
        title={`${settingsSite.title?.value || env.SITE_TITTLE} | ${
          settingsSite.tagline?.value || ""
        }`}
        description={settingsSite.description?.value || env.DESCRIPTION}
        canonical={`https://${settingsSite.url?.value || env.DOMAIN}${
          router.pathname
        }`}
        openGraph={{
          url: `https://${settingsSite.url?.value || env.DOMAIN}${
            router.pathname
          }`,
          title: `${settingsSite.title?.value || env.SITE_TITTLE} | ${
            settingsSite.tagline?.value || ""
          }`,
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
        ]}
      />
      <SiteLinksSearchBoxJsonLd
        url={`https://${settingsSite.url?.value || env.DOMAIN}${
          router.pathname
        }`}
        potentialActions={[
          {
            target: `https://${settingsSite.url?.value || env.DOMAIN}/search?q`,
            queryInput: "search_term_string",
          },
        ]}
      />
      <HomeLayout>
        <section className="flex w-full flex-col">
          <ListPostFeatured featured={featured} />
          <div className="mx-auto flex w-full flex-row md:max-[991px]:max-w-[750px] min-[992px]:max-[1199px]:max-w-[970px] min-[1200px]:max-w-[1170px]">
            <div className="flex w-full flex-col px-4 lg:mr-4">
              <InfiniteScrollWP
                pageType="home"
                posts={listPost}
                pageInfo={postsHome?.pageInfo}
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
                {postsHome?.posts.map((post: WpSinglePostDataProps) => {
                  const newUri = splitUriWP(post.uri)
                  return (
                    <PostCardSide
                      key={post.id}
                      src={post.featuredImage.sourceUrl}
                      alt={post.featuredImage.altText}
                      title={post.title}
                      slug={newUri}
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

export async function getStaticProps() {
  const postsHome = await wpGetAllPosts()
  const { settingsSite } = await getSettingsSite()
  return {
    props: { postsHome: postsHome, settingsSite },
    revalidate: 60,
  }
}
