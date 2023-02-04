import * as React from "react"
import { FaFacebookF } from "react-icons/fa"

import { ShareButton, ShareButtonProps } from "./ShareButton"

export const ShareButtonFacebook = React.forwardRef<
  HTMLDivElement,
  ShareButtonProps
>((props, ref) => {
  const { url, onClick, text, ...rest } = props

  return (
    <ShareButton
      additionalClassName="!bg-[#314E89] text-white dark:text-gray-100 lg:hover:bg-[#314E89] dark:bg-[#374151]"
      onClick={onClick}
      icon={<FaFacebookF />}
      fullUrl={`https://facebook.com/sharer/sharer.php?u=${encodeURI(
        url as string,
      )}`}
      text={text || "Facebook"}
      ref={ref}
      {...rest}
    />
  )
})
