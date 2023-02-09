import * as React from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { useForm } from "react-hook-form"
import { HiEye, HiEyeOff } from "react-icons/hi"
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  RequiredIndicator,
  Textarea,
} from "ui"

import { AdminRole } from "@/components/Role"
import { DashboardLayout } from "@/layouts/Dashboard"

interface FormValues {
  username: string
  name: string
  email: string
  password: string
  phoneNumber?: string
  profilePicture?: string
  about?: string
  role: string
}

export default function CreateUsersDashboard() {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const handleToggleShowPassword = () => setShowPassword(!showPassword)

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FormValues>()

  const onSubmit = async (values: any) => {
    setLoading(true)
    try {
      const { data } = await axios.post("/user/signup", values)
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
                    min: { value: 3, message: "Minimal username 3 characters" },
                    max: {
                      value: 20,
                      message: "Maximum username 20 characters",
                    },
                  })}
                  placeholder="Enter your username"
                  className="max-w-xl"
                />
                {errors?.username && (
                  <FormErrorMessage>{errors.username.message}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl invalid={Boolean(errors.password)}>
                <FormLabel>
                  Password
                  <RequiredIndicator />
                </FormLabel>
                <Input.Group>
                  <Input
                    className="pr-20 max-w-xl"
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
                  <FormErrorMessage>{errors.password.message}</FormErrorMessage>
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
              {/* TODO: change to file upload*/}
              <FormControl invalid={Boolean(errors.profilePicture)}>
                <FormLabel>Profile Picture</FormLabel>
                <Input
                  type="text"
                  {...register("profilePicture")}
                  placeholder="Optional"
                  className="max-w-xl"
                />
                {errors?.profilePicture && (
                  <FormErrorMessage>
                    {errors.profilePicture.message}
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl invalid={Boolean(errors.role)}>
                <FormLabel>
                  Role
                  <RequiredIndicator />
                </FormLabel>
                <select {...register("role")}>
                  <option value="USER">USER</option>
                  <option value="AUTHOR">AUTHOR</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
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
          </div>
        </div>
      </DashboardLayout>
    </AdminRole>
  )
}
