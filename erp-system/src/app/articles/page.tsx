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
            className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-none shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-colors font-medium flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export to CSV
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        {/* Left Column: Premium Form */}
        <div className="lg:col-span-1">
          <JournalEntryForm accounts={accounts} />
        </div>

        {/* Right Column: History List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-slate-900">Recent Articles</h2>
            <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">{articles.length} total</span>
          </div>
          
          {articles.map((article) => {
            const totalDebit = article.debits.reduce((sum, d) => sum + d.amount, 0);
            
            return (
              <div key={article.id} className="bg-white rounded-none shadow-sm border border-slate-200 overflow-hidden hover:border-indigo-300 transition-all group">
                <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-none">
                      <ReceiptText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{article.description}</h3>
                      <p className="text-xs text-slate-600 flex items-center gap-2 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {new Date(article.date).toLocaleDateString()}
                        {article.referenceNumber && <span>• Ref: {article.referenceNumber}</span>}
                        {article.vendorName && <span>• Vendor: {article.vendorName}</span>}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-slate-900 text-lg">€{totalDebit.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Balanced</p>
                  </div>
                </div>

                {/* Split Details */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white">
                  {/* Debits */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 border-b border-slate-100 pb-1">Debits</h4>
                    <div className="space-y-1">
                      {article.debits.map(d => (
                        <div key={d.id} className="flex justify-between items-center text-sm">
                          <span className="text-slate-600">{d.account.title}</span>
                          <span className="font-mono text-slate-900">€{d.amount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Credits */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 border-b border-slate-100 pb-1">Credits</h4>
                    <div className="space-y-1">
                      {article.credits.map(c => (
                        <div key={c.id} className="flex justify-between items-center text-sm">
                          <span className="text-slate-600">{c.account.title}</span>
                          <span className="font-mono text-slate-900">€{c.amount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          {articles.length === 0 && (
            <div className="text-center p-12 border-2 border-dashed border-slate-200 rounded-none bg-slate-50">
              <Banknote className="mx-auto h-10 w-10 text-slate-300 mb-3" />
              <h3 className="text-sm font-semibold text-slate-900 mb-1">No transactions found</h3>
              <p className="text-sm text-slate-600">Record a new journal entry using the form.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}



