import db from "../../utils/db"
import { CreateTopicInput } from "./topic.schema"

export async function createTopic(
  data: CreateTopicInput & {
    slug: string
    authorId: string
    featuredImageId?: string
  },
) {
  return db.topic.create({
    // @ts-ignore FIX: validation error
    data,
  })
}

export function getTopics(topicPage: number, perPage: number) {
  return db.topic.findMany({
    orderBy: {
      createdAt: "desc",
    },
    skip: (topicPage - 1) * perPage,
    take: perPage,
    select: {
      description: true,
      title: true,
      slug: true,
      id: true,
      createdAt: true,
      updatedAt: true,
      featuredImage: {
        select: {
          url: true,
          alt: true,
        },
      },
      author: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  })
}

export async function findTopicById(topicId: string) {
  const topic = await db.topic.findUnique({
    where: { id: topicId },
    select: {
      description: true,
      title: true,
      slug: true,
      id: true,
      createdAt: true,
      updatedAt: true,
      featuredImage: {
        select: {
          url: true,
          alt: true,
        },
      },
      author: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  })

  return topic
}

export async function findTopicBySlug(topicSlug: string) {
  const topic = await db.topic.findUnique({
    where: { slug: topicSlug },
    select: {
      description: true,
      title: true,
      slug: true,
      id: true,
      createdAt: true,
      updatedAt: true,
      featuredImage: {
        select: {
          url: true,
          alt: true,
        },
      },
      author: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  })

  return topic
}

export async function updateTopic(
  topicId: string,
  data: CreateTopicInput & {
    slug: string
    featuredImageId?: string
  },
) {
  const updatedTopic = await db.topic.update({
    where: { id: topicId },
    data,
  })

  return updatedTopic
}

export async function deleteTopicById(topicId: string) {
  return db.topic.delete({
    where: {
      id: topicId,
    },
  })
}

export async function getTotalTopics() {
  const topic = await db.topic.count()
  return topic
}
