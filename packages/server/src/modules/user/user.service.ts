import { hashPassword } from "../../utils/password"
import db from "../../utils/db"
import { CreateUserInput, UpdateUserInput } from "./user.schema"

export async function createUser(input: CreateUserInput) {
  const { password, ...rest } = input

  const hashedPassword = hashPassword(password)

  const user = await db.user.create({
    // @ts-ignore fix later
    data: { ...rest, password: hashedPassword },
  })

  return user
}

export async function findUserByEmail(email: string) {
  return db.user.findUnique({
    where: {
      email,
    },
  })
}

export async function findUserByUsername(username: string) {
  return db.user.findUnique({
    where: {
      username,
    },
  })
}

export async function findUserById(userId: string) {
  return db.user.findUnique({
    where: {
      id: userId,
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
  const updatedUser = await db.user.update({
    where: { id: userId },
    //@ts-ignore FIX: later
    data,
  })

  return updatedUser
}

export async function deleteUserById(userId: string) {
  return db.user.delete({
    where: {
      id: userId,
    },
  })
}
