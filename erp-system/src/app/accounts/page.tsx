export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import AccountsClient from "./AccountsClient";

export default async function AccountsPage() {
  const accounts = await prisma.account.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return <AccountsClient initialAccounts={accounts} />;
}
