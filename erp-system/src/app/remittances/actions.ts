"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createRemittance(formData: FormData) {
  const title = formData.get("title") as string
  const amountStr = formData.get("amount") as string
  const projectId = formData.get("projectId") as string

  if (!amountStr) {
    return { error: "Amount is required" }
  }

  const amount = parseFloat(amountStr)
  if (isNaN(amount) || amount <= 0) {
    return { error: "Invalid amount" }
  }

  try {
    await prisma.remittance.create({
      data: {
        title: title || null,
        amount,
        projectId: projectId || null,
      },
    })
    
    revalidatePath("/remittances")
    return { success: true }
  } catch (error) {
    return { error: "Failed to log remittance" }
  }
}
