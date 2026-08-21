import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("Cleaning up existing data...")
  await prisma.debit.deleteMany()
  await prisma.credit.deleteMany()
  await prisma.article.deleteMany()
  await prisma.donation.deleteMany()
  await prisma.remittance.deleteMany()
  await prisma.project.deleteMany()
  await prisma.contributor.deleteMany()
  await prisma.account.deleteMany()

  console.log("Creating Accounts...")
  const bankAccount = await prisma.account.create({
    data: { title: "Main Bank Account", accountType: "ASSETS", gasCode: "38.00" }
  })
  const cashAccount = await prisma.account.create({
    data: { title: "Petty Cash", accountType: "ASSETS", gasCode: "38.01" }
  })
  const donationRevAccount = await prisma.account.create({
    data: { title: "Donations Received", accountType: "REVENUES", gasCode: "73.00" }
  })
  const suppliesExpAccount = await prisma.account.create({
    data: { title: "Office Supplies", accountType: "EXPENSES", gasCode: "64.00" }
  })
  const grantRevAccount = await prisma.account.create({
    data: { title: "Government Grants", accountType: "REVENUES", gasCode: "74.00" }
  })

  console.log("Creating Contributors...")
  const john = await prisma.contributor.create({
    data: { fullName: "John Doe", email: "john@example.com", taxId: "123456789" }
  })
  const acme = await prisma.contributor.create({
    data: { fullName: "ACME Corp", email: "contact@acme.com", taxId: "987654321" }
  })

  console.log("Creating Projects...")
  const waterProject = await prisma.project.create({
    data: { title: "Clean Water Initiative", code: "PRJ-W1", workStage: "ACTIVE", budget: 50000 }
  })
  const schoolProject = await prisma.project.create({
    data: { title: "Athens School Rebuild", code: "PRJ-S2", workStage: "PLANNING", budget: 120000 }
  })

  console.log("Creating Donations...")
  await prisma.donation.create({
    data: { title: "Annual Gala Gift", amount: 5000, contributorId: john.id, paymentDate: new Date("2024-01-15") }
  })
  await prisma.donation.create({
    data: { title: "Corporate Match", amount: 15000, contributorId: acme.id, paymentDate: new Date("2024-02-10") }
  })

  console.log("Creating Articles (Transactions)...")
  // Transaction 1: Received 5000 from John Doe
  await prisma.article.create({
    data: {
      description: "Received donation from John Doe",
      date: new Date("2024-01-15"),
      debits: { create: { amount: 5000, accountId: bankAccount.id } }, // Money into Bank
      credits: { create: { amount: 5000, accountId: donationRevAccount.id } } // From Donations Revenue
    }
  })

  // Transaction 2: Received 15000 from ACME
  await prisma.article.create({
    data: {
      description: "Corporate Match from ACME",
      date: new Date("2024-02-10"),
      debits: { create: { amount: 15000, accountId: bankAccount.id } },
      credits: { create: { amount: 15000, accountId: donationRevAccount.id } }
    }
  })

  // Transaction 3: Received Government Grant
  await prisma.article.create({
    data: {
      description: "EU Community Grant",
      date: new Date("2024-03-01"),
      debits: { create: { amount: 30000, accountId: bankAccount.id } },
      credits: { create: { amount: 30000, accountId: grantRevAccount.id } }
    }
  })

  // Transaction 4: Bought Office Supplies
  await prisma.article.create({
    data: {
      description: "Purchased laptops and printers",
      date: new Date("2024-03-05"),
      debits: { create: { amount: 4500, accountId: suppliesExpAccount.id } }, // Expense
      credits: { create: { amount: 4500, accountId: bankAccount.id } } // Paid from Bank
    }
  })

  console.log("Creating Remittances (Project Expenditures)...")
  await prisma.remittance.create({
    data: { title: "Water pump equipment purchase", amount: 12000, projectId: waterProject.id }
  })
  await prisma.remittance.create({
    data: { title: "Engineering survey", amount: 3500, projectId: waterProject.id }
  })
  await prisma.remittance.create({
    data: { title: "Architectural blueprints", amount: 8000, projectId: schoolProject.id }
  })

  console.log("Database seeded successfully! 🎉")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
