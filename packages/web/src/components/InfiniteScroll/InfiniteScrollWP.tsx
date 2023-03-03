import * as React from "react"
import { useRouter } from "next/router"
import { Button } from "ui"

import { PostCard } from "@/components/Card"
import { WpPostsDataProps } from "@/lib/wp-data-types"
import {
  wpGetAllPostsLoadMore,
  wpGetPostsByAuthorSlug,
  wpGetPostsByCategorySlug,
  wpGetPostsByTagSlug,
} from "@/lib/wp-posts"

interface InfiniteScrollWPProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string
  posts: WpPostsDataProps
  pageInfo: any
  pageType: "home" | "category" | "author" | "tag"
}

export const InfiniteScrollWP = React.forwardRef<
  HTMLDivElement,
  InfiniteScrollWPProps
>((props, ref) => {
  const { id, posts, pageInfo, pageType, ...rest } = props

  const router = useRouter()

  const loadMoreRef = React.useRef<any>(null)
  const [page, setPage] = React.useState(pageInfo)
  const [list, setList] = React.useState(posts) as any

  const handleObserver = React.useCallback(
    async (entries: any) => {
      const [target] = entries
      if (target.isIntersecting && page.hasNextPage == true) {
        if (pageType == "category") {
          const data: any = await wpGetPostsByCategorySlug(id, page.endCursor)
          setList((list: any) => [...list, ...data.posts])
          setPage(data.pageInfo)
        } else if (pageType == "author") {
          const data: any = await wpGetPostsByAuthorSlug(
            id as string,
            page.endCursor,
          )
          setList((list: any) => [...list, ...data.posts])
          setPage(data.pageInfo)
        } else if (pageType == "tag") {
          const data: any = await wpGetPostsByTagSlug(id, page.endCursor)
          setList((list: any) => [...list, ...data.posts])
          setPage(data.pageInfo)
        } else {
          const data: any = await wpGetAllPostsLoadMore(page.endCursor)
          setList((list: any) => [...list, ...data.posts])
          setPage(data.pageInfo)
        }
      }
    },
    [id, page.endCursor, page.hasNextPage, pageType],
  )

  React.useEffect(() => {
    const lmRef: any = loadMoreRef.current
    const observer = new IntersectionObserver(handleObserver)
    const handleRouteChange = () => {
      setList(posts)
    }

    if (pageType != "home") {
      router.events.on("routeChangeComplete", handleRouteChange)
    }

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
      {list.map((post: WpPostsDataProps) => {
        return (
          <PostCard
            key={post.id}
            src={post.featuredImage.sourceUrl}
            alt={post.featuredImage.altText}
            slug={post.uri}
            title={post.title}
            excerpt={post.excerpt}
            authorName={post.author.name}
            authorAvatarUrl={post.author.avatar.url}
            authorUri={post.author.uri}
            date={post.date}
          />
        )
      })}
      <div ref={loadMoreRef}>
        <Button
          ref={loadMoreRef}
          loading={page.hasNextPage == true}
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
