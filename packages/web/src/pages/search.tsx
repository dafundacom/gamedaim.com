import * as React from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { NextSeo } from "next-seo"
import useSWR from "swr"
import { MdChevronRight } from "react-icons/md"

import env from "@/env"
import { wpGetPostsBySearch, wpGetAllPosts } from "@/lib/wp-posts"
import { WpPostsDataProps, WpSinglePostDataProps } from "@/lib/wp-data-types"
import { HomeLayout } from "@/layouts/Home"
import { Breadcrumb } from "ui"
import { fetcher } from "@/lib/fetcher"
import { ArticleDataProps } from "@/lib/data-types"
import { DownloadCard } from "@/components/Card"
import { splitUriWP } from "@/utils/split-html"
import { getSettingsSite } from "@/lib/settings"

const PostCardSide = dynamic(() =>
  import("@/components/Card").then((mod) => mod.PostCardSide),
)
const PostCard = dynamic(() =>
  import("@/components/Card/PostCard").then((mod) => mod.PostCard),
)

const Heading = dynamic(() => import("ui").then((mod) => mod.Heading))

interface SearchProps {
  posts: WpPostsDataProps
  settingsSite: any
}

export default function Search(props: SearchProps) {
  const { posts, settingsSite } = props
  const router = useRouter()

  const inputRef = React.useRef() as React.RefObject<HTMLInputElement>

  const handlerSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    //@ts-ignore
    const value = inputRef.current.value
    router.push(`/search?q=${value}`)
  }
  const { data: articles } = useSWR<any>(
    `/article/search/${router.query?.q}`,
    fetcher,
  )
  const { data: downloads } = useSWR<any>(
    `/download/search/${router.query?.q}`,
    fetcher,
  )

  const { data: postsWP } = useSWR<any>(router.query.q, (value: any) =>
    wpGetPostsBySearch(value),
  )

  return (
    <>
      <NextSeo
        title={`Search | ${settingsSite.title?.value || env.SITE_TITTLE}`}
        description={`Search | ${settingsSite.title?.value || env.SITE_TITTLE}`}
        canonical={`https://${settingsSite.url?.value || env.DOMAIN}${
          router.pathname
        }`}
        openGraph={{
          url: `https://${settingsSite.url?.value || env.DOMAIN}${
            router.pathname
          }`,
          title: `Search | ${settingsSite.title?.value || env.SITE_TITTLE}`,
          description: `Search | ${
            settingsSite.title?.value || env.SITE_TITTLE
          }`,
        }}
        noindex={true}
      />
      <HomeLayout>
        <section className="flex w-full flex-col">
          <div className="relative mb-10 flex flex-col bg-gradient-to-r from-[#1e3799] !to-[#0984e3] py-10 max-md:px-5">
            <div className="absolute top-1 px-4">
              <Breadcrumb separator={<MdChevronRight className="text-white" />}>
                <Breadcrumb.Item bold>
                  <Breadcrumb.Link className="text-white" href="/">
                    Home
                  </Breadcrumb.Link>
                </Breadcrumb.Item>

                <Breadcrumb.Item currentPage>
                  <Breadcrumb.Link className="text-white" href="/search">
                    Search
                  </Breadcrumb.Link>
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <div className="self-center">
              <Heading size="4xl" className="text-white">
                {router.query.q !== undefined
                  ? `Search results for "${router.query?.q}"`
                  : "Search"}
              </Heading>
            </div>
          </div>
          <div className="flex w-full flex-row md:mx-auto md:max-[991px]:max-w-[750px] min-[992px]:max-[1199px]:max-w-[970px] lg:px-4 min-[1200px]:max-w-[1170px]">
            <div className="flex w-full flex-col px-4 lg:mr-4">
              <div className="mb-4 rounded-md bg-gray-100 p-2">
                <form onSubmit={handlerSubmit} autoComplete="off">
                  <div className="relative flex min-w-full lg:w-[400px]">
                    <div className="absolute top-[4px] bottom-0 left-0 flex items-center pl-3">
                      <span className="text-gray-4 h-5 w-5"></span>
                    </div>
                    <input
                      className="focus:border-primary-200 h-11 w-full rounded-full border border-gray-300 bg-white px-8 py-3 text-gray-700 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-gray-500"
                      type="search"
                      name="q"
                      ref={inputRef}
                      autoComplete="off"
                      placeholder="Search..."
                      required
                    />
                  </div>
                </form>
              </div>
              {downloads && downloads.length > 0 && (
                <div className="w-full">
                  <div className={"my-2 flex flex-row justify-start"}>
                    <Heading as="h2" size="2xl" bold>
                      Downloads
                    </Heading>
                  </div>
                  <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    <DownloadCard list={downloads} />
                  </div>
                </div>
              )}
              <div>
                <div className={"my-2 flex flex-row justify-between"}>
                  <Heading as="h2" size="2xl" bold>
                    Articles
                  </Heading>
                </div>
                {articles &&
                  articles.length > 0 &&
                  articles.map((article: ArticleDataProps) => {
                    return (
                      <PostCard
                        key={article.id}
                        src={article.featuredImage?.url}
                        alt={article.featuredImage?.alt}
                        slug={article.slug}
                        title={article.title}
                        excerpt={article.excerpt}
                        authorName={article.author?.name}
                        authorAvatarUrl={article.author?.profilePicture?.url}
                        authorUri={article.author?.username}
                        date={article.createdAt}
                        isWP={false}
                      />
                    )
                  })}
                {postsWP &&
                  postsWP?.posts.map((post: WpSinglePostDataProps) => {
                    const newUri = splitUriWP(post.uri)

                    return (
                      <PostCard
                        key={post.id}
                        src={post.featuredImage?.sourceUrl}
                        alt={post.featuredImage?.altText}
                        slug={newUri}
                        title={post.title}
                        excerpt={post.excerpt}
                        authorName={post.author.name}
                        authorAvatarUrl={post.author.avatar.url}
                        authorUri={post.author.uri}
                        date={post.date}
                      />
                    )
                  })}
                {postsWP === undefined ||
                  (postsWP && postsWP?.posts.length === 0 && (
                    <div className="bg-[#fafafa] py-5 text-center">
                      No Content Available
                    </div>
                  ))}
              </div>
            </div>
            <aside className="hidden w-4/12 lg:block">
              <div className="sticky top-8 rounded-xl border border-gray-100 p-4 dark:border-gray-700">
                <div className="mb-4">
                  <Heading as="h4" className="!text-transparent">
                    <span className="after:absolute after:left-1/2 after:top-[40px] after:ml-[-25px] after:h-[3px] after:w-[50px] after:border after:border-[#1e3799] after:bg-[#1e3799]">
                      Trending
                    </span>
                  </Heading>
                </div>
                {posts.map((post: WpSinglePostDataProps) => {
                  const newUri = splitUriWP(post.uri)

                  return (
                    <PostCardSide
                      key={post.id}
                      src={post.featuredImage.sourceUrl}
                      alt={post.featuredImage.altText}
                      title={post.title}
                      slug={newUri}
                    />
                  )
                })}
              </div>
            </aside>
          </div>
        </section>
      </HomeLayout>
    </>
  )
}

export async function getServerSideProps() {
  const { posts, pageInfo } = await wpGetAllPosts()
  const { settingsSite } = await getSettingsSite()

  return { props: { posts, pageInfo, settingsSite } }
}
