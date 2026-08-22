export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { Scale, CheckCircle2, AlertTriangle, Download } from "lucide-react";

export default async function TrialBalancePage() {
  // Fetch all accounts with their debits and credits
  const accounts = await prisma.account.findMany({
    include: {
      debits: true,
      credits: true
    },
    orderBy: { accountType: 'asc' } // Group by Assets, Liabilities, etc.
  });

  let totalCompanyDebits = 0;
  let totalCompanyCredits = 0;

  const trialBalanceData = accounts.map(account => {
    const sumDebits = account.debits.reduce((sum, d) => sum + d.amount, 0);
    const sumCredits = account.credits.reduce((sum, c) => sum + c.amount, 0);
    
    // Normal balances based on account type
    let netDebit = 0;
    let netCredit = 0;

    if (sumDebits > sumCredits) {
      netDebit = sumDebits - sumCredits;
      totalCompanyDebits += netDebit;
    } else if (sumCredits > sumDebits) {
      netCredit = sumCredits - sumDebits;
      totalCompanyCredits += netCredit;
    }

    return {
      ...account,
      sumDebits,
      sumCredits,
      netDebit,
      netCredit
    };
  }).filter(a => a.sumDebits > 0 || a.sumCredits > 0); // Only show active accounts

  // Round to handle floating point math errors
  totalCompanyDebits = Math.round(totalCompanyDebits * 100) / 100;
  totalCompanyCredits = Math.round(totalCompanyCredits * 100) / 100;
  const isBalanced = totalCompanyDebits === totalCompanyCredits;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Trial Balance</h1>
          <p className="text-slate-600 mt-2 font-medium">Verify the mathematical accuracy of the general ledger.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="bg-slate-900 text-white px-4 py-2.5 shadow hover:bg-slate-700 transition flex items-center gap-2 font-bold">
            <Download className="w-4 h-4" />
            Export to PDF
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
        {/* Status Header */}
        <div className={`px-6 py-6 border-b border-slate-200 flex justify-between items-center ${isBalanced ? 'bg-emerald-50' : 'bg-red-50'}`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${isBalanced ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
              <Scale className="w-8 h-8" />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${isBalanced ? 'text-emerald-900' : 'text-red-900'}`}>
                {isBalanced ? 'Books are Balanced' : 'Out of Balance'}
              </h2>
              <p className={`text-sm font-bold ${isBalanced ? 'text-emerald-700' : 'text-red-700'} flex items-center gap-1 mt-1`}>
                {isBalanced ? (
                  <><CheckCircle2 className="w-4 h-4"/> Debits equal Credits across all accounts.</>
                ) : (
                  <><AlertTriangle className="w-4 h-4"/> Critical Error: Debits do not match Credits.</>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* The Report */}
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-100 border-b border-slate-200 text-xs uppercase font-bold tracking-wider text-slate-700">
            <tr>
              <th className="px-6 py-4">Account Code</th>
              <th className="px-6 py-4">Account Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-right border-l border-slate-200">Debit Balance</th>
              <th className="px-6 py-4 text-right">Credit Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {trialBalanceData.map(account => (
              <tr key={account.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-3 font-mono text-xs text-slate-500">{account.gasCode || "-"}</td>
                <td className="px-6 py-3 font-bold text-slate-900">{account.title}</td>
                <td className="px-6 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    {account.accountType}
                  </span>
                </td>
                <td className="px-6 py-3 text-right font-mono font-bold text-indigo-700 border-l border-slate-100">
                  {account.netDebit > 0 ? `€${account.netDebit.toLocaleString(undefined, {minimumFractionDigits: 2})}` : ""}
                </td>
                <td className="px-6 py-3 text-right font-mono font-bold text-amber-700">
                  {account.netCredit > 0 ? `€${account.netCredit.toLocaleString(undefined, {minimumFractionDigits: 2})}` : ""}
                </td>
              </tr>
            ))}
            {trialBalanceData.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                  No account balances found. Post some journal entries to generate the trial balance.
                </td>
              </tr>
            )}
            
            {/* Totals Row */}
            {trialBalanceData.length > 0 && (
              <tr className="bg-slate-900 text-white">
                <td colSpan={3} className="px-6 py-4 text-right font-bold uppercase tracking-wider text-xs text-slate-300">
                  Total Balances
                </td>
                <td className="px-6 py-4 text-right font-mono font-bold text-lg">
                  €{totalCompanyDebits.toLocaleString(undefined, {minimumFractionDigits: 2})}
                </td>
                <td className="px-6 py-4 text-right font-mono font-bold text-lg">
                  €{totalCompanyCredits.toLocaleString(undefined, {minimumFractionDigits: 2})}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
