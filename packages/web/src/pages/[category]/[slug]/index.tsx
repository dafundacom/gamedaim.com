import * as React from "react"

import { GetStaticProps, GetStaticPaths } from "next"

import env from "@/env"
import { getSeoDatas } from "@/lib/wp-seo"
import { wpGetPostBySlug, wpGetAllPosts, wpGetAllSlug } from "@/lib/wp-posts"
import { SinglePostLayout } from "@/layouts/SinglePost"
import { wpPrimaryCategorySlug } from "@/lib/wp-categories"
import { HomeLayout } from "@/layouts/Home"
import { WpPostsDataProps, WpSinglePostDataProps } from "@/lib/wp-data-types"

interface PostProps {
  seo: any
  posts: WpPostsDataProps
  post: WpSinglePostDataProps
}
export default function Post(props: PostProps) {
  const { posts, post } = props
  const { seo } = post
  return (
    <>
      <HomeLayout>
        <SinglePostLayout
          seoData={seo}
          post={post}
          posts={posts as unknown as WpPostsDataProps}
        />
      </HomeLayout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }: any) => {
  const seo = await getSeoDatas(
    `https://${env.DOMAIN}/${params.category}/${params.slug}`,
  )
  const slug = params.slug
  const { posts } = await wpGetAllPosts()
  const { post } = await wpGetPostBySlug(slug)

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      seo,
      posts,
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
