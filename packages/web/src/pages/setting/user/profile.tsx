import * as React from "react"
import NextImage from "next/image"
import axios from "axios"
import toast from "react-hot-toast"
import { NextSeo } from "next-seo"
import useSWR from "swr"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  RequiredIndicator,
  Text,
} from "ui"

import env from "@/env"
import { AuthContext } from "@/contexts/auth.context"
import { Modal } from "@/components/Modal"
import { MediaUpload } from "@/components/Media"
import { DefaultLayout } from "@/layouts/Default"
import { UserRole } from "@/components/Role"
import { InfiniteScrollMedia } from "@/components/InfiniteScroll"
import { fetcher } from "@/lib/fetcher"

interface FormValues {
  username: string
  name?: string
  email?: string
  about?: string
  phoneNumber?: string
}

export default function SettingUserProfile() {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [openModal, setOpenModal] = React.useState<boolean>(false)
  const [loadedMedias, setLoadedMedias] = React.useState([])
  const [selectedProfilePictureId, setSelectedProfilePictureId] =
    React.useState<string>("")
  const [selectedProfilePictureUrl, setSelectedProfilePictureUrl] =
    React.useState<string>("")
  const [auth] = React.useContext(AuthContext)
  const [user, setUser] = React.useState<any>({
    id: "",
    username: "",
    name: "",
    email: "",
    about: "",
    phoneNumber: "",
    profilePictureId: "",
    role: "",
  })

  const router = useRouter()

  const loadMedias = async () => {
    try {
      const { data } = await axios.get(`/media/author/${auth.user.id}/1`)
      setLoadedMedias(data)
    } catch (err) {
      console.log(err)
    }
  }
  React.useEffect(() => {
    loadMedias()
    loadUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router?.query?.id])

  React.useEffect(() => {
    reset(user)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const loadUser = async () => {
    try {
      const { data } = await axios.get(`/user/${auth.user.id}`)
      setUser({
        username: data.username,
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        profilePicture: data.profilePicture,
        about: data.about,
      })
      setSelectedProfilePictureId(data.profilePicture.id)
      setSelectedProfilePictureUrl(data.profilePicture.url)
      setLoading(false)
    } catch (err) {
      console.log(err)
    }
  }

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<FormValues>()

  const onSubmit = async (values: any) => {
    try {
      setLoading(true)
      const { data } = await axios.put(`/user/${auth.user.id}`, values)
      if (data?.error) {
        toast.error(data?.error)
        setLoading(false)
      } else {
        toast.success("Your profile updated successfully")
      }
    } catch (err: any) {
      console.log(err)
      toast.error(err.response.data.message)
      setLoading(false)
    }
  }
  const { data: mediasCount } = useSWR("/media/count", fetcher)

  const totalPageMedias = mediasCount && Math.ceil(mediasCount / 10)
  const handleUpdateMedia = (data: {
    id: React.SetStateAction<string>
    url: React.SetStateAction<string>
  }) => {
    setSelectedProfilePictureId(data.id)
    setSelectedProfilePictureUrl(data.url)
    setOpenModal(false)
  }
  return (
    <>
      <NextSeo
        title={`Edit Profile | ${env.SITE_TITLE}`}
        description={`Edit Profile | ${env.SITE_TITLE}`}
        canonical={`https://${env.DOMAIN}${router.pathname}`}
        openGraph={{
          url: `https://${env.DOMAIN}${router.pathname}`,
          title: `Edit Profile | ${env.SITE_TITLE}`,
          description: `Edit Profile | ${env.SITE_TITLE}`,
        }}
        noindex={true}
      />
      <UserRole>
        <DefaultLayout>
          <div className="mx-auto mt-[75px] flex max-w-[768px] items-end justify-end">
            <div className="flex-1 space-y-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormControl invalid={Boolean(errors.username)}>
                  <FormLabel>
                    Username
                    <RequiredIndicator />
                  </FormLabel>
                  <Input
                    type="text"
                    {...register("username", {
                      required: "Username is Required",
                    })}
                    className="max-w-xl"
                  />
                  {errors?.username && (
                    <FormErrorMessage>
                      {errors.username.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl invalid={Boolean(errors.name)}>
                  <FormLabel>
                    Name
                    <RequiredIndicator />
                  </FormLabel>
                  <Input
                    type="text"
                    {...register("name", {
                      required: "Name is Required",
                    })}
                    className="max-w-xl"
                  />
                  {errors?.name && (
                    <FormErrorMessage>{errors.name.message}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl invalid={Boolean(errors.email)}>
                  <FormLabel>
                    Email
                    <RequiredIndicator />
                  </FormLabel>
                  <Input
                    type="email"
                    {...register("email", {
                      required: "Email is Required",
                    })}
                    className="max-w-xl"
                  />
                  {errors?.email && (
                    <FormErrorMessage>{errors.email.message}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl invalid={Boolean(errors.phoneNumber)}>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    type="text"
                    {...register("phoneNumber", {
                      pattern: {
                        value: /^(0|[1-9]\d*)(\.\d+)?$/,
                        message: "Number is Invalid",
                      },
                    })}
                    className="max-w-xl"
                  />
                  {errors?.phoneNumber && (
                    <FormErrorMessage>
                      {errors.phoneNumber.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
                {selectedProfilePictureId ? (
                  <>
                    <FormLabel>Profile Picture</FormLabel>
                    <NextImage
                      src={selectedProfilePictureUrl}
                      fill
                      alt="Profile Picture"
                      className="!relative mt-2 max-h-[200px] max-w-[200px] cursor-pointer rounded-sm border-2 border-gray-300 object-cover"
                      onClick={() => setOpenModal(true)}
                    />
                  </>
                ) : (
                  <>
                    <FormLabel>Profile Picture</FormLabel>
                    <Text
                      size="sm"
                      colorScheme="blue"
                      className="border-1 max-w-xl cursor-pointer rounded-md border-gray-200 p-8 text-center"
                      onClick={() => setOpenModal(true)}
                    >
                      Select Profile Picture
                    </Text>
                  </>
                )}
                <Button type="submit" variant="solid" loading={loading}>
                  Save
                </Button>
              </form>
              <Modal
                title="Select Profile Picture"
                content={
                  <>
                    <MediaUpload addLoadMedias={setLoadedMedias} />
                    <div className="my-3">
                      {loadedMedias && (
                        <InfiniteScrollMedia
                          medias={loadedMedias}
                          index={2}
                          updateMedia={handleUpdateMedia}
                          totalPage={totalPageMedias}
                        />
                      )}
                    </div>
                  </>
                }
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
              />
            </div>
          </div>
        </DefaultLayout>
      </UserRole>
    </>
  )
}
