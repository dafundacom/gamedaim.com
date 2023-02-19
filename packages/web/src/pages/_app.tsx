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
import { DefaultSeo } from "next-seo"

import env from "@/env"
import styleConfig from "@/utils/style"
import { AuthProvider } from "@/contexts/auth.context"
import { ContentProvider } from "@/contexts/content.context"
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
              <ContentProvider>
                <Toaster />
                {loading && (
                  <div className="fixed w-full flex mx-auto top-[10px] z-[999]">
                    <Button
                      size="xl"
                      colorScheme="blue"
                      variant="ghost"
                      loading={loading}
                      className="!w-auto !border !bg-white !mx-auto !p-1 !rounded-full !cursor-default"
                    />
                  </div>
                )}
                <DefaultSeo
                  themeColor={env.SITE_COLOR}
                  additionalMetaTags={[
                    {
                      name: "application-name",
                      content: env.SITE_TITLE,
                    },
                    {
                      name: "apple-mobile-web-app-capable",
                      content: "yes",
                    },
                    {
                      name: "apple-mobile-web-app-status-bar-style",
                      content: "default",
                    },
                    {
                      name: "apple-mobile-web-app-title",
                      content: env.SITE_TITLE,
                    },
                    {
                      name: "format-detection",
                      content: "telephone=no",
                    },
                    {
                      name: "msapplication-env",
                      content: "/browserconfig.xml",
                    },
                    {
                      name: "msapplication-TileColor",
                      content: env.SITE_COLOR,
                    },
                    {
                      name: "msapplication-tap-highlight",
                      content: "noe",
                    },
                    {
                      name: "msapplication-TileImage",
                      content: "/icons/ms-icon-144x144.png",
                    },
                  ]}
                  additionalLinkTags={[
                    {
                      rel: "apple-touch-icon",
                      sizes: "57x57",
                      href: "/icons/apple-icon-57x57.png",
                    },
                    {
                      rel: "apple-touch-icon",
                      sizes: "60x60",
                      href: "/icons/apple-icon-60x60.png",
                    },
                    {
                      rel: "apple-touch-icon",
                      sizes: "72x72",
                      href: "/icons/apple-icon-72x72.png",
                    },
                    {
                      rel: "apple-touch-icon",
                      sizes: "76x76",
                      href: "/icons/apple-icon-76x76.png",
                    },
                    {
                      rel: "apple-touch-icon",
                      sizes: "114x114",
                      href: "/icons/apple-icon-114x114.png",
                    },
                    {
                      rel: "apple-touch-icon",
                      sizes: "120x120",
                      href: "/icons/apple-icon-120x120.png",
                    },
                    {
                      rel: "apple-touch-icon",
                      sizes: "144x144",
                      href: "/icons/apple-icon-144x144.png",
                    },
                    {
                      rel: "apple-touch-icon",
                      sizes: "152x152",
                      href: "/icons/apple-icon-152x152.png",
                    },
                    {
                      rel: "apple-touch-icon",
                      sizes: "180x180",
                      href: "/icons/apple-icon-180x180.png",
                    },
                    {
                      rel: "icon",
                      type: "image/png",
                      sizes: "192x192",
                      href: "/icons/android-icon-192x192.png",
                    },
                    {
                      rel: "icon",
                      type: "image/png",
                      sizes: "32x32",
                      href: "/icons/android-icon-32x32.png",
                    },
                    {
                      rel: "icon",
                      type: "image/png",
                      sizes: "96x96",
                      href: "/icons/android-icon-96x96.png",
                    },
                    {
                      rel: "icon",
                      type: "image/png",
                      sizes: "16x16",
                      href: "/icons/android-icon-16x16.png",
                    },
                    {
                      rel: "shortcut icon",
                      href: "/icons/favicon.ico",
                    },
                    {
                      rel: "manifest",
                      href: "/manifest.json",
                    },
                  ]}
                  openGraph={{
                    locale: env.SITE_LANGUAGE,
                    siteName: env.SITE_TITLE,
                  }}
                  facebook={{
                    appId: env.FACEBOOK_ID,
                  }}
                  twitter={{
                    handle: env.TWITTER_USERNAME,
                    site: env.TWITTER_USERNAME,
                    cardType: "summary_large_image",
                  }}
                  robotsProps={{
                    maxSnippet: -1,
                    maxImagePreview: "large",
                    maxVideoPreview: -1,
                  }}
                />
                <Component {...pageProps} />
              </ContentProvider>
            </AuthProvider>
          </NextThemeProvider>
        </Hydrate>
        {env.NODE_ENV !== "production" && <ReactQueryDevtools />}
      </QueryClientProvider>
    </>
  )
}

export default install(styleConfig, App)
