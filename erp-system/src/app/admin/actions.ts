"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createBoardMinute(formData: FormData) {
  const summary = formData.get("summary") as string
  const decisionNo = parseInt(formData.get("decisionNo") as string)
  const topic = parseInt(formData.get("topic") as string)
  const dateStr = formData.get("date") as string

  if (!summary || !dateStr) return { error: "Missing required fields" }

  await prisma.boardMinute.create({
    data: {
      summary,
      decisionNo: decisionNo || 1,
      topic: topic || 1,
      date: new Date(dateStr)
    }
  })
  
  revalidatePath("/admin")
}

export async function createFixedAsset(formData: FormData) {
  const description = formData.get("description") as string
  const quantity = parseInt(formData.get("quantity") as string)

  if (!description) return { error: "Missing description" }

  await prisma.fixedAsset.create({
    data: {
      description,
      quantity: quantity || 1
    }
  })
  
  revalidatePath("/admin")
}

export async function createRental(formData: FormData) {
  const title = formData.get("title") as string
  const rentAmount = parseFloat(formData.get("rentAmount") as string)
  const startDateStr = formData.get("startDate") as string
  const endDateStr = formData.get("endDate") as string

  if (!title || !rentAmount) return { error: "Missing fields" }

  await prisma.rental.create({
    data: {
      title,
      rentAmount,
      startDate: startDateStr ? new Date(startDateStr) : null,
      endDate: endDateStr ? new Date(endDateStr) : null,
    }
  })
  
  revalidatePath("/admin")
}
