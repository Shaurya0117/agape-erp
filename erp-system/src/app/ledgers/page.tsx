export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import SearchInput from "@/components/SearchInput";
import { BookOpen, Calendar, Download } from "lucide-react";

export default async function LedgersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const params = await searchParams;
  const consigneeQuery = params?.q || "";

  // If no query, we show nothing or a prompt
  let debits: any[] = [];
  let credits: any[] = [];

  if (consigneeQuery.length > 2) {
    debits = await prisma.debit.findMany({
      where: { consignee: { contains: consigneeQuery, mode: 'insensitive' } },
      include: { article: true, account: true },
      orderBy: { article: { date: 'asc' } }
    });

    credits = await prisma.credit.findMany({
      where: { consignee: { contains: consigneeQuery, mode: 'insensitive' } },
      include: { article: true, account: true },
      orderBy: { article: { date: 'asc' } }
    });
  }

  // Combine and sort chronologically
  const allTransactions = [
    ...debits.map(d => ({ ...d, type: 'DEBIT', date: d.article.date, description: d.article.description })),
    ...credits.map(c => ({ ...c, type: 'CREDIT', date: c.article.date, description: c.article.description }))
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let runningBalance = 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Subledgers</h1>
          <p className="text-slate-600 mt-2 font-medium">Search for a Consignee (Client/Supplier) to view their unified ledger.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <SearchInput placeholder="Search Consignee name..." />
          <button disabled className="bg-slate-200 text-slate-400 px-4 py-2.5 font-bold flex items-center gap-2 cursor-not-allowed">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
        {consigneeQuery.length <= 2 ? (
          <div className="flex flex-col items-center justify-center h-full p-24 text-slate-500">
            <BookOpen className="w-16 h-16 text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Search for a Ledger</h3>
            <p className="font-medium">Type at least 3 characters of a Consignee name to view their transactions.</p>
          </div>
        ) : (
          <div>
            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Showing Ledger For</p>
                <h2 className="text-2xl font-bold text-indigo-700">"{consigneeQuery}"</h2>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Transactions</p>
                <p className="font-mono font-bold text-slate-900 text-xl">{allTransactions.length}</p>
              </div>
            </div>

            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-100 border-b border-slate-200 text-xs uppercase font-bold tracking-wider text-slate-700">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Article Description</th>
                  <th className="px-6 py-4">Account</th>
                  <th className="px-6 py-4">Ref</th>
                  <th className="px-6 py-4 text-right">Debit</th>
                  <th className="px-6 py-4 text-right">Credit</th>
                  <th className="px-6 py-4 text-right border-l border-slate-200 bg-slate-50">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allTransactions.map((t, i) => {
                  // If it's a debit, it increases the balance (or decreases, depending on if it's a supplier or client).
                  // For a generic ledger, we just do Debits - Credits = Balance.
                  if (t.type === 'DEBIT') runningBalance += t.amount;
                  else runningBalance -= t.amount;

                  return (
                    <tr key={`${t.type}-${t.id}`} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium">
                        {new Date(t.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {t.description}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {t.account.title}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">
                        {t.reference || "-"}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-indigo-700">
                        {t.type === 'DEBIT' ? `€${t.amount.toFixed(2)}` : ""}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-amber-700">
                        {t.type === 'CREDIT' ? `€${t.amount.toFixed(2)}` : ""}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-slate-900 border-l border-slate-100 bg-slate-50/50">
                        €{runningBalance.toFixed(2)}
                      </td>
                    </tr>
                  )
                })}
                {allTransactions.length > 0 && (
                  <tr className="bg-slate-100 border-t-2 border-slate-300">
                    <td colSpan={6} className="px-6 py-4 text-right font-bold text-slate-700 uppercase tracking-wider text-xs">
                      Ending Balance
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-slate-900 text-lg">
                      €{runningBalance.toFixed(2)}
                    </td>
                  </tr>
                )}
                {allTransactions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500 font-medium">
                      No transactions found for this consignee.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

