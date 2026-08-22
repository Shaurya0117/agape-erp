export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { createRemittance } from "./actions";

export default async function RemittancesPage() {
  const projects = await prisma.project.findMany({
    orderBy: { title: 'asc' }
  });

  const remittances = await prisma.remittance.findMany({
    include: {
      project: true
    }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Remittances (Transfers)</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-6 rounded-none shadow-sm border border-gray-200 h-fit">
          <h2 className="text-xl font-semibold mb-4">Log Remittance</h2>
          <form action={createRemittance as any} className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title / Description</label>
              <input 
                type="text" 
                name="title" 
                className="w-full px-3 py-2 border border-gray-300 rounded-none shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                placeholder="e.g. Wire Transfer to Region A"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (€) *</label>
              <input 
                type="number" 
                step="0.01"
                name="amount" 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-none shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link to Project (Optional)</label>
              <select 
                name="projectId" 
                className="w-full px-3 py-2 border border-gray-300 rounded-none shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">None</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 text-slate-900 py-2 px-4 rounded hover:bg-blue-700 transition duration-150 font-medium"
            >
              Log Transfer
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-none shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {remittances.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-sm text-gray-500">
                      No remittances logged.
                    </td>
                  </tr>
                ) : (
                  remittances.map((remittance) => (
                    <tr key={remittance.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {remittance.title || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {remittance.project ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {remittance.project.title}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                        €{remittance.amount.toFixed(2)}
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
  );
}




