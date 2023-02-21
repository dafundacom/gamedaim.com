import * as React from "react"
import NextImage from "next/image"
import axios from "axios"
import toast from "react-hot-toast"
import { NextSeo } from "next-seo"
import { useRouter } from "next/router"
import { useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { HiEye, HiEyeOff } from "react-icons/hi"
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
import { Modal } from "@/components/Modal"
import { MediaUpload } from "@/components/Media"
import { AdminRole } from "@/components/Role"
import { DashboardLayout } from "@/layouts/Dashboard"

interface FormValues {
  username: string
  name: string
  email: string
  password: string
  phoneNumber?: string
  about?: string
  role: string
  meta_title?: string
  meta_description?: string
}

export default function CreateUsersDashboard() {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const handleToggleShowPassword = () => setShowPassword(!showPassword)
  const [openModal, setOpenModal] = React.useState<boolean>(false)
  const [loadedMedias, setLoadedMedias] = React.useState([])
  const [selectedprofilePictureId, setSelectedprofilePictureId] =
    React.useState<string>("")
  const [selectedprofilePictureUrl, setSelectedprofilePictureUrl] =
    React.useState<string>("")

  const router = useRouter()

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FormValues>()

  const loadMedias = useQuery({
    queryKey: ["loadedMedias"],
    queryFn: async () => {
      const { data } = await axios.get("/media/page/1")
      return data
    },
    refetchInterval: 10000,
    onSuccess: (data: any) => {
      setLoadedMedias(data)
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
  })

  const onSubmit = async (values: any) => {
    setLoading(true)
    try {
      const mergedValues = {
        ...values,
        profilePictureId: selectedprofilePictureId,
      }
      console.log(mergedValues)
      const { data } = await axios.post("/user/signup", mergedValues)
      if (data?.error) {
        toast.error(data.error)
      } else {
        reset()
        toast.success("User Successfully created")
      }
    } catch (err: any) {
      console.log("err => ", err)
      toast.error(err.response.data.message)
    }
    setLoading(false)
  }

  return (
    <>
      <NextSeo
        title={`Add New User | ${env.SITE_TITLE}`}
        description={`Add New User | ${env.SITE_TITLE}`}
        canonical={`https/${env.DOMAIN}${router.pathname}`}
        openGraph={{
          url: `https/${env.DOMAIN}${router.pathname}`,
          title: `Add New User | ${env.SITE_TITLE}`,
          description: `Add New User | ${env.SITE_TITLE}`,
        }}
        noindex={true}
      />
      <AdminRole>
        <DashboardLayout>
          <div className="mt-4 flex items-end justify-end">
            <div className="flex-1 space-y-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormControl invalid={Boolean(errors.email)}>
                  <FormLabel>
                    Email
                    <RequiredIndicator />
                  </FormLabel>
                  <Input
                    type="email"
                    {...register("email", {
                      required: "Email is Required",
                      pattern: {
                        value:
                          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1, 3}\.[0-9]{1, 3}\.[0-9]{1, 3}\.[0-9]{1, 3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        message: "Email is Invalid",
                      },
                    })}
                    placeholder="Enter email"
                    className="max-w-xl"
                  />
                  {errors?.email && (
                    <FormErrorMessage>{errors.email.message}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl invalid={Boolean(errors.name)}>
                  <FormLabel>Name</FormLabel>
                  <Input
                    type="name"
                    {...register("name", {
                      required: "Name is required",
                      min: { value: 1, message: "Minimal name 1 characters" },
                      max: { value: 64, message: "Maximum name 64 characters" },
                    })}
                    placeholder="Enter name"
                    className="max-w-xl"
                  />
                  {errors?.name && (
                    <FormErrorMessage>{errors.name.message}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl invalid={Boolean(errors.username)}>
                  <FormLabel>
                    Username
                    <RequiredIndicator />
                  </FormLabel>
                  <Input
                    {...register("username", {
                      required: "Username is Required",
                      pattern: {
                        value: /^[a-z0-9]{3,16}$/i,
                        message:
                          "Username should be 3-20 characters without spaces, symbol or any special characters.",
                      },
                      min: {
                        value: 3,
                        message: "Minimal username 3 characters",
                      },
                      max: {
                        value: 20,
                        message: "Maximum username 20 characters",
                      },
                    })}
                    placeholder="Enter your username"
                    className="max-w-xl"
                  />
                  {errors?.username && (
                    <FormErrorMessage>
                      {errors.username.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
                <FormControl invalid={Boolean(errors.password)}>
                  <FormLabel>
                    Password
                    <RequiredIndicator />
                  </FormLabel>
                  <Input.Group>
                    <Input
                      className="max-w-xl pr-20"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      {...register("password", {
                        required: "Password Requird",
                        pattern: {
                          value:
                            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,64}$/i,
                          message:
                            "Password should be 8-64 characters and include at least 1 lowercase letter, 1 uppercase letter, 1 number and 1 special character!",
                        },
                        min: {
                          value: 8,
                          message: "Minimal password 8 characters",
                        },
                        max: {
                          value: 64,
                          message: "Maximum password 64 characters",
                        },
                      })}
                    />
                    {/*FIX: not appear on mobile*/}
                    <Input.RightElement className="w-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          handleToggleShowPassword()
                        }}
                        className="absolute inset-y-0 right-[970px] mr-3 flex items-center rounded-lg p-1 focus:outline-none"
                      >
                        {showPassword ? (
                          <HiEyeOff className="cursor-pointer text-xl text-gray-500 hover:text-gray-600" />
                        ) : (
                          <HiEye className="cursor-pointer text-xl text-gray-500 hover:text-gray-600" />
                        )}
                      </button>
                    </Input.RightElement>
                  </Input.Group>
                  {errors?.password && (
                    <FormErrorMessage>
                      {errors.password.message}
                    </FormErrorMessage>
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
                    placeholder="Optional"
                    className="max-w-xl"
                  />
                  {errors?.phoneNumber && (
                    <FormErrorMessage>
                      {errors.phoneNumber.message}
                    </FormErrorMessage>
                  )}
                </FormControl>

                {selectedprofilePictureId ? (
                  <>
                    <FormLabel>Featured Image</FormLabel>
                    <NextImage
                      src={selectedprofilePictureUrl}
                      fill
                      alt="Featured Image"
                      className="!relative mt-2 max-h-[200px] max-w-[200px] cursor-pointer rounded-sm border-2 border-gray-300 object-cover"
                      onClick={() => setOpenModal(true)}
                    />
                  </>
                ) : (
                  <>
                    <FormLabel>Featured Image</FormLabel>
                    <Text
                      size="sm"
                      colorScheme="blue"
                      className="border-1 max-w-xl cursor-pointer rounded-md border-gray-200 p-8 text-center"
                      onClick={() => setOpenModal(true)}
                    >
                      Select Featured Image
                    </Text>
                  </>
                )}
                <FormControl invalid={Boolean(errors.role)}>
                  <FormLabel>
                    Role
                    <RequiredIndicator />
                  </FormLabel>
                  <Select id="role" className="max-w-sm" {...register("role")}>
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
                  <Textarea
                    {...register("about")}
                    className="max-w-xl"
                    placeholder="Optional"
                  />
                  {errors?.about && (
                    <FormErrorMessage>{errors.about.message}</FormErrorMessage>
                  )}
                </FormControl>
                <Button type="submit" variant="solid" loading={loading}>
                  Submit
                </Button>
              </form>
              <Modal
                title="Select Featured Image"
                content={
                  <>
                    <MediaUpload />
                    <div className="my-3 grid grid-cols-5 gap-3">
                      {loadMedias.isFetching === false &&
                        loadedMedias.map(
                          (media: {
                            id: string
                            name: string
                            url: string
                            alt: string
                          }) => (
                            <>
                              <NextImage
                                key={media.id}
                                src={media.url}
                                alt={media.alt}
                                fill
                                className="!relative max-h-[500px] max-w-[500px] cursor-pointer rounded-sm border-2 border-gray-300 object-cover"
                                onClick={(e) => {
                                  e.preventDefault()
                                  setSelectedprofilePictureId(media.id)
                                  setSelectedprofilePictureUrl(media.url)
                                  setOpenModal(false)
                                }}
                              />
                            </>
                          ),
                        )}
                    </div>
                  </>
                }
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
              />
            </div>
          </div>
        </DashboardLayout>
      </AdminRole>
    </>
  )
}
