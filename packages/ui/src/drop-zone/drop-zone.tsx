import * as React from "react"
import { tx } from "@twind/core"

export interface DropZoneProps extends React.HTMLAttributes<HTMLDivElement> {
  colorScheme?: string
  placeholder?: string
  description?: string
}

export const DropZone = React.forwardRef<HTMLDivElement, DropZoneProps>(
  (props, ref) => {
    const {
      colorScheme = "gray",
      className,
      placeholder = "Click to upload or drag and drop",
      description = "SVG, PNG, JPG or GIF (MAX. 800x400px)",
      ...rest
    } = props

    return (
      <div
        ref={ref}
        className={tx`flex w-full items-center justify-center ${className}`}
        {...rest}
      >
        <label
          htmlFor="dropzone-file"
          className={tx`flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-${colorScheme}-300 bg-${colorScheme}-50 hover:bg-${colorScheme}-100 dark:border-${colorScheme}-600 dark:bg-${colorScheme}-700 dark:hover:border-${colorScheme}-500 dark:hover:bg-${colorScheme}-800`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              aria-hidden="true"
              className={tx`text-${colorScheme}-400 mb-3 h-10 w-10`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>
            <p
              className={tx`text-${colorScheme}-500 dark:text-${colorScheme}-400 mb-2 text-sm`}
            >
              <span className="font-semibold">{placeholder}</span>
            </p>
            <p
              className={tx`text-${colorScheme}-500 dark:text-${colorScheme}-400 text-xs`}
            >
              {description}
            </p>
          </div>
          <input id="dropzone-file" type="file" className="hidden" />
        </label>
      </div>
    )
  },
)
