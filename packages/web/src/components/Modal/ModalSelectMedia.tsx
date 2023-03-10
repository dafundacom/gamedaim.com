import * as React from "react"
import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import { getMediaBySearch, useInfiniteMedias } from "@/lib/medias"
import { MdOutlineSearch } from "react-icons/md"
import NextImage from "next/image"
import { InfiniteScrollMedia } from "@/components/InfiniteScroll"
import { MediaUpload } from "@/components/Media"
import { Modal } from "@/components/Modal"
import { Input, Text } from "ui"
import { MediaDataProps } from "@/lib/data-types"

export const ModalSelectMedia = (props: {
  handleSelectUpdateMedia: any
  open: any
  setOpen: any
}) => {
  const { handleSelectUpdateMedia, open, setOpen } = props
  const [resultMedias, setResultMedias] = React.useState([])
  const [searched, setSearched] = React.useState(false)
  const {
    medias: listMedias,
    page,
    setPage,
    updateMedias,
  } = useInfiniteMedias()

  const { data: mediasCount } = useSWR("/media/count", fetcher)

  const totalPageMedias = mediasCount && Math.ceil(mediasCount / 10)

  const handleSearchMedia = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { media } = await getMediaBySearch(e.target["0"].value)

    setSearched(true)
    setResultMedias(media)
  }

  return (
    <>
      <Modal
        title="Select Featured Image"
        content={
          <>
            <MediaUpload addLoadMedias={updateMedias} />
            <div>
              <form onSubmit={(e) => handleSearchMedia(e)}>
                <Input.Group>
                  <Input type="text" placeholder="Search image" />
                  <Input.RightElement className="w-2">
                    <button
                      type="submit"
                      className="inset-y-0 mr-3 flex items-center rounded-lg p-1 focus:outline-none"
                    >
                      <MdOutlineSearch />
                    </button>
                  </Input.RightElement>
                </Input.Group>
              </form>
            </div>
            <div className="my-3">
              {!searched && listMedias && (
                <InfiniteScrollMedia
                  medias={listMedias}
                  index={2}
                  updateMedia={updateMedias}
                  totalPage={totalPageMedias}
                  page={page}
                  selectMedia={handleSelectUpdateMedia}
                  setPage={setPage}
                />
              )}

              {searched && resultMedias.length > 0 ? (
                <div className="mb-4 grid grid-cols-3 gap-3 lg:!grid-cols-5">
                  {resultMedias.map((media: MediaDataProps) => {
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
                          handleSelectUpdateMedia(media)
                          setSearched(false)
                        }}
                      />
                    )
                  })}
                </div>
              ) : (
                searched && (
                  <>
                    <Text>Medias Not Found</Text>
                  </>
                )
              )}
            </div>
          </>
        }
        isOpen={open}
        onClose={() => {
          setOpen(false)
          setSearched(false)
        }}
      />
    </>
  )
}
