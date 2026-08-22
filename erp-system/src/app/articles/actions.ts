"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createArticle(payload: {
  description: string;
  date: string;
  debits: { accountId: string; amount: number; reference?: string; consignee?: string }[];
  credits: { accountId: string; amount: number; reference?: string; consignee?: string }[];
}) {
  const { description, date, debits, credits } = payload;

  if (!description || !date) throw new Error("Missing fields");

  await prisma.article.create({
    data: {
      description,
      date: new Date(date),
      debits: {
        create: debits.map(d => ({ 
          accountId: d.accountId, 
          amount: d.amount,
          reference: d.reference || null,
          consignee: d.consignee || null
        }))
      },
      credits: {
        create: credits.map(c => ({ 
          accountId: c.accountId, 
          amount: c.amount,
          reference: c.reference || null,
          consignee: c.consignee || null
        }))
      }
    }
  });

  revalidatePath("/articles");
}
