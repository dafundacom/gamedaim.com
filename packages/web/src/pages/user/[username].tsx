import * as React from "react"
import dayjs from "dayjs"
import NextImage from "next/image"
import env from "@/env"
import useSWR from "swr"

import { HomeLayout } from "@/layouts/Home"
import { Heading, Text } from "ui"
import { BreadcrumbJsonLd, NextSeo } from "next-seo"
import { getUserByUserName } from "@/lib/users"
import { ArticleDataProps, UserDataProps } from "@/lib/data-types"
import { getSettingsSite } from "@/lib/settings"
import { getArticleByAuthorId } from "@/lib/articles"
import { PostCard } from "@/components/Card"

interface UserProps {
  user: UserDataProps
  articles: ArticleDataProps
  settingsSite: any
}

export default function User(props: UserProps) {
  const { user, settingsSite } = props

  const { data: articles } = useSWR(user?.id, (key) =>
    getArticleByAuthorId(key),
  )
  const [imageAvatar, setImageAvatar] = React.useState(
    user?.profilePicture?.url,
  )
  return (
    <HomeLayout>
      <div className="mx-4 mt-[70px] w-full rounded px-4">
        {user.profilePicture ? (
          <NextSeo
            title={`${user.meta_title || user.username} — ${
              settingsSite.title?.value || env.SITE_TITLE
            }`}
            description={
              user.meta_description ||
              user.about ||
              `${user.name} — ${settingsSite.title?.value || env.SITE_TITLE}`
            }
            canonical={`https://${env.DOMAIN}/user/${user.username}`}
            openGraph={{
              title: `${user.meta_title || user.name} — ${
                settingsSite.title?.value || env.SITE_TITLE
              }`,
              description:
                user.meta_description ||
                user.about ||
                `${user.name} — ${settingsSite.title?.value || env.SITE_TITLE}`,
              url: `https://${settingsSite.url?.value || env.DOMAIN}/user/${
                user.username
              }`,
              images: [
                {
                  url: user.profilePicture.url,
                  alt: user.name,
                  height: 250,
                  width: 250,
                  type: "image/webp",
                },
              ],
            }}
          />
        ) : (
          <NextSeo
            title={`${user.meta_title || user.username} — ${
              settingsSite.title?.value || env.SITE_TITLE
            }`}
            description={
              user.meta_description ||
              user.about ||
              `${user.name} — ${settingsSite.title?.value || env.SITE_TITLE}`
            }
            canonical={`https://${settingsSite.url?.value || env.DOMAIN}/user/${
              user.username
            }`}
            openGraph={{
              title: `${user.meta_title || user.name} — ${
                settingsSite.title?.value || env.SITE_TITLE
              }`,
              description:
                user.meta_description ||
                user.about ||
                `${user.name} — ${settingsSite.title?.value || env.SITE_TITLE}`,
              url: `https://${settingsSite.url?.value || env.DOMAIN}/user/${
                user.username
              }`,
            }}
          />
        )}

        <BreadcrumbJsonLd
          itemListElements={[
            {
              position: 1,
              name: settingsSite.url?.value || env.DOMAIN,
              item: `https://${settingsSite.url?.value || env.DOMAIN}`,
            },
            {
              position: 2,
              name: user.name,
              item: `https://${settingsSite.url?.value || env.DOMAIN}/user/${
                user.username
              }`,
            },
          ]}
        />
        <div className="flex flex-col items-center space-y-2 border-b">
          <div className="mr-4">
            {user?.profilePicture?.url && (
              <NextImage
                src={imageAvatar}
                alt={user?.name}
                width={400}
                onError={() => {
                  setImageAvatar("/icons/author.jpg")
                }}
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
        <div>
          <div className="my-2 flex flex-row justify-between pb-2">
            <Heading as="h2" size="2xl" bold>
              {`Articles by ${user.name}`}
            </Heading>
          </div>
          {articles &&
            articles.articles.length > 0 &&
            articles.articles.map((article: ArticleDataProps) => {
              return (
                <PostCard
                  key={article.id}
                  src={article.featuredImage?.url}
                  alt={article.featuredImage?.alt}
                  slug={article.slug}
                  title={article.title}
                  excerpt={article.excerpt}
                  date={article.createdAt}
                  isWP={false}
                />
              )
            })}
        </div>
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
