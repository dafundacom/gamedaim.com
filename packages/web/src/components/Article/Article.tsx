import * as React from "react"
import axios from "axios"
import parse from "html-react-parser"
import dynamic from "next/dynamic"
import NextImage from "next/image"
import NextLink from "next/link"

import { wpPrimaryCategorySlug } from "@/lib/wp-categories"
import { WpPostsDataProps } from "@/lib/wp-data-types"
import { wpTagPathBySlug } from "@/lib/wp-tags"
import { parseAndSplitHTMLString, splitUriWP } from "@/utils/split-html"

const MetadataPost = dynamic(() =>
  import("@/components/Metadata").then((mod) => mod.MetadataPost),
)
const StickyShare = dynamic(
  () => import("@/components/Share").then((mod) => mod.StickyShare),
  { ssr: false },
)
const Heading = dynamic(() => import("ui").then((mod) => mod.Heading))
const Text = dynamic(() => import("ui").then((mod) => mod.Text))
const Button = dynamic(() => import("ui").then((mod) => mod.Button))
const ButtonGroup = dynamic(() => import("ui").then((mod) => mod.ButtonGroup))
const PopupAd = dynamic(
  () => import("@/components/Ads/PopupAd").then((mod) => mod.PopupAd),
  { ssr: false },
)

interface PostProps {
  postData: {
    title: string
    content: string
    authorName: string
    authorUrl: string
    authorImg: string
    slug: string
    categories: any
    tags?: any
    date: string
    featuredImageCaption: string
    featuredImageUrl: string
    featuredImageAlt: string
  }

  posts: WpPostsDataProps
  isMain?: boolean
  isWP?: boolean
}

