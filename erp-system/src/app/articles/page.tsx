export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { ReceiptText, Calendar, Wallet, Banknote, ArrowRight, ArrowDownRight, ArrowUpRight, Plus, Download } from "lucide-react";
import SearchInput from "@/components/SearchInput";
import JournalEntryForm from "./JournalEntryForm";

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
          <p className="text-slate-600 mt-2">Record complex double-entry articles.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <SearchInput placeholder="Search transactions..." />
          <a 
            href="/api/export/articles" 
            className="bg-slate-900 text-white px-4 py-2.5 shadow hover:bg-slate-700 transition flex items-center gap-2 font-bold"
          >
            <Download className="w-4 h-4" />
            Export to CSV
          </a>
        </div>
      </div>

      <div className="flex flex-col gap-12 pb-12">
        {/* Top: Premium Form */}
        <div className="w-full">
          <JournalEntryForm accounts={accounts} />
        </div>

        {/* Bottom: History List */}
        <div className="w-full space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Recent Articles</h2>
            <span className="text-sm font-bold text-slate-600 bg-slate-200 px-3 py-1">{articles.length} total</span>
          </div>
          
          {articles.map((article) => {
            const totalDebit = article.debits.reduce((sum, d) => sum + d.amount, 0);
            
            return (
              <div key={article.id} className="bg-white shadow-sm border border-slate-200 overflow-hidden hover:border-indigo-400 transition-all group">
                <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-100/50">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-100 text-indigo-700 rounded-sm">
                      <ReceiptText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-700 transition-colors">{article.description}</h3>
                      <p className="text-sm text-slate-600 flex items-center gap-2 mt-0.5 font-medium">
                        <Calendar className="w-4 h-4" />
                        {new Date(article.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-slate-900 text-xl">€{totalDebit.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                    <p className="text-[10px] uppercase font-bold text-indigo-700 tracking-wider">Balanced</p>
                  </div>
                </div>

                {/* Split Details */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white">
                  {/* Debits */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 border-b-2 border-indigo-100 pb-2">Debits</h4>
                    <div className="space-y-3">
                      {article.debits.map(d => (
                        <div key={d.id} className="text-sm">
                          <div className="flex justify-between items-center font-medium">
                            <span className="text-slate-800">{d.account.title}</span>
                            <span className="font-mono font-bold text-slate-900">€{d.amount.toFixed(2)}</span>
                          </div>
                          {(d.consignee || d.reference) && (
                            <div className="text-xs text-slate-500 mt-1 pl-2 border-l-2 border-slate-200">
                              {d.consignee && <span className="font-bold">C:</span>} {d.consignee} 
                              {d.consignee && d.reference && " | "}
                              {d.reference && <span className="font-bold">R:</span>} {d.reference}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Credits */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 border-b-2 border-amber-100 pb-2">Credits</h4>
                    <div className="space-y-3">
                      {article.credits.map(c => (
                        <div key={c.id} className="text-sm">
                          <div className="flex justify-between items-center font-medium">
                            <span className="text-slate-800">{c.account.title}</span>
                            <span className="font-mono font-bold text-slate-900">€{c.amount.toFixed(2)}</span>
                          </div>
                          {(c.consignee || c.reference) && (
                            <div className="text-xs text-slate-500 mt-1 pl-2 border-l-2 border-slate-200">
                              {c.consignee && <span className="font-bold">C:</span>} {c.consignee} 
                              {c.consignee && c.reference && " | "}
                              {c.reference && <span className="font-bold">R:</span>} {c.reference}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          {articles.length === 0 && (
            <div className="text-center p-12 border-2 border-dashed border-slate-200 bg-slate-50">
              <Banknote className="mx-auto h-12 w-12 text-slate-400 mb-3" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No transactions found</h3>
              <p className="text-sm font-medium text-slate-600">Record a new journal entry using the form above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
