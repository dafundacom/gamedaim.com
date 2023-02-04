import * as React from "react"
import { FaLinkedinIn } from "react-icons/fa"

import { ShareButton, ShareButtonProps } from "./ShareButton"

export const ShareButtonLinkedIn = React.forwardRef<
  HTMLDivElement,
  ShareButtonProps
>((props, ref) => {
  const { url, onClick, text, ...rest } = props

  return (
    <ShareButton
      additionalClassName="text-[#00A0DC] !bg-[#00A0DC] lg:text-white dark:text-gray-100 dark:bg-[#374151]"
      onClick={onClick}
      icon={<FaLinkedinIn />}
      text={text || "LinkedIn"}
      fullUrl={
        "https://www.linkedin.com/shareArticle?mini=true&url=" +
        encodeURI(url as string) +
        "&title=" +
        encodeURI(text as string) +
        "&summary=" +
        encodeURI(text as string) +
        "&source=" +
        encodeURI(url as string)
      }
      ref={ref}
      {...rest}
    />
  )
})
