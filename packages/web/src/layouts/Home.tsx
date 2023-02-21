import * as React from "react"

import { useDisclosure } from "ui"
import { TopNav, SideNav } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { wpGetPrimaryMenus } from "@/lib/wp-menus"

interface HomeLayoutProps {
  children: React.ReactNode
}

export const HomeLayout = React.forwardRef<HTMLDivElement, HomeLayoutProps>(
  (props, ref) => {
    const { isOpen, onToggle } = useDisclosure()
    const [primaryMenus, setPrimaryMenus] = React.useState<any>(null)
    React.useEffect(() => {
      async function menus() {
        const { menu } = await wpGetPrimaryMenus()
        setPrimaryMenus(menu)
      }
      menus()
    }, [])

    const { children, ...rest } = props

    return (
      <div ref={ref} {...rest}>
        <TopNav toggleSideNav={onToggle} />
        <div>
          <div
            className={`${
              isOpen == true &&
              "!translate-x-0 !opacity-100 md:!-translate-x-full md:!opacity-0"
            } scrollbar fixed top-0 !z-20 flex h-full w-[250px] -translate-x-full flex-row overflow-x-auto border-r border-gray-100 bg-white pt-20 opacity-0 transition-[transform] delay-150 ease-in-out dark:border-gray-700 dark:bg-gray-900 md:translate-x-0 md:opacity-100`}
          >
            <SideNav primaryMenus={primaryMenus} />
          </div>
          <div
            onClick={onToggle}
            className={`${
              isOpen == true && "!block md:!hidden"
            } fixed top-0 bottom-0 z-[19] hidden w-full bg-black opacity-80 transition-all`}
          />
        </div>
        <div
          id="container"
          className={`mt-20 flex w-full ${
            isOpen == true && "md:!pl-[0]"
          } transition-[padding] delay-150 ease-in-out md:pl-[250px]`}
        >
          {children}
        </div>
        <Footer
          className={`transition-[padding] delay-150 ease-in-out md:pl-[250px] ${
            isOpen == true && "md:!pl-[0]"
          }`}
        />
      </div>
    )
  },
)
