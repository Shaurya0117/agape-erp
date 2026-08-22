"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createAccount(formData: FormData) {
  const title = formData.get("title") as string
  const accountType = formData.get("accountType") as string
  const gasCode = formData.get("gasCode") as string
  const requiresReference = formData.get("requiresReference") === "on"
  const requiresConsignee = formData.get("requiresConsignee") === "on"

  if (!title || !accountType) return { error: "Missing required fields" }

  try {
    await prisma.account.create({
      data: {
        title,
        accountType,
        gasCode: gasCode || null,
        requiresReference,
        requiresConsignee
      },
    })
    
    revalidatePath("/accounts")
    return { success: true }
  } catch (error) {
    return { error: "Failed to create account" }
  }
}

export async function updateAccount(formData: FormData) {
  const id = formData.get("id") as string
  const title = formData.get("title") as string
  const accountType = formData.get("accountType") as string
  const gasCode = formData.get("gasCode") as string
  const requiresReference = formData.get("requiresReference") === "on"
  const requiresConsignee = formData.get("requiresConsignee") === "on"

  if (!id || !title || !accountType) return { error: "Missing required fields" }

  try {
    await prisma.account.update({
      where: { id },
      data: {
        title,
        accountType,
        gasCode: gasCode || null,
        requiresReference,
        requiresConsignee
      },
    })
    
    revalidatePath("/accounts")
    return { success: true }
  } catch (error) {
    return { error: "Failed to update account" }
  }
}
