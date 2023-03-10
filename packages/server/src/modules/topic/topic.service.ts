import db from "../../utils/db"
import { CreateTopicInput } from "./topic.schema"

export async function createTopic(
  data: CreateTopicInput & {
    slug: string
    authorId: string
    featuredImageId?: string
  },
) {
  return await db.topic.create({
    // @ts-ignore FIX: validation error
    data,
  })
}

export async function getTopics(topicPage: number, perPage: number) {
  return await db.topic.findMany({
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
          id: true,
          url: true,
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
          id: true,
          url: true,
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
      id: true,
      title: true,
      description: true,
      slug: true,
      meta_title: true,
      meta_description: true,
      articles: {
        take: 10,
        select: {
          content: true,
          excerpt: true,
          title: true,
          meta_title: true,
          meta_description: true,
          slug: true,
          id: true,
          viewCount: true,
          status: true,
          featuredImage: {
            select: {
              id: true,
              url: true,
              alt: true,
            },
          },
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              profilePicture: true,
            },
          },
        },
      },
      downloads: {
        take: 10,
        select: {
          id: true,
          content: true,
          excerpt: true,
          title: true,
          meta_title: true,
          meta_description: true,
          slug: true,
          developer: true,
          operationSystem: true,
          license: true,
          officialWeb: true,
          schemaType: true,
          type: true,
          viewCount: true,
          status: true,
          featuredImage: {
            select: {
              id: true,
              url: true,
              alt: true,
            },
          },
        },
      },
      createdAt: true,
      updatedAt: true,
      featuredImage: {
        select: {
          id: true,
          url: true,
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

export async function findTopicBySlugAndGetArticles(
  topicSlug: string,
  topicPage: number,
  perPage: number,
) {
  return await db.topic.findUnique({
    where: { slug: topicSlug },
    select: {
      id: true,
      title: true,
      description: true,
      slug: true,
      meta_title: true,
      meta_description: true,
      articles: {
        skip: (topicPage - 1) * perPage,
        take: perPage,
        select: {
          content: true,
          excerpt: true,
          title: true,
          meta_title: true,
          meta_description: true,
          slug: true,
          id: true,
          viewCount: true,
          status: true,
          featuredImage: {
            select: {
              id: true,
              url: true,
              alt: true,
            },
          },
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              profilePicture: true,
            },
          },
        },
      },
      createdAt: true,
      updatedAt: true,
      featuredImage: {
        select: {
          id: true,
          url: true,
        },
      },
      author: {
        select: {
          name: true,
          id: true,
        },
      },
      _count: {
        select: {
          articles: true,
        },
      },
    },
  })
}

export async function findTopicBySlugAndGetDownloads(
  topicSlug: string,
  topicPage: number,
  perPage: number,
) {
  return await db.topic.findUnique({
    where: { slug: topicSlug },
    select: {
      id: true,
      title: true,
      description: true,
      slug: true,
      meta_title: true,
      meta_description: true,
      downloads: {
        skip: (topicPage - 1) * perPage,
        take: perPage,
        select: {
          id: true,
          content: true,
          excerpt: true,
          title: true,
          meta_title: true,
          meta_description: true,
          slug: true,
          developer: true,
          operationSystem: true,
          license: true,
          officialWeb: true,
          schemaType: true,
          type: true,
          viewCount: true,
          status: true,
          featuredImage: {
            select: {
              id: true,
              url: true,
              alt: true,
            },
          },
        },
      },
      createdAt: true,
      updatedAt: true,
      featuredImage: {
        select: {
          id: true,
          url: true,
        },
      },
      author: {
        select: {
          name: true,
          id: true,
        },
      },
      _count: {
        select: {
          downloads: true,
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

export async function searchTopics(searchTopicQuery: string) {
  return await db.topic.findMany({
    where: {
      OR: [
        { title: { contains: searchTopicQuery } },
        { description: { contains: searchTopicQuery } },
        { slug: { contains: searchTopicQuery } },
      ],
    },
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
          id: true,
          url: true,
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

export async function updateTopicViewCount(topicId: string) {
  await db.topic.update({
    where: { id: topicId },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  })
}

export async function deleteTopicById(topicId: string) {
  return await db.topic.delete({
    where: {
      id: topicId,
    },
  })
}

export async function getTotalTopics() {
  return await db.topic.count()
}
