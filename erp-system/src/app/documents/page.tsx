export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { createVoucher, createProtocol } from "./actions";
import { FileBadge, ScrollText, Plus, Hash, Link as LinkIcon, Download, Upload } from "lucide-react";

export default async function DocumentsPage() {
  const [vouchers, protocols, articles] = await Promise.all([
    prisma.voucher.findMany({ include: { article: true }, orderBy: { createdAt: 'desc' } }),
    prisma.documentProtocol.findMany({ orderBy: { date: 'desc' } }),
    prisma.article.findMany({ orderBy: { date: 'desc' } })
  ]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Document Management</h1>
        <p className="text-slate-500 mt-2">Manage official protocols and accounting vouchers (receipts).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Vouchers Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-none shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileBadge className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900">Financial Vouchers</h2>
              </div>
            </div>
            <div className="p-4">
              <form action={createVoucher as any} className="space-y-3 mb-6 bg-slate-50 p-4 rounded-none border border-slate-100">
                <input type="text" name="title" required placeholder="Voucher Description" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-none focus:ring-2 focus:ring-indigo-600" />
                <div className="flex gap-2">
                  <div className="relative w-1/2">
                    <Hash className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input type="text" name="identifier" required placeholder="VCH-1234" className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-none focus:ring-2 focus:ring-indigo-600" />
                  </div>
                  <div className="relative w-1/2">
                    <LinkIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <select name="articleId" className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-none focus:ring-2 focus:ring-indigo-600 bg-white">
                      <option value="">Attach to Transaction (Optional)</option>
                      {articles.map(a => (
                        <option key={a.id} value={a.id}>{new Date(a.date).toLocaleDateString()} - {a.description}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full bg-slate-800 text-white text-sm py-2 rounded-none hover:bg-slate-700 transition font-medium">Log Voucher</button>
              </form>

              <div className="space-y-3">
                {vouchers.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">No vouchers recorded.</p>
                ) : (
                  vouchers.map(v => (
                    <div key={v.id} className="p-3 border border-slate-100 rounded-none hover:bg-slate-50 transition">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-slate-900 text-sm">{v.title}</span>
                        <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-mono font-bold">{v.identifier}</span>
                      </div>
                      {v.article ? (
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-2">
                          <LinkIcon className="w-3 h-3 text-emerald-500" /> Attached: {v.article.description}
                        </p>
                      ) : (
                        <p className="text-xs text-slate-400 mt-2">Unattached</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Document Protocols */}
        <div className="space-y-6">
          <div className="bg-white rounded-none shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <ScrollText className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">Official Protocols</h2>
            </div>
            <div className="p-4">
              <form action={createProtocol as any} className="flex gap-2 mb-6 bg-slate-50 p-4 rounded-none border border-slate-100">
                <select name="direction" className="px-3 py-2 text-sm border border-slate-200 rounded-none focus:ring-2 focus:ring-indigo-600 bg-white">
                  <option value="INCOMING">Incoming</option>
                  <option value="OUTGOING">Outgoing</option>
                </select>
                <input type="text" name="title" required placeholder="Letter Subject" className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-none focus:ring-2 focus:ring-indigo-600" />
                <input type="date" name="date" required className="w-32 px-3 py-2 text-sm border border-slate-200 rounded-none focus:ring-2 focus:ring-indigo-600" />
                <button type="submit" className="bg-slate-800 text-white p-2 rounded-none hover:bg-slate-700 transition">
                  <Plus className="w-5 h-5" />
                </button>
              </form>

              <div className="divide-y divide-slate-100 border border-slate-100 rounded-none">
                {protocols.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">No protocols found.</p>
                ) : (
                  protocols.map(p => (
                    <div key={p.id} className="p-3 flex justify-between items-center group hover:bg-slate-50 transition">
                      <div className="flex items-center gap-3">
                        {p.direction === 'INCOMING' ? (
                          <div className="bg-blue-50 text-blue-600 p-1.5 rounded-none"><Download className="w-4 h-4" /></div>
                        ) : (
                          <div className="bg-orange-50 text-orange-600 p-1.5 rounded-none"><Upload className="w-4 h-4" /></div>
                        )}
                        <div>
                          <p className="font-medium text-slate-800 text-sm">{p.title}</p>
                          <p className="text-xs text-slate-400">{new Date(p.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}



