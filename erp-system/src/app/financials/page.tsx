export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { FileText, Calculator, TrendingUp, Landmark } from "lucide-react";
import PdfExportButton from "@/components/PdfExportButton";

export default async function FinancialsPage() {
  const accounts = await prisma.account.findMany({
    include: {
      debits: true,
      credits: true,
    }
  });

  // Calculate Balances
  let totalAssets = 0;
  let totalLiabilities = 0;
  let totalEquity = 0;
  let totalRevenues = 0;
  let totalExpenses = 0;

  const processedAccounts = accounts.map(acc => {
    const totalDebit = acc.debits.reduce((sum, d) => sum + d.amount, 0);
    const totalCredit = acc.credits.reduce((sum, c) => sum + c.amount, 0);
    
    let balance = 0;
    if (acc.accountType === "ASSETS" || acc.accountType === "EXPENSES") {
      balance = totalDebit - totalCredit;
    } else {
      balance = totalCredit - totalDebit;
    }

    // Assign to totals
    if (acc.accountType === "ASSETS") totalAssets += balance;
    if (acc.accountType === "LIABILITIES") totalLiabilities += balance;
    if (acc.accountType === "EQUITY") totalEquity += balance;
    if (acc.accountType === "REVENUES") totalRevenues += balance;
    if (acc.accountType === "EXPENSES") totalExpenses += balance;

    return { ...acc, totalDebit, totalCredit, balance };
  });

  const netIncome = totalRevenues - totalExpenses;
  const calculatedEquity = totalEquity + netIncome; // Retained earnings

  const pdfData = processedAccounts.map(a => ({
    code: a.gasCode || 'N/A',
    title: a.title,
    type: a.accountType,
    balance: `€${a.balance.toLocaleString(undefined, {minimumFractionDigits: 2})}`
  }));

  const pdfColumns = [
    { header: 'Account Code', dataKey: 'code' },
    { header: 'Account Title', dataKey: 'title' },
    { header: 'Type', dataKey: 'type' },
    { header: 'Balance', dataKey: 'balance' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Financial Statements</h1>
          <p className="text-slate-600 mt-2">Real-time Balance Sheet and Income Statement generated from ledger entries.</p>
        </div>
        <PdfExportButton 
          title="Master Financial Statement (Trial Balance)" 
          data={pdfData} 
          columns={pdfColumns} 
          fileName="agape-erp-financials" 
        />
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-none shadow-sm border border-slate-200 flex flex-col gap-2">
          <div className="flex items-center gap-3 text-slate-600">
            <Landmark className="w-5 h-5" />
            <h2 className="text-sm font-semibold uppercase tracking-wider">Total Assets</h2>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-1">€{totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>

        <div className="bg-white p-6 rounded-none shadow-sm border border-slate-200 flex flex-col gap-2">
          <div className="flex items-center gap-3 text-slate-600">
            <Calculator className="w-5 h-5" />
            <h2 className="text-sm font-semibold uppercase tracking-wider">Liabilities</h2>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-1">€{totalLiabilities.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>

        <div className="bg-white p-6 rounded-none shadow-sm border border-slate-200 flex flex-col gap-2">
          <div className="flex items-center gap-3 text-emerald-600">
            <TrendingUp className="w-5 h-5" />
            <h2 className="text-sm font-semibold uppercase tracking-wider">Total Revenues</h2>
          </div>
          <p className="text-3xl font-bold text-emerald-600 mt-1">€{totalRevenues.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>

        <div className="bg-white p-6 rounded-none shadow-sm border border-slate-200 flex flex-col gap-2">
          <div className="flex items-center gap-3 text-red-500">
            <FileText className="w-5 h-5" />
            <h2 className="text-sm font-semibold uppercase tracking-wider">Total Expenses</h2>
          </div>
          <p className="text-3xl font-bold text-red-600 mt-1">€{totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Income Statement */}
        <div className="bg-white rounded-none shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-900">Income Statement (P&L)</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center text-slate-700">
              <span className="font-medium">Gross Revenues</span>
              <span className="font-bold">€{totalRevenues.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center text-slate-700 border-b border-slate-100 pb-4">
              <span className="font-medium">Total Expenses</span>
              <span className="font-bold text-red-600">- €{totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center text-lg">
              <span className="font-bold text-slate-900">Net Surplus / Deficit</span>
              <span className={`font-black ${netIncome >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                €{netIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Balance Sheet */}
        <div className="bg-white rounded-none shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-900">Balance Sheet</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center text-slate-700 font-medium">
              <span>Assets</span>
              <span>€{totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-slate-700">
              <span>Liabilities</span>
              <span>€{totalLiabilities.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center text-slate-700">
              <span>Owner's Equity</span>
              <span>€{totalEquity.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center text-slate-700 border-b border-slate-100 pb-4">
              <span className="text-sm italic text-slate-600">+ Retained Earnings (Net Income)</span>
              <span className="text-sm italic text-slate-600">€{netIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center text-lg pt-2">
              <span className="font-bold text-slate-900">Total L & E</span>
              <span className="font-black text-slate-900">
                €{(totalLiabilities + calculatedEquity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            
            {/* Equation Check */}
            {Math.abs(totalAssets - (totalLiabilities + calculatedEquity)) > 0.01 && (
              <div className="bg-red-50 text-red-600 p-3 rounded-none text-sm font-medium mt-4">
                Warning: Assets do not equal Liabilities + Equity. Check trial balance.
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}




