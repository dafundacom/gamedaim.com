import * as React from "react"
import axios from "axios"
import dayjs from "dayjs"

import env from "@/env"
import { DefaultLayout } from "@/layouts/Default"

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

export default function User({ user }: { user: UserProps }) {
  return (
    <DefaultLayout>
      <div>{user.username}</div>
      <div>{user.name}</div>
      <div>{user.email}</div>
      <div>{user.about}</div>
      <div>{user.phoneNumber}</div>
      <div>{user.profilePicture}</div>
      <div>{dayjs(user.createdAt).format("DD/MM/YYYY")}</div>
    </DefaultLayout>
  )
}

export async function getServerSideProps({ params }: { params: UserProps }) {
  const { data } = await axios.get(
    `${env.API}/user/username/${params.username}`,
  )
  return {
    props: {
      user: data,
    },
  }
}
