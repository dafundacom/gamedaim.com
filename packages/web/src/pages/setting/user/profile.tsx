import * as React from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  RequiredIndicator,
  Textarea,
} from "ui"

import { AuthContext } from "@/contexts/auth.context"
import { DefaultLayout } from "@/layouts/Default"
import { UserRole } from "@/components/Role"

interface FormValues {
  username: string
  name?: string
  email?: string
  about?: string
  phoneNumber?: string
  profilePicture?: string
}

export default function SettingUserProfile() {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [auth] = React.useContext(AuthContext)
  const [user, setUser] = React.useState<any>({
    username: "",
    name: "",
    email: "",
    about: "",
    phoneNumber: "",
    profilePicture: "",
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
      const { data } = await axios.get(`/user/${auth.user.id}`)
      setUser({
        username: data.username,
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        profilePicture: data.profilePicture,
        about: data.about,
      })
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

  return (
    <UserRole>
      <DefaultLayout>
        <div className="mt-4 flex items-end justify-end">
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
                  <FormErrorMessage>{errors.username.message}</FormErrorMessage>
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
              {/*TODO: change this to use uploadFile*/}
              <FormControl invalid={Boolean(errors.profilePicture)}>
                <FormLabel>Profile Picture</FormLabel>
                <Input
                  type="text"
                  {...register("profilePicture")}
                  className="max-w-xl"
                />
                {errors?.profilePicture && (
                  <FormErrorMessage>
                    {errors.profilePicture.message}
                  </FormErrorMessage>
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
          </div>
        </div>
      </DefaultLayout>
    </UserRole>
  )
}
