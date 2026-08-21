"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createBaptism(formData: FormData) {
  const title = formData.get("title") as string
  const godchildName = formData.get("godchildName") as string
  const registrationDate = formData.get("registrationDate") as string

  if (!title || !godchildName || !registrationDate) {
    return { error: "Missing required fields" }
  }

  try {
    await prisma.baptism.create({
      data: {
        title,
        godchildName,
        registrationDate: new Date(registrationDate),
      },
    })
    
    revalidatePath("/baptisms")
    return { success: true }
  } catch (error) {
    return { error: "Failed to create baptism record" }
  }
}
