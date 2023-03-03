import * as React from "react"
import axios from "axios"
import NextImage from "next/image"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { toast } from "react-hot-toast"
import { MdDeleteOutline } from "react-icons/md"
import { Button, IconButton } from "ui"

import { MediaDataProps } from "@/lib/data-types"
import { getMedias } from "@/lib/medias"

interface InfiniteScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  medias: any
  index: number
  updateMedia?: any
  totalPage: any
  isLibrary?: boolean
  deleteMedia?: any
}

export const InfiniteScrollMedia = React.forwardRef<
  HTMLDivElement,
  InfiniteScrollProps
>((props, ref) => {
  const { medias, totalPage, isLibrary, updateMedia, index, ...rest } = props

  const router = useRouter()

  const loadMoreRef = React.useRef<any>(null)
  const [page, setPage] = React.useState<any>(index)
  const [list, setList] = React.useState(medias) as any

  const handleObserver = React.useCallback(
    async (entries: any) => {
      const [target] = entries
      if (target.isIntersecting && totalPage >= page) {
        const { medias }: any = await getMedias(page)
        setList((list: any) => [...list, ...medias])
        setPage((prev: number) => prev + 1)
      }
    },
    [page, totalPage],
  )

  React.useEffect(() => {
    const lmRef: any = loadMoreRef.current
    const observer = new IntersectionObserver(handleObserver)
    const handleRouteChange = () => {
      if (!isLibrary) {
        setList(medias)
        setPage(index)
      }
    }

    router.events.on("routeChangeComplete", handleRouteChange)

    if (loadMoreRef.current) observer.observe(loadMoreRef.current)
    return () => {
      if (lmRef) {
        observer.unobserve(lmRef)
      }

      router.events.off("routeChangeComplete", handleRouteChange)
    }
  }, [handleObserver, index, isLibrary, medias, router.events])
  const handleDelete = async (item: { name: any }) => {
    try {
      const { data } = await axios.delete(`/media/name/${item.name}`)
      const filteredData = list.filter(
        (media: { name: string }) => media.name !== data.name,
      )
      setList(filteredData)
      toast.success("Media deleted successfully")
    } catch (err: any) {
      console.log(err)
      toast.error(err.response.data.message)
    }
  }

  return (
    <div ref={ref} {...rest}>
      <div className="mb-4 grid grid-cols-5 gap-3">
        {isLibrary
          ? list.map((media: MediaDataProps) => (
              <div className="relative overflow-hidden rounded-[18px]">
                <IconButton
                  colorScheme="red"
                  className="!absolute z-20 !rounded-full !p-0"
                  onClick={() => handleDelete(media)}
                >
                  <MdDeleteOutline />
                </IconButton>
                <NextLink href={`/dashboard/media/${media.id}`}>
                  <NextImage
                    key={media.id}
                    src={media.url}
                    alt={media.alt || media.name}
                    fill
                    className="!relative aspect-[1/1] h-[500px] max-w-[unset] animate-pulse rounded-sm border-2 border-gray-300 bg-slate-300 object-cover"
                    onLoadingComplete={(e) => {
                      e.classList.remove("animate-pulse")
                    }}
                  />
                </NextLink>
              </div>
            ))
          : list.map((media: MediaDataProps) => {
              return (
                <NextImage
                  key={media.id}
                  src={media.url}
                  alt={media.alt || media.name}
                  fill
                  className="!relative aspect-[1/1] h-[500px] max-w-[unset] animate-pulse cursor-pointer rounded-sm border-2 border-gray-300 bg-slate-300 object-cover"
                  onLoadingComplete={(e) => {
                    e.classList.remove("animate-pulse")
                  }}
                  onClick={(e: { preventDefault: () => void }) => {
                    e.preventDefault()
                    updateMedia(media)
                  }}
                />
              )
            })}
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
