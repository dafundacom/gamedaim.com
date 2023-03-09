import * as React from "react"
import axios from "axios"
import NextImage from "next/image"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { toast } from "react-hot-toast"
import { Button } from "ui"

import { MediaDataProps } from "@/lib/data-types"
import { DeleteMediaButton } from "../Media"

interface InfiniteScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  medias: any
  index: number
  selectMedia?: any
  totalPage: any
  isLibrary?: boolean
  deleteMedia?: any
  page: any
  setPage: any
  updateMedia: any
}

export const InfiniteScrollMedia = React.forwardRef<
  HTMLDivElement,
  InfiniteScrollProps
>((props, ref) => {
  const {
    medias,
    totalPage,
    isLibrary,
    selectMedia,
    index,
    page,
    setPage,
    updateMedia,
    ...rest
  } = props

  const router = useRouter()

  const loadMoreRef = React.useRef<any>(null)

  const handleObserver = React.useCallback(
    async (entries: any) => {
      const [target] = entries
      if (target.isIntersecting && totalPage >= page) {
        setPage(page + 1)
      }
    },
    [page, setPage, totalPage],
  )

  React.useEffect(() => {
    const lmRef: any = loadMoreRef.current
    const observer = new IntersectionObserver(handleObserver)
    const handleRouteChange = () => {
      setPage(1)
    }

    router.events.on("routeChangeComplete", handleRouteChange)

    if (loadMoreRef.current) observer.observe(loadMoreRef.current)
    return () => {
      if (lmRef) {
        observer.unobserve(lmRef)
      }

      router.events.off("routeChangeComplete", handleRouteChange)
    }
  }, [handleObserver, index, isLibrary, medias, router.events, setPage])
  const handleDelete = async (item: { name: any }) => {
    try {
      const { data } = await axios.delete(`/media/name/${item.name}`)
      updateMedia()

      if (data) toast.success("Media deleted successfully")
    } catch (err: any) {
      console.log(err)
      toast.error(err.response.data.message)
    }
  }

  return (
    <div ref={ref} {...rest}>
      <div className="mb-4 grid grid-cols-3 gap-3 lg:!grid-cols-5">
        {isLibrary
          ? medias.map((list: any) =>
              list.map((media: MediaDataProps) => {
                return (
                  <div className="relative overflow-hidden rounded-[18px]">
                    <DeleteMediaButton
                      content={media.name}
                      deleteMedia={() => handleDelete(media)}
                    />
                    <NextLink href={`/dashboard/media/${media.id}`}>
                      <NextImage
                        key={media.id}
                        src={media.url}
                        alt={media.alt || media.name}
                        fill
                        className="loading-image !relative aspect-[1/1] h-[500px] max-w-[unset] rounded-sm border-2 border-gray-300 bg-slate-300 object-cover"
                        onLoadingComplete={(e) => {
                          e.classList.remove("loading-image")
                        }}
                      />
                    </NextLink>
                  </div>
                )
              }),
            )
          : medias.map((list: any) =>
              list.map((media: MediaDataProps) => {
                return (
                  <NextImage
                    key={media.id}
                    src={media.url}
                    alt={media.alt || media.name}
                    fill
                    className="loading-image !relative aspect-[1/1] h-[500px] max-w-[unset] cursor-pointer rounded-sm border-2 border-gray-300 bg-slate-300 object-cover"
                    onLoadingComplete={(e) => {
                      e.classList.remove("loading-image")
                    }}
                    onClick={(e: { preventDefault: () => void }) => {
                      e.preventDefault()
                      selectMedia(media)
                    }}
                  />
                )
              }),
            )}
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
