import { prisma } from "@/lib/prisma";
import { createContainer } from "./actions";
import { Ship, Calendar, Tag, Package, Box } from "lucide-react";

export default async function LogisticsPage() {
  const containers = await prisma.container.findMany({
    orderBy: { departureDate: 'desc' }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Logistics & Shipping</h1>
        <p className="text-slate-500 mt-2">Manage relief containers and tracking identifiers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Column */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-none shadow-sm border border-slate-200 overflow-hidden sticky top-24">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">Add Container</h2>
            </div>
            
            <form action={createContainer as any} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Container Content / Title</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Box className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="text" name="title" required className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-none focus:ring-2 focus:ring-indigo-600 sm:text-sm bg-slate-50" placeholder="e.g. Medical Supplies" />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Tracking Identifier</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="text" name="identifier" required className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-none focus:ring-2 focus:ring-indigo-600 sm:text-sm bg-slate-50" placeholder="MSCU-1234567" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Departure Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="date" name="departureDate" className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-none focus:ring-2 focus:ring-indigo-600 sm:text-sm bg-slate-50" />
                </div>
              </div>

              <button type="submit" className="w-full mt-2 bg-indigo-600 text-white py-2.5 px-4 rounded-none hover:bg-indigo-700 shadow-md font-medium">Log Container</button>
            </form>
          </div>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-none shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50/80">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Container</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Tracking ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Departure Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {containers.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-16 text-center">
                        <Ship className="w-12 h-12 mb-3 mx-auto text-slate-200" />
                        <p className="font-medium text-slate-600">No shipments found</p>
                      </td>
                    </tr>
                  ) : (
                    containers.map(c => (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{c.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className="bg-indigo-50 text-indigo-700 font-mono px-2 py-1 rounded text-sm font-bold border border-indigo-100">{c.identifier}</span></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {c.departureDate ? new Date(c.departureDate).toLocaleDateString() : 'Awaiting'}
                        </td>
                      </tr>
                    ))
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


