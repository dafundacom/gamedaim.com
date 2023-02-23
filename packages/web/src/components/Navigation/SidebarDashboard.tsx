import * as React from "react"
import NextImage from "next/image"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { useTheme } from "next-themes"
import {
  MdCode,
  MdOutlineAdsClick,
  MdOutlineArticle,
  MdOutlineComment,
  MdOutlinePermMedia,
  // MdOutlineSettings,
  MdOutlineTopic,
  MdPerson,
  MdSpaceDashboard,
  MdSupervisedUserCircle,
} from "react-icons/md"
import { LogoutIcon, MoonIcon, SunIcon } from "ui"

import env from "@/env"
import { AuthContext } from "@/contexts/auth.context"
import { Sidebar } from "."

export interface SidebarDashboardProps {}

export const SidebarDashboard = React.forwardRef<
  HTMLDivElement,
  SidebarDashboardProps
>((props, ref) => {
  const { ...rest } = props
  const [auth, setAuth] = React.useContext(AuthContext)
  const [mounted, setMounted] = React.useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  const router = useRouter()

  React.useEffect(() => setMounted(true), [])

  const switchTheme = () => {
    if (mounted) {
      setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }
  }

  const logOut = () => {
    localStorage.removeItem("auth")
    setAuth({
      user: null,
      accessToken: "",
    })
    router.push("/auth/login")
  }

  return (
    <Sidebar ref={ref} {...rest}>
      <NextLink href="/" className="flex items-center justify-center p-2">
        <NextImage
          height={32}
          width={120}
          alt={env.SITE_TITLE}
          src={env.LOGO_URL}
        />
      </NextLink>
      <Sidebar.Item icon={<MdSpaceDashboard />} href="/dashboard">
        Dashboard
      </Sidebar.Item>
      <Sidebar.Toggle icon={<MdOutlineArticle />} title="Articles">
        <Sidebar.ToggleItem href="/dashboard/articles">
          All Articles
        </Sidebar.ToggleItem>
        <Sidebar.ToggleItem href="/dashboard/articles/new">
          Add new article
        </Sidebar.ToggleItem>
      </Sidebar.Toggle>
      {auth?.user?.role === "ADMIN" && (
        <Sidebar.Toggle icon={<MdOutlineTopic />} title="Topics">
          <Sidebar.ToggleItem href="/dashboard/topics">
            All Topics
          </Sidebar.ToggleItem>
          <Sidebar.ToggleItem href="/dashboard/topics/new">
            Add new topic
          </Sidebar.ToggleItem>
        </Sidebar.Toggle>
      )}
      {auth?.user?.role === "ADMIN" && (
        <Sidebar.Toggle icon={<MdOutlineAdsClick />} title="Ads">
          <Sidebar.ToggleItem href="/dashboard/ads">All Ads</Sidebar.ToggleItem>
          <Sidebar.ToggleItem href="/dashboard/ads/new">
            Add new ad
          </Sidebar.ToggleItem>
        </Sidebar.Toggle>
      )}
      {auth?.user?.role === "ADMIN" && (
        <Sidebar.Toggle icon={<MdCode />} title="Scripts">
          <Sidebar.ToggleItem href="/dashboard/scripts">
            All scripts
          </Sidebar.ToggleItem>
          <Sidebar.ToggleItem href="/dashboard/scripts/new">
            Add new script
          </Sidebar.ToggleItem>
        </Sidebar.Toggle>
      )}
      <Sidebar.Toggle icon={<MdOutlinePermMedia />} title="Media">
        <Sidebar.ToggleItem href="/dashboard/media/library">
          Library
        </Sidebar.ToggleItem>
        <Sidebar.ToggleItem href="/dashboard/media/new">
          Add new
        </Sidebar.ToggleItem>
      </Sidebar.Toggle>
      {auth?.user?.role === "ADMIN" && (
        <>
          <Sidebar.Item icon={<MdOutlineComment />} href="/dashboard/comments">
            Comments
          </Sidebar.Item>
          <Sidebar.Item
            icon={<MdOutlineComment />}
            href="/dashboard/wp-comments"
          >
            WP Comments
          </Sidebar.Item>
          <Sidebar.Toggle icon={<MdSupervisedUserCircle />} title="Users">
            <Sidebar.ToggleItem href="/dashboard/users">
              All users
            </Sidebar.ToggleItem>
            <Sidebar.ToggleItem href="/dashboard/users/new">
              Add new
            </Sidebar.ToggleItem>
          </Sidebar.Toggle>
          {/* <Sidebar.Item icon={<MdOutlineSettings />} href="/dashboard/settings"> */}
          {/*   Settings */}
          {/* </Sidebar.Item> */}
        </>
      )}
      <div className="py-5">
        <Sidebar.Item icon={<MdPerson />} href="/setting/user/profile">
          Profile
        </Sidebar.Item>
        <Sidebar.Item
          icon={
            <>
              {mounted &&
                (resolvedTheme === "light" ? (
                  <MoonIcon className="h-5 w-5" />
                ) : (
                  <SunIcon className="h-5 w-5" />
                ))}
            </>
          }
          onClick={switchTheme}
        >
          Switch Theme
        </Sidebar.Item>
        <Sidebar.Item icon={<LogoutIcon />} onClick={() => logOut()}>
          Log Out
        </Sidebar.Item>
      </div>
    </Sidebar>
  )
})
