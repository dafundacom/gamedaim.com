import { hashPassword } from "../../utils/password"
import db from "../../utils/db"
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
  return db.user.findUnique({
    where: {
      email,
    },
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
          url: true,
        },
      },
    },
  })
}

export async function findUserByUsername(username: string) {
  return db.user.findUnique({
    where: {
      username,
    },
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
          url: true,
        },
      },
    },
  })
}

export async function findUserById(userId: string) {
  return db.user.findUnique({
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
      role: true,
      profilePicture: {
        select: {
          url: true,
        },
      },
    },
  })
}

export async function findUsers(userPage: number, perPage: number) {
  return db.user.findMany({
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

export async function deleteUserById(userId: string) {
  return db.user.delete({
    where: {
      id: userId,
    },
  })
}

export async function getTotalUsers() {
  return await db.user.count()
}
