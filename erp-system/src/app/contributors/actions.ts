"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createContributor(formData: FormData) {
  const fullName = formData.get("fullName") as string
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const email = formData.get("email") as string
  const taxId = formData.get("taxId") as string

  if (!fullName) return { error: "Full Name is required" }

  try {
    await prisma.contributor.create({
      data: {
        fullName,
        firstName: firstName || null,
        lastName: lastName || null,
        email: email || null,
        taxId: taxId || null,
      },
    })
    
    revalidatePath("/contributors")
    return { success: true }
  } catch (error) {
    return { error: "Failed to create contributor" }
  }
}
