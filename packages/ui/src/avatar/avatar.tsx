import * as React from "react"
import { tx } from "@twind/core"
import { useImage } from "../image"
import { SizesProps } from "../type-utils"

type AvatarSizes = Exclude<SizesProps, "4xl" | "base">

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
  name?: string
  alt?: string
  bordered?: boolean
  children?: React.ReactNode
  src?: string
  srcSet?: string
  loading?: "eager" | "lazy"
  onError?: () => void
  // eslint-disable-next-line no-unused-vars
  getInitials?: (name: string) => string
  isFullName?: boolean
  size?: AvatarSizes | "2xs" | "full"
  colorScheme?: string
}

const getInitials = (name: string) => {
  let [firstName, lastName] = name.split(" ")

  if (firstName && lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`
  } else {
    return firstName.charAt(0)
  }
}

export interface AvatarNameProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
  name: string
  isFullName?: boolean
  className?: string
  size?: string
}

export const AvatarName: React.FunctionComponent<AvatarNameProps> = (props) => {
  const {
    as: Comp = "span",
    name,
    isFullName,
    className,
    size = "md",
    ...rest
  } = props

  const avatarNameSizeClasses = {
    "2xs": "h-4 w-4",
    xs: "h-5 w-5",
    sm: "h-6 w-6",
    md: "h-7 w-7",
    lg: "h-8 w-8",
    xl: "h-10 w-10",
    "2xl": "h-12 w-12",
    "3xl": "h-16 w-16",
    full: "h-full w-full",
  }

  const avatarNameClasses = tx(
    "font-medium text-center uppercase",
    avatarNameSizeClasses[size],
    className,
  )

  return (
    <Comp className={avatarNameClasses} aria-label={name} {...rest}>
      {name ? (isFullName ? name : getInitials(name)) : null}
    </Comp>
  )
}

interface DefaultAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  "aria-label"?: string
}

const DefaultAvatar: React.FunctionComponent<DefaultAvatarProps> = (props) => {
  const { className, ...rest } = props

  const defaultAvatarClasses = tx("h-full w-full", className)
  return (
    <div className={defaultAvatarClasses} {...rest}>
      <svg fill="#fff" viewBox="0 0 128 128" role="img">
        <g>
          <path d="M103,102.1388 C93.094,111.92 79.3504,118 64.1638,118 C48.8056,118 34.9294,111.768 25,101.7892 L25,95.2 C25,86.8096 31.981,80 40.6,80 L87.4,80 C96.019,80 103,86.8096 103,95.2 L103,102.1388 Z" />
          <path d="M63.9961647,24 C51.2938136,24 41,34.2938136 41,46.9961647 C41,59.7061864 51.2938136,70 63.9961647,70 C76.6985159,70 87,59.7061864 87,46.9961647 C87,34.2938136 76.6985159,24 63.9961647,24" />
        </g>
      </svg>
    </div>
  )
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (props, ref) => {
    const {
      as: Comp = "div",
      size = "md",
      bordered,
      name,
      isFullName,
      src,
      children,
      className,
      style,
      onError,
      colorScheme = "gray",
      ...rest
    } = props

    const avatarSizeClassesForFont = {
      "2xs": 4,
      xs: 5,
      sm: 6,
      md: 7,
      lg: 8,
      xl: 10,
      "2xl": 12,
      "3xl": 16,
      full: "full",
    }

    const avatarBaseSizeClassesForFont = {
      4: "1rem",
      5: "1.25rem",
      6: "1.5rem",
      7: "1.75rem",
      8: "2rem",
      10: "2.5rem",
      12: "3rem",
      16: "4rem",
    }

    const avatarSizeClasses = {
      "2xs": "h-4 w-4",
      xs: "h-5 w-5",
      sm: "h-6 w-6",
      md: "h-7 w-7",
      lg: "h-8 w-8",
      xl: "h-10 w-10",
      "2xl": "h-12 w-12",
      "3xl": "h-16 w-16",
      full: "h-full w-full",
    }

    const classes = tx(
      `inline-flex flex-shrink-0 relative items-center justify-center align-top rounded-full bg-${colorScheme}-300 text-${colorScheme}-800 dark:bg-${colorScheme}-600 dark:text-${colorScheme}-100`,
      bordered && `border-2 border-white dark:border-${colorScheme}-800`,
      avatarSizeClasses[size],
      className,
    )

    const status = useImage({ src, onError })
    const hasLoaded = status === "loaded"

    const sizeKey = avatarSizeClassesForFont[size]
    const _size = avatarBaseSizeClassesForFont[sizeKey]
    const fontSize = `calc(${_size} / 2.5)`

    const renderChildren = () => {
      if (src && hasLoaded) {
        return (
          <img
            className="h-full w-full rounded-full object-cover"
            src={src}
            alt={name}
          />
        )
      }

      if (src && !hasLoaded) {
        if (name) {
          return <AvatarName size={size} name={name} isFullName={isFullName} />
        } else {
          return <DefaultAvatar aria-label={name} />
        }
      }

      if (!src && name) {
        return <AvatarName size={size} name={name} isFullName={isFullName} />
      }

      return <DefaultAvatar aria-label={name} />
    }

    return (
      <Comp
        ref={ref}
        className={classes}
        style={{
          fontSize,
          lineHeight: _size,
          ...style,
        }}
        {...rest}
      >
        {renderChildren()}
        {children}
      </Comp>
    )
  },
)
