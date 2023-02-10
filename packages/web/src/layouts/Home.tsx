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
              "!opacity-100 md:!opacity-0 !translate-x-0 md:!-translate-x-full"
            } -translate-x-full md:translate-x-0 transition-[transform] ease-in-out delay-150 border-r border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 !z-20 fixed pt-20 top-0 overflow-x-auto h-full opacity-0 md:opacity-100 flex flex-row w-[250px] scrollbar`}
          >
            <SideNav primaryMenus={primaryMenus} />
          </div>
          <div
            onClick={onToggle}
            className={`${
              isOpen == true && "!block md:!hidden"
            } hidden bg-[linear-gradient(180deg,#000,#434343)] z-[19] opacity-80 transition-all	w-full top-0 bottom-0 fixed`}
          />
        </div>

        <div
          id="container"
          className={`flex w-full mt-20 ${
            isOpen == true && "md:!pl-[0]"
          } md:pl-[250px] transition-[padding] ease-in-out delay-150`}
        >
          {children}
        </div>
        <Footer
          className={`md:pl-[250px] transition-[padding] ease-in-out delay-150 ${
            isOpen == true && "md:!pl-[0]"
          }`}
        />
      </div>
    )
  },
)
