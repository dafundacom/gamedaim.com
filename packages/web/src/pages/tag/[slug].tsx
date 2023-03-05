import * as React from "react"
import NextLink from "next/link"
import Head from "next/head"
import parse from "html-react-parser"
import dynamic from "next/dynamic"
import { GetStaticProps, GetStaticPaths } from "next"
import { useRouter } from "next/router"

import env from "@/env"
import { wpGetTagBySlug, wpGetAllTags } from "@/lib/wp-tags"
import { wpGetPostsByTagSlug } from "@/lib/wp-posts"
import { getSeoDatas } from "@/lib/wp-seo"
import {
  WpPostsDataProps,
  WpSinglePostDataProps,
  WpTagsDataProps,
} from "@/lib/wp-data-types"
import { Breadcrumb } from "ui"
import { MdChevronRight } from "react-icons/md"
const PostCardSide = dynamic(() =>
  import("@/components/Card").then((mod) => mod.PostCardSide),
)
import { HomeLayout } from "@/layouts/Home"
import { splitUriWP } from "@/utils/split-html"
const InfiniteScrollWP = dynamic(() =>
  import("@/components/InfiniteScroll").then((mod) => mod.InfiniteScrollWP),
)
const Button = dynamic(() => import("ui").then((mod) => mod.Button))
const Heading = dynamic(() => import("ui").then((mod) => mod.Heading))

interface TagProps {
  tag: WpTagsDataProps
  seo: {
    head: string
    success: boolean
  }
  posts: WpPostsDataProps
  pageInfo: any
}

export default function Tag(props: TagProps) {
  const { seo, posts, pageInfo, tag } = props
  const router: any = useRouter()
  const {
    query: { slug },
  } = router

  return (
    <>
      <Head>{seo.success === true && parse(seo.head)}</Head>
      <HomeLayout>
        <section className="flex w-full flex-col">
          <div className="relative mb-10 flex flex-col bg-gradient-to-r from-[#1e3799] to-[#0984e3] py-10">
            <div className="absolute top-1 ml-4">
              <Breadcrumb
                className="!text-white"
                separator={<MdChevronRight className="text-white" />}
              >
                <Breadcrumb.Item bold>
                  <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item currentPage>
                  <Breadcrumb.Link href={`/${tag?.slug}`}>
                    {tag?.name}
                  </Breadcrumb.Link>
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <div className="self-center">
              <Heading size="4xl" className="text-white">
                {tag?.name}
              </Heading>
            </div>
            <div className="self-center">
              <NextLink href={`/${slug}`}>
                <Button className="!mr-2 border border-[#24272f] !bg-[#1e3799]">
                  All
                </Button>
              </NextLink>
            </div>
          </div>
          <div className="mx-auto flex w-full flex-row md:mx-auto md:max-[991px]:max-w-[750px] min-[992px]:max-[1199px]:max-w-[970px] min-[1200px]:max-w-[1170px]">
            <div className="flex w-full flex-col px-4 lg:mr-4">
              <InfiniteScrollWP
                pageType="tag"
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
  const slug = params?.slug
  const seo = await getSeoDatas(`https://${env.DOMAIN}/tag/${slug}`)
  const { tag } = await wpGetTagBySlug(slug)
  const { posts, pageInfo } = await wpGetPostsByTagSlug(tag.slug)
  if (!tag || !posts) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      seo,
      tag,
      posts,
      pageInfo,
    },
    revalidate: 100,
  }
}
export const getStaticPaths: GetStaticPaths = async () => {
  const { tags } = await wpGetAllTags()
  const paths = tags.map((tag: any) => {
    const { slug } = tag
    return {
      params: {
        slug,
      },
    }
  })

  return {
    paths,
    fallback: "blocking",
  }
}
