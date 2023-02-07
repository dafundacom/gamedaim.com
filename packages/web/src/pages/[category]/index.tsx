import * as React from "react"
import NextLink from "next/link"
import Head from "next/head"
import parse from "html-react-parser"
import { GetStaticProps, GetStaticPaths } from "next"
import dynamic from "next/dynamic"
import env from "@/env"
import { getSeoDatas } from "@/lib/wp-seo"
import {
  wpGetCategoryBySlug,
  useWpGetCategoryBySlug,
  wpGetAllCategories,
} from "@/lib/wp-categories"
import {
  wpGetPostsByCategorySlug,
  useWpGetPostsByCategorySlug,
} from "@/lib/wp-posts"
import { useRouter } from "next/router"
import { QueryClient, dehydrate } from "@tanstack/react-query"
const InfiniteScroll = dynamic(() =>
  import("@/components/InfiniteScroll").then((mod) => mod.InfiniteScroll),
)
const PostCardSide = dynamic(() =>
  import("@/components/Card").then((mod) => mod.PostCardSide),
)

const HomeLayout = dynamic(() =>
  import("@/layouts/Home").then((mod) => mod.HomeLayout),
)
const Button = dynamic(() => import("ui").then((mod) => mod.Button))
const Heading = dynamic(() => import("ui").then((mod) => mod.Heading))
interface CategoryProps {
  category: {
    name: string
    slug: string
    children: {
      nodes: any
    }
  }
  posts: any
  pageInfo: any
  seo: {
    head: string
    success: boolean
  }
}

export default function Category(props: CategoryProps) {
  const { seo } = props
  const router = useRouter()
  const {
    query: { category },
  } = router
  const { getCategoryBySlug }: any = useWpGetCategoryBySlug(category as string)
  const { isFetching, isError } = getCategoryBySlug
  const { getPostsByCategorySlug }: any = useWpGetPostsByCategorySlug(
    category as string,
  )
  const categoryChild = getCategoryBySlug?.data?.category?.children?.nodes
  if (isError) {
    router.push("/404")
  }
  return (
    <>
      <Head>{seo?.success === true && parse(seo?.head)}</Head>
      <HomeLayout>
        {isFetching === false && (
          <section className="flex w-full flex-col">
            <div className="flex py-10 mb-10 flex-col bg-gradient-to-r !from-[#1e3799] !to-[#0984e3] relative">
              <div className="absolute top-1">
                <nav className="ml-2 flex" aria-label="Breadcrumb">
                  <ol className="inline-flex items-center text-white">
                    <li className="inline-flex items-center">
                      <NextLink
                        href="/"
                        className="inline-flex items-center text-sm font-medium text-white dark:text-gray-400 dark:hover:text-white after:inline-block after:not-italic after:font-normal after:ml-2 after:mr-2 after:align-top after:content-['>']"
                      >
                        Home
                      </NextLink>
                    </li>
                    <li aria-current="page">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-white dark:text-gray-400">
                          {getCategoryBySlug?.data?.category.name}
                        </span>
                      </div>
                    </li>
                  </ol>
                </nav>
              </div>
              <div className="self-center">
                <Heading size="4xl" className="text-white">
                  {getCategoryBySlug?.data?.category.name}
                </Heading>
              </div>
              <div className="self-center">
                <NextLink href={`/${getCategoryBySlug?.data?.category.slug}`}>
                  <Button className="!mr-2 border border-[#24272f] !bg-[#1e3799]">
                    All
                  </Button>
                </NextLink>
                {categoryChild !== undefined &&
                  categoryChild.map((child: { slug: string; name: string }) => {
                    return (
                      <NextLink href={`/${child.slug}`} key={child.name}>
                        <Button className="!mr-2 border border-[#24272f] !bg-[#ffffff33] hover:!bg-[#1e3799]">
                          {child.name}
                        </Button>
                      </NextLink>
                    )
                  })}
              </div>
            </div>
            <div className="mx-auto w-full md:max-[991px]:max-w-[750px] min-[992px]:max-[1199px]:max-w-[970px] min-[1200px]:max-w-[1170px] flex flex-row lg:mx-auto lg:px-4">
              <div className="w-full px-4 flex flex-col lg:mr-4">
                {getPostsByCategorySlug?.isFetching === false && (
                  <InfiniteScroll
                    pageType="category"
                    posts={getPostsByCategorySlug?.data?.posts}
                    id={getCategoryBySlug?.data?.category.slug}
                    pageInfo={getPostsByCategorySlug?.data?.pageInfo}
                  />
                )}
              </div>
              <aside className="w-4/12 px-4 hidden lg:block">
                <div className="rounded-xl border border-gray-100 dark:border-gray-700 p-4 sticky top-8">
                  <div className="mb-4">
                    <Heading as="h4" className="!text-transparent">
                      <span className="after:absolute after:border after:border-[#1e3799] after:bg-[#1e3799] after:h-[3px] after:w-[50px] after:ml-[-25px] after:left-1/2 after:top-[40px]">
                        Trending
                      </span>
                    </Heading>
                  </div>
                  {getPostsByCategorySlug?.data?.posts.map(
                    (post: {
                      id: number
                      featuredImage: {
                        sourceUrl: string
                        altText: string
                      }
                      slug: string
                      title: string
                      excerpt: string
                      categories: any
                      uri: string
                    }) => {
                      return (
                        <PostCardSide
                          key={post.id}
                          src={post.featuredImage.sourceUrl}
                          alt={post.featuredImage.altText}
                          title={post.title}
                          slug={post.uri}
                        />
                      )
                    },
                  )}
                </div>
              </aside>
            </div>
          </section>
        )}
      </HomeLayout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ params, res }: any) => {
  const queryClient = new QueryClient()
  const slug = params?.category
  let isError = false

  const seo = await getSeoDatas(`https://${env.DOMAIN}/${slug}`)
  await queryClient.prefetchQuery(["categoryPosts", slug], () =>
    wpGetPostsByCategorySlug(slug),
  )
  try {
    await queryClient.prefetchQuery(["category", slug], () =>
      wpGetCategoryBySlug(slug),
    )
  } catch (error: any) {
    isError = true
    res.statusCode = error.response.status
  }
  if (isError) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      seo,
    },
    revalidate: 100,
  }
}
export const getStaticPaths: GetStaticPaths = async () => {
  const { categories } = await wpGetAllCategories()
  const paths = categories.map(({ slug }: any) => {
    const category = slug
    return {
      params: {
        category,
      },
    }
  })

  return {
    paths,
    fallback: "blocking",
  }
}
