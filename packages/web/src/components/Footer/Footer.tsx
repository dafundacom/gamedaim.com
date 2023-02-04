import * as React from "react"
import NextLink from "next/link"
import NextImage from "next/image"

import env from "@/env"

interface FooterProps {
  className?: string
}

export const Footer = React.forwardRef<HTMLDivElement, FooterProps>(
  (props, ref) => {
    const { className, ...rest } = props
    return (
      <footer
        className={`${className} flex flex-col mt-12`}
        ref={ref}
        {...rest}
      >
        <div className="border-t min-h-[120px] flex border-gray-100 dark:border-gray-700">
          <NextLink className="w-full pl-4 self-center" href="/">
            <NextImage
              className="site-logo"
              height={32}
              width={120}
              alt={env.SITE_TITLE}
              src={env.LOGO_URL}
            />
          </NextLink>
        </div>
        <div className="border-t border-gray-100 dark:border-gray-700 flex min-h-[60px]">
          <div className="pl-4 w-full self-center">
            {/* TODO: fetch from api*/}
            {"© 2023 Gamedaim - Everlasting Gaming Knowledge"}
          </div>
        </div>
      </footer>
    )
  },
)
