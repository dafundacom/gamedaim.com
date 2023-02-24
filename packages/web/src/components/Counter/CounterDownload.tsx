import * as React from "react"
export function CounterdownDownload() {
  const [difference, setDifference] = React.useState(10)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDifference((prevDifference): number => prevDifference - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return <>{difference}</>
}
