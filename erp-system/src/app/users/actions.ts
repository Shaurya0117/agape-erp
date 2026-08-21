"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleUserPermission(userId: string, field: string, value: boolean) {
  const allowedFields = ['isSuperAdmin', 'canManageFinancials', 'canManageProjects', 'canManageLogistics', 'canManageUsers'];
  
  if (!allowedFields.includes(field)) {
    throw new Error("Invalid permission field");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { [field]: value }
  });

  revalidatePath("/users");
}
