import * as React from "react"

import {
  ShareButtonFacebook,
  ShareButtonTwitter,
  ShareButtonWhatsApp,
  ShareButtonEmail,
} from "."

interface ShareButtonArticleProps extends React.HTMLAttributes<HTMLDivElement> {
  url: string
  text?: string | null
  media?: string | null
}

export const ShareButtonArticle = React.forwardRef<
  HTMLDivElement,
  ShareButtonArticleProps
>((props, ref) => {
  const { url, text, ...rest } = props
  return (
    <div
      className="lg:justify-unset flex max-lg:w-full flex-row justify-evenly py-2 sm:max-[767px]:w-1/2 lg:mt-2 lg:!w-auto lg:flex-col lg:!py-0 "
      ref={ref}
      {...rest}
    >
      <ShareButtonFacebook url={url} />
      <ShareButtonTwitter url={url} sharetext={text} />
      <ShareButtonEmail url={url} subject={text} />
      <ShareButtonWhatsApp message={text} url={url} />
    </div>
  )
})
