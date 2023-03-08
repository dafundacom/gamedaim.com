import * as React from "react"
import Head from "next/head"
import dynamic from "next/dynamic"
import parse from "html-react-parser"
import { useRouter } from "next/router"
import { Button, TagProps } from "ui"

import env from "@/env"
import { Article } from "@/components/Article"
import { wpGetInfiniteScollArticles } from "@/lib/wp-posts"
import { wpPrimaryCategorySlug } from "@/lib/wp-categories"
import { WpPostsDataProps, WpSinglePostDataProps } from "@/lib/wp-data-types"
import { ArticleJsonLd, BreadcrumbJsonLd, NextSeo } from "next-seo"

const PostCardSide = dynamic(() =>
  import("@/components/Card").then((mod) => mod.PostCardSide),
)

const Heading = dynamic(() => import("ui").then((mod) => mod.Heading))

interface PostProps {
  post: WpSinglePostDataProps
  posts: WpPostsDataProps
  seoData: any
}

export const SinglePostLayout = React.forwardRef<HTMLDivElement, PostProps>(
  (props, ref) => {
    const { post, posts, seoData } = props
    const { categories } = post
    const { primary } = wpPrimaryCategorySlug(categories as any)
    const [articles, setArticles] = React.useState<any>([])
    const [hasNextPage, setHasNextPage] = React.useState(true)
    const [endCursor, setEndCursor] = React.useState("")
    const LoaderRef = React.useRef(null)
    const articleRef = React.useRef(null)
    const router = useRouter()
    const [seo, setSeo] = React.useState({
      title: seoData.title,
      excerpt: post.excerpt,
      description: seoData.description,
      slug: post.slug,
      category: primary,

      authorName: post.author.name,
      authorUrl: post.author.slug,
      authorImg: post.author.avatar.url,
      categories: post.categories,
      featuredImageUrl: post.featuredImage.sourceUrl,
      featuredImageAlt: post.featuredImage.altText,
      featuredImageCaption: post.featuredImage.caption,
      date: post.date,
      modified: post.modified,
      tags: post.tags,
    })

    const postData = {
      content: post.content,
      title: post.title,
      authorName: post.author.name,
      authorUrl: post.author.slug,
      authorImg: post.author.avatar.url,
      categories: post.categories,
      featuredImageUrl: post.featuredImage.sourceUrl,
      featuredImageAlt: post.featuredImage.altText,
      featuredImageCaption: post.featuredImage.caption,
      date: post.date,
      slug: post.slug,
      tags: post.tags,
    }

    const handleObserver = React.useCallback(
      async (entries: any) => {
        const [target] = entries
        if (target.isIntersecting && hasNextPage == true) {
          const data: any = await wpGetInfiniteScollArticles(
            primary.id,
            endCursor,
          )
          setArticles((list: any) => [...list, ...data.posts])
          setEndCursor(data.pageInfo.endCursor)
          setHasNextPage(data.pageInfo.hasNextPage)
          setSeo({
            title: data.posts[0].seo.title,
            excerpt: data.posts[0].excerpt,
            description: data.posts[0].seo.description,
            slug: data.posts[0].slug,
            category: primary,
            authorName: data.posts[0].author.name,
            authorUrl: data.posts[0].author.slug,
            authorImg: data.posts[0].author.avatar.url,
            categories: data.posts[0].categories,
            featuredImageUrl: data.posts[0].featuredImage.sourceUrl,
            featuredImageAlt: data.posts[0].featuredImage.altText,
            featuredImageCaption: data.posts[0].featuredImage.caption,
            date: data.posts[0].date,
            modified: data.posts[0].modified,
            tags: data.posts[0].tags,
          })
        }
      },
      [endCursor, hasNextPage, primary],
    )

    React.useEffect(() => {
      const observer = new IntersectionObserver(handleObserver)
      const handleRouteChange = () => {
        setArticles([])
        setSeo({
          title: seoData.title,
          excerpt: post.excerpt,
          description: seoData.description,
          slug: post.slug,
          category: primary,

          authorName: post.author.name,
          authorUrl: post.author.slug,
          authorImg: post.author.avatar.url,
          categories: post.categories,
          featuredImageUrl: post.featuredImage.sourceUrl,
          featuredImageAlt: post.featuredImage.altText,
          featuredImageCaption: post.featuredImage.caption,
          date: post.date,
          modified: post.modified,
          tags: post.tags,
        })
      }

      router.events.on("routeChangeComplete", handleRouteChange)
      if (LoaderRef.current) {
        observer.observe(LoaderRef.current)
      }

      return () => {
        if (observer) {
          observer.disconnect()
        }

        router.events.off("routeChangeComplete", handleRouteChange)
      }
    }, [handleObserver, post, primary, router.events, seoData])

    return (
      <>
        <Head>{parse(seoData.jsonLd.raw)}</Head>
        <NextSeo
          title={`${seo.title} | ${env.SITE_TITLE}`}
          description={seo.description}
          canonical={`https://${env.DOMAIN}/${seo.category.slug}/${seo.slug}`}
          openGraph={{
            url: `https://${env.DOMAIN}/${seo.slug}`,
            title: `${seo.title} | ${env.SITE_TITLE}`,
            description: seo.description,
            images: [
              {
                url: seo.featuredImageUrl,
                alt: seo.featuredImageAlt,
                width: 1280,
                height: 720,
                type: "image/jpeg",
              },
            ],
            article: {
              publishedTime: seo.date,
              modifiedTime: seo.modified,
              section: seo.tags[0].title,
              authors: [`https://${env.DOMAIN}/author/${seo.authorUrl}`],
              tags: [
                seo.tags?.map((tag: TagProps) => {
                  return tag.title
                }),
              ],
            },
          }}
        />
        <ArticleJsonLd
          url={`https://${env.DOMAIN}/${seo.category.slug}/${seo.slug}`}
          title={`${seo.title} | ${env.SITE_TITLE}`}
          images={[seo.featuredImageUrl]}
          datePublished={seo.date}
          dateModified={seo.modified}
          authorName={[
            {
              name: seo.authorName,
              url: `https://${env.DOMAIN}/author/${seo.authorUrl}`,
            },
          ]}
          publisherName={env.SITE_TITLE}
          publisherLogo={env.LOGO_URL}
          description={seo.description}
          isAccessibleForFree={true}
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
              name: "Article",
              item: `https://${env.DOMAIN}/${seo.category.slug}`,
            },
            {
              position: 3,
              name: seo.category.title,
              item: `https://${env.DOMAIN}/${seo.category.slug}`,
            },
          ]}
        />
        <div
          ref={ref}
          className="mx-auto flex w-full md:max-[991px]:max-w-[750px] min-[992px]:max-[1199px]:max-w-[970px] min-[1200px]:max-w-[1170px]"
        >
          <section className="w-full lg:w-8/12">
            <Article
              isMain={true}
              posts={posts}
              postData={postData}
              isWP={true}
            />
            {articles.map(
              (
                postData: {
                  title: string
                  content: string
                  author: {
                    name: string
                    slug: string
                    avatar: { url: string }
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
                },
                i: number,
                arr: { [x: string]: { slug: string } },
              ) => {
                const postDatas = {
                  content: postData.content,
                  title: postData.title,
                  authorName: postData.author.name,
                  authorUrl: postData.author.slug,
                  authorImg: postData.author.avatar.url,
                  categories: postData.categories,
                  featuredImageUrl: postData.featuredImage.sourceUrl,
                  featuredImageAlt: postData.featuredImage.altText,
                  featuredImageCaption: postData.featuredImage.caption,
                  date: postData.date,
                  slug: postData.slug,
                  tags: postData.tags,
                }
                if (arr[i].slug == post.slug) {
                  return null
                }
                return (
                  <Article
                    key={i}
                    posts={posts}
                    ref={articleRef}
                    postData={postDatas}
                    isWP={true}
                  />
                )
              },
            )}
            <div ref={LoaderRef}>
              <Button
                loading={hasNextPage == true}
                loadingText="Loading ..."
                colorScheme="blue"
                className="!w-full !cursor-default"
              >
                No More Posts
              </Button>
            </div>
          </section>
          <aside className="hidden w-4/12 px-4 lg:!block">
            <div className="sticky top-8 rounded-xl border border-gray-100 p-4 dark:border-gray-700">
              <div className="mb-4">
                <Heading as="h4" className="!text-transparent">
                  <span className="after:absolute after:left-1/2 after:top-[40px] after:ml-[-25px] after:h-[3px] after:w-[50px] after:border after:border-[#1e3799] after:bg-[#1e3799]">
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
      </>
    )
  },
)
