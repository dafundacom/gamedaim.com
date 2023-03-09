import db from "../../utils/db"

export async function updateWpViewCount(wpPostId: string) {
  await db.wpView.upsert({
    where: { wpPostId: wpPostId },
    update: {
      viewCount: { increment: 1 },
    },
    create: {
      wpPostId: wpPostId,
      viewCount: 1,
    },
  })
}

export async function getWpViews() {
  await db.wpView.findMany({
    select: {
      wpPostId: true,
      viewCount: true,
    },
  })
}

export async function getWpView(wpPostId: string) {
  await db.wpView.findUnique({
    where: { wpPostId: wpPostId },
    select: {
      wpPostId: true,
      viewCount: true,
    },
  })
}
