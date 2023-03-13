import { fetch } from "@/lib/fetch"

export const getUsersCount = async () => {
  let usersCountData
  try {
    const { data } = await fetch.get("/user/count")
    usersCountData = data
  } catch (e) {
    console.log(`Failed to query post data: ${e}`)
    throw e
  }

  return { usersCount: usersCountData }
}

export const getUsers = async (page = 1) => {
  let usersData
  try {
    const { data } = await fetch.get(`/user/page/${page}`)
    usersData = data
  } catch (e) {
    console.log(`Failed to query post data: ${e}`)
    throw e
  }

  return { users: usersData }
}

export const getUserByUserName = async (username: string) => {
  let postData
  try {
    const { data } = await fetch.get(`/user/username/${username}`)
    postData = data
  } catch (e) {
    console.log(`Failed to query post data: ${e}`)
    throw e
  }

  return { user: postData }
}

export const getUserById = async (id: string) => {
  let postData
  try {
    const { data } = await fetch.get(`/user/${id}`)
    postData = data
  } catch (e) {
    console.log(`Failed to query post data: ${e}`)
    throw e
  }

  return { user: postData }
}
