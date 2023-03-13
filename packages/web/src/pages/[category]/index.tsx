import * as React from "react"
import NextLink from "next/link"
import Head from "next/head"
import dynamic from "next/dynamic"
import parse from "html-react-parser"
import { GetStaticProps, GetStaticPaths } from "next"
import env from "@/env"

import { wpGetCategoryBySlug, wpGetAllCategories } from "@/lib/wp-categories"
import { wpGetPostsByCategorySlug } from "@/lib/wp-posts"
import {
  WpCategoriesDataProps,
  WpPostsDataProps,
  WpSinglePostDataProps,
} from "@/lib/wp-data-types"
import { MdChevronRight } from "react-icons/md"
const InfiniteScrollWP = dynamic(() =>
  import("@/components/InfiniteScroll/").then((mod) => mod.InfiniteScrollWP),
)
const PostCardSide = dynamic(() =>
  import("@/components/Card").then((mod) => mod.PostCardSide),
)

import { HomeLayout } from "@/layouts/Home"
import { Breadcrumb, Button, Heading } from "ui"
import { splitUriWP } from "@/utils/split-html"
import { BreadcrumbJsonLd, NextSeo } from "next-seo"
import { getSettingsSite } from "@/lib/settings"

interface CategoryProps {
  category: WpCategoriesDataProps
  posts: WpPostsDataProps
  pageInfo: any
  settingsSite: any
}

export default function Category(props: CategoryProps) {
  const { posts, category, pageInfo, settingsSite } = props

  return (
    <>
      <NextSeo
        title={`${category.seo.title} — ${
          settingsSite.title?.value || env.SITE_TITTLE
        }`}
        description={
          category.seo.description ||
          `${category.seo.title} | ${
            settingsSite.title?.value || env.SITE_TITTLE
          }`
        }
        canonical={`https://${settingsSite.url?.value || env.DOMAIN}/${
          category.slug
        }`}
        openGraph={{
          title: `${category.seo.title} | ${
            settingsSite.title?.value || env.SITE_TITTLE
          }`,
          description:
            category.seo.description ||
            `${category.seo.title} | ${
              settingsSite.title?.value || env.SITE_TITTLE
            }`,

          url: `https://${settingsSite.url?.value || env.DOMAIN}/${
            category.slug
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
            name: category.seo.title,
            item: `https://${settingsSite.url?.value || env.DOMAIN}/${
              category.slug
            }`,
          },
        ]}
      />
      <Head>{parse(category.seo?.jsonLd?.raw)}</Head>
      <HomeLayout>
        <section className="flex w-full flex-col">
          <div className="relative mb-10 flex flex-col bg-gradient-to-r !from-[#1e3799] !to-[#0984e3] py-10">
            <div className="absolute top-1 ml-5">
              <Breadcrumb
                separator={<MdChevronRight className="!text-white" />}
              >
                <Breadcrumb.Item bold>
                  <Breadcrumb.Link className="text-white" href="/">
                    Home
                  </Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item currentPage>
                  <Breadcrumb.Link
                    className="text-white"
                    href={`/${category?.slug}`}
                  >
                    {category?.name}
                  </Breadcrumb.Link>
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <div className="self-center">
              <Heading size="4xl" className="text-white">
                {category.name}
              </Heading>
            </div>
            <div className="mt-2 self-center">
              <NextLink href={`/${category.slug}`}>
                <Button className="!mr-2 border border-[#24272f] !bg-[#1e3799]">
                  All
                </Button>
              </NextLink>
              {category.children.nodes.map(
                (child: {
                  slug: string
                  name: string
                  taxonomyName: string
                }) => {
                  if (child.taxonomyName === "category") {
                    return (
                      <NextLink href={`/${child.slug}`} key={child.name}>
                        <Button className="!mr-2 border border-[#24272f] !bg-[#ffffff33] hover:!bg-[#1e3799]">
                          {child.name}
                        </Button>
                      </NextLink>
                    )
                  }
                },
              )}
            </div>
          </div>
          <div className="mx-auto flex w-full flex-row md:max-[991px]:max-w-[750px] min-[992px]:max-[1199px]:max-w-[970px] lg:mx-auto lg:px-4 min-[1200px]:max-w-[1170px]">
            <div className="flex w-full flex-col px-4 lg:mr-4">
              <InfiniteScrollWP
                pageType="category"
                posts={posts}
                id={category.slug}
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
                {posts.map((post: WpSinglePostDataProps) => {
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

export const getStaticProps: GetStaticProps = async ({ params }: any) => {
  const slug = params?.category

  const { category } = await wpGetCategoryBySlug(slug)
  const { posts, pageInfo } = await wpGetPostsByCategorySlug(category?.slug)
  const { settingsSite } = await getSettingsSite()

  if (!category) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      posts,
      pageInfo,
      category,
      settingsSite,
    },
    revalidate: 100,
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { categories } = await wpGetAllCategories()
  const paths = categories.map(({ slug }: any) => {
    const category = slug
    return {
      params: {
        category,
      },
    }
  })

  return {
    paths,
    fallback: "blocking",
  }
}
