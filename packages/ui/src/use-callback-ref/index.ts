/* eslint-disable no-unused-vars */
import * as React from "react"

export function useCallbackRef<T extends (...args: any[]) => any>(
  callback: T | undefined,
  deps: React.DependencyList = [],
) {
  const callbackRef = React.useRef(callback)

  React.useEffect(() => {
    callbackRef.current = callback
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useCallback(
    ((...args) => callbackRef.current?.(...args)) as T,
    deps,
  )
}
