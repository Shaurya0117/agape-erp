"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createAccount(formData: FormData) {
  const title = formData.get("title") as string
  const accountType = formData.get("accountType") as string
  const gasCode = formData.get("gasCode") as string

  if (!title || !accountType) return { error: "Missing required fields" }

  try {
    await prisma.account.create({
      data: {
        title,
        accountType,
        gasCode: gasCode || null,
      },
    })
    
    revalidatePath("/accounts")
    return { success: true }
  } catch (error) {
    return { error: "Failed to create account" }
  }
}

export async function deleteAccount(formData: FormData) {
  const id = formData.get("id") as string
  if (!id) return { error: "ID is required" }

  try {
    await prisma.account.delete({
      where: { id }
    })
    revalidatePath("/accounts")
    return { success: true }
  } catch (error) {
    return { error: "Failed to delete account" }
  }
}
