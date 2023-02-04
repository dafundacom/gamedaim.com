/* eslint-disable no-unused-vars */
import * as React from "react"

type Handler = (e: Event) => void

export const useClickOutside = <T extends HTMLElement = HTMLElement>(
  refObject: React.RefObject<T>,
  handler: Handler,
) => {
  React.useEffect(() => {
    const listener = (e: Event) => {
      const el = refObject?.current

      if (
        !el ||
        el.contains(e.target as Node) ||
        (e.target as HTMLButtonElement).ariaHasPopup
      ) {
        return
      }

      handler(e)
    }

    document.addEventListener("mousedown", listener)
    document.addEventListener("touchstart", listener)
    return () => {
      document.removeEventListener("mousedown", listener)
      document.removeEventListener("touchstart", listener)
    }
  }, [handler, refObject])
}
