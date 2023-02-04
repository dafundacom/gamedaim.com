import * as React from "react"
import { FaTwitter } from "react-icons/fa"

import { ShareButton, ShareButtonProps } from "./ShareButton"

export const ShareButtonTwitter = React.forwardRef<
  HTMLDivElement,
  ShareButtonProps
>((props, ref) => {
  const { url, onClick, text, sharetext, ...rest } = props

  return (
    <ShareButton
      additionalClassName="text-[#1DA1F2] !bg-[#1DA1F2] lg:hover:bg-[#1DA1F2] lg:text-white dark:text-gray-100"
      onClick={onClick}
      icon={<FaTwitter />}
      text={text || "Twitter"}
      sharetext={sharetext}
      fullUrl={`https://twitter.com/intent/tweet/?text=${encodeURI(
        sharetext as string,
      )}&url=${encodeURI(url as string)}`}
      ref={ref}
      {...rest}
    />
  )
})
