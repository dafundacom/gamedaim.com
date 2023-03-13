import * as React from "react"
import NextImage from "next/image"
import toast from "react-hot-toast"
import { NextSeo } from "next-seo"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  RequiredIndicator,
  Select,
  Text,
  Textarea,
} from "ui"

import env from "@/env"
import { ModalSelectMedia } from "@/components/Modal"
import { DashboardLayout } from "@/layouts/Dashboard"
import { AdminRole } from "@/components/Role"
import { getSettingsSite } from "@/lib/settings"
import { fetch } from "@/lib/fetch"

enum UserRoles {
  "ADMIN",
  "AUTHOR",
  "USER",
}

interface FormValues {
  username: string
  name?: string
  email?: string
  about?: string
  phoneNumber?: string
  role: UserRoles
}

export default function DashboardEditUser(props: { settingsSite: any }) {
  const { settingsSite } = props
  const [loading, setLoading] = React.useState<boolean>(false)
  const [openModal, setOpenModal] = React.useState<boolean>(false)
  const [selectedProfilePictureId, setSelectedProfilePictureId] =
    React.useState<string>("")
  const [selectedProfilePictureUrl, setSelectedProfilePictureUrl] =
    React.useState<string>("")
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

  React.useEffect(() => {
    loadUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router?.query?.id])

  React.useEffect(() => {
    reset(user)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const loadUser = async () => {
    try {
      const { data } = await fetch.get(`/user/${router.query.id}`)
      setUser({
        id: data.id,
        username: data.username,
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        role: data.role,
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
    setLoading(true)
    try {
      const mergedValues = {
        ...values,
        profilePictureId: selectedProfilePictureId,
      }
      const { data } = await fetch.put(
        `/user/update-by-admin/${user.id}`,
        selectedProfilePictureId ? mergedValues : values,
      )

      if (data?.error) {
        toast.error(data?.error)
        setLoading(false)
      } else {
        toast.success("Your profile updated successfully")
        setLoading(false)
        router.push("/dashboard/users")
      }
    } catch (err: any) {
      console.log(err)
      toast.error(err.response.data.message)
      setLoading(false)
    }
  }

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
        title={`Edit User | ${settingsSite.title?.value || env.SITE_TITTLE}`}
        description={`Edit User | ${
          settingsSite.title?.value || env.SITE_TITTLE
        }`}
        canonical={`https://${settingsSite.url?.value || env.DOMAIN}${
          router.pathname
        }`}
        openGraph={{
          url: `https://${settingsSite.url?.value || env.DOMAIN}${
            router.pathname
          }`,
          title: `Edit User | ${settingsSite.title?.value || env.SITE_TITTLE}`,
          description: `Edit User | ${
            settingsSite.title?.value || env.SITE_TITTLE
          }`,
        }}
        noindex={true}
      />
      <AdminRole>
        <DashboardLayout>
          <div className="mt-4 mb-[100px] flex items-end justify-end">
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
                <FormControl invalid={Boolean(errors.role)}>
                  <FormLabel>
                    Role
                    <RequiredIndicator />
                  </FormLabel>
                  <Select className="max-w-sm" {...register("role")}>
                    <Select.Option value="USER">USER</Select.Option>
                    <Select.Option value="AUTHOR">AUTHOR</Select.Option>
                    <Select.Option value="ADMIN">ADMIN</Select.Option>
                  </Select>
                  {errors?.role && (
                    <FormErrorMessage>{errors.role.message}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl invalid={Boolean(errors.about)}>
                  <FormLabel>About</FormLabel>
                  <Textarea {...register("about")} className="max-w-xl" />
                  {errors?.about && (
                    <FormErrorMessage>{errors.about.message}</FormErrorMessage>
                  )}
                </FormControl>
                <Button type="submit" variant="solid" loading={loading}>
                  Save
                </Button>
              </form>
              <ModalSelectMedia
                handleSelectUpdateMedia={handleUpdateMedia}
                open={openModal}
                setOpen={setOpenModal}
              />
            </div>
          </div>
        </DashboardLayout>
      </AdminRole>
    </>
  )
}

export async function getServerSideProps() {
  const { settingsSite } = await getSettingsSite()
  return {
    props: { settingsSite },
  }
}
