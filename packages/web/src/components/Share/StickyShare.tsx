import env from "@/env"
import { ShareButtonArticle } from "./ShareButtonArticle"

export const StickyShare = (props: any) => {
  const { title, categorySlug, postSlug } = props
  return (
    <>
      <div className="shadow-xs fixed top-[unset] bottom-0 left-0 z-40 mx-0 mr-2 mb-0 mr-0 flex h-fit w-full flex-row items-center justify-center bg-white dark:bg-gray-700 lg:!sticky lg:!top-20 lg:bottom-[unset] lg:left-[unset] lg:!w-auto lg:bg-transparent lg:px-2 lg:shadow-none lg:dark:bg-transparent">
        <ShareButtonArticle
          url={`https://${env.DOMAIN}/${categorySlug}/${postSlug}`}
          text={title}
        />
      </div>
    </>
  )
}
