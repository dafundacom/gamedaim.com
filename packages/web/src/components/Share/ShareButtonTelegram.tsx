import * as React from "react"
import { FaTelegramPlane } from "react-icons/fa"

import { ShareButton, ShareButtonProps } from "./ShareButton"

export const ShareButtonTelegram = React.forwardRef<
  HTMLDivElement,
  ShareButtonProps
>((props, ref) => {
  const { url, onClick, text, message, ...rest } = props

  return (
    <ShareButton
      variant="solid"
      onClick={onClick}
      icon={<FaTelegramPlane />}
      text={text || "Telegram"}
      fullUrl={
        "https://telegram.me/share/url?text=" +
        encodeURI(message as string) +
        "&url=" +
        encodeURI(url as string)
      }
      message={message}
      ref={ref}
      {...rest}
    />
  )
})
