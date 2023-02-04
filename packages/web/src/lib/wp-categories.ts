import {
  QUERY_WP_ALL_CATEGORIES,
  QUERY_WP_CATEGORY_BY_SLUG,
  QUERY_WP_ALL_CATEGORIES_SITEMAP,
} from "@/data/wp-categories"
import { useQuery } from "@tanstack/react-query"
import env from "@/env"
import { wpFetchAPI } from "./wp-posts"

export function wpCategoryPathBySlug(slug: string) {
  return `/category/${slug}`
}

export async function wpGetAllCategories() {
  const data = await wpFetchAPI(QUERY_WP_ALL_CATEGORIES)
  const categories = data?.data.categories.edges.map(({ node = {} }) => node)
  return {
    categories,
  }
}

export async function wpGetAllCategoriesSiteMap() {
  const data = await wpFetchAPI(QUERY_WP_ALL_CATEGORIES_SITEMAP)
  const categories = data?.categories.edges.map(({ node = {} }) => node)
  return {
    categories,
  }
}

export async function wpGetCategoryBySlug(slug: string) {
  let categoryData
  try {
    categoryData = await wpFetchAPI(QUERY_WP_CATEGORY_BY_SLUG, {
      slug,
    })
  } catch (e) {
    console.log(
      `[categories][wpGetCategoryBySlug] Failed to query category data: ${e}`,
    )
    throw e
  }
  if (categoryData.categories === null) {
    let category: { error: string } = {
      error: "",
    }
    category.error = "Somethig went wrong"
    return { category }
  }

  const category = categoryData?.data.categories.edges
    .map(({ node = {} }) => node)
    .map(wpMapCategoryData)[0]

  if (categoryData.categories === null) {
    let category: { error: string } = {
      error: "",
    }
    category.error = "Something went wrong"
    return { category }
  }

  return {
    category,
  }
}
export const useWpGetCategoryBySlug = (slug: string) => {
  const { data, isError, isFetching } = useQuery(
    ["category", slug],
    () => wpGetCategoryBySlug(slug),
    {
      staleTime: env.STALE_FIVE_MINUTES,
      keepPreviousData: true,
    },
  )

  return {
    getCategoryBySlug: {
      data: data,
      isError,
      isFetching,
    },
  } as const
}
export async function wpGetCategories({ count }: { count: number }) {
  const { categories } = await wpGetAllCategories()
  return {
    categories: categories.slice(0, count),
  }
}

export function wpMapCategoryData(category: string[]) {
  const data = { ...category }
  return data
}

export function wpPrimaryCategorySlug(category: any[]) {
  const isPrimary = category.find(({ parent }: any) => {
    return parent === null
  })
  let primary
  if (isPrimary) {
    primary = isPrimary
    return { primary }
  } else {
    primary = category[0]
    return { primary }
  }
}
