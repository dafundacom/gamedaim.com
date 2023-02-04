import Document, { Html, Head, Main, NextScript } from "next/document"
import install from "@twind/with-next/document"

import env from "@/env"

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="application-name" content={env.SITE_TITLE} />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content={env.SITE_TITLE} />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-env" content="/browserenv.xml" />
          <meta name="msapplication-TileColor" content={env.SITE_COLOR} />
          <meta
            name="msapplication-TileImage"
            content="/icons/ms-icon-144x144.png"
          />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#ffffff" />
          <link
            rel="apple-touch-icon"
            sizes="57x57"
            href="/icons/apple-icon-57x57.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="60x60"
            href="/icons/apple-icon-60x60.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="72x72"
            href="/icons/apple-icon-72x72.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="76x76"
            href="/icons/apple-icon-76x76.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="114x114"
            href="/icons/apple-icon-114x114.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="120x120"
            href="/icons/apple-icon-120x120.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="144x144"
            href="/icons/apple-icon-144x144.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="152x152"
            href="/icons/apple-icon-152x152.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/icons/apple-icon-180x180.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="192x192"
            href="/icons/android-icon-192x192.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/icons/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="96x96"
            href="/icons/favicon-96x96.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/icons/favicon-16x16.png"
          />
          <link rel="shortcut icon" href="/icons/favicon.ico" />
          <link rel="manifest" href="/manifest.json" />
          <meta property="og:locale" content={env.SITE_LANGUAGE} />
          <meta property="og:site_name" content={env.SITE_TITLE} />
          {/* <meta property="og:url" content={metadata.og.url} /> */}
          <meta name="twitter:site" content={env.TWITTER_USERNAME} />
          <meta property="fb:app_id" content={env.FACEBOOK_ID} />
          <meta
            content="max-snippet:-1, max-image-preview:large, max-video-preview:-1"
            name="robots"
          />
        </Head>
        <body className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default install(MyDocument)
