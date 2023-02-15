import * as React from "react"
import NextImage from "next/image"
import NextLink from "next/link"
import axios from "axios"
import toast from "react-hot-toast"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { NextSeo } from "next-seo"
import {
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  RequiredIndicator,
  Text,
} from "ui"
import { HiEye, HiEyeOff } from "react-icons/hi"

import env from "@/env"
import { AuthContext } from "@/contexts/auth.context"
import { PublicRole } from "@/components/Role"

interface FormValues {
  email: string
  name: string
  username: string
  password: string
}

export default function Signup() {
  const [auth, setAuth] = React.useContext(AuthContext)
  const router = useRouter()
  const [showPassword, setShowPassword] = React.useState(false)
  const handleToggleShowPassword = () => setShowPassword(!showPassword)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (auth?.token) {
      router.push("/")
    }
  }, [auth, router])

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormValues>()

  const onSubmit = async (values: any) => {
    try {
      setLoading(true)
      const { data } = await axios.post(`/user/signup`, values)
      if (data?.error) {
        toast.error(data.error)
        setLoading(false)
      } else {
        setAuth(data)
        localStorage.setItem("auth", JSON.stringify(data))
        toast.success("Successfully signed up")
        setLoading(false)
        router.push("/")
      }
    } catch (err: any) {
      toast.error(err.response.data.message)
      setLoading(false)
    }
  }

  return (
    <>
      <NextSeo
        title={`Sign Up | ${env.SITE_TITLE}`}
        description={`Sign Up | ${env.SITE_TITLE}`}
        canonical={`https/${env.DOMAIN}${router.pathname}`}
        openGraph={{
          url: `https/${env.DOMAIN}${router.pathname}`,
          title: `Sign Up | ${env.SITE_TITLE}`,
          description: `Sign Up | ${env.SITE_TITLE}`,
        }}
        noindex={true}
      />
      <PublicRole>
        <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <NextLink
              className="my-24 flex items-center justify-center"
              href="/"
            >
              <NextImage
                height={32}
                width={120}
                alt={env.SITE_TITLE}
                src={env.LOGO_URL}
              />
            </NextLink>
            <Heading bold size="3xl" className="text-center">
              Sign Up
            </Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
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
                    placeholder="Enter your email"
                  />
                  {errors?.email && (
                    <FormErrorMessage>{errors.email.message}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl invalid={Boolean(errors.name)}>
                  <FormLabel>
                    Name
                    <RequiredIndicator />
                  </FormLabel>
                  <Input
                    type="name"
                    {...register("name", {
                      required: "Name is required",
                      min: { value: 1, message: "Minimal name 1 characters" },
                      max: { value: 64, message: "Maximum name 64 characters" },
                    })}
                    placeholder="Enter your name"
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
                      className="pr-20"
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
                    <Input.RightElement className="w-14">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          handleToggleShowPassword()
                        }}
                        className="absolute inset-y-0 right-0 mr-3 flex items-center rounded-lg p-1 focus:outline-none"
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
                <Button type="submit" variant="solid" loading={loading}>
                  Sign Up
                </Button>
              </div>
            </form>
            <Divider />
            <Text className="mt-8 text-center">
              Already have account?&nbsp;
              <NextLink
                className="text-primary-500 hover:text-primary-700 font-semibold dark:text-gray-400 dark:hover:text-gray-300"
                href="/auth/login"
              >
                Login here
              </NextLink>
            </Text>
          </div>
        </div>
      </PublicRole>
    </>
  )
}
