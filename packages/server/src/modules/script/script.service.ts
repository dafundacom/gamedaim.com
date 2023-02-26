import db from "../../utils/db"
import { CreateScriptInput } from "./script.schema"

export async function createScript(
  data: CreateScriptInput & {
    authorId: string
  },
) {
  return await db.script.create({
    // @ts-ignore FIX: validation error
    data,
  })
}

export async function getScripts(scriptPage: number, perPage: number) {
  return await db.script.findMany({
    orderBy: {
      createdAt: "desc",
    },
    skip: (scriptPage - 1) * perPage,
    take: perPage,
    select: {
      id: true,
      title: true,
      content: true,
      active: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  })
}

export async function findScriptById(scriptId: string) {
  return await db.script.findUnique({
    where: { id: scriptId },
    select: {
      id: true,
      title: true,
      content: true,
      active: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  })
}

export async function updateScript(scriptId: string, data: CreateScriptInput) {
  return await db.script.update({
    where: { id: scriptId },
    data,
  })
}

export async function deleteScriptById(scriptId: string) {
  return await db.script.delete({
    where: {
      id: scriptId,
    },
  })
}

export async function getTotalScripts() {
  return await db.script.count()
}
