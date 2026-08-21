import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("Restoring base accounts...")
  
  await prisma.account.createMany({
    data: [
      { title: "Main Bank Account", accountType: "ASSETS", gasCode: "38.00" },
      { title: "Petty Cash", accountType: "ASSETS", gasCode: "38.01" },
      { title: "Donations Received", accountType: "REVENUES", gasCode: "73.00" },
      { title: "Office Supplies", accountType: "EXPENSES", gasCode: "64.00" },
      { title: "Government Grants", accountType: "REVENUES", gasCode: "74.00" },
      { title: "Project Funding Reserve", accountType: "EQUITY", gasCode: "40.00" },
      { title: "Payroll / Salaries", accountType: "EXPENSES", gasCode: "60.00" },
      { title: "Accounts Payable", accountType: "LIABILITIES", gasCode: "50.00" }
    ]
  })

  console.log("Base accounts restored! The ERP is now a clean slate ready for the client.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
