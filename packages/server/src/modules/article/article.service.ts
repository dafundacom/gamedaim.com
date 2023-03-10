import db from "../../utils/db"
import { CreateArticleInput } from "./article.schema"

export async function createArticle(
  data: CreateArticleInput & {
    slug: string
    authorId: string
    featuredImageId: string
    topicIds?: string[]
    topics: { connect: { id: string }[] }
  },
) {
  return await db.article.create({
    //@ts-ignore
    data,
  })
}

export async function getArticles(articlePage: number, perPage: number) {
  return await db.article.findMany({
    orderBy: {
      createdAt: "desc",
    },
    skip: (articlePage - 1) * perPage,
    take: perPage,
    select: {
      id: true,
      title: true,
      content: true,
      excerpt: true,
      meta_title: true,
      meta_description: true,
      slug: true,
      viewCount: true,
      status: true,
      featuredImage: {
        select: {
          id: true,
          url: true,
          alt: true,
        },
      },
      createdAt: true,
      updatedAt: true,
      topics: {
        select: {
          id: true,
          title: true,
          slug: true,
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
  })
}

export async function findArticleById(artilceId: string) {
  return await db.article.findUnique({
    where: { id: artilceId },
    select: {
      content: true,
      excerpt: true,
      title: true,
      meta_title: true,
      meta_description: true,
      slug: true,
      id: true,
      status: true,
      viewCount: true,
      featuredImage: {
        select: {
          id: true,
          url: true,
          alt: true,
        },
      },
      createdAt: true,
      updatedAt: true,
      topics: {
        select: {
          id: true,
          title: true,
          slug: true,
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
  })
}

export async function findArticleByAuthorId(
  authorId: string,
  articlePage: number,
  perPage: number,
) {
  return await db.article.findMany({
    where: { authorId: authorId },
    orderBy: {
      createdAt: "desc",
    },
    skip: (articlePage - 1) * perPage,
    take: perPage,
    select: {
      content: true,
      excerpt: true,
      title: true,
      meta_title: true,
      meta_description: true,
      slug: true,
      id: true,
      status: true,
      viewCount: true,
      featuredImage: {
        select: {
          id: true,
          url: true,
          alt: true,
        },
      },
      createdAt: true,
      updatedAt: true,
      topics: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
  })
}

export async function findArticleBySlug(artilceSlug: string) {
  return await db.article.findUnique({
    where: { slug: artilceSlug },
    select: {
      content: true,
      excerpt: true,
      title: true,
      meta_title: true,
      meta_description: true,
      slug: true,
      id: true,
      status: true,
      viewCount: true,
      featuredImage: {
        select: {
          id: true,
          url: true,
          alt: true,
        },
      },
      createdAt: true,
      updatedAt: true,
      topics: {
        select: {
          id: true,
          title: true,
          slug: true,
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
  })
}

export async function updateArticle(
  articleId: string,
  data: CreateArticleInput & {
    slug: string
    featuredImageId: string
    topicIds?: string[]
    topics: { connect: { id: string }[] }
  },
) {
  return await db.article.update({
    where: { id: articleId },
    data,
  })
}

export async function searchArticles(searchArticleQuery: string) {
  return await db.article.findMany({
    where: {
      OR: [
        { title: { contains: searchArticleQuery } },
        { content: { contains: searchArticleQuery } },
        { slug: { contains: searchArticleQuery } },
      ],
    },
    select: {
      content: true,
      excerpt: true,
      title: true,
      meta_title: true,
      meta_description: true,
      slug: true,
      id: true,
      status: true,
      viewCount: true,
      featuredImage: {
        select: {
          id: true,
          url: true,
          alt: true,
        },
      },
      createdAt: true,
      updatedAt: true,
      topics: {
        select: {
          id: true,
          title: true,
          slug: true,
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
  })
}

export async function updateArticleViewCount(articleId: string) {
  await db.article.update({
    where: { id: articleId },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  })
}

export async function deleteArticleById(articleId: string) {
  return await db.article.delete({
    where: {
      id: articleId,
    },
  })
}

export async function getTotalArticles() {
  return await db.article.count()
}
