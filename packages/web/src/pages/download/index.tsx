import * as React from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { NextSeo } from "next-seo"
import env from "@/env"
import NextLink from "next/link"
import { ListDownload } from "@/components/Download/List/ListDownload"
import { Button, ChevronDownIcon, Heading } from "@/../../ui"
const HomeLayout = dynamic(() =>
  import("@/layouts/Home").then((mod) => mod.HomeLayout),
)

export default function Download() {
  const router = useRouter()
  const listGames = [
    {
      judul: "Red Dead Redemption 2",
      gambar:
        "https://gamedaim.com/wp-content/uploads/2019/06/The-Witcher-3-Wild-Hunt.jpg",
      ukuran: "150 GB",
      genre: "Open-world action-adventure",
      sistemOperasi: ["Windows", "Xbox One", "PlayStation 4"],
    },

    {
      judul: "The Legend of Zelda: Breath of the Wild",
      gambar:
        "https://gamedaim.com/wp-content/uploads/2021/12/Half-Life-Alyx.jpg",
      ukuran: "14 GB",
      genre: "Action-adventure",
      sistemOperasi: [
        "Windows",
        "macOS",
        "Linux",
        "Android",
        "iOS",
        "Xbox One",
        "PlayStation 4",
        "Nintendo Switch",
        "Wii U",
      ],
    },

    {
      judul: "Grand Theft Auto V",
      gambar:
        "https://gamedaim.com/wp-content/uploads/2021/12/It-Takes-Two-800x450.jpg",
      ukuran: "72 GB",
      genre: "Open-world action-adventure",
      sistemOperasi: [
        "Windows",
        "macOS",
        "Linux",
        "Android",
        "iOS",
        "Xbox One",
        "PlayStation 4",
        "Nintendo Switch",
        "Wii U",
      ],
    },

    {
      judul: "Super Mario Odyssey",
      gambar:
        "https://gamedaim.com/wp-content/uploads/2021/12/Devil-May-Cry-5-800x450.jpg",
      ukuran: "5 GB",
      genre: "Platformer",
      sistemOperasi: [
        "Windows",
        "macOS",
        "Linux",
        "Android",
        "iOS",
        "Xbox One",
        "PlayStation 4",
        "Nintendo Switch",
        "Wii U",
      ],
    },

    {
      judul: "Minecraft",
      gambar:
        "https://gamedaim.com/wp-content/uploads/2020/03/Resident-Evil-4.jpg",
      ukuran: "500 MB",
      genre: "Sandbox, survival",
      sistemOperasi: ["PlayStation 4", "Nintendo Switch", "Wii U"],
    },

    {
      judul: "The Witcher 3: Wild Hunt",
      gambar:
        "https://gamedaim.com/wp-content/uploads/2019/06/The-Witcher-3-Wild-Hunt.jpg",
      ukuran: "40 GB",
      genre: "Action RPG",
      sistemOperasi: ["Xbox One", "PlayStation 4", "Nintendo Switch", "Wii U"],
    },

    {
      judul: "Overwatch",
      gambar:
        "https://gamedaim.com/wp-content/uploads/2021/12/Horizon-Zero-Dawn.jpeg",
      ukuran: "15 GB",
      genre: "Hero shooter",
      sistemOperasi: [
        "Android",
        "iOS",
        "Xbox One",
        "PlayStation 4",
        "Nintendo Switch",
        "Wii U",
      ],
    },

    {
      judul: "Fortnite",
      gambar:
        "https://gamedaim.com/wp-content/uploads/2021/12/Horizon-Zero-Dawn.jpeg",
      ukuran: "30 GB",
      genre: "Battle Royale",
      sistemOperasi: ["Nintendo Switch", "Wii U"],
    },

    {
      judul: "League of Legends",
      gambar:
        "https://gamedaim.com/wp-content/uploads/2021/12/Horizon-Zero-Dawn.jpeg",
      ukuran: "10 GB",
      genre: "MOBA",
      sistemOperasi: ["PlayStation 4", "Nintendo Switch", "Wii U"],
    },

    {
      judul: "Among Us",
      gambar:
        "https://gamedaim.com/wp-content/uploads/2021/12/Horizon-Zero-Dawn.jpeg",
      ukuran: "200 MB",
      genre: "Social deduction",
      sistemOperasi: [
        "Android",
        "iOS",
        "Xbox One",
        "PlayStation 4",
        "Nintendo Switch",
        "Wii U",
      ],
    },
  ]
  const daftarGames = [
    {
      judul: "Red Dead Redemption 2",
      link: "https://example.com/red-dead-redemption-2",
    },
    {
      judul: "The Legend of Zelda: Breath of the Wild",
      link: "https://example.com/breath-of-the-wild",
    },
    { judul: "Grand Theft Auto V", link: "https://example.com/gta-v" },
    {
      judul: "Super Mario Odyssey",
      link: "https://example.com/super-mario-odyssey",
    },
    { judul: "Minecraft", link: "https://example.com/minecraft" },
    {
      judul: "The Witcher 3: Wild Hunt",
      link: "https://example.com/witcher-3",
    },
    { judul: "Overwatch", link: "https://example.com/overwatch" },
    { judul: "Fortnite", link: "https://example.com/fortnite" },
    {
      judul: "League of Legends",
      link: "https://example.com/league-of-legends",
    },
    { judul: "Among Us", link: "https://example.com/among-us" },
  ]
  const [isOpen, setIsOpen] = React.useState(false)

  function toggleDropdown() {
    setIsOpen(!isOpen)
  }
  return (
    <>
      <NextSeo
        title={`${env.SITE_TITLE} | Everlasting Gaming Knowledge`}
        description={env.DESCRIPTION}
        canonical={`https/${env.DOMAIN}${router.pathname}`}
        openGraph={{
          url: `https/${env.DOMAIN}${router.pathname}`,
          title: `${env.SITE_TITLE} | Everlasting Gaming Knowledge`,
          description: env.DESCRIPTION,
        }}
      />
      <HomeLayout>
        <div className="mx-auto flex w-full flex-col min-[992px]:max-[1199px]:max-w-[970px] max-[991px]:px-4 md:max-[991px]:max-w-[750px] min-[1200px]:max-w-[1170px]">
          <div>
            <div className="relative">
              <Button
                className="focus:shadow-outline rounded bg-gray-500 py-2 px-4 font-medium text-white focus:outline-none"
                onClick={toggleDropdown}
              >
                <span className="mr-2">Category</span>
                <ChevronDownIcon className="h-6 w-6" />
              </Button>
              {isOpen && (
                <div className="absolute z-10 mt-1 rounded bg-white shadow-lg">
                  {daftarGames.map((game, index) => (
                    <a
                      key={index}
                      href={game.link}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-gray-900"
                    >
                      {game.judul}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="w-full px-4">
            <div className={"my-2 flex flex-row justify-between"}>
              <Heading as="h2" size="2xl" bold>
                Games
              </Heading>
              <NextLink href="/game/" className="text-[#00695C]">
                See more
              </NextLink>
            </div>
            <ListDownload listDownloads={listGames} />
          </div>
          <div className="w-full px-4">
            <div className={"my-2 flex flex-row justify-between"}>
              <Heading as="h2" size="2xl" bold>
                Apps
              </Heading>
              <NextLink href="/game/" className="text-[#00695C]">
                See more
              </NextLink>
            </div>
            <ListDownload listDownloads={listGames} />
          </div>
        </div>
      </HomeLayout>
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 60,
  }
}
