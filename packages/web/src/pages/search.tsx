import * as React from "react"
import { useRouter } from "next/router"
import NextLink from "next/link"
import dynamic from "next/dynamic"
import { wpGetPostsBySearch, wpGetAllPosts } from "@/lib/wp-posts"
const PostCardSide = dynamic(() =>
  import("@/components/Card").then((mod) => mod.PostCardSide),
)
const PostCard = dynamic(() =>
  import("@/components/Card/PostCard").then((mod) => mod.PostCard),
)
const HomeLayout = dynamic(() =>
  import("@/layouts/HomeLayout").then((mod) => mod.HomeLayout),
)
const Heading = dynamic(() => import("ui").then((mod) => mod.Heading))
interface SearchProps {
  posts: any
}

export default function Search(props: SearchProps) {
  const { posts } = props
  const router = useRouter()
  const [notFound, setNotFound] = React.useState(false)
  const [postsSearch, setPostsSearch] = React.useState([])

  const inputRef = React.useRef() as React.RefObject<HTMLInputElement>

  const handlerSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    //@ts-ignore
    const value = inputRef.current.value
    router.push(`/search?q=${value}`)
  }

  React.useEffect(() => {
    const loadPosts = async () => {
      const { posts } = await wpGetPostsBySearch(router.query.q as string)
      //@ts-ignore
      if (posts.length >= 1) {
        //@ts-ignore
        setPostsSearch(posts)
        //@ts-ignore
      } else if (posts.length == 0) {
        setNotFound(true)
      }
    }
    if (router.query.q) {
      loadPosts()
    }
  }, [router.query.q])

  return (
    <>
      <HomeLayout>
        <section className="w-full flex flex-col">
          <div className="flex py-10 mb-10 flex-col bg-gradient-to-r from-[#1e3799] to-[#0984e3] relative">
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
                        {router.query.q !== undefined
                          ? `Search results for "${router.query?.q}"`
                          : "Search"}
                      </span>
                    </div>
                  </li>
                </ol>
              </nav>
            </div>
            <div className="self-center">
              <Heading size="4xl" className="text-white">
                {router.query.q !== undefined
                  ? `Search results for "${router.query?.q}"`
                  : "Search"}
              </Heading>
            </div>
          </div>
          <div className="mx-4 w-full md:max-[991px]:max-w-[750px] min-[992px]:max-[1199px]:max-w-[970px] min-[1200px]:max-w-[1170px] md:mx-auto flex flex-row px-4">
            <div className="w-full flex flex-col lg:mr-4">
              <div className="mb-4 bg-gray-100 rounded-md p-2">
                <form onSubmit={handlerSubmit} autoComplete="off">
                  <div className="relative flex min-w-full lg:w-[400px]">
                    <div className="absolute top-[4px] bottom-0 left-0 flex items-center pl-3">
                      <span className="text-gray-4 h-5 w-5"></span>
                    </div>
                    <input
                      className="focus:border-primary-200 h-11 w-full rounded-full border border-gray-300 bg-white px-8 py-3 text-gray-700 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-gray-500"
                      type="search"
                      name="q"
                      value={router.query.q}
                      ref={inputRef}
                      autoComplete="off"
                      placeholder="Search..."
                      required
                    />
                  </div>
                </form>
              </div>
              {!notFound &&
                postsSearch.map(
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
                    author: {
                      name: string
                      avatar: {
                        url: string
                      }
                      uri: string
                    }
                    uri: string
                    date: string
                  }) => {
                    return (
                      <PostCard
                        key={post.id}
                        src={post.featuredImage.sourceUrl}
                        alt={post.featuredImage.altText}
                        slug={post.uri}
                        title={post.title}
                        excerpt={post.excerpt}
                        authorName={post.author.name}
                        authorAvatarUrl={post.author.avatar.url}
                        authorUri={post.author.uri}
                        date={post.date}
                      />
                    )
                  },
                )}
              {notFound == true && (
                <div className="bg-[#fafafa] py-5 text-center">
                  No Content Available
                </div>
              )}
            </div>
            <aside className="w-4/12 hidden lg:block">
              <div className="rounded-xl border border-gray-100 dark:border-gray-700 p-4 sticky top-8">
                <div className="mb-4">
                  <Heading as="h4" className="!text-transparent">
                    <span className="after:absolute after:border after:border-[#1e3799] after:bg-[#1e3799] after:h-[3px] after:w-[50px] after:ml-[-25px] after:left-1/2 after:top-[40px]">
                      Trending
                    </span>
                  </Heading>
                </div>
                {posts.map(
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
      </HomeLayout>
    </>
  )
}

export async function getServerSideProps() {
  const { posts, pageInfo } = await wpGetAllPosts()
  return { props: { posts, pageInfo } }
}
