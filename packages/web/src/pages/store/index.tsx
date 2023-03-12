import { useRouter } from "next/router"
import { NextSeo } from "next-seo"

import env from "@/env"
import { StoreLayout } from "@/layouts/Store"
import { ListCardStore, ListLinkTopup } from "@/components/List"

import { getSettingsSite } from "@/lib/settings"

export default function Store(props: { settingsSite: any }) {
  const { settingsSite } = props
  const router = useRouter()
  return (
    <>
      <NextSeo
        title={`Store | ${settingsSite.title?.value || env.SITE_TITTLE}`}
        description={`Store | ${settingsSite.title?.value || env.SITE_TITTLE}`}
        canonical={`https://${settingsSite.url?.value || env.DOMAIN}${
          router.pathname
        }`}
        openGraph={{
          url: `https://${settingsSite.url?.value || env.DOMAIN}${
            router.pathname
          }`,
          title: `Store | ${settingsSite.title?.value || env.SITE_TITTLE}`,
          description: `Store | ${
            settingsSite.title?.value || env.SITE_TITTLE
          }`,
        }}
      />
      <StoreLayout>
        <div className="mx-auto flex w-full flex-col space-y-4 md:max-[991px]:max-w-[750px] min-[992px]:max-[1199px]:max-w-[970px] min-[1200px]:max-w-[1170px]">
          <ListLinkTopup />
          <ListCardStore />
        </div>
      </StoreLayout>
    </>
  )
}

export async function getStaticProps() {
  const { settingsSite } = await getSettingsSite()

  return { props: { settingsSite } }
}
