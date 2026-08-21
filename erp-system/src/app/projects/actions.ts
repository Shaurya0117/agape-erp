"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createProject(formData: FormData) {
  const title = formData.get("title") as string
  const code = formData.get("code") as string
  const workStage = formData.get("workStage") as string
  const startDateStr = formData.get("startDate") as string
  const budgetStr = formData.get("budget") as string

  if (!title) return { error: "Project title is required" }

  const budget = budgetStr ? parseFloat(budgetStr) : null

  try {
    await prisma.project.create({
      data: {
        title,
        code: code || null,
        workStage: workStage || null,
        startDate: startDateStr ? new Date(startDateStr) : null,
        budget,
      },
    })
    
    revalidatePath("/projects")
    return { success: true }
  } catch (error) {
    return { error: "Failed to create project" }
  }
}
