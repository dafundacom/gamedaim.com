import Head from "next/head"
import NextLink from "next/link"
import { useRouter } from "next/router"

import { Button } from "ui"
import env from "@/env"

export default function Custom500() {
  const router = useRouter()
  return (
    <>
      <Head>
        <title>{env.SITE_TITLE} | 500</title>
        <meta name="description" content={env.ABOUT} />
        <meta property="og:title" content={`${env.SITE_TITLE} | 500`} />
        <meta property="og:description" content={env.ABOUT} />
        <link
          rel="canonical"
          href={`https://${env.DOMAIN}${router.pathname}`}
        />
      </Head>
      <section className="flex h-screen items-center justify-center bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
              500
            </h1>
            <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
              Internal Server Error.
            </p>
            <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
              We are already working to solve the problem
            </p>
            <NextLink href="/">
              <Button colorScheme="blue">Back to Homepage</Button>
            </NextLink>
          </div>
        </div>
      </section>
    </>
  )
}
