"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createVoucher(formData: FormData) {
  const title = formData.get("title") as string
  const identifier = formData.get("identifier") as string
  const articleId = formData.get("articleId") as string

  if (!title || !identifier) return { error: "Missing required fields" }

  await prisma.voucher.create({
    data: {
      title,
      identifier,
      articleId: articleId || null,
    }
  })
  
  revalidatePath("/documents")
}

export async function createProtocol(formData: FormData) {
  const title = formData.get("title") as string
  const direction = formData.get("direction") as string
  const dateStr = formData.get("date") as string

  if (!title) return { error: "Missing required fields" }

  await prisma.documentProtocol.create({
    data: {
      title,
      direction,
      date: dateStr ? new Date(dateStr) : new Date(),
    }
  })
  
  revalidatePath("/documents")
}
