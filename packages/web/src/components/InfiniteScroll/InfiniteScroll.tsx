import * as React from "react"
import { useRouter } from "next/router"
import {
  wpGetAllPostsLoadMore,
  wpGetPostsByCategorySlug,
  wpGetPostsByAuthorSlug,
  wpGetPostsByTagSlug,
} from "@/lib/wp-posts"
import { PostCard } from "@/components/Card"
import { Button } from "ui"

export const InfiniteScroll = (props: any) => {
  const { posts, pageInfo, pageType, id } = props
  const router = useRouter()

  const loadMoreRef: any = React.useRef(null)
  const [page, setPage] = React.useState(pageInfo)
  const [list, setList] = React.useState(posts)
  const handleObserver = React.useCallback(
    async (entries: any) => {
      const [target] = entries
      if (target.isIntersecting && page.hasNextPage == true) {
        if (pageType == "category") {
          const data: any = await wpGetPostsByCategorySlug(id, page.endCursor)
          setList((list: any) => [...list, ...data.posts])
          setPage(data.pageInfo)
        } else if (pageType == "author") {
          const data: any = await wpGetPostsByAuthorSlug(id, page.endCursor)
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
    <>
      {list.map(
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
          author: {
            name: string
            avatar: {
              url: string
            }
            uri: string
          }
          uri: string
          date: string
        }) => {
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
        },
      )}
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
    </>
  )
}
