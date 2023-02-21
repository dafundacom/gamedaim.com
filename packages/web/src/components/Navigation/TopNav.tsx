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
    const [values, setValues] = React.useState("")
    const handleChange = (event: {
      target: { value: React.SetStateAction<string> }
    }) => {
      // 👇 Get input value from "event"
      setValues(event.target.value)
    }
    const handlerSubmit = (e: { preventDefault: () => void }) => {
      e.preventDefault()
      //@ts-ignore
      router.push(`/search?q=${values}`)
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
          className="opacity-1 fixed top-0 left-auto z-[99] -my-0 mx-auto box-border flex h-16 w-full items-center border-none bg-white py-0 px-4 align-baseline shadow-lg shadow-md outline-none dark:bg-gray-900"
          ref={ref}
          {...rest}
        >
          <div className="mr-auto ml-auto grow pr-4 pl-4">
            <div className="relative h-full">
              <div className="-ml-4 -mr-4 flex h-full flex-row flex-nowrap items-center">
                <div id="drawer" className="mx-2">
                  <div
                    className="cursor-pointer space-y-[6px] hover:space-y-[3px]"
                    onClick={toggleSideNav}
                  >
                    <div className="h-0.5 w-5 bg-gray-600 transition-[margin] dark:bg-white"></div>
                    <div className="h-0.5 w-5 bg-gray-600 transition-[margin] dark:bg-white"></div>
                    <div className="h-0.5 w-5 bg-gray-600 transition-[margin] dark:bg-white"></div>
                  </div>
                </div>
                <div className="flex min-w-0 max-w-full flex-shrink-0 flex-grow-0 basis-auto flex-col pl-4 pr-4">
                  <div className="flex w-full flex-row flex-wrap items-center justify-start pr-0 pl-0">
                    <div className="ak-bar-item ak-header-logo flex w-full flex-row flex-wrap items-center justify-start pr-0 pl-0">
                      <Heading className="m-0 p-0 text-4xl font-bold leading-none">
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
                <div className="mx-auto hidden lg:!block lg:w-[40%] xl:!w-[50%]">
                  <form
                    className="bg-white dark:bg-gray-800"
                    onSubmit={handlerSubmit}
                    autoComplete="off"
                  >
                    <div className="relative flex min-w-full bg-white dark:bg-gray-900 lg:w-[400px]">
                      <div className="absolute top-[4px] bottom-0 left-0 flex items-center pl-3">
                        <span className="text-gray-4 h-5 w-5"></span>
                      </div>
                      <input
                        className="focus:border-primary-200 h-11 w-full rounded-full border border-gray-300 bg-white px-8 py-3 text-gray-700 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-gray-500"
                        type="search"
                        name="q"
                        onChange={handleChange}
                        autoComplete="off"
                        placeholder="Search..."
                        required
                      />
                    </div>
                  </form>
                </div>
                <div className="grow-1 ml-auto flex flex-row space-x-2">
                  <div className="hidden space-x-2 lg:block">
                    <NextLink
                      href={`https://www.facebook.com/${env.FACEBOOK_USERNAME}`}
                      target="_blank"
                    >
                      <IconButton variant="ghost" className="!px-1 !text-lg">
                        <FaFacebook />
                      </IconButton>
                    </NextLink>
                    <NextLink
                      href={`https://www.twitter.com/${env.TWITTER_USERNAME}`}
                      target="_blank"
                    >
                      <IconButton variant="ghost" className="!px-1 !text-lg">
                        <FaTwitter />
                      </IconButton>
                    </NextLink>
                    {env.YOUTUBE_CHANNEL ? (
                      <NextLink
                        href={`https://www.youtube.com/channel/${env.YOUTUBE_CHANNEL}`}
                        target="_blank"
                      >
                        <IconButton variant="ghost" className="!px-1 !text-lg">
                          <FaYoutube />
                        </IconButton>
                      </NextLink>
                    ) : null}
                    <NextLink
                      href={`https://www.instagram.com/${env.INSTAGRAM_USERNAME}`}
                      target="_blank"
                    >
                      <IconButton variant="ghost" className="!px-1 !text-lg">
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
                    <div className="relative md:!hidden">
                      <IconButton
                        onClick={onToggle}
                        variant="ghost"
                        className="!px-1 !text-lg"
                      >
                        <MdSearch />
                      </IconButton>
                      {mounted && (
                        <div
                          className={`${
                            isOpen ? "!visible !opacity-100" : null
                          } invisible	absolute top-[60px] right-0 z-[8] w-[300px] rounded-md border border-solid border-gray-100 bg-white p-5 opacity-0 transition-all before:absolute before:right-[16px] before:top-[-30px] before:z-[8] before:border-x-[8px] before:border-b-[8px] before:border-solid before:border-x-transparent before:border-b-white before:border-t-transparent`}
                        >
                          <form
                            className="relative overflow-hidden rounded-md"
                            onSubmit={handlerSubmit}
                            autoComplete="off"
                          >
                            <input
                              className="focus:border-primary-200 w-full rounded-full border border-gray-300 bg-white px-8 py-3 text-gray-700 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-gray-500"
                              type="search"
                              name="q"
                              onChange={handleChange}
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
