export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { createDonation } from "./actions";

export default async function DonationsPage() {
  const contributors = await prisma.contributor.findMany({
    orderBy: { fullName: 'asc' }
  });

  const donations = await prisma.donation.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      contributor: true
    }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Donations Tracker</h1>
        <a 
          href="/api/export/donations" 
          className="bg-slate-900 text-white px-4 py-2 rounded shadow hover:bg-slate-700 transition"
        >
          Export to CSV
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-none shadow-sm border border-gray-200 h-fit">
          <h2 className="text-xl font-semibold mb-4">Record Donation</h2>
          <form action={createDonation as any} className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-slate-900 font-bold mb-1">Contributor / Donor *</label>
              <select 
                name="contributorId" 
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-none shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-slate-900"
              >
                <option value="">Select a donor...</option>
                {contributors.map(c => (
                  <option key={c.id} value={c.id}>{c.fullName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 font-bold mb-1">Amount (€) *</label>
              <input 
                type="number" 
                step="0.01"
                name="amount" 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-none shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-slate-900" 
                placeholder="100.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 font-bold mb-1">Title / Note (Optional)</label>
              <input 
                type="text" 
                name="title" 
                className="w-full px-3 py-2 border border-gray-300 rounded-none shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-slate-900" 
                placeholder="e.g. Annual Gala Gift"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 font-bold mb-1">Date Received</label>
              <input 
                type="date" 
                name="paymentDate" 
                className="w-full px-3 py-2 border border-gray-300 rounded-none shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-slate-900" 
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-green-600 text-slate-900 py-2 px-4 rounded hover:bg-green-700 transition duration-150 font-medium"
            >
              Save Donation
            </button>
          </form>
        </div>

        {/* Right Column: List */}
        <div className="lg:col-span-2 bg-white rounded-none shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {donations.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                      No donations recorded yet.
                    </td>
                  </tr>
                ) : (
                  donations.map((donation) => (
                    <tr key={donation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {donation.paymentDate ? new Date(donation.paymentDate).toLocaleDateString() : new Date(donation.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {donation.contributor.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {donation.title || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600 text-right">
                        €{donation.amount.toFixed(2)}
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






