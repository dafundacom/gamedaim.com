import * as React from "react"
import NextImage from "next/image"
import NextLink from "next/link"

import env from "@/env"

interface FooterProps {
  className?: string
}

export const Footer = React.forwardRef<HTMLDivElement, FooterProps>(
  (props, ref) => {
    const { className, ...rest } = props
    return (
      <footer
        className={`${className} mt-12 flex flex-col`}
        ref={ref}
        {...rest}
      >
        <div className="flex min-h-[120px] border-t border-gray-100 dark:border-gray-700">
          <NextLink className="w-full self-center pl-4" href="/">
            <NextImage
              className="site-logo"
              height={32}
              width={120}
              alt={env.SITE_TITLE}
              src={env.LOGO_URL}
            />
          </NextLink>
        </div>
        <div className="flex min-h-[60px] border-t border-gray-100 dark:border-gray-700">
          <div className="w-full self-center pl-4">
            {/* TODO: fetch from api*/}
            {"© 2023 Gamedaim - Everlasting Gaming Knowledge"}
          </div>
        </div>
      </footer>
    )
  },
)
