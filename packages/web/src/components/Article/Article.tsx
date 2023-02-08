import { wpPrimaryCategorySlug } from "@/lib/wp-categories"
import { wpTagPathBySlug } from "@/lib/wp-tags"
import dynamic from "next/dynamic"
const MetadataPost = dynamic(() =>
  import("@/components/Metadata").then((mod) => mod.MetadataPost),
)
import parse from "html-react-parser"
const StickyShare = dynamic(
  () => import("@/components/Share").then((mod) => mod.StickyShare),
  { ssr: false },
)
const Heading = dynamic(() => import("ui").then((mod) => mod.Heading))
const Text = dynamic(() => import("ui").then((mod) => mod.Text))
const Button = dynamic(() => import("ui").then((mod) => mod.Button))
const ButtonGroup = dynamic(() => import("ui").then((mod) => mod.ButtonGroup))
import NextLink from "next/link"
import NextImage from "next/image"
import * as React from "react"
export const Article = (props: { post: any; posts: any; index: any }) => {
  const { post, posts, index } = props
  const { content, title, author, categories, featuredImage, date, tags } = post
  const { primary } = wpPrimaryCategorySlug(categories)
  const [image, setImage] = React.useState("/image/imgloader.gif") as any
  const articleRef = React.useRef(null)
  const article: any = articleRef.current
  React.useEffect(() => {
    if (article) {
      const toc = article.querySelector(".ez-toc-title")
      const list = article.querySelector("nav > ul")
      if (toc) {
        toc.addEventListener("click", () => {
          list.classList.toggle("open-list")
        })
      }
    }
  }, [article])
  return (
    <>
      <article className="px-4 [&:not(:first-child)]:before:block [&:not(:first-child)]:before:w-full [&:not(:first-child)]:before:h-[35px] [&:not(:first-child)]:before:mb-[50px] [&:not(:first-child)]:before:bg-[url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAE0lEQVQYV2NkwAIYqSy4YMGC/wAIQwLlE7lczAAAAABJRU5ErkJggg==)]">
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
              src={image}
              onLoadingComplete={() => {
                setImage(featuredImage.sourceUrl)
              }}
            />
            {featuredImage.caption && (
              <span className="text-center text-xs italic text-gray-600 dark:text-gray-500">
                {parse(featuredImage.caption)}
              </span>
            )}
          </>
        )}
        <div className="flex">
          <StickyShare categorySlug={primary.slug} postSlug={post.slug} />
          <section ref={articleRef} className="article-body">
            {parse(content)}
          </section>
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

        <section className="mb-20">
          {index === 0 && (
            <>
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
            </>
          )}
        </section>
      </article>
    </>
  )
}
