import * as React from "react"
import { useRouter } from "next/router"
import { NextSeo } from "next-seo"
import { GetServerSideProps } from "next"
import { Heading } from "ui"
import env from "@/env"
import { getDownloadByTopics } from "@/lib/download"
import { getTopics } from "@/lib/topics"
import { HomeLayout } from "@/layouts/Home"
import { InfiniteScrollDownload } from "@/components/InfiniteScroll"
import { TopicDataProps } from "@/lib/data-types"

interface TopicProps {
  downloadByTopic: TopicDataProps
}
export default function DownloadsByTopic(props: TopicProps) {
  const { downloadByTopic } = props
  const router = useRouter()
  const totalPage = Math.ceil(downloadByTopic._count.downloads / 10)
  return (
    <>
      <NextSeo
        title={`${env.SITE_TITLE} | Everlasting Gaming Knowledge`}
        description={env.DESCRIPTION}
        canonical={`https://${env.DOMAIN}${router.pathname}`}
        openGraph={{
          url: `https://${env.DOMAIN}${router.pathname}`,
          title: `${env.SITE_TITLE} | Everlasting Gaming Knowledge`,
          description: env.DESCRIPTION,
        }}
      />
      <HomeLayout>
        <div className="mx-auto flex w-full flex-col min-[992px]:max-[1199px]:max-w-[970px] max-[991px]:px-4 md:max-[991px]:max-w-[750px] min-[1200px]:max-w-[1170px]">
          <div className="w-full px-4">
            <div className={"my-2 flex flex-row justify-start"}>
              <Heading as="h2" size="2xl" bold>
                Newest
              </Heading>
            </div>
            <InfiniteScrollDownload
              id={downloadByTopic.slug}
              posts={downloadByTopic.downloads}
              index={2}
              totalPage={totalPage}
            />
          </div>
        </div>
      </HomeLayout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug: any = params?.slug

  const { downloadByTopic } = await getDownloadByTopics(slug)
  const { topics } = await getTopics(1)
  if (!downloadByTopic) {
    return {
      notFound: true,
    }
  }
  return {
    props: { downloadByTopic, topics },
  }
}
