import * as React from "react"
import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import { useInfiniteMedias } from "@/lib/medias"
import { InfiniteScrollMedia } from "../InfiniteScroll"
import { MediaUpload } from "../Media"
import { Modal } from "./Modal"

export const ModalSelectMedia = (props: {
  handleSelectUpdateMedia: any
  open: any
  setOpen: any
}) => {
  const { handleSelectUpdateMedia, open, setOpen } = props

  const {
    medias: listMedias,
    page,
    setPage,
    updateMedias,
  } = useInfiniteMedias()

  const { data: mediasCount } = useSWR("/media/count", fetcher)

  const totalPageMedias = mediasCount && Math.ceil(mediasCount / 10)
  return (
    <>
      <Modal
        title="Select Featured Image"
        content={
          <>
            <MediaUpload addLoadMedias={updateMedias} />
            <div className="my-3">
              {listMedias && (
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
            </div>
          </>
        }
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </>
  )
}
