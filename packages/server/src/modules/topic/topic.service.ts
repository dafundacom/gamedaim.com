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
      meta_title: true,
      meta_description: true,
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
  return await db.topic.findUnique({
    where: { id: topicId },
    select: {
      description: true,
      title: true,
      meta_title: true,
      meta_description: true,
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

export async function findTopicBySlug(topicSlug: string) {
  return await db.topic.findUnique({
    where: { slug: topicSlug },
    select: {
      description: true,
      title: true,
      meta_title: true,
      meta_description: true,
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

export async function updateTopic(
  topicId: string,
  data: CreateTopicInput & {
    slug: string
    featuredImageId?: string
  },
) {
  return await db.topic.update({
    where: { id: topicId },
    data,
  })
}

export async function deleteTopicById(topicId: string) {
  return db.topic.delete({
    where: {
      id: topicId,
    },
  })
}

export async function getTotalTopics() {
  return await db.topic.count()
}
