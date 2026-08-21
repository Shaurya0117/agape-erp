import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const articles = await prisma.article.findMany({
    include: {
      debits: { include: { account: true } },
      credits: { include: { account: true } }
    },
    orderBy: { date: 'desc' }
  })

  let csvContent = "ID,Date,Description,Debit_Accounts,Credit_Accounts,Total_Amount\n"

  articles.forEach(article => {
    const totalAmount = article.debits.reduce((sum, d) => sum + d.amount, 0)
    const debitAccounts = article.debits.map(d => d.account.title).join(" | ")
    const creditAccounts = article.credits.map(c => c.account.title).join(" | ")
    
    csvContent += `"${article.id}","${new Date(article.date).toISOString().split('T')[0]}","${article.description}","${debitAccounts}","${creditAccounts}",${totalAmount}\n`
  })

  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=articles_export.csv",
    }
  })
}
