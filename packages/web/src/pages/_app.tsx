import * as React from "react"
import NProgress from "nprogress"
import { useRouter } from "next/router"
import { AppProps } from "next/app"
import { ThemeProvider as NextThemeProvider } from "next-themes"
import install from "@twind/with-next/app"
import {
  QueryClient,
  QueryClientProvider,
  Hydrate,
} from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import "nprogress/nprogress.css"

import styleConfig from "@/utils/style"

const queryClient = new QueryClient()

function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  React.useEffect(() => {
    const handleRouteStart = () => NProgress.start()
    const handleRouteDone = () => NProgress.done()

    router.events.on("routeChangeStart", handleRouteStart)
    router.events.on("routeChangeComplete", handleRouteDone)
    router.events.on("routeChangeError", handleRouteDone)

    return () => {
      router.events.off("routeChangeStart", handleRouteStart)
      router.events.off("routeChangeComplete", handleRouteDone)
      router.events.off("routeChangeError", handleRouteDone)
    }
  }, [router.events])

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <NextThemeProvider
            defaultTheme="system"
            attribute="class"
            enableSystem
          >
            <Component {...pageProps} />
          </NextThemeProvider>
        </Hydrate>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </>
  )
}

export default install(styleConfig, App)
