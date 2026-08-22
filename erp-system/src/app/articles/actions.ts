"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createArticle(payload: {
  description: string;
  date: string;
  referenceNumber?: string;
  vendorName?: string;
  debits: { accountId: string; amount: number }[];
  credits: { accountId: string; amount: number }[];
}) {
  const { description, date, referenceNumber, vendorName, debits, credits } = payload;

  if (!description || !date) throw new Error("Missing fields");

  await prisma.article.create({
    data: {
      description,
      date: new Date(date),
      referenceNumber: referenceNumber || null,
      vendorName: vendorName || null,
      debits: {
        create: debits.map(d => ({ accountId: d.accountId, amount: d.amount }))
      },
      credits: {
        create: credits.map(c => ({ accountId: c.accountId, amount: c.amount }))
      }
    }
  });

  revalidatePath("/articles");
}
