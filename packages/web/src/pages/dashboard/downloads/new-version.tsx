import * as React from "react"
import { NextSeo } from "next-seo"
import { useRouter } from "next/router"
import env from "@/env"
import { AdminRole } from "@/components/Role"
import { DashboardLayout } from "@/layouts/Dashboard"
import { NewDownloadFile } from "@/components/Form"

export default function CreateDownloadfilesDashboard() {
  const router = useRouter()

  return (
    <>
      <NextSeo
        title={`Add New Download-file | ${env.SITE_TITLE}`}
        description={`Add New Download File | ${env.SITE_TITLE}`}
        canonical={`https/${env.DOMAIN}${router.pathname}`}
        openGraph={{
          url: `https/${env.DOMAIN}${router.pathname}`,
          title: `Add New Download File | ${env.SITE_TITLE}`,
          description: `Add New Download File | ${env.SITE_TITLE}`,
        }}
        noindex={true}
      />
      <AdminRole>
        <DashboardLayout>
          <NewDownloadFile />
        </DashboardLayout>
      </AdminRole>
    </>
  )
}
