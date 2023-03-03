import * as React from "react"
import { useRouter } from "next/router"
import { Button } from "ui"

import { PostCard } from "@/components/Card"
import { ArticleDataProps } from "@/lib/data-types"
import { getArticlesByTopic } from "@/lib/topics"

interface InfiniteScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string
  posts: any
  index?: number
  pageType: any
  totalPage?: any
}

export const InfiniteScrollTopic = React.forwardRef<
  HTMLDivElement,
  InfiniteScrollProps
>((props, ref) => {
  const { id, posts, pageType, totalPage, index, ...rest } = props

  const router = useRouter()

  const loadMoreRef = React.useRef<any>(null)
  const [page, setPage] = React.useState<any>(index)
  const [list, setList] = React.useState(posts) as any

  const handleObserver = React.useCallback(
    async (entries: any) => {
      const [target] = entries
      if (target.isIntersecting && totalPage >= page) {
        const { topic } = await getArticlesByTopic(id, page)
        setList((list: any) => [...list, ...topic.articles])
        setPage((prev: number) => prev + 1)
      }
    },
    [id, page, totalPage],
  )

  React.useEffect(() => {
    const lmRef: any = loadMoreRef.current
    const observer = new IntersectionObserver(handleObserver)
    const handleRouteChange = () => {
      setList(posts)
    }

    router.events.on("routeChangeComplete", handleRouteChange)

    if (loadMoreRef.current) observer.observe(loadMoreRef.current)
    return () => {
      if (lmRef) {
        observer.unobserve(lmRef)
      }
      if (pageType != "home") {
        router.events.off("routeChangeComplete", handleRouteChange)
      }
    }
  }, [handleObserver, pageType, posts, router.events])

  return (
    <div ref={ref} {...rest}>
      {list.map((article: ArticleDataProps) => {
        return (
          <PostCard
            key={article.id}
            src={article.featuredImage.url}
            alt={article.featuredImage.alt}
            slug={article.slug}
            title={article.title}
            excerpt={article.excerpt}
            authorName={article.author.name}
            authorAvatarUrl={article.author.profilePicture?.url}
            authorUri={article.author?.username}
            date={article.createdAt}
            isWP={false}
          />
        )
      })}
      <div ref={loadMoreRef}>
        <Button
          ref={loadMoreRef}
          loading={totalPage >= page}
          loadingText="Loading ..."
          colorScheme="blue"
          className="!w-full !cursor-default"
        >
          No More Posts
        </Button>
      </div>
    </div>
  )
})
