export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { createBoardMinute, createFixedAsset, createRental } from "./actions";
import { Building, BookOpen, Key, Plus } from "lucide-react";

export default async function AdminPage() {
  const [minutes, assets, rentals] = await Promise.all([
    prisma.boardMinute.findMany({ orderBy: { date: 'desc' }, take: 5 }),
    prisma.fixedAsset.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.rental.findMany({ orderBy: { rentAmount: 'desc' } })
  ]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Administration</h1>
        <p className="text-slate-600 mt-2">Manage board minutes, fixed assets, and property rentals.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Board Minutes */}
        <div className="space-y-6">
          <div className="bg-white rounded-none shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">Board Minutes</h2>
            </div>
            <div className="p-4">
              <form action={createBoardMinute as any} className="space-y-3 mb-6 bg-slate-50 p-4 rounded-none border border-slate-100">
                <input type="text" name="summary" required placeholder="Decision Summary" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-none focus:ring-2 focus:ring-indigo-600" />
                <div className="flex gap-2">
                  <input type="number" name="decisionNo" placeholder="Dec. #" className="w-1/3 px-3 py-2 text-sm border border-slate-200 rounded-none focus:ring-2 focus:ring-indigo-600" />
                  <input type="number" name="topic" placeholder="Topic #" className="w-1/3 px-3 py-2 text-sm border border-slate-200 rounded-none focus:ring-2 focus:ring-indigo-600" />
                  <input type="date" name="date" required className="w-1/3 px-3 py-2 text-sm border border-slate-200 rounded-none focus:ring-2 focus:ring-indigo-600" />
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white text-sm py-2 rounded-none hover:bg-slate-700 transition font-medium">Record Minute</button>
              </form>

              <div className="space-y-3">
                {minutes.length === 0 ? (
                  <p className="text-sm text-slate-600 text-center py-4">No records found.</p>
                ) : (
                  minutes.map(m => (
                    <div key={m.id} className="p-3 border border-slate-100 rounded-none hover:bg-slate-50 transition">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-slate-900 text-sm">Dec #{m.decisionNo} / Top #{m.topic}</span>
                        <span className="text-xs text-slate-600">{new Date(m.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-slate-700 line-clamp-2">{m.summary}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Assets */}
        <div className="space-y-6">
          <div className="bg-white rounded-none shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <Building className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">Fixed Assets</h2>
            </div>
            <div className="p-4">
              <form action={createFixedAsset as any} className="flex gap-2 mb-6">
                <input type="text" name="description" required placeholder="Asset Name" className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-none focus:ring-2 focus:ring-indigo-600" />
                <input type="number" name="quantity" defaultValue={1} className="w-20 px-3 py-2 text-sm border border-slate-200 rounded-none focus:ring-2 focus:ring-indigo-600" />
                <button type="submit" className="bg-slate-900 text-white p-2 rounded-none hover:bg-slate-700 transition">
                  <Plus className="w-5 h-5" />
                </button>
              </form>

              <div className="divide-y divide-slate-100">
                {assets.length === 0 ? (
                  <p className="text-sm text-slate-600 text-center py-4">No assets found.</p>
                ) : (
                  assets.map(a => (
                    <div key={a.id} className="py-3 flex justify-between items-center group">
                      <span className="font-medium text-slate-800 text-sm">{a.description}</span>
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-bold">Qty: {a.quantity}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Rentals */}
        <div className="space-y-6">
          <div className="bg-white rounded-none shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">Property Rentals</h2>
            </div>
            <div className="p-4">
              <form action={createRental as any} className="space-y-3 mb-6 bg-slate-50 p-4 rounded-none border border-slate-100">
                <input type="text" name="title" required placeholder="Property Title" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-none focus:ring-2 focus:ring-indigo-600" />
                <input type="number" step="0.01" name="rentAmount" required placeholder="Monthly Rent (€)" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-none focus:ring-2 focus:ring-indigo-600" />
                <div className="flex gap-2">
                  <input type="date" name="startDate" className="w-1/2 px-3 py-2 text-sm border border-slate-200 rounded-none focus:ring-2 focus:ring-indigo-600 text-slate-600" title="Start Date" />
                  <input type="date" name="endDate" className="w-1/2 px-3 py-2 text-sm border border-slate-200 rounded-none focus:ring-2 focus:ring-indigo-600 text-slate-600" title="End Date" />
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white text-sm py-2 rounded-none hover:bg-slate-700 transition font-medium">Add Rental</button>
              </form>

              <div className="space-y-3">
                {rentals.length === 0 ? (
                  <p className="text-sm text-slate-600 text-center py-4">No rentals found.</p>
                ) : (
                  rentals.map(r => (
                    <div key={r.id} className="p-3 border border-slate-100 rounded-none hover:bg-slate-50 transition flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{r.title}</p>
                        <p className="text-xs text-slate-600 mt-1">
                          {r.startDate ? new Date(r.startDate).toLocaleDateString() : 'TBD'} - {r.endDate ? new Date(r.endDate).toLocaleDateString() : 'TBD'}
                        </p>
                      </div>
                      <span className="font-bold text-indigo-600">€{r.rentAmount}</span>
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




