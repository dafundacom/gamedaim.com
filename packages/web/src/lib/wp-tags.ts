import {
  QUERY_WP_ALL_TAGS,
  QUERY_WP_TAG_BY_SLUG,
  QUERY_WP_ALL_TAGS_SITEMAP,
} from "@/data/wp-tags"
import { wpFetchAPI } from "./wp-posts"
export function wpTagPathBySlug(slug: string) {
  return `/tag/${slug}`
}

export async function wpGetAllTags() {
  const data = await wpFetchAPI(QUERY_WP_ALL_TAGS)
  const tags = data?.data?.tags.edges.map(({ node = {} }) => node)
  return {
    tags,
  }
}

export async function wpGetAllTagsSiteMap() {
  const data = await wpFetchAPI(QUERY_WP_ALL_TAGS_SITEMAP)
  const tags = data?.data.tags.edges.map(({ node = {} }) => node)
  return {
    tags,
  }
}

export async function wpGetTagBySlug(slug: string) {
  let tagData

  try {
    tagData = await wpFetchAPI(QUERY_WP_TAG_BY_SLUG, {
      slug,
    })
  } catch (e) {
    console.log(`[tags][wpGetTagBySlug] Failed to query tag data: ${e}`)
    throw e
  }
  if (tagData.data.tags === null) {
    let tag: { error: string } = {
      error: "",
    }
    tag.error = "Ada yang salah"
    return { tag }
  }

  const tag = tagData?.data.tags.edges
    .map(({ node = {} }) => node)
    .map(wpMapTagData)[0]

  return {
    tag,
  }
}

export async function wpGetTags({ count } = {} as any) {
  const { tags } = await wpGetAllTags()
  return {
    tags: tags.slice(0, count),
  }
}

export function wpMapTagData(tag = {}) {
  const data = { ...tag }
  return data
}
