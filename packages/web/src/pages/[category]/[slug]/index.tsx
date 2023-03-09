import * as React from "react"

import { GetStaticProps, GetStaticPaths } from "next"

import { wpGetPostBySlug, wpGetAllPosts, wpGetAllSlug } from "@/lib/wp-posts"
import { SinglePostLayout } from "@/layouts/SinglePost"
import { wpPrimaryCategorySlug } from "@/lib/wp-categories"
import { HomeLayout } from "@/layouts/Home"
import { WpPostsDataProps, WpSinglePostDataProps } from "@/lib/wp-data-types"
import { getSettingsSite } from "@/lib/settings"

interface PostProps {
  seo: any
  posts: WpPostsDataProps
  settingsSite: any
  post: WpSinglePostDataProps
}
export default function Post(props: PostProps) {
  const { posts, post, settingsSite } = props
  const { seo } = post
  return (
    <>
      <HomeLayout>
        <SinglePostLayout
          seoData={seo}
          settingsSite={settingsSite}
          post={post}
          posts={posts as unknown as WpPostsDataProps}
        />
      </HomeLayout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }: any) => {
  const slug = params.slug
  const { posts } = await wpGetAllPosts()
  const { post } = await wpGetPostBySlug(slug)
  const { settingsSite } = await getSettingsSite()

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      posts,
      settingsSite,
      post,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { posts }: any = await wpGetAllSlug()

  const paths = posts.map((post: any) => {
    const { slug, categories } = post
    const { primary } = wpPrimaryCategorySlug(categories)
    return {
      params: {
        category: primary.slug,
        slug: slug,
      },
    }
  })
  return {
    paths,
    fallback: "blocking",
  }
}
