import * as React from "react"
import Head from "next/head"
import dynamic from "next/dynamic"

import env from "@/env"

import parse from "html-react-parser"
import { useRouter } from "next/router"
import { wpGetPostsByAuthorSlug, wpGetAllPosts } from "@/lib/wp-posts"
import { WpPostsDataProps, WpSinglePostDataProps } from "@/lib/wp-data-types"

const PostCardSide = dynamic(() =>
  import("@/components/Card").then((mod) => mod.PostCardSide),
)

import { HomeLayout } from "@/layouts/Home"
import { splitUriWP } from "@/utils/split-html"
import { NextSeo, BreadcrumbJsonLd } from "next-seo"
import { wpGetUserBySlug } from "@/lib/wp-users"
import { UserDataProps } from "@/lib/data-types"
import { getSettingsSite } from "@/lib/settings"
const InfiniteScrollWP = dynamic(() =>
  import("@/components/InfiniteScroll").then((mod) => mod.InfiniteScrollWP),
)
const Heading = dynamic(() => import("ui").then((mod) => mod.Heading))

interface AuthorProps {
  posts: WpPostsDataProps
  listPosts: any
  settingsSite: any
  pageInfo: any
  user: UserDataProps
}

export default function Author(props: AuthorProps) {
  const { user, posts, pageInfo, listPosts, settingsSite } = props
  const router = useRouter()
  const {
    query: { slug },
  }: any = router

  return (
    <>
      <NextSeo
        title={`${user.seo.title} — ${
          settingsSite.title?.value || env.SITE_TITTLE
        }`}
        description={
          user.seo?.description ||
          `${user.seo.title} | ${settingsSite.title?.value || env.SITE_TITTLE}`
        }
        canonical={`https://${settingsSite.url?.value || env.DOMAIN}/${
          user.slug
        }`}
        openGraph={{
          title: `${user.seo.title} | ${
            settingsSite.title?.value || env.SITE_TITTLE
          }`,
          description:
            user.seo?.description ||
            `${user.seo.title} | ${
              settingsSite.title?.value || env.SITE_TITTLE
            }`,

          url: `https://${settingsSite.url?.value || env.DOMAIN}/author/${
            user.slug
          }`,
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
            name: user.seo.title,
            item: `https://${settingsSite.url?.value || env.DOMAIN}/author/${
              user.slug
            }`,
          },
        ]}
      />
      <Head>{parse(user.seo?.jsonLd?.raw)}</Head>
      <HomeLayout>
        <section className="mx-auto flex w-full flex-row md:max-[991px]:max-w-[750px] min-[992px]:max-[1199px]:max-w-[970px] lg:px-4 min-[1200px]:max-w-[1170px]">
          <div className="flex w-full flex-col px-4 lg:mr-4">
            <InfiniteScrollWP
              pageType="author"
              posts={posts}
              id={slug}
              pageInfo={pageInfo}
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
              {listPosts?.posts?.map((post: WpSinglePostDataProps) => {
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
        </section>
      </HomeLayout>
    </>
  )
}

export const getServerSideProps = async ({ params, res }: any) => {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=120, stale-while-revalidate=600",
  )

  const slug = params?.slug
  const { user } = await wpGetUserBySlug(slug)
  const { posts, pageInfo } = await wpGetPostsByAuthorSlug(slug)
  const listPosts = await wpGetAllPosts()
  const { settingsSite } = await getSettingsSite()

  if (!user || !posts) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      user,
      posts,
      pageInfo,
      listPosts,
      settingsSite,
    },
  }
}
