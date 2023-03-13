import { Button } from "ui"
import { MdArrowBack, MdArrowForward } from "react-icons/md"

export const BannerStore = (props: { content: any }) => {
  const { content } = props
  const arrowClass =
    "justify-center content-center !bg-[#F39C12] hover:!bg-slate-800 hover:!text-white !p-2 cursor-pointer !border-none !ring-0 !absolute !rounded-full !top-[48%]"

  return (
    <>
      <div className="flex h-full items-center justify-center">
        <div className="relative m-4 h-[400px] w-full overflow-hidden rounded-md">
          <Button
            id="prev"
            variant="outline"
            className={`${arrowClass} left-[5%] z-[99]`}
          >
            <MdArrowBack />
          </Button>
          <Button
            id="next"
            variant="outline"
            className={`${arrowClass} right-[5%] z-[99]`}
          >
            <MdArrowForward />
          </Button>
          <div className="scrollbarhide scrollbar relative flex snap-x snap-mandatory overflow-x-scroll scroll-smooth">
            {content.map((c: any, i: number) => {
              const arrow = i + 1

              return (
                <div
                  key={c.title}
                  id={`slides__${arrow}`}
                  className="scale-1 relative mr-0 box-border flex h-[400px] w-full flex-shrink-0 origin-[center_center] snap-center items-center justify-center bg-gray-200"
                >
                  <span className="slide__text border-none bg-none">
                    {arrow}
                  </span>

                  <Button
                    id="prev"
                    variant="outline"
                    className={`${arrowClass} left-[5%] z-[100] opacity-0`}
                  >
                    <a
                      className="h-full w-full"
                      href={`#slides__${
                        arrow === 1 ? content.length : arrow - 1
                      }`}
                      title="Prev"
                    >
                      <MdArrowBack />
                    </a>
                  </Button>

                  <Button
                    id="next"
                    variant="outline"
                    className={`${arrowClass} right-[5%] z-[100] opacity-0`}
                  >
                    <a
                      className="h-full w-full"
                      href={`#slides__${
                        arrow === content.length ? 1 : arrow + 1
                      }`}
                      title="Next"
                    >
                      <MdArrowForward />
                    </a>
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
