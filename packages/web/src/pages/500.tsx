import NextLink from "next/link"
import { useRouter } from "next/router"
import { NextSeo } from "next-seo"
import env from "env"
import { Button } from "ui"

export default function Custom500() {
  const router = useRouter()

  return (
    <>
      <NextSeo
        title={`500 | ${env.SITE_TITLE}`}
        description={`500 | ${env.SITE_TITLE}`}
        canonical={`https://${env.DOMAIN}${router.pathname}`}
        openGraph={{
          url: `https://${env.DOMAIN}${router.pathname}`,
          title: `500 | ${env.SITE_TITLE}`,
          description: `500 | ${env.SITE_TITLE}`,
        }}
        noindex={true}
      />
      <section className="flex h-screen items-center justify-center bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-screen-xl py-8 px-4 lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="text-primary-600 dark:text-primary-500 mb-4 text-7xl font-extrabold tracking-tight lg:text-9xl">
              500
            </h1>
            <p className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl">
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
