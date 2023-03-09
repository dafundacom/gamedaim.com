import * as React from "react"

import { useRouter } from "next/router"
import { NextSeo } from "next-seo"
import useSWR from "swr"
import {
  MdCode,
  MdDownload,
  MdOutlineAdsClick,
  MdOutlineArticle,
  MdOutlineComment,
  MdOutlinePermMedia,
  MdOutlineTopic,
  MdSupervisedUserCircle,
  MdUploadFile,
} from "react-icons/md"
import { Heading } from "ui"

import { AdminOrAuthorRole } from "@/components/Role"
import { BoxDashboard } from "@/components/Box"
import { DashboardLayout } from "@/layouts/Dashboard"
import { fetcher } from "@/lib/fetcher"
import { getSettingsSite } from "@/lib/settings"

export default function Dashboard(props: { settingsSite: any }) {
  const { settingsSite } = props
  const router = useRouter()

  const { data: totalAds } = useSWR("/ad/count", fetcher)
  const { data: totalArticles } = useSWR("/article/count", fetcher)
  const { data: totalDownloads } = useSWR("/download/count", fetcher)
  const { data: totalDownloadFiles } = useSWR("/download-file/count", fetcher)
  const { data: totalTopics } = useSWR("/topic/count", fetcher)
  const { data: totalScripts } = useSWR("/script/count", fetcher)
  const { data: totalUsers } = useSWR("/user/count", fetcher)
  const { data: totalComments } = useSWR("/comment/count", fetcher)
  const { data: totalMedias } = useSWR("/media/count", fetcher)

  return (
    <>
      <NextSeo
        title={`Dashboard | ${settingsSite.title?.value || ""}`}
        description={`Dashboard | ${settingsSite.title?.value || ""}`}
        canonical={`https://${settingsSite.url?.value || ""}${router.pathname}`}
        openGraph={{
          url: `https://${settingsSite.url?.value || ""}${router.pathname}`,
          title: `Dashboard | ${settingsSite.title?.value || ""}`,
          description: `Dashboard | ${settingsSite.title?.value || ""}`,
        }}
      />
      <AdminOrAuthorRole>
        <DashboardLayout>
          <div className="my-8 dark:text-white">
            <Heading size="3xl" as="h2">
              Statistics
            </Heading>
            <div className="my-8 grid grid-cols-2 gap-3 md:grid-cols-5">
              {totalArticles !== undefined && (
                <BoxDashboard
                  icon={<MdOutlineArticle className="h-5 w-5" />}
                  count={totalArticles}
                  text="article"
                />
              )}
              {totalTopics !== undefined && (
                <BoxDashboard
                  icon={<MdOutlineTopic className="h-5 w-5" />}
                  count={totalTopics}
                  text="topic"
                />
              )}
              {totalAds !== undefined && (
                <BoxDashboard
                  icon={<MdOutlineAdsClick className="h-5 w-5" />}
                  count={totalAds}
                  text="ad"
                />
              )}
              {totalScripts !== undefined && (
                <BoxDashboard
                  icon={<MdCode className="h-5 w-5" />}
                  count={totalScripts}
                  text="Script"
                />
              )}
              {totalMedias !== undefined && (
                <BoxDashboard
                  icon={<MdOutlinePermMedia className="h-5 w-5" />}
                  count={totalMedias}
                  text="media"
                />
              )}
              {totalComments !== undefined && (
                <BoxDashboard
                  icon={<MdOutlineComment className="h-5 w-5" />}
                  count={totalComments}
                  text="comment"
                />
              )}
              {totalUsers !== undefined && (
                <BoxDashboard
                  icon={<MdSupervisedUserCircle className="h-5 w-5" />}
                  count={totalUsers}
                  text="user"
                />
              )}
              {totalDownloads !== undefined && (
                <BoxDashboard
                  icon={<MdDownload className="h-5 w-5" />}
                  count={totalDownloads}
                  text="download"
                />
              )}
              {totalDownloadFiles !== undefined && (
                <BoxDashboard
                  icon={<MdUploadFile className="h-5 w-5" />}
                  count={totalDownloadFiles}
                  text="download file"
                />
              )}
            </div>
          </div>
        </DashboardLayout>
      </AdminOrAuthorRole>
    </>
  )
}

export async function getServerSideProps() {
  const { settingsSite } = await getSettingsSite()
  return {
    props: { settingsSite },
  }
}
