import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const donations = await prisma.donation.findMany({
    include: {
      contributor: true
    },
    orderBy: { createdAt: 'desc' }
  })

  let csvContent = "ID,Payment_Date,Contributor_Name,Tax_ID,Note,Amount\n"

  donations.forEach(donation => {
    const dateStr = donation.paymentDate ? new Date(donation.paymentDate).toISOString().split('T')[0] : ""
    
    csvContent += `"${donation.id}","${dateStr}","${donation.contributor.fullName}","${donation.contributor.taxId || ""}","${donation.title || ""}",${donation.amount}\n`
  })

  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=donations_export.csv",
    }
  })
}
