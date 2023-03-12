import NextLink from "next/link"
import NextImage from "next/image"
import { Heading, Text } from "ui"

export const ListCardStore = () => {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        <NextLink
          href="/store/topup/mobile-legends"
          className="flex w-[fit-content] flex-col overflow-hidden rounded-md shadow-md"
        >
          <NextImage
            src="/image/mobile-legends.webp"
            width={200}
            height={200}
            className="h-[156px] object-cover"
            alt="Mobile Legends"
          />
          <div className="flex max-w-[200px] flex-col items-center p-2">
            <Heading>Mobile Legends</Heading>
            <Text>4.6 | 50 Tranksaksi</Text>
          </div>
        </NextLink>
        <NextLink
          href="/store/topup/free-fire"
          className="flex w-[fit-content] flex-col overflow-hidden rounded-md shadow-md"
        >
          <NextImage
            src="/image/free-fire.webp"
            width={200}
            height={200}
            className="h-[156px] object-cover"
            alt="Free Fire"
          />
          <div className="flex max-w-[200px] flex-col items-center p-2">
            <Heading>Free Fire</Heading>
            <Text>4.6 | 50 Tranksaksi</Text>
          </div>
        </NextLink>
        <NextLink
          href="/store/topup/free-fire-max"
          className="flex w-[fit-content] flex-col overflow-hidden rounded-md shadow-md"
        >
          <NextImage
            src="/image/free-fire-max.webp"
            width={200}
            height={200}
            className="h-[156px] object-cover"
            alt="Free Fire Max"
          />
          <div className="flex max-w-[200px] flex-col items-center p-2">
            <Heading>Free Fire Max</Heading>
            <Text>4.6 | 50 Tranksaksi</Text>
          </div>
        </NextLink>
        <NextLink
          href="/store/topup/pubgm"
          className="flex w-[fit-content] flex-col overflow-hidden rounded-md shadow-md"
        >
          <NextImage
            src="/image/pubgm.webp"
            width={200}
            height={200}
            className="h-[156px] object-cover"
            alt="Pubg Mobile"
          />
          <div className="flex max-w-[200px] flex-col items-center p-2">
            <Heading>Pubg Mobile</Heading>
            <Text>4.6 | 50 Tranksaksi</Text>
          </div>
        </NextLink>
        <NextLink
          href="/store/topup/lol"
          className="flex w-[fit-content] flex-col overflow-hidden rounded-md shadow-md"
        >
          <NextImage
            src="/image/lol.webp"
            width={200}
            height={200}
            className="h-[156px] object-cover"
            alt="League of Legends: Wildrift"
          />
          <div className="flex max-w-[200px] flex-col items-center p-2">
            <Heading>League of Legends: Wildrift</Heading>
            <Text>4.6 | 50 Tranksaksi</Text>
          </div>
        </NextLink>
        <NextLink
          href="/store/topup/genshin-impact"
          className="flex w-[fit-content] flex-col overflow-hidden rounded-md shadow-md"
        >
          <NextImage
            src="/image/genshin-impact.webp"
            width={200}
            height={200}
            className="h-[156px] object-cover"
            alt="Genshin Impact"
          />
          <div className="flex max-w-[200px] flex-col items-center p-2">
            <Heading>Genshin Impact</Heading>
            <Text>4.6 | 50 Tranksaksi</Text>
          </div>
        </NextLink>
        <NextLink
          href="/store/topup/tower-of-fantasy"
          className="flex w-[fit-content] flex-col overflow-hidden rounded-md shadow-md"
        >
          <NextImage
            src="/image/tower-of-fantasy.webp"
            width={200}
            height={200}
            className="h-[156px] object-cover"
            alt="Tower Of Fantasy"
          />
          <div className="flex max-w-[200px] flex-col items-center p-2">
            <Heading>Tower Of Fantasy</Heading>
            <Text>4.6 | 50 Tranksaksi</Text>
          </div>
        </NextLink>
        <NextLink
          href="/store/topup/valorant"
          className="flex w-[fit-content] flex-col overflow-hidden rounded-md shadow-md"
        >
          <NextImage
            src="/image/valorant.webp"
            width={200}
            height={200}
            className="h-[156px] object-cover"
            alt="Valorant"
          />
          <div className="flex max-w-[200px] flex-col items-center p-2">
            <Heading>Valorant</Heading>
            <Text>4.6 | 50 Tranksaksi</Text>
          </div>
        </NextLink>
        <NextLink
          href="/store/topup/lord-mobile"
          className="flex w-[fit-content] flex-col overflow-hidden rounded-md shadow-md"
        >
          <NextImage
            src="/image/lord-mobile.webp"
            width={200}
            height={200}
            className="h-[156px] object-cover"
            alt="Lords Mobile"
          />
          <div className="flex max-w-[200px] flex-col items-center p-2">
            <Heading>Lords Mobile</Heading>
            <Text>4.6 | 50 Tranksaksi</Text>
          </div>
        </NextLink>
        <NextLink
          href="/store/topup/higg-domino"
          className="flex w-[fit-content] flex-col overflow-hidden rounded-md shadow-md"
        >
          <NextImage
            src="/image/higgs-domino.webp"
            width={200}
            height={200}
            className="h-[156px] object-cover"
            alt="Higgs Domino"
          />
          <div className="flex max-w-[200px] flex-col items-center p-2">
            <Heading>Higgs Domino</Heading>
            <Text>4.6 | 50 Tranksaksi</Text>
          </div>
        </NextLink>
      </div>
    </>
  )
}
