export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { createArticle } from "./actions";
import { ReceiptText, Calendar, Wallet, Banknote, ArrowRight, ArrowDownRight, ArrowUpRight, Plus, Download } from "lucide-react";
import SearchInput from "@/components/SearchInput";

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const params = await searchParams;
  const query = params?.q || "";
  
  const accounts = await prisma.account.findMany({
    orderBy: { title: 'asc' }
  });

  const articles = await prisma.article.findMany({
    where: {
      description: {
        contains: query
      }
    },
    orderBy: { date: 'desc' },
    include: {
      debits: { include: { account: true } },
      credits: { include: { account: true } }
    }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Transactions</h1>
          <p className="text-slate-500 mt-2">Record double-entry articles (debits and credits).</p>
        </div>
        
        <div className="flex items-center gap-4">
          <SearchInput placeholder="Search transactions..." />
          <a 
            href="/api/export/articles" 
            className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-none shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-colors font-medium flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export to CSV
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Premium Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-none shadow-sm border border-slate-200 overflow-hidden sticky top-24">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">New Transaction</h2>
            </div>
            
            <form action={createArticle as any} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Description</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ReceiptText className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type="text" 
                    name="description" 
                    required 
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors sm:text-sm text-slate-900 bg-slate-50 focus:bg-white" 
                    placeholder="e.g. Purchased Office Supplies"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type="date" 
                    name="date" 
                    required 
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors sm:text-sm text-slate-900 bg-slate-50 focus:bg-white" 
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-red-600 flex items-center gap-1">
                    <ArrowDownRight className="w-4 h-4" /> Debit Account
                  </label>
                  <p className="text-xs text-slate-500 mb-1">Where the money went (e.g. Expenses)</p>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Wallet className="h-5 w-5 text-red-400" />
                    </div>
                    <select 
                      name="debitAccountId" 
                      required
                      className="block w-full pl-10 pr-10 py-2.5 border border-red-200 rounded-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-colors sm:text-sm text-slate-900 bg-red-50/30 focus:bg-white appearance-none"
                    >
                      <option value="">Select an account...</option>
                      {accounts.map(acc => (
                        <option key={acc.id} value={acc.id}>{acc.title} ({acc.accountType})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                    <ArrowUpRight className="w-4 h-4" /> Credit Account
                  </label>
                  <p className="text-xs text-slate-500 mb-1">Where money came from (e.g. Bank)</p>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Wallet className="h-5 w-5 text-emerald-400" />
                    </div>
                    <select 
                      name="creditAccountId" 
                      required
                      className="block w-full pl-10 pr-10 py-2.5 border border-emerald-200 rounded-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-colors sm:text-sm text-slate-900 bg-emerald-50/30 focus:bg-white appearance-none"
                    >
                      <option value="">Select an account...</option>
                      {accounts.map(acc => (
                        <option key={acc.id} value={acc.id}>{acc.title} ({acc.accountType})</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Total Amount (€)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Banknote className="h-5 w-5 text-slate-400" />
                    </div>
                    <input 
                      type="number" 
                      step="0.01"
                      name="amount" 
                      required 
                      className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors sm:text-sm text-slate-900 bg-slate-50 focus:bg-white font-bold" 
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full mt-2 bg-indigo-600 text-white py-2.5 px-4 rounded-none hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg font-medium flex justify-center items-center gap-2"
              >
                Record Transaction <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Premium Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-none shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50/80">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Accounts (Dr / Cr)</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {articles.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <ReceiptText className="w-12 h-12 mb-3 text-slate-200" />
                          <p className="text-base font-medium text-slate-600">No transactions recorded</p>
                          <p className="text-sm">Record your first double-entry transaction.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    articles.map((article) => {
                      const totalAmount = article.debits.reduce((sum, d) => sum + d.amount, 0);
                      
                      return (
                        <tr key={article.id} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {new Date(article.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                            {article.description}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex flex-col gap-1 text-xs">
                              <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100 w-fit">
                                Dr: {article.debits.map(d => d.account.title).join(", ")}
                              </span>
                              <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 w-fit">
                                Cr: {article.credits.map(c => c.account.title).join(", ")}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 text-right">
                            €{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



