import db from "../src/utils/db"

async function main() {
  const url = await db.setting.upsert({
    where: { key: "url" },
    update: {},
    create: {
      key: "url",
      value: "http://localhost:3000",
    },
  })

  const title = await db.setting.upsert({
    where: { key: "title" },
    update: {},
    create: {
      key: "title",
      value: "Website Title",
    },
  })

  const meta_title = await db.setting.upsert({
    where: { key: "meta_title" },
    update: {},
    create: {
      key: "meta_title",
      value: "Website Meta Title",
    },
  })

  const description = await db.setting.upsert({
    where: { key: "description" },
    update: {},
    create: {
      key: "description",
      value: "Website Description",
    },
  })

  const meta_description = await db.setting.upsert({
    where: { key: "meta_description" },
    update: {},
    create: {
      key: "meta_description",
      value: "Website Meta Description",
    },
  })

  const facebook_username = await db.setting.upsert({
    where: { key: "facebook_username" },
    update: {},
    create: {
      key: "facebook_username",
      value: "Facebook Username",
    },
  })

  const twitter_username = await db.setting.upsert({
    where: { key: "twitter_username" },
    update: {},
    create: {
      key: "twitter_username",
      value: "Twitter Username",
    },
  })

  const instagram_username = await db.setting.upsert({
    where: { key: "instagram_username" },
    update: {},
    create: {
      key: "instagram_username",
      value: "Instagram Username",
    },
  })

  const pinterest_username = await db.setting.upsert({
    where: { key: "pinterest_username" },
    update: {},
    create: {
      key: "pinterest_username",
      value: "Pintereset Username",
    },
  })

  const youtube_username = await db.setting.upsert({
    where: { key: "youtube_username" },
    update: {},
    create: {
      key: "youtube_username",
      value: "Youtube Username",
    },
  })

  console.log(
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
