import * as React from "react"
import { omit } from "../object-utils"

import { useImage, UseImageProps } from "./use-image"

export interface NativeImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  htmlWidth?: string | number
  htmlHeight?: string | number
}

export const NativeImage = React.forwardRef(
  (props: NativeImageProps, ref: React.Ref<any>) => {
    const { htmlWidth, htmlHeight, alt, ...rest } = props
    return (
      <img
        width={htmlWidth}
        height={htmlHeight}
        ref={ref}
        alt={alt}
        {...rest}
      />
    )
  },
)

export interface ImageProps
  extends UseImageProps,
    Omit<NativeImageProps, "onError"> {
  fallbackSrc?: string
  fallback?: React.ReactElement
  loading?: "eager" | "lazy"
  ignoreFallback?: boolean
  as?: React.ElementType
}

export const Image = React.forwardRef<unknown, ImageProps>((props, ref) => {
  const {
    fallbackSrc,
    fallback,
    src,
    loading,
    ignoreFallback,
    crossOrigin,
    as: Comp = NativeImage,
    ...rest
  } = props

  const shouldIgnore = loading != null || ignoreFallback

  const status = useImage({
    ...props,
    ignoreFallback: shouldIgnore,
  })

  const shared = {
    ref,
    // @ts-ignore FIX later
    ...(shouldIgnore ? rest : omit(rest, ["onError", "onLoad"])),
  }

  if (status !== "loaded") {
    if (fallback) return fallback
    return <Comp src={fallbackSrc} {...shared} />
  }

  return (
    <Comp src={src} crossOrigin={crossOrigin} loading={loading} {...shared} />
  )
})
