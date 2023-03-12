import * as React from "react"
import { useRouter } from "next/router"
import NextLink from "next/link"

import { MdPerson } from "react-icons/md"
import { Button, DashboardIcon, IconButton, LoginIcon, LogoutIcon } from "ui"

import { AuthContext } from "@/contexts/auth.context"
export const DropdownProfile = () => {
  const [openProfile, setOpenProfile] = React.useState(false)
  const [auth, setAuth] = React.useContext(AuthContext)
  const router = useRouter()

  function toggleDropdown() {
    setOpenProfile((prev) => !prev)
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
    <div className="dark:bg-inherit">
      {auth.user ? (
        <div className="relative">
          <Button
            onClick={toggleDropdown}
            variant="ghost"
            className="flex items-center !p-0 text-sm focus:outline-none"
          >
            <MdPerson className="h-5 w-5" />
          </Button>
          {openProfile && (
            <div className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white shadow-lg dark:!bg-gray-800">
              <NextLink
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                href="/setting/user/profile"
              >
                <Button variant="ghost" aria-label="Profile" className="!p-0">
                  <MdPerson className="mr-2 h-5 w-5" /> Profile
                </Button>
              </NextLink>
              {auth.user?.role !== "USER" && (
                <NextLink
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  href="/dashboard"
                >
                  <Button variant="ghost" aria-label="Profile" className="!p-0">
                    <DashboardIcon className="mr-2 h-5 w-5" />
                    Dashboard
                  </Button>
                </NextLink>
              )}
              <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <Button
                  className="!p-0"
                  variant="ghost"
                  aria-label="Log Out"
                  onClick={() => logOut()}
                >
                  <LogoutIcon className="mr-2 h-5 w-5" /> Log Out
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <NextLink href="/auth/login">
          <IconButton className="!px-1" variant="ghost" aria-label="Login">
            <LoginIcon className="h-5 w-5" />
          </IconButton>
        </NextLink>
      )}
    </div>
  )
}
