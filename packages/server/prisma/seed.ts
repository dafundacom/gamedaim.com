import env from "../src/env"
import db from "../src/utils/db"
import { hashPassword } from "../src/utils/password"

async function main() {
  const hashedPassword = hashPassword(env.DEFAULT_ADMIN_PASSWORD)

  const admin = await db.user.upsert({
    where: { email: env.DEFAULT_ADMIN_EMAIL },
    update: {
      role: "ADMIN",
    },
    create: {
      email: env.DEFAULT_ADMIN_EMAIL,
      username: "admin",
      name: "Admin",
      role: "ADMIN",
      password: hashedPassword,
    },
  })

  const url = await db.setting.upsert({
    where: { key: "url" },
    update: {},
    create: {
      key: "url",
      value: "https://gamedaim.com",
    },
  })

  const title = await db.setting.upsert({
    where: { key: "title" },
    update: {},
    create: {
      key: "title",
      value: "Gamedaim | Everlasting Gaming Knowledge",
    },
  })

  const meta_title = await db.setting.upsert({
    where: { key: "meta_title" },
    update: {},
    create: {
      key: "meta_title",
      value: "Gamedaim | Everlasting Gaming Knowledge",
    },
  })

  const description = await db.setting.upsert({
    where: { key: "description" },
    update: {},
    create: {
      key: "description",
      value:
        "Gamedaim.com adalah Portal Berita Game Platform PC, Xbox, Playstation, Nintendo, Android, iOS, dan VR. berita Esports Terbaru",
    },
  })

  const meta_description = await db.setting.upsert({
    where: { key: "meta_description" },
    update: {},
    create: {
      key: "meta_description",
      value:
        "Gamedaim.com adalah Portal Berita Game Platform PC, Xbox, Playstation, Nintendo, Android, iOS, dan VR. berita Esports Terbaru",
    },
  })

  const facebook_username = await db.setting.upsert({
    where: { key: "facebook_username" },
    update: {},
    create: {
      key: "facebook_username",
      value: "gamedaim",
    },
  })

  const twitter_username = await db.setting.upsert({
    where: { key: "twitter_username" },
    update: {},
    create: {
      key: "twitter_username",
      value: "gamedaim",
    },
  })

  const instagram_username = await db.setting.upsert({
    where: { key: "instagram_username" },
    update: {},
    create: {
      key: "instagram_username",
      value: "gamedaim",
    },
  })

  const pinterest_username = await db.setting.upsert({
    where: { key: "pinterest_username" },
    update: {},
    create: {
      key: "pinterest_username",
      value: "gamedaim",
    },
  })

  const youtube_username = await db.setting.upsert({
    where: { key: "youtube_username" },
    update: {},
    create: {
      key: "youtube_username",
      value: "UCBWMNCeDFfyYddZDtNHH2Vw",
    },
  })

  console.log(
    admin,
    url,
    title,
    description,
    meta_title,
    meta_description,
    facebook_username,
    twitter_username,
    instagram_username,
    pinterest_username,
    youtube_username,
  )
}

main()
  .then(async () => {
    await db.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await db.$disconnect()
    process.exit(1)
  })
