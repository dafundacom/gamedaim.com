import * as React from "react"
import axios from "axios"
import dayjs from "dayjs"
import NextImage from "next/image"
import env from "@/env"
import { useRouter } from "next/router"
import { HomeLayout } from "@/layouts/Home"
import { Heading } from "@/../../ui"

interface UserProps {
  username: string
  name: string
  email: string
  slug: string
  about: string
  phoneNumber: number
  profilePicture: string
  createdAt: string
}

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
  }, [])
  console.log(user?.data)
  return (
    <HomeLayout>
      <div className="mt-[70px] h-screen w-full mx-4 px-4 rounded">
        {user !== undefined ? (
          <>
            <div className="flex">
              <div className="mr-4">
                <NextImage
                  src={user?.data?.profilePicture?.url}
                  alt={user?.data?.name}
                  width={400}
                  height={400}
                  className="rounded-full aspect-[1/1] w-[150px] lg:!w-[350px] object-cover"
                />
              </div>
              <div className="space-y-2">
                <Heading>{user?.data?.name}</Heading>
                <div className="rounded p-2 bg-primary-500 text-white inline-block">
                  {user?.data?.email}
                </div>
                <div>{dayjs(user?.data?.createdAt).format("DD/MM/YYYY")}</div>
                <div>{user?.data?.about}</div>
                <div>{user?.data?.phoneNumber}</div>
              </div>
            </div>
          </>
        ) : (
          <div>Loading...</div>
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
