import * as React from "react"
import axios from "axios"
import toast from "react-hot-toast"
import env from "@/env"

import { NextSeo } from "next-seo"
import { useRouter } from "next/router"
import useSWR from "swr"
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

import { AdminRole } from "@/components/Role"
import { DashboardLayout } from "@/layouts/Dashboard"
import { fetcher } from "@/lib/fetcher"
import { getSettingsSite } from "@/lib/settings"

interface FormValues {
  key: string
  value: string
}

export default function Settings(props: { settingsSite: any }) {
  const { settingsSite } = props
  const [loading, setLoading] = React.useState<boolean>(false)
  const [successCount, setSuccessCount] = React.useState(0)

  const router = useRouter()
  const { data: title } = useSWR("/setting/title", fetcher)
  const { data: metaTitle } = useSWR("/setting/meta_title", fetcher)
  const { data: description } = useSWR("/setting/description", fetcher)
  const { data: metaDescription } = useSWR("/setting/meta_description", fetcher)
  const { data: url } = useSWR("/setting/url", fetcher)
  const { data: facebook } = useSWR("/setting/facebook_username", fetcher)
  const { data: twitter } = useSWR("/setting/twitter_username", fetcher)
  const { data: instagram } = useSWR("/setting/instagram_username", fetcher)
  const { data: pinterest } = useSWR("/setting/pinterest_username", fetcher)
  const { data: youtube } = useSWR("/setting/youtube_username", fetcher)
  const { data: tagline } = useSWR("/setting/tagline", fetcher)

  const {
    register: registerTitle,
    formState: { errors: errorsTitle },
    handleSubmit: handleSubmitTitle,
    reset: resetTitle,
  } = useForm<FormValues>({
    defaultValues: {
      key: "title",
    },
  })
  const {
    register: registerMetaTitle,
    formState: { errors: errorsMetaTitle },
    handleSubmit: handleSubmitMetaTitle,
    reset: resetMetaTitle,
  } = useForm<FormValues>({
    defaultValues: {
      key: "meta_title",
    },
  })

  const {
    register: registerDescription,
    formState: { errors: errorsDescription },
    handleSubmit: handleSubmitDescription,
    reset: resetDescription,
  } = useForm<FormValues>({
    defaultValues: {
      key: "description",
    },
  })
  const {
    register: registerMetaDescription,
    formState: { errors: errorsMetaDescription },
    handleSubmit: handleSubmitMetaDescription,
    reset: resetMetaDescription,
  } = useForm<FormValues>({
    defaultValues: {
      key: "meta_description",
    },
  })
  const {
    register: registerUrl,
    formState: { errors: errorsUrl },
    handleSubmit: handleSubmitUrl,
    reset: resetUrl,
  } = useForm<FormValues>({
    defaultValues: {
      key: "url",
    },
  })
  const {
    register: registerFacebook,
    formState: { errors: errorsFacebook },
    handleSubmit: handleSubmitFacebook,
    reset: resetFacebook,
  } = useForm<FormValues>({
    defaultValues: {
      key: "facebook_username",
    },
  })
  const {
    register: registerTwitter,
    formState: { errors: errorsTwitter },
    handleSubmit: handleSubmitTwitter,
    reset: resetTwitter,
  } = useForm<FormValues>({
    defaultValues: {
      key: "twitter_username",
    },
  })
  const {
    register: registerInstagram,
    formState: { errors: errorsInstagram },
    handleSubmit: handleSubmitInstagram,
    reset: resetInstagram,
  } = useForm<FormValues>({
    defaultValues: {
      key: "instagram_username",
    },
  })
  const {
    register: registerPinterest,
    formState: { errors: errorsPinterest },
    handleSubmit: handleSubmitPinterest,
    reset: resetPinterest,
  } = useForm<FormValues>({
    defaultValues: {
      key: "pinterest_username",
    },
  })
  const {
    register: registerYoutube,
    formState: { errors: errorsYoutube },
    handleSubmit: handleSubmitYoutube,
    reset: resetYoutube,
  } = useForm<FormValues>({
    defaultValues: {
      key: "youtube_username",
    },
  })

  const {
    register: registerTagline,
    formState: { errors: errorsTagline },
    handleSubmit: handleSubmitTagline,
    reset: resetTagline,
  } = useForm<FormValues>({
    defaultValues: {
      key: "tagline",
    },
  })

  React.useEffect(() => {
    resetTitle(title)
    resetMetaTitle(metaTitle)
    resetDescription(description)
    resetMetaDescription(metaDescription)
    resetUrl(url)
    resetFacebook(facebook)
    resetInstagram(instagram)
    resetPinterest(pinterest)
    resetTwitter(twitter)
    resetYoutube(youtube)
    resetTagline(tagline)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    description,
    facebook,
    instagram,
    metaDescription,
    metaTitle,
    pinterest,
    tagline,
    title,
    twitter,
    url,
    youtube,
  ])

  const onSubmitTitle = async (values: any) => {
    try {
      const { data } = await axios.post("/setting", values)

      if (data?.error) {
        toast.error(data.error)
      } else {
        resetTitle(data)
        setSuccessCount((prevCount) => prevCount + 1)
      }
    } catch (err: any) {
      console.log("err => ", err)
      toast.error(err.response.data.message)
    }
  }
  const onSubmitMetaTitle = async (values: any) => {
    try {
      const { data } = await axios.post("/setting", values)

      if (data?.error) {
        toast.error(data.error)
      } else {
        resetMetaTitle(data)
        setSuccessCount((prevCount) => prevCount + 1)
      }
    } catch (err: any) {
      console.log("err => ", err)
      toast.error(err.response.data.message)
    }
  }
  const onSubmitDescription = async (values: any) => {
    try {
      const { data } = await axios.post("/setting", values)

      if (data?.error) {
        toast.error(data.error)
      } else {
        resetDescription(data)
        setSuccessCount((prevCount) => prevCount + 1)
      }
    } catch (err: any) {
      console.log("err => ", err)
      toast.error(err.response.data.message)
    }
  }
  const onSubmitMetaDescription = async (values: any) => {
    try {
      const { data } = await axios.post("/setting", values)

      if (data?.error) {
        toast.error(data.error)
      } else {
        resetMetaDescription(data)
        setSuccessCount((prevCount) => prevCount + 1)
      }
    } catch (err: any) {
      console.log("err => ", err)
      toast.error(err.response.data.message)
    }
  }

  const onSubmitUrl = async (values: any) => {
    try {
      const { data } = await axios.post("/setting", values)

      if (data?.error) {
        toast.error(data.error)
      } else {
        resetUrl(data)
        setSuccessCount((prevCount) => prevCount + 1)
      }
    } catch (err: any) {
      console.log("err => ", err)
      toast.error(err.response.data.message)
    }
  }

  const onSubmitFacebook = async (values: any) => {
    try {
      const { data } = await axios.post("/setting", values)

      if (data?.error) {
        toast.error(data.error)
      } else {
        resetFacebook(data)
        setSuccessCount((prevCount) => prevCount + 1)
      }
    } catch (err: any) {
      console.log("err => ", err)
      toast.error(err.response.data.message)
    }
  }

  const onSubmitInstagram = async (values: any) => {
    try {
      const { data } = await axios.post("/setting", values)

      if (data?.error) {
        toast.error(data.error)
      } else {
        resetInstagram(data)
        setSuccessCount((prevCount) => prevCount + 1)
      }
    } catch (err: any) {
      console.log("err => ", err)
      toast.error(err.response.data.message)
    }
  }

  const onSubmitTwitter = async (values: any) => {
    try {
      const { data } = await axios.post("/setting", values)

      if (data?.error) {
        toast.error(data.error)
      } else {
        resetTwitter(data)
        setSuccessCount((prevCount) => prevCount + 1)
      }
    } catch (err: any) {
      console.log("err => ", err)
      toast.error(err.response.data.message)
    }
  }

  const onSubmitPinterest = async (values: any) => {
    try {
      const { data } = await axios.post("/setting", values)

      if (data?.error) {
        toast.error(data.error)
      } else {
        resetPinterest(data)
        setSuccessCount((prevCount) => prevCount + 1)
      }
    } catch (err: any) {
      console.log("err => ", err)
      toast.error(err.response.data.message)
    }
  }
  const onSubmitYoutube = async (values: any) => {
    try {
      const { data } = await axios.post("/setting", values)

      if (data?.error) {
        toast.error(data.error)
      } else {
        resetYoutube(data)
        setSuccessCount((prevCount) => prevCount + 1)
      }
    } catch (err: any) {
      console.log("err => ", err)
      toast.error(err.response.data.message)
    }
  }

  const onSubmitTagline = async (values: any) => {
    try {
      const { data } = await axios.post("/setting", values)

      if (data?.error) {
        toast.error(data.error)
      } else {
        resetTagline(data)
        setSuccessCount((prevCount) => prevCount + 1)
      }
    } catch (err: any) {
      console.log("err => ", err)
      toast.error(err.response.data.message)
    }
  }

  const onSubmitAll = () => {
    setLoading(true)
    handleSubmitTitle(onSubmitTitle)()
    handleSubmitMetaTitle(onSubmitMetaTitle)()
    handleSubmitDescription(onSubmitDescription)()
    handleSubmitMetaDescription(onSubmitMetaDescription)()
    handleSubmitUrl(onSubmitUrl)()
    handleSubmitFacebook(onSubmitFacebook)()
    handleSubmitTwitter(onSubmitTwitter)()
    handleSubmitInstagram(onSubmitInstagram)()
    handleSubmitYoutube(onSubmitYoutube)()
    handleSubmitPinterest(onSubmitPinterest)()
    handleSubmitTagline(onSubmitTagline)()
    if (successCount === 11) {
      toast.success("Settings submitted successfully!")
      setSuccessCount(0)
    }

    setLoading(false)
  }

  return (
    <>
      <NextSeo
        title={`Add New Topic | ${
          settingsSite.title?.value || env.SITE_TITTLE
        }`}
        description={`Add New Topic | ${
          settingsSite.title?.value || env.SITE_TITTLE
        }`}
        canonical={`https://${settingsSite.url?.value || env.DOMAIN}${
          router.pathname
        }`}
        openGraph={{
          url: `https://${settingsSite.url?.value || env.DOMAIN}${
            router.pathname
          }`,
          title: `Add New Topic | ${
            settingsSite.title?.value || env.SITE_TITTLE
          }`,
          description: `Add New Topic | ${
            settingsSite.title?.value || env.SITE_TITTLE
          }`,
        }}
        noindex={true}
      />
      <AdminRole>
        <DashboardLayout>
          <div className="mt-4 mb-[100px] flex items-end justify-end">
            <div className="flex-1 space-y-4">
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <FormControl invalid={Boolean(errorsTitle.value)}>
                  <FormLabel>
                    Title
                    <RequiredIndicator />
                  </FormLabel>
                  <Input
                    type="text"
                    {...registerTitle("value", {
                      required: "Title is Required",
                    })}
                    className="max-w-xl"
                    placeholder="Enter Title"
                  />
                  {errorsTitle?.value && (
                    <FormErrorMessage>
                      {errorsTitle.value.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </form>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <FormControl invalid={Boolean(errorsMetaTitle.value)}>
                  <FormLabel>
                    Meta Title
                    <RequiredIndicator />
                  </FormLabel>
                  <Input
                    type="text"
                    {...registerMetaTitle("value", {
                      required: "Meta Title is Required",
                    })}
                    className="max-w-xl"
                    placeholder="Enter Meta Title"
                  />
                  {errorsMetaTitle?.value && (
                    <FormErrorMessage>
                      {errorsMetaTitle.value.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </form>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <FormControl invalid={Boolean(errorsDescription.value)}>
                  <FormLabel>
                    Description
                    <RequiredIndicator />
                  </FormLabel>
                  <Textarea
                    type="text"
                    {...registerDescription("value", {
                      required: "Description is Required",
                    })}
                    className="max-w-xl"
                    placeholder="Description"
                  />
                  {errorsDescription?.value && (
                    <FormErrorMessage>
                      {errorsDescription.value.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </form>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <FormControl invalid={Boolean(errorsMetaDescription.value)}>
                  <FormLabel>
                    Meta Description
                    <RequiredIndicator />
                  </FormLabel>
                  <Textarea
                    type="text"
                    {...registerMetaDescription("value", {
                      required: "Meta Description is Required",
                    })}
                    className="max-w-xl"
                    placeholder="Enter Meta Description"
                  />
                  {errorsMetaDescription?.value && (
                    <FormErrorMessage>
                      {errorsMetaDescription.value.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </form>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <FormControl invalid={Boolean(errorsUrl.value)}>
                  <FormLabel>
                    Url
                    <RequiredIndicator />
                  </FormLabel>
                  <Input
                    type="text"
                    {...registerUrl("value", {
                      required: "Url is Required",
                    })}
                    className="max-w-xl"
                    placeholder="Enter Url"
                  />
                  {errorsUrl?.value && (
                    <FormErrorMessage>
                      {errorsUrl.value.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </form>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <FormControl invalid={Boolean(errorsTagline.value)}>
                  <FormLabel>
                    Tagline Username
                    <RequiredIndicator />
                  </FormLabel>
                  <Input
                    type="text"
                    {...registerTagline("value", {
                      required: "Tagline is Required",
                    })}
                    className="max-w-xl"
                    placeholder="Enter Tagline Username"
                  />
                  {errorsTagline?.value && (
                    <FormErrorMessage>
                      {errorsTagline.value.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </form>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <FormControl invalid={Boolean(errorsFacebook.value)}>
                  <FormLabel>
                    Facebook Username
                    <RequiredIndicator />
                  </FormLabel>
                  <Input
                    type="text"
                    {...registerFacebook("value", {
                      required: "Facebook username is Required",
                    })}
                    className="max-w-xl"
                    placeholder="Enter Facebook Username"
                  />
                  {errorsFacebook?.value && (
                    <FormErrorMessage>
                      {errorsFacebook.value.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </form>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <FormControl invalid={Boolean(errorsTwitter.value)}>
                  <FormLabel>
                    Twitter Username
                    <RequiredIndicator />
                  </FormLabel>
                  <Input
                    type="text"
                    {...registerTwitter("value", {
                      required: "Twitter username is Required",
                    })}
                    className="max-w-xl"
                    placeholder="Enter Twitter Username"
                  />
                  {errorsTwitter?.value && (
                    <FormErrorMessage>
                      {errorsTwitter.value.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </form>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <FormControl invalid={Boolean(errorsInstagram.value)}>
                  <FormLabel>
                    Instagram Username
                    <RequiredIndicator />
                  </FormLabel>
                  <Input
                    type="text"
                    {...registerInstagram("value", {
                      required: "Instagram username is Required",
                    })}
                    className="max-w-xl"
                    placeholder="Enter Instagram Username"
                  />
                  {errorsInstagram?.value && (
                    <FormErrorMessage>
                      {errorsInstagram.value.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </form>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <FormControl invalid={Boolean(errorsPinterest.value)}>
                  <FormLabel>
                    Pinterest Username
                    <RequiredIndicator />
                  </FormLabel>
                  <Input
                    type="text"
                    {...registerPinterest("value", {
                      required: "Pinterest username is Required",
                    })}
                    className="max-w-xl"
                    placeholder="Enter Pinterest Username"
                  />
                  {errorsPinterest?.value && (
                    <FormErrorMessage>
                      {errorsPinterest.value.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </form>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <FormControl invalid={Boolean(errorsYoutube.value)}>
                  <FormLabel>
                    Youtube Channel
                    <RequiredIndicator />
                  </FormLabel>
                  <Input
                    type="text"
                    {...registerYoutube("value", {
                      required: "Youtube username is Required",
                    })}
                    className="max-w-xl"
                    placeholder="Enter Youtube Channel"
                  />
                  {errorsYoutube?.value && (
                    <FormErrorMessage>
                      {errorsYoutube.value.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </form>
              <Button onClick={onSubmitAll} variant="solid" loading={loading}>
                Submit
              </Button>
            </div>
          </div>
        </DashboardLayout>
      </AdminRole>
    </>
  )
}

export async function getStaticProps() {
  const { settingsSite } = await getSettingsSite()
  return {
    props: { settingsSite },
    revalidate: 60,
  }
}
