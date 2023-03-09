import * as React from "react"
import dayjs from "dayjs"
import NextImage from "next/image"
import { useRouter } from "next/router"
import { HomeLayout } from "@/layouts/Home"
import { Heading, Text } from "ui"
import { NextSeo } from "next-seo"
import { getUserByUserName } from "@/lib/users"
import { ArticleDataProps, UserDataProps } from "@/lib/data-types"
import { getSettingsSite } from "@/lib/settings"

interface UserProps {
  user: UserDataProps
  articles: ArticleDataProps
  settingsSite: any
}

export default function User(props: UserProps) {
  const { user, settingsSite } = props
  const router = useRouter()

  return (
    <HomeLayout>
      <div className="mx-4 mt-[70px] w-full rounded px-4">
        <NextSeo
          title={`${user?.name} | ${settingsSite.title?.value || ""}`}
          description={`${user?.name} | ${settingsSite.title?.value || ""}`}
          canonical={`https://${settingsSite.url?.value || ""}${
            router.pathname
          }`}
          openGraph={{
            url: `https://${settingsSite.url?.value || ""}${router.pathname}`,
            title: `${user?.name} | ${settingsSite.title?.value || ""}`,
            description: `${user?.about} | ${settingsSite.title?.value || ""}`,
          }}
          noindex={true}
        />
        <div className="flex flex-col items-center space-y-2 border-b">
          <div className="mr-4">
            {user?.profilePicture?.url && (
              <NextImage
                src={user?.profilePicture?.url}
                alt={user?.name}
                width={400}
                height={400}
                className="aspect-[1/1] w-[150px] max-w-[unset] rounded-full object-cover lg:!w-[200px]"
              />
            )}
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Heading>{user?.name}</Heading>
            <div className="bg-primary-500 inline-block rounded p-2 text-white">
              {user?.email}
            </div>
            <Text>{dayjs(user?.createdAt).format("DD/MM/YYYY")}</Text>
            <Text>{user?.about}</Text>
          </div>
        </div>
        {/* <div>
          <div className="my-2 flex flex-row justify-between pb-2">
            <Heading as="h2" size="2xl" bold>
              {`Articles by ${user.name}`}
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
        </div> */}
      </div>
    </HomeLayout>
  )
}

export async function getServerSideProps({ params }: any) {
  const { user } = await getUserByUserName(params?.username)
  const { settingsSite } = await getSettingsSite()

  if (!user) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      user,
      settingsSite,
    },
  }
}
