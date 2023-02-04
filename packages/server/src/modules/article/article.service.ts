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
  // const { title, content, topicIds, slug, authorId } = data
  return db.article.create({
    // @ts-ignore FIX: validation error
    data,
  })
}

export function getArticles(articlePage: number, perPage: number) {
  return db.article.findMany({
    orderBy: {
      createdAt: "desc",
    },
    skip: (articlePage - 1) * perPage,
    take: perPage,
    select: {
      content: true,
      title: true,
      slug: true,
      id: true,
      status: true,
      featuredImage: {
        select: {
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
  const article = await db.article.findUnique({
    where: { id: artilceId },
    select: {
      content: true,
      title: true,
      slug: true,
      id: true,
      status: true,
      featuredImage: {
        select: {
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

  return article
}

export async function findArticleBySlug(artilceSlug: string) {
  const article = await db.article.findUnique({
    where: { slug: artilceSlug },
    select: {
      content: true,
      title: true,
      slug: true,
      id: true,
      status: true,
      featuredImage: {
        select: {
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

  return article
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
  const updatedTopic = await db.article.update({
    where: { id: articleId },
    data,
  })

  return updatedTopic
}

export async function deleteArticleById(articleId: string) {
  return db.article.delete({
    where: {
      id: articleId,
    },
  })
}
