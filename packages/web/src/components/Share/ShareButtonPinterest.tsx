import * as React from "react"
import { FaPinterestP } from "react-icons/fa"

import { ShareButton, ShareButtonProps } from "./ShareButton"

export const ShareButtonPinterest = React.forwardRef<
  HTMLDivElement,
  ShareButtonProps
>((props, ref) => {
  const { url, onClick, text, sharetext, mediaSrc, ...rest } = props

  return (
    <ShareButton
      additionalClassName="!bg-[#C61F26] lg:hover:bg-[#C61F26]  text-white dark:text-gray-100"
      onClick={onClick}
      icon={<FaPinterestP />}
      text={text || "Pinterest"}
      fullUrl={`https://pinterest.com/pin/create/button/?url=${encodeURI(
        url as string,
      )}&media=${encodeURI(mediaSrc as string)}&description=${encodeURI(
        sharetext as string,
      )}`}
      ref={ref}
      {...rest}
    />
  )
})
