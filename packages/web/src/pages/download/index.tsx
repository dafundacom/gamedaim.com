import * as React from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { NextSeo } from "next-seo"
import NextImage from "next/image"
import env from "@/env"
import { Heading, IconButton, Text } from "@/../../ui"
import {
  FaWindows,
  FaApple,
  FaLinux,
  FaAndroid,
  FaAppleAlt,
  FaXbox,
  FaPlaystation,
} from "react-icons/fa"
import { SiNintendoswitch } from "react-icons/si"
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
  function getIconSistemOperasi(sistemOperasi: string) {
    switch (sistemOperasi) {
      case "Windows":
        return <FaWindows />
      case "macOS":
        return <FaApple />
      case "Linux":
        return <FaLinux />
      case "Android":
        return <FaAndroid />
      case "iOS":
        return <FaAppleAlt />
      case "Xbox One":
        return <FaXbox />
      case "PlayStation 4":
        return <FaPlaystation />
      case "Nintendo Switch":
        return <SiNintendoswitch />
      default:
        return <SiNintendoswitch />
    }
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
        <div className="mx-4 space-y-5">
          {listGames.map((list) => {
            const icon = getIconSistemOperasi(list.sistemOperasi[0])
            return (
              <>
                <div className="flex flex-col shadow-lg rounded-lg overflow-hidden w-[200px]">
                  <div className="relative">
                    <NextImage
                      src={list.gambar}
                      alt={list.judul}
                      width={400}
                      height={400}
                      className="object-cover h-[185px] w-[200px] max-w-[unset]"
                    />
                    <IconButton className="!absolute !p-[1px] top-[5px] right-[5px] !rounded-full !w-[25px] bg-white !text-primary-800">
                      {icon}
                    </IconButton>
                  </div>
                  <Heading className="px-3 !text-base mt-3">
                    {list.judul}
                  </Heading>
                  <div className="flex mt-6 mb-3 justify-between px-3">
                    <Text>{list.genre}</Text>
                    <Text className="!text-[14px]">{list.ukuran}</Text>
                  </div>
                </div>
              </>
            )
          })}
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
