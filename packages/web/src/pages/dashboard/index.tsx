import * as React from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { useRouter } from "next/router"
import { NextSeo } from "next-seo"
import { useQueries } from "@tanstack/react-query"
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

import env from "@/env"
import { AdminOrAuthorRole } from "@/components/Role"
import { BoxDashboard } from "@/components/Box"
import { DashboardLayout } from "@/layouts/Dashboard"

export default function Dashboard() {
  const router = useRouter()

  const [totalAds, setTotalAds]: any = React.useState<number>()
  const [totalArticles, setTotalArticles]: any = React.useState<number>()
  const [totalComments, setTotalComments]: any = React.useState<number>()
  const [totalMedias, setTotalMedias]: any = React.useState<number>()
  const [totalScripts, setTotalScripts]: any = React.useState<number>()
  const [totalTopics, setTotalTopics]: any = React.useState<number>()
  const [totalUsers, setTotalUsers]: any = React.useState<number>()
  const [totalDownloads, setTotalDownloads]: any = React.useState<number>()
  const [totalDownloadFiles, setTotalDownloadFiles]: any =
    React.useState<number>()

  const getAdsCount = async () => {
    const { data } = await axios.get("/ad/count")
    return data
  }

  const getArticlesCount = async () => {
    const { data } = await axios.get("/article/count")
    return data
  }

  const getCommentsCount = async () => {
    const { data } = await axios.get("/comment/count")
    return data
  }

  const getMediasCount = async () => {
    const { data } = await axios.get("/media/count")
    return data
  }

  const getScriptsCount = async () => {
    const { data } = await axios.get("/script/count")
    return data
  }

  const getTopicsCount = async () => {
    const { data } = await axios.get("/topic/count")
    return data
  }

  const getUsersCount = async () => {
    const { data } = await axios.get("/user/count")
    return data
  }
  const getDownloadsCount = async () => {
    const { data } = await axios.get("/download/count")
    return data
  }
  const getDownloadFilesCount = async () => {
    const { data } = await axios.get("/download-file/count")
    return data
  }
  const getCounts = useQueries({
    queries: [
      {
        queryKey: ["adsCount"],
        queryFn: () => getAdsCount(),
        onSuccess: (data: any) => {
          setTotalAds(data)
        },
        onError: (error: any) => {
          toast.error(error.message)
        },
      },
      {
        queryKey: ["articlesCount"],
        queryFn: () => getArticlesCount(),
        onSuccess: (data: number) => {
          setTotalArticles(data)
        },
        onError: (error: any) => {
          toast.error(error.message)
        },
      },
      {
        queryKey: ["commentsCount"],
        queryFn: () => getCommentsCount(),
        onSuccess: (data: number) => {
          setTotalComments(data)
        },
        onError: (error: any) => {
          toast.error(error.message)
        },
      },
      {
        queryKey: ["mediasCount"],
        queryFn: () => getMediasCount(),
        onSuccess: (data: number) => {
          setTotalMedias(data)
        },
        onError: (error: any) => {
          toast.error(error.message)
        },
      },
      {
        queryKey: ["topicsCount"],
        queryFn: () => getTopicsCount(),
        onSuccess: (data: number) => {
          setTotalTopics(data)
        },
        onError: (error: any) => {
          toast.error(error.message)
        },
      },
      {
        queryKey: ["usersCount"],
        queryFn: () => getUsersCount(),
        onSuccess: (data: number) => {
          setTotalUsers(data)
        },
        onError: (error: any) => {
          toast.error(error.message)
        },
      },
      {
        queryKey: ["scriptsCount"],
        queryFn: () => getScriptsCount(),
        onSuccess: (data: number) => {
          setTotalScripts(data)
        },
        onError: (error: any) => {
          toast.error(error.message)
        },
      },
      {
        queryKey: ["downloadsCount"],
        queryFn: () => getDownloadsCount(),
        onSuccess: (data: number) => {
          setTotalDownloads(data)
        },
        onError: (error: any) => {
          toast.error(error.message)
        },
      },
      {
        queryKey: ["downloadFilesCount"],
        queryFn: () => getDownloadFilesCount(),
        onSuccess: (data: number) => {
          setTotalDownloadFiles(data)
        },
        onError: (error: any) => {
          toast.error(error.message)
        },
      },
    ],
  })

  return (
    <>
      <NextSeo
        title={`Dashboard | ${env.SITE_TITLE}`}
        description={`Dashboard | ${env.SITE_TITLE}`}
        canonical={`https://${env.DOMAIN}${router.pathname}`}
        openGraph={{
          url: `https://${env.DOMAIN}${router.pathname}`,
          title: `Dashboard | ${env.SITE_TITLE}`,
          description: `Dashboard | ${env.SITE_TITLE}`,
        }}
      />
      <AdminOrAuthorRole>
        <DashboardLayout>
          <div className="my-8 dark:text-white">
            <Heading size="3xl" as="h2">
              Statistics
            </Heading>
            <div className="my-8 grid grid-cols-2 gap-3 md:grid-cols-5">
              {getCounts[1].isSuccess && (
                <BoxDashboard
                  icon={<MdOutlineArticle className="h-5 w-5" />}
                  count={totalArticles}
                  text="article"
                />
              )}
              {getCounts[4].isSuccess && (
                <BoxDashboard
                  icon={<MdOutlineTopic className="h-5 w-5" />}
                  count={totalTopics}
                  text="topic"
                />
              )}
              {getCounts[0].isSuccess && (
                <BoxDashboard
                  icon={<MdOutlineAdsClick className="h-5 w-5" />}
                  count={totalAds}
                  text="ad"
                />
              )}
              {getCounts[6].isSuccess && (
                <BoxDashboard
                  icon={<MdCode className="h-5 w-5" />}
                  count={totalScripts}
                  text="Script"
                />
              )}
              {getCounts[3].isSuccess && (
                <BoxDashboard
                  icon={<MdOutlinePermMedia className="h-5 w-5" />}
                  count={totalMedias}
                  text="media"
                />
              )}
              {getCounts[2].isSuccess && (
                <BoxDashboard
                  icon={<MdOutlineComment className="h-5 w-5" />}
                  count={totalComments}
                  text="comment"
                />
              )}
              {getCounts[5].isSuccess && (
                <BoxDashboard
                  icon={<MdSupervisedUserCircle className="h-5 w-5" />}
                  count={totalUsers}
                  text="user"
                />
              )}
              {getCounts[7].isSuccess && (
                <BoxDashboard
                  icon={<MdDownload className="h-5 w-5" />}
                  count={totalDownloads}
                  text="download"
                />
              )}
              {getCounts[8].isSuccess && (
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
