"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createItem(formData: FormData) {
  const name = formData.get("name") as string;
  const sku = formData.get("sku") as string;
  const category = formData.get("category") as string;
  const quantity = parseInt(formData.get("quantity") as string);
  const unit = formData.get("unit") as string;
  const location = formData.get("location") as string;

  if (!name || !sku) throw new Error("Name and SKU are required");

  await prisma.inventoryItem.create({
    data: { name, sku, category, quantity, unit, location }
  });

  revalidatePath("/inventory");
}

export async function adjustStock(itemId: string, newQuantity: number) {
  await prisma.inventoryItem.update({
    where: { id: itemId },
    data: { quantity: newQuantity }
  });
  revalidatePath("/inventory");
}
