import * as React from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { useQueries } from "@tanstack/react-query"
import {
  MdOutlineAdsClick,
  MdOutlineArticle,
  MdOutlineComment,
  MdOutlinePermMedia,
  MdOutlineTopic,
  MdSupervisedUserCircle,
} from "react-icons/md"
import { Heading } from "ui"

import { AdminOrAuthorRole } from "@/components/Role"
import { BoxDashboard } from "@/components/Box"
import { DashboardLayout } from "@/layouts/Dashboard"

export default function Dashboard() {
  const [totalAds, setTotalAds]: any = React.useState<number>()
  const [totalArticles, setTotalArticles]: any = React.useState<number>()
  const [totalComments, setTotalComments]: any = React.useState<number>()
  const [totalWpComments, setTotalWpComments]: any = React.useState<number>()
  const [totalMedias, setTotalMedias]: any = React.useState<number>()
  const [totalTopics, setTotalTopics]: any = React.useState<number>()
  const [totalUsers, setTotalUsers]: any = React.useState<number>()

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

  const getTopicsCount = async () => {
    const { data } = await axios.get("/topic/count")
    return data
  }

  const getUsersCount = async () => {
    const { data } = await axios.get("/user/count")
    return data
  }

  const getWpCommentsCount = async () => {
    const { data } = await axios.get("/wp-comment/count")
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
        queryKey: ["wpCommentsCount"],
        queryFn: () => getWpCommentsCount(),
        onSuccess: (data: number) => {
          setTotalWpComments(data)
        },
        onError: (error: any) => {
          toast.error(error.message)
        },
      },
    ],
  })

  return (
    <AdminOrAuthorRole>
      <DashboardLayout>
        <div className="my-8">
          <Heading size="3xl" as="h2">
            Statistics
          </Heading>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 my-8">
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
            {getCounts[6].isSuccess && (
              <BoxDashboard
                icon={<MdOutlineComment className="h-5 w-5" />}
                count={totalWpComments}
                text="wp comment"
              />
            )}
            {getCounts[5].isSuccess && (
              <BoxDashboard
                icon={<MdSupervisedUserCircle className="h-5 w-5" />}
                count={totalUsers}
                text="user"
              />
            )}
          </div>
        </div>
      </DashboardLayout>
    </AdminOrAuthorRole>
  )
}
