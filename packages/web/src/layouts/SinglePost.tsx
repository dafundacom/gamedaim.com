import * as React from "react"
import NextLink from "next/link"
import NextImage from "next/image"
import { wpPrimaryCategorySlug } from "@/lib/wp-categories"
import { wpTagPathBySlug } from "@/lib/wp-tags"
import env from "@/env"
import dynamic from "next/dynamic"
const PostCardSide = dynamic(() =>
  import("@/components/Card").then((mod) => mod.PostCardSide),
)
const MetadataPost = dynamic(() =>
  import("@/components/Metadata").then((mod) => mod.MetadataPost),
)
const ShareButtonArticle = dynamic(() =>
  import("@/components/Share").then((mod) => mod.ShareButtonArticle),
)
const Button = dynamic(() => import("ui").then((mod) => mod.Button))
const ButtonGroup = dynamic(() => import("ui").then((mod) => mod.ButtonGroup))
const Heading = dynamic(() => import("ui").then((mod) => mod.Heading))
const Text = dynamic(() => import("ui").then((mod) => mod.Text))

interface PostProps {
  post: {
    title: string
    content: string
    author: {
      name: string
      slug: string
      avatar: {
        url: string
      }
    }
    slug: string
    categories: any
    featuredImage: {
      altText: string
      sourceUrl: string
      caption: string
    }
    tags: any
    date: string
  }

  posts: any
}

export const SinglePostLayout = React.forwardRef<HTMLDivElement, PostProps>(
  (props, ref) => {
    const { post, posts } = props
    const { content, title, author, categories, featuredImage, date, tags } =
      post
    const { primary } = wpPrimaryCategorySlug(categories)

    return (
      <div
        ref={ref}
        className="flex w-full md:max-[991px]:max-w-[750px] min-[992px]:max-[1199px]:max-w-[970px] min-[1200px]:max-w-[1170px] mx-auto"
      >
        <section className="flex px-4 flex-row w-full lg:w-8/12">
          <div>
            <div>
              {categories.map(
                (category: { slug: string; name: string }, i: number) => {
                  return (
                    <ButtonGroup className="p-1" key={i}>
                      <Button
                        size="xs"
                        colorScheme="slate"
                        className="!rounded-full uppercase"
                      >
                        <NextLink href={`/${category.slug}`}>
                          {category.name}
                        </NextLink>
                      </Button>
                    </ButtonGroup>
                  )
                },
              )}
            </div>
            <Heading
              as="h1"
              className="mt-4 mb-2 border-b border-gray-200 pb-2 !text-[25px] font-bold !leading-[1.7] dark:border-gray-600 md:border-none md:!text-[40px] md:!leading-[43px]"
              lineClamp={0}
              dangerouslySetInnerHTML={{
                __html: title,
              }}
            />
            <div className="mb-2">
              <MetadataPost
                authorName={author.name}
                authorAvatarUrl={author.avatar.url}
                authorSlug={author.slug}
                date={date}
              />
            </div>
            {featuredImage && (
              <>
                <NextImage
                  width="1280"
                  height="720"
                  alt={featuredImage.altText}
                  className="rounded-lg object-cover"
                  src={featuredImage.sourceUrl}
                />
                {featuredImage.caption && (
                  <span
                    className="text-center text-xs italic text-gray-600 dark:text-gray-500"
                    dangerouslySetInnerHTML={{
                      __html: featuredImage.caption,
                    }}
                  />
                )}
              </>
            )}
            <div className="flex">
              <div className="h-fit mr-2 shadow-xs fixed top-[unset] bottom-0 left-0 z-40 mx-0 mb-0 mr-0 flex w-full flex-row items-center justify-center bg-white dark:bg-gray-700 lg:px-2 lg:sticky lg:top-20 lg:bottom-[unset] lg:left-[unset] lg:!w-auto lg:bg-transparent lg:shadow-none lg:dark:bg-transparent">
                <ShareButtonArticle
                  url={`https://${env.DOMAIN}/${primary.slug}/${post.slug}`}
                  text={title}
                />
              </div>
              <section
                className="article-body"
                dangerouslySetInnerHTML={{
                  __html: content,
                }}
              />
            </div>

            <section className="mx-4 md:mx-12 my-6" id="tag">
              {tags.map((tag: { slug: string; name: string }, i: number) => {
                return (
                  <ButtonGroup className="p-1" key={i}>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      variant="outline"
                      className="mx-1"
                      key={tag.slug}
                    >
                      <NextLink href={wpTagPathBySlug(tag.slug)}>
                        {tag.name}
                      </NextLink>
                    </Button>
                  </ButtonGroup>
                )
              })}
            </section>
            <section>
              <div className="mb-2">
                <Heading
                  as="h4"
                  className="border-b-4 !text-primary-400 border-primary-400"
                >
                  Related Posts
                </Heading>
              </div>
              <div className="grid grid-cols-[repeat(1,1fr)] md:grid-cols-2 gap-4">
                {posts.map(
                  (post: { title: string; uri: string }, i: number) => {
                    return (
                      <article className="border-b-2 border-gray-200">
                        <NextLink key={i} href={post.uri}>
                          <Text
                            size="lg"
                            className="font-semibold hover:text-primary-400"
                          >
                            {post.title}
                          </Text>
                        </NextLink>
                      </article>
                    )
                  },
                )}
              </div>
            </section>
          </div>
        </section>
        <aside className="w-4/12 px-4 hidden lg:block">
          <div className="rounded-xl border border-gray-100 dark:border-gray-700 p-4 sticky top-8">
            <div className="mb-4">
              <Heading as="h4" className="!text-transparent">
                <span className="after:absolute after:border after:border-[#1e3799] after:bg-[#1e3799] after:h-[3px] after:w-[50px] after:ml-[-25px] after:left-1/2 after:top-[40px]">
                  Trending
                </span>
              </Heading>
            </div>
            {posts.map(
              (post: {
                id: number
                featuredImage: {
                  sourceUrl: string
                  altText: string
                }
                title: string
                slug: string
                excerpt: string
                categories: any
              }) => {
                return (
                  <PostCardSide
                    key={post.id}
                    src={post.featuredImage.sourceUrl}
                    alt={post.featuredImage.altText}
                    slug={`/${primary.slug}/${post.slug}`}
                    title={post.title}
                  />
                )
              },
            )}
          </div>
        </aside>
      </div>
    )
  },
)
