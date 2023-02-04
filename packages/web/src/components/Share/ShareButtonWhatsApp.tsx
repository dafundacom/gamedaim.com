import * as React from "react"
import { FaWhatsapp } from "react-icons/fa"

import { ShareButton, ShareButtonProps } from "./ShareButton"

export const ShareButtonWhatsApp = React.forwardRef<
  HTMLDivElement,
  ShareButtonProps
>((props, ref) => {
  const { url, onClick, text, message, ...rest } = props

  return (
    <ShareButton
      additionalClassName="!bg-[#22C35E] lg:hover:bg-[#22C35E] text-white dark:text-gray-100 text-[#22C35E]"
      onClick={onClick}
      icon={<FaWhatsapp />}
      message={message}
      text={text || "WhatsApp"}
      fullUrl={
        "whatsapp://send?text=" +
        encodeURI(message as string) +
        "%20" +
        encodeURI(url as string)
      }
      ref={ref}
      {...rest}
    />
  )
})
