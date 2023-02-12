import * as React from "react"
import { wpPrimaryCategorySlug } from "@/lib/wp-categories"
import dynamic from "next/dynamic"
import { Article } from "@/components/Article"
import { wpGetInfiniteScollArticles } from "@/lib/wp-posts"
import { useRouter } from "next/router"
import { Button } from "ui"
import Head from "next/head"
import { ContentContext } from "@/contexts/content.context"
import env from "@/env"
import { getSeoDatas } from "@/lib/wp-seo"
import parse from "html-react-parser"
const PostCardSide = dynamic(() =>
  import("@/components/Card").then((mod) => mod.PostCardSide),
)

const Heading = dynamic(() => import("ui").then((mod) => mod.Heading))

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
    const { categories } = post
    const { primary } = wpPrimaryCategorySlug(categories)
    const [articles, setArticles] = React.useState<any>([])
    const [hasNextPage, setHasNextPage] = React.useState(true)
    const [endCursor, setEndCursor] = React.useState("")
    const LoaderRef = React.useRef(null)
    const articleRef = React.useRef(null)
    const router = useRouter()
    const seoData: any = React.useContext(ContentContext)
    const [seo, setSeo] = React.useState(seoData)

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
        }
      },
      [endCursor, hasNextPage, primary.id],
    )
    const handleObserverSeo = React.useCallback(
      async (entries: any) => {
        const [target] = entries
        if (target.isIntersecting) {
          const seoDatas = await getSeoDatas(
            `https://${env.DOMAIN}/${primary.slug}/${target.target.id}`,
          )
          setSeo(seoDatas)
        }
      },
      [primary.slug],
    )

    React.useEffect(() => {
      const observer = new IntersectionObserver(handleObserver)
      const observerSeo = new IntersectionObserver(handleObserverSeo)
      const handleRouteChange = () => {
        setArticles([])
        setSeo(seoData)
      }
      router.events.on("routeChangeComplete", handleRouteChange)
      if (LoaderRef.current) {
        observer.observe(LoaderRef.current)
      }
      if (articleRef.current) {
        observerSeo.observe(articleRef.current)
      }

      return () => {
        if (observer) {
          observer.disconnect()
        }
        if (observerSeo) {
          observerSeo.disconnect()
        }
        router.events.off("routeChangeComplete", handleRouteChange)
      }
    }, [handleObserver, handleObserverSeo, post, router.events, seoData])

    return (
      <>
        <Head>{seo?.success === true && parse(seo?.head)}</Head>
        <div
          ref={ref}
          className="flex w-full md:max-[991px]:max-w-[750px] min-[992px]:max-[1199px]:max-w-[970px] min-[1200px]:max-w-[1170px] mx-auto"
        >
          <section className="w-full lg:w-8/12">
            <Article post={post} posts={posts} />
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
                if (i > 0 && arr[i].slug == post.slug) {
                  return null
                }
                return (
                  <Article
                    key={i}
                    post={postData}
                    posts={posts}
                    index={i}
                    ref={articleRef}
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
          <aside className="w-4/12 px-4 hidden lg:!block">
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
      </>
    )
  },
)
