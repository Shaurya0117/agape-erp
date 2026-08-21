"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createContainer(formData: FormData) {
  const title = formData.get("title") as string
  const identifier = formData.get("identifier") as string
  const departureDateStr = formData.get("departureDate") as string

  if (!title || !identifier) return { error: "Missing required fields" }

  await prisma.container.create({
    data: {
      title,
      identifier,
      departureDate: departureDateStr ? new Date(departureDateStr) : null,
    }
  })
  
  revalidatePath("/logistics")
}
