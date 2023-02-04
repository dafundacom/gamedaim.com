import * as React from "react"

export const useSafeLayoutEffect = globalThis?.document
  ? React.useLayoutEffect
  : React.useEffect
