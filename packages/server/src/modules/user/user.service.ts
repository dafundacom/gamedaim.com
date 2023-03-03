import db from "../../utils/db"
import { hashPassword } from "../../utils/password"
import { CreateUserInput, UpdateUserInput } from "./user.schema"

export async function createUser(input: CreateUserInput) {
  const { password, ...rest } = input
  const hashedPassword = hashPassword(password)

  return await db.user.create({
    // @ts-ignore fix later
    data: { ...rest, password: hashedPassword },
  })
}

export async function findUserByEmail(email: string) {
  return await db.user.findUnique({
    where: {
      email,
    },
  })
}

export async function findUserByUsername(username: string) {
  return await db.user.findUnique({
    where: {
      username,
    },
  })
}

export async function findUserById(userId: string) {
  return await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      meta_title: true,
      meta_description: true,
      phoneNumber: true,
      about: true,
      role: true,
      profilePicture: {
        select: {
          id: true,
          url: true,
        },
      },
    },
  })
}

export async function findUsers(userPage: number, perPage: number) {
  return await db.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    skip: (userPage - 1) * perPage,
    take: perPage,
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      meta_title: true,
      meta_description: true,
      role: true,
      profilePicture: {
        select: {
          id: true,
          url: true,
        },
      },
    },
  })
}

export async function updateUser(userId: string, data: UpdateUserInput) {
  return await db.user.update({
    where: { id: userId },
    data,
  })
}

export async function searchUsers(searchUserQuery: string) {
  return await db.user.findMany({
    where: {
      OR: [
        { email: { contains: searchUserQuery } },
        { name: { contains: searchUserQuery } },
        { username: { contains: searchUserQuery } },
      ],
    },
  })
}

export async function deleteUserById(userId: string) {
  return await db.user.delete({
    where: {
      id: userId,
    },
  })
}

export async function getTotalUsers() {
  return await db.user.count()
}
