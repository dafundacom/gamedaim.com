import * as React from "react"
import NextLink from "next/link"
import NextImage from "next/image"
import { useRouter } from "next/router"
import { useTheme } from "next-themes"
import { FaTwitter, FaFacebook, FaYoutube, FaInstagram } from "react-icons/fa"
import {
  DashboardIcon,
  Heading,
  IconButton,
  LoginIcon,
  LogoutIcon,
  MoonIcon,
  SunIcon,
  useDisclosure,
} from "ui"
import env from "@/env"
import { AuthContext } from "@/contexts/auth.context"
import { MdSearch } from "react-icons/md"

interface TopNavProps {
  toggleSideNav?: any
}

export const TopNav = React.forwardRef<HTMLDivElement, TopNavProps>(
  (props, ref) => {
    const { toggleSideNav, ...rest } = props
    const [mounted, setMounted] = React.useState(false)
    const { resolvedTheme, setTheme } = useTheme()
    const [auth, setAuth] = React.useContext(AuthContext)
    const router = useRouter()
    const { isOpen, onToggle } = useDisclosure()

    const inputRef = React.useRef() as React.RefObject<HTMLInputElement>
    const handlerSubmit = (e: { preventDefault: () => void }) => {
      e.preventDefault()
      //@ts-ignore
      const value = inputRef.current.value
      router.push(`/search?q=${value}`)
    }

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
        token: "",
      })
      router.push("/auth/login")
    }

    return (
      <>
        <header
          className="box-border py-0 border-none bg-white dark:bg-gray-900 px-4 outline-none align-baseline flex items-center -my-0 mx-auto fixed top-0 left-auto w-full opacity-1 h-16 shadow-lg shadow-md z-[99]"
          ref={ref}
          {...rest}
        >
          <div className="grow pr-4 pl-4 mr-auto ml-auto">
            <div className="relative h-full">
              <div className="flex-nowrap flex-row items-center flex h-full -ml-4 -mr-4">
                <div id="drawer" className="mx-2">
                  <div
                    className="cursor-pointer space-y-[6px] hover:space-y-[3px]"
                    onClick={toggleSideNav}
                  >
                    <div className="h-0.5 w-5 bg-gray-600 dark:bg-white transition-[margin]"></div>
                    <div className="h-0.5 w-5 bg-gray-600 dark:bg-white transition-[margin]"></div>
                    <div className="h-0.5 w-5 bg-gray-600 dark:bg-white transition-[margin]"></div>
                  </div>
                </div>
                <div className="flex-grow-0 flex-shrink-0 flex flex-col pl-4 pr-4 max-w-full min-w-0 basis-auto">
                  <div className="pr-0 pl-0 items-center justify-start w-full flex flex-wrap flex-row">
                    <div className="ak-bar-item ak-header-logo pr-0 pl-0 items-center justify-start w-full flex flex-wrap flex-row">
                      <Heading className="logo-image m-0 p-0 leading-none font-bold text-4xl">
                        <NextLink href="/">
                          <NextImage
                            height={32}
                            width={120}
                            alt={env.SITE_TITLE}
                            src={env.LOGO_URL}
                          />
                        </NextLink>
                      </Heading>
                    </div>
                  </div>
                </div>
                <div className="mx-auto w-[50%] hidden lg:block">
                  <form
                    className="bg-white dark:bg-gray-800"
                    onSubmit={handlerSubmit}
                    autoComplete="off"
                  >
                    <div className="relative flex min-w-full lg:w-[400px] bg-white dark:bg-gray-900">
                      <div className="absolute top-[4px] bottom-0 left-0 flex items-center pl-3">
                        <span className="text-gray-4 h-5 w-5"></span>
                      </div>
                      <input
                        className="focus:border-primary-200 h-11 w-full rounded-full border border-gray-300 bg-white px-8 py-3 text-gray-700 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-gray-500"
                        type="search"
                        name="q"
                        ref={inputRef}
                        autoComplete="off"
                        placeholder="Search..."
                        required
                      />
                    </div>
                  </form>
                </div>
                <div className="grow-1 flex flex-row ml-auto space-x-2">
                  <div className="space-x-2 hidden lg:block">
                    <NextLink
                      href={`https://www.facebook.com/${env.FACEBOOK_USERNAME}`}
                      target="_blank"
                    >
                      <IconButton variant="ghost" className="!text-lg !px-1">
                        <FaFacebook />
                      </IconButton>
                    </NextLink>
                    <NextLink
                      href={`https://www.twitter.com/${env.TWITTER_USERNAME}`}
                      target="_blank"
                    >
                      <IconButton variant="ghost" className="!text-lg !px-1">
                        <FaTwitter />
                      </IconButton>
                    </NextLink>
                    {env.YOUTUBE_CHANNEL ? (
                      <NextLink
                        href={`https://www.youtube.com/channel/${env.YOUTUBE_CHANNEL}`}
                        target="_blank"
                      >
                        <IconButton variant="ghost" className="!text-lg !px-1">
                          <FaYoutube />
                        </IconButton>
                      </NextLink>
                    ) : null}
                    <NextLink
                      href={`https://www.instagram.com/${env.INSTAGRAM_USERNAME}`}
                      target="_blank"
                    >
                      <IconButton variant="ghost" className="!text-lg !px-1">
                        <FaInstagram />
                      </IconButton>
                    </NextLink>
                  </div>
                  {auth.user ? (
                    <>
                      {auth.user?.role !== "USER" && (
                        <NextLink href="/dashboard">
                          <IconButton
                            variant="ghost"
                            aria-label="Profile"
                            className="!px-1"
                          >
                            <DashboardIcon className="h-5 w-5" />
                          </IconButton>
                        </NextLink>
                      )}
                      <IconButton
                        className="!px-1"
                        variant="ghost"
                        aria-label="Log Out"
                        onClick={() => logOut()}
                      >
                        <LogoutIcon className="h-5 w-5" />
                      </IconButton>
                    </>
                  ) : (
                    <NextLink href="/auth/login">
                      <IconButton
                        className="!px-1"
                        variant="ghost"
                        aria-label="Login"
                      >
                        <LoginIcon className="h-5 w-5" />
                      </IconButton>
                    </NextLink>
                  )}
                  <div className="flex space-x-2">
                    <IconButton
                      variant="ghost"
                      aria-label="Toggle Dark Mode"
                      onClick={switchTheme}
                      className="!px-1"
                    >
                      {mounted &&
                        (resolvedTheme === "light" ? (
                          <MoonIcon className="h-5 w-5" />
                        ) : (
                          <SunIcon className="h-5 w-5" />
                        ))}
                    </IconButton>
                    <div className="md:!hidden relative">
                      <IconButton
                        onClick={onToggle}
                        variant="ghost"
                        className="!text-lg !px-1"
                      >
                        <MdSearch />
                      </IconButton>
                      {mounted && (
                        <div
                          className={`${
                            isOpen ? "!visible !opacity-100" : null
                          } opacity-0	invisible absolute border border-solid border-gray-100 top-[60px] right-0 z-[8] rounded-md p-5 bg-white transition-all w-[300px] before:absolute before:right-[16px] before:top-[-30px] before:z-[8] before:border-solid before:border-x-[8px] before:border-b-[8px] before:border-b-white before:border-x-transparent before:border-t-transparent`}
                        >
                          <form
                            className="relative rounded-md overflow-hidden"
                            onSubmit={handlerSubmit}
                            autoComplete="off"
                          >
                            <input
                              className="focus:border-primary-200 w-full rounded-full border border-gray-300 bg-white px-8 py-3 text-gray-700 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-gray-500"
                              type="search"
                              name="q"
                              ref={inputRef}
                              autoComplete="off"
                              placeholder="Search..."
                              required
                            />
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
      </>
    )
  },
)
