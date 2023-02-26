import * as React from "react"
import { useRouter } from "next/router"
import { Button } from "ui"

import { DownloadCard } from "@/components/Card"
import { getDownloadByTopics } from "@/lib/download"

interface InfiniteScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string
  posts: any
  index: number
  totalPage: any
}

export const InfiniteScrollDownload = React.forwardRef<
  HTMLDivElement,
  InfiniteScrollProps
>((props, ref) => {
  const { id, posts, totalPage, index, ...rest } = props

  const router = useRouter()

  const loadMoreRef = React.useRef<any>(null)
  const [page, setPage] = React.useState<any>(index)
  const [list, setList] = React.useState(posts) as any

  const handleObserver = React.useCallback(
    async (entries: any) => {
      const [target] = entries
      if (target.isIntersecting && totalPage >= page) {
        const {
          downloadByTopic: { downloads },
        }: any = await getDownloadByTopics(id, page)
        setList((list: any) => [...list, ...downloads])
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

      router.events.off("routeChangeComplete", handleRouteChange)
    }
  }, [handleObserver, posts, router.events])

  return (
    <div ref={ref} {...rest}>
      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <DownloadCard list={list} />
      </div>
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
