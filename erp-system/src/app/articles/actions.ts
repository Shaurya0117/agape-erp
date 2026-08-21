"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createArticle(formData: FormData) {
  const description = formData.get("description") as string
  const dateStr = formData.get("date") as string
  const amountStr = formData.get("amount") as string
  const debitAccountId = formData.get("debitAccountId") as string
  const creditAccountId = formData.get("creditAccountId") as string

  if (!description || !dateStr || !amountStr || !debitAccountId || !creditAccountId) {
    return { error: "Missing required fields" }
  }

  const amount = parseFloat(amountStr)
  if (isNaN(amount) || amount <= 0) {
    return { error: "Invalid amount" }
  }

  try {
    // Create the article with nested debit and credit creation
    await prisma.article.create({
      data: {
        description,
        date: new Date(dateStr),
        debits: {
          create: {
            amount,
            accountId: debitAccountId
          }
        },
        credits: {
          create: {
            amount,
            accountId: creditAccountId
          }
        }
      },
    })
    
    revalidatePath("/articles")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Failed to create transaction" }
  }
}
