import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("Wiping all transactional dummy data...")
  
  // Wipe all transactions and money movements
  await prisma.debit.deleteMany()
  await prisma.credit.deleteMany()
  await prisma.article.deleteMany()
  await prisma.donation.deleteMany()
  await prisma.remittance.deleteMany()

  // Optional: Wipe base entities too if you want it COMPLETELY empty
  await prisma.project.deleteMany()
  await prisma.contributor.deleteMany()
  await prisma.account.deleteMany()
  
  // Also wipe the admin module dummy data if any
  await prisma.minute.deleteMany()
  await prisma.asset.deleteMany()
  await prisma.rental.deleteMany()
  await prisma.container.deleteMany()
  await prisma.voucher.deleteMany()
  await prisma.baptism.deleteMany()

  console.log("Database is now completely empty! 🎉")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
