import {
  QUERY_WP_ALL_USERS,
  QUERY_WP_USERS_BY_ID,
  QUERY_WP_ALL_USERS_SLUG,
} from "@/data/wp-users"
import { wpFetchAPI } from "./wp-posts"

export function wpAuthorPathBySlug(slug: string) {
  return `/author/${slug}`
}

export async function wpGetUserBySlug(slug: string) {
  const { users } = await wpGetAllUsers()

  const user = users.find((user: { slug: string }) => user.slug === slug)

  return {
    user,
  }
}

export function wpAuthorPathByName(slug: string) {
  return `/author/${slug}`
}

export async function wpGetUserByNameSlug(slug: string) {
  const { users } = await wpGetAllUsers()

  const user = users.find((user: { slug: string }) => user.slug === slug)
  if (!user) {
    let user: { error: string } = {
      error: "",
    }
    user.error = "Ada yang salah"
    return { user }
  }
  return {
    user,
  }
}

export function wpUserSlugByName(slug: string) {
  return slug
}

export async function wpGetUserbyId(id: string) {
  let usersData

  try {
    usersData = await wpFetchAPI(QUERY_WP_USERS_BY_ID, {
      id,
    })
  } catch (e) {
    console.log(`[users][USERS_BY_ID] Failed to query users data: ${e}`)
    throw e
  }

  return {
    usersData,
  }
}

export async function wpGetAllUsers() {
  let usersData

  try {
    usersData = await wpFetchAPI(QUERY_WP_ALL_USERS)
  } catch (e) {
    console.log(`[users][wpGetAllUsers] Failed to query users data: ${e}`)
    throw e
  }

  let users = usersData?.data.users.edges
    .map(({ node = {} }) => node)
    .map(wpMapUserData)

  return {
    users,
  }
}

export async function wpGetAllUsersSlug() {
  let usersData

  try {
    usersData = await wpFetchAPI(QUERY_WP_ALL_USERS_SLUG)
  } catch (e) {
    console.log(`[users][wpGetAllUsersSlug] Failed to query users data: ${e}`)
    throw e
  }

  let users = usersData?.data.users.edges.map(({ node = {} }) => node)

  return {
    users,
  }
}

export async function wpGetAllAuthors() {
  const { users } = await wpGetAllUsers()

  return {
    user: users,
  }
}

export function wpMapUserData(user: {
  roles: { nodes: Record<string, any>[] }
  avatar: { url: string }
}) {
  return {
    ...user,
    roles: [...user.roles.nodes],
    avatar: user.avatar && wpUpdateUserAvatar(user.avatar),
  }
}

export function wpUpdateUserAvatar(avatar: { url: string }) {
  return {
    ...avatar,
    url: avatar.url?.replace("http://", "https://"),
  }
}