export const Article = React.forwardRef<HTMLDivElement, PostProps>(
  (props, ref) => {
    const { posts, isMain, isWP, postData } = props
    const {
      content,
      title,
      authorName,
      authorUrl,
      authorImg,
      categories,
      featuredImageCaption,
      featuredImageUrl,
      featuredImageAlt,
      date,
      slug,
      tags,
    } = postData
    let primaryData
    if (isWP) {
      const { primary } = wpPrimaryCategorySlug(categories)
      primaryData = primary
    }

    const articleRef = React.useRef(null)
    const article: any = articleRef.current

    const [ad, setAd]: any = React.useState()
    const [openModal, setOpenModal] = React.useState<boolean>(false)
    const [loadingAd, setLoadingAd] = React.useState(false)

    const adAbove: any = ad?.filter(
      (ads: any) => ads.position == "SINGLE_ARTICLE_ABOVE",
    )
    const adBelow: any = ad?.filter(
      (ads: any) => ads.position == "SINGLE_ARTICLEBELOW",
    )
    const adInline: any = ad?.filter(
      (ads: any) => ads.position == "SINGLE_ARTILCE_INLINE",
    )
    const adPopup: any = ad?.filter(
      (ads: any) => ads.position == "SINGLE_ARTICLE_POP_UP",
    )

    const { firstHalf, secondHalf } = parseAndSplitHTMLString(content)

    const getAds = async () => {
      try {
        const { data } = await axios.get("/ad/page/1")
        setAd(data)
        setLoadingAd(true)
      } catch (err: any) {
        console.log(err)
      }
    }

    React.useEffect(() => {
      getAds()
      setOpenModal(true)

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    React.useEffect(() => {
      if (article) {
        const toc = article.querySelector(".ez-toc-title")
        if (toc) {
          toc.addEventListener("click", () => {
            toc.classList.toggle("open-list")
          })
        }
      }
    }, [article])

    return (
      <>
        <article id={postData.slug} ref={ref} className="article-divider px-4">
          {loadingAd === true &&
            ad.length > 0 &&
            adPopup.length > 0 &&
            openModal === true &&
            isMain && (
              <PopupAd
                content={<>{parse(adPopup[0]?.content)}</>}
                isOpen={openModal}
                className="max-w-[366px]"
                onClose={() => setOpenModal(false)}
              />
            )}

          <div>
            {categories?.map((category: any, i: number) => {
              return (
                <ButtonGroup className="p-1" key={i}>
                  <Button
                    size="xs"
                    colorScheme="slate"
                    className="!rounded-full uppercase"
                  >
                    <NextLink
                      href={
                        isWP ? `/${category.slug}` : `/topic/${category.slug}`
                      }
                    >
                      {isWP ? category.name : category.title}
                    </NextLink>
                  </Button>
                </ButtonGroup>
              )
            })}
          </div>
          <Heading
            as="h1"
            className="mt-4 mb-2 border-b border-gray-200 pb-2 !text-[25px] font-bold !leading-[1.7] dark:border-gray-600 md:border-none md:!text-[40px] md:!leading-[43px]"
            lineClamp={0}
          >
            {title}
          </Heading>
          {isWP && (
            <div className="mb-2">
              <MetadataPost
                authorName={authorName}
                authorAvatarUrl={authorImg}
                authorSlug={authorUrl}
                date={date}
              />
            </div>
          )}
          {featuredImageUrl && (
            <>
              <NextImage
                width="1280"
                height="720"
                alt={featuredImageAlt}
                className={`loading-image rounded-lg object-cover`}
                onLoadingComplete={(e) => {
                  e.classList.remove("loading-image")
                }}
                src={featuredImageUrl}
              />
              {featuredImageCaption && (
                <span className="text-center text-xs italic text-gray-600 dark:text-gray-500">
                  {parse(featuredImageCaption)}
                </span>
              )}
            </>
          )}
          <div className="flex">
            <StickyShare
              title={title}
              categorySlug={isWP ? primaryData.slug : "article"}
              postSlug={slug}
            />
            <section ref={articleRef} className="article-body">
              {loadingAd === true &&
                ad.length > 0 &&
                adAbove.length > 0 &&
                adAbove.map((ad: { content: string }) => {
                  return (
                    <div className="my-2 rounded p-2">{parse(ad?.content)}</div>
                  )
                })}
              {parse(firstHalf)}
              {loadingAd === true &&
                ad.length > 0 &&
                adInline.length > 0 &&
                adInline.map((ad: { content: string }) => {
                  return (
                    <div className="my-2 rounded p-2">{parse(ad?.content)}</div>
                  )
                })}
              {parse(secondHalf)}
              {loadingAd === true &&
                ad.length > 0 &&
                adBelow.length > 0 &&
                adBelow.map((ad: { content: string }) => {
                  return (
                    <div className="my-2 rounded p-2">{parse(ad?.content)}</div>
                  )
                })}
            </section>
          </div>
          <section className="mx-4 my-6 md:mx-12" id="tag">
            {tags &&
              tags.map((tag: { slug: string; name: string }, i: number) => {
                return (
                  <ButtonGroup className="p-1" key={i}>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      variant="outline"
                      className="mx-1"
                      key={tag.slug}
                    >
                      <NextLink href={wpTagPathBySlug(tag.slug)}>
                        {tag.name}
                      </NextLink>
                    </Button>
                  </ButtonGroup>
                )
              })}
          </section>
          <section className="mb-20">
            {isMain === true && (
              <>
                <div className="mb-2">
                  <Heading
                    as="h4"
                    className="!text-primary-400 border-primary-400 border-b-4"
                  >
                    Related Posts
                  </Heading>
                </div>
                <div className="grid grid-cols-[repeat(1,1fr)] gap-4 md:grid-cols-2">
                  {posts.map((post: any) => {
                    return (
                      <article
                        className="border-b-2 border-gray-200"
                        key={post.title}
                      >
                        <NextLink
                          href={
                            isWP
                              ? splitUriWP(post.uri)
                              : "/article/" + post.slug
                          }
                        >
                          <Text
                            size="lg"
                            className="hover:text-primary-400 font-semibold"
                          >
                            {post.title}
                          </Text>
                        </NextLink>
                      </article>
                    )
                  })}
                </div>
              </>
            )}
          </section>
        </article>
      </>
    )
  },
)
