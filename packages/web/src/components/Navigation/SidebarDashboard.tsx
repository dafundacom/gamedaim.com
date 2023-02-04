import * as React from "react"
// TODO: change Link to our own componenet
import Link from "next/link"
import {
  MdOutlineArticle,
  MdOutlineComment,
  MdOutlinePermMedia,
  MdOutlineSettings,
  MdOutlineTopic,
  MdPerson,
  MdSpaceDashboard,
  MdSupervisedUserCircle,
} from "react-icons/md"

import { AuthContext } from "@/contexts/auth.context"
import { Logo } from "@/components/Brand"
import { Sidebar } from "."

export interface SidebarDashboardProps {}

export const SidebarDashboard = React.forwardRef<
  HTMLDivElement,
  SidebarDashboardProps
>((props, ref) => {
  const { ...rest } = props

  const [auth] = React.useContext(AuthContext)

  return (
    <Sidebar ref={ref} {...rest}>
      <Link
        href="/"
        className="mx-auto my-0 flex items-center justify-center p-5"
      >
        <Logo />
      </Link>
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
          <Sidebar.Toggle icon={<MdSupervisedUserCircle />} title="Users">
            <Sidebar.ToggleItem href="/dashboard/users">
              All users
            </Sidebar.ToggleItem>
            <Sidebar.ToggleItem href="/dashboard/users/new">
              Add new
            </Sidebar.ToggleItem>
          </Sidebar.Toggle>
          <Sidebar.Item icon={<MdOutlineSettings />} href="/dashboard/settings">
            Settings
          </Sidebar.Item>
        </>
      )}
      <Sidebar.Item
        icon={<MdPerson />}
        className="py-5"
        href="/setting/user/profile"
      >
        Profile
      </Sidebar.Item>
    </Sidebar>
  )
})
