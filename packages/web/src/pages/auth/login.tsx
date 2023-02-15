import * as React from "react"
import NextLink from "next/link"
import NextImage from "next/image"
import axios from "axios"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { NextSeo } from "next-seo"
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  RequiredIndicator,
  FormErrorMessage,
  Divider,
  Heading,
  Text,
} from "ui"
import { HiEye, HiEyeOff } from "react-icons/hi"

import env from "@/env"
import { AuthContext } from "@/contexts/auth.context"
import { PublicRole } from "@/components/Role"

interface FormValues {
  email: string
  password: string
}

export default function Login() {
  const [auth, setAuth] = React.useContext<any>(AuthContext)
  const [showPassword, setShowPassword] = React.useState(false)
  const handleToggleShowPassword = () => setShowPassword(!showPassword)
  const [loading, setLoading] = React.useState<boolean>(false)
  const router = useRouter()

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
      const { data } = await axios.post("/user/login", values)
      if (data?.error) {
        toast.error(data.error)
        setLoading(false)
      } else {
        setAuth(data)
        localStorage.setItem("auth", JSON.stringify(data))
        toast.success("Successfully signed in")
        if (data?.user?.role === "Admin" || data?.user?.role === "Author") {
          router.push("/dashboard")
        } else {
          router.push("/")
        }
      }
    } catch (err: any) {
      console.log("err => ", err)
      setLoading(false)
      toast.error(err.response.data.message)
    }
  }

  return (
    <>
      <NextSeo
        title={`Login | ${env.SITE_TITLE}`}
        description={`Login | ${env.SITE_TITLE}`}
        canonical={`https/${env.DOMAIN}${router.pathname}`}
        openGraph={{
          url: `https/${env.DOMAIN}${router.pathname}`,
          title: `Login | ${env.SITE_TITLE}`,
          description: `Login | ${env.SITE_TITLE}`,
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
            <Heading size="2xl" bold className="text-center">
              Login
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
                        required: "Password is Required",
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
                  Login
                </Button>
              </div>
            </form>
            <Divider />
            <Text className="mt-8 text-center">
              Need an account?&nbsp;
              <NextLink
                className="text-primary-500 hover:text-primary-700 font-semibold dark:text-gray-400 dark:hover:text-gray-300"
                href="/auth/signup"
              >
                Create an account
              </NextLink>
            </Text>
            {/* <Text className="mt-8 text-center"> */}
            {/*   Forgot Password?&nbsp; */}
            {/*   <NextLink */}
            {/*     className="text-primary-500 hover:text-primary-700 font-semibold dark:text-gray-400 dark:hover:text-gray-300" */}
            {/*     href="/auth/forgot-password" */}
            {/*   > */}
            {/*     Reset here */}
            {/*   </NextLink> */}
            {/* </Text> */}
          </div>
        </div>
      </PublicRole>
    </>
  )
}
