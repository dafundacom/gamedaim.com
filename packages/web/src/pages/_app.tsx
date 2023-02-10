import * as React from "react"
import { useRouter } from "next/router"
import { AppProps } from "next/app"
import { ThemeProvider as NextThemeProvider } from "next-themes"
import { Toaster } from "react-hot-toast"
import install from "@twind/with-next/app"
import {
  QueryClient,
  QueryClientProvider,
  Hydrate,
} from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import styleConfig from "@/utils/style"
import { AuthProvider } from "@/contexts/auth.context"
import { ArticleProvider } from "@/contexts/article.context"
import { MediaProvider } from "@/contexts/media.context"
import { UserProvider } from "@/contexts/user.context"
import { AdProvider } from "@/contexts/ads.context"
import { Button } from "ui"

const queryClient = new QueryClient()

function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  React.useEffect(() => {
    const handleRouteStart = () => setLoading(true)
    const handleRouteDone = () => setLoading(false)

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
            <AuthProvider>
              <AdProvider>
                <UserProvider>
                  <ArticleProvider>
                    <MediaProvider>
                      <Toaster />
                      {loading === true && (
                        <div className="fixed w-full flex mx-auto top-[10px] z-[999]">
                          <Button
                            loading={loading == true}
                            colorScheme="blue"
                            className="!w-auto !mx-auto !p-1 !rounded-full !cursor-default"
                          />
                        </div>
                      )}
                      <Component {...pageProps} />
                    </MediaProvider>
                  </ArticleProvider>
                </UserProvider>
              </AdProvider>
            </AuthProvider>
          </NextThemeProvider>
        </Hydrate>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </>
  )
}

export default install(styleConfig, App)
