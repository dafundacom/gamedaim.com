import * as React from "react"
import { FaRedditAlien } from "react-icons/fa"

import { ShareButton, ShareButtonProps } from "./ShareButton"

export const ShareButtonReddit = React.forwardRef<
  HTMLDivElement,
  ShareButtonProps
>((props, ref) => {
  const { url, onClick, text, ...rest } = props

  return (
    <ShareButton
      additionalClassName="!bg-[#ff4500] lg:hover:bg-[#ff4500] text-white dark:text-gray-100"
      onClick={onClick}
      icon={<FaRedditAlien />}
      text={text || "Reddit"}
      fullUrl={`https://reddit.com/submit/?url=${encodeURI(url as string)}`}
      ref={ref}
      {...rest}
    />
  )
})
