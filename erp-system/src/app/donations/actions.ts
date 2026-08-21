"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createDonation(formData: FormData) {
  const contributorId = formData.get("contributorId") as string
  const amountStr = formData.get("amount") as string
  const title = formData.get("title") as string
  const dateStr = formData.get("paymentDate") as string

  if (!contributorId || !amountStr) {
    return { error: "Contributor and amount are required" }
  }

  const amount = parseFloat(amountStr)
  if (isNaN(amount) || amount <= 0) {
    return { error: "Invalid amount" }
  }

  try {
    await prisma.donation.create({
      data: {
        contributorId,
        amount,
        title: title || null,
        paymentDate: dateStr ? new Date(dateStr) : new Date(),
      },
    })
    
    revalidatePath("/donations")
    return { success: true }
  } catch (error) {
    return { error: "Failed to record donation" }
  }
}
