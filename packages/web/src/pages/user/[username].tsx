import * as React from "react"
import axios from "axios"
import dayjs from "dayjs"
import NextImage from "next/image"
import { useRouter } from "next/router"
import { HomeLayout } from "@/layouts/Home"
import { Button, Heading, Text } from "@/../../ui"
import { NextSeo } from "next-seo"
import env from "@/env"

// interface UserProps {
//   username: string
//   name: string
//   email: string
//   slug: string
//   about: string
//   phoneNumber: number
//   profilePicture: string
//   createdAt: string
// }

export default function User() {
  const router = useRouter()
  const [user, setUser] = React.useState<any>()
  const loadUser = async () => {
    let userData
    try {
      const { data } = await axios.get(`/user/${router.query.username}`)
      userData = data
    } catch (err) {
      console.log(err)
    }
    return { data: userData }
  }
  React.useEffect(() => {
    const userData = async () => {
      const data: any = await loadUser()
      setUser(data)
    }
    userData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  console.log(user?.data)
  return (
    <HomeLayout>
      <div className="mx-4 mt-[70px] h-screen w-full rounded px-4">
        {user !== undefined ? (
          <>
            <NextSeo
              title={`${user?.data?.name} | ${env.SITE_TITLE}`}
              description={`${user?.data?.name} | ${env.SITE_TITLE}`}
              canonical={`https/${env.DOMAIN}${router.pathname}`}
              openGraph={{
                url: `https/${env.DOMAIN}${router.pathname}`,
                title: `${user?.data?.name} | ${env.SITE_TITLE}`,
                description: `${user?.data?.about} | ${env.SITE_TITLE}`,
              }}
              noindex={true}
            />
            <div className="flex flex-col items-center space-y-2">
              <div className="mr-4">
                <NextImage
                  src={user?.data?.profilePicture?.url}
                  alt={user?.data?.name}
                  width={400}
                  height={400}
                  className="aspect-[1/1] w-[150px] max-w-[unset] rounded-full object-cover lg:!w-[200px]"
                />
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Heading>{user?.data?.name}</Heading>
                <div className="bg-primary-500 inline-block rounded p-2 text-white">
                  {user?.data?.email}
                </div>
                <Text>{dayjs(user?.data?.createdAt).format("DD/MM/YYYY")}</Text>
                <Text>{user?.data?.about}</Text>
              </div>
            </div>
          </>
        ) : (
          <div className="mx-auto flex w-full">
            <Button
              size="xl"
              colorScheme="blue"
              variant="ghost"
              loading={true}
              className="!mx-auto !w-auto !cursor-default !rounded-full !border !bg-white !p-1 dark:!bg-gray-800"
            />
          </div>
        )}
      </div>
    </HomeLayout>
  )
}

export async function getServerSideProps() {
  return {
    props: {
      // user: userData,
    },
  }
}
