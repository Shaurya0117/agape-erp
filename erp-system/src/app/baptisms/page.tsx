import { prisma } from "@/lib/prisma";
import { createBaptism } from "./actions";

export default async function BaptismsPage() {
  const baptisms = await prisma.baptism.findMany({
    orderBy: { registrationDate: 'desc' }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Baptisms / Sponsorships</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-6 rounded-none shadow-sm border border-gray-200 h-fit">
          <h2 className="text-xl font-semibold mb-4">Record New Baptism</h2>
          <form action={createBaptism as any} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input 
                type="text" 
                name="title" 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-none shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                placeholder="e.g. 2024 Sponsorship"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Godchild Name *</label>
              <input 
                type="text" 
                name="godchildName" 
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-none shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Registration Date *</label>
              <input 
                type="date" 
                name="registrationDate" 
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-none shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-150 font-medium"
            >
              Save Record
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white rounded-none shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Godchild Name</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {baptisms.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-sm text-gray-500">
                      No baptisms recorded yet.
                    </td>
                  </tr>
                ) : (
                  baptisms.map((baptism) => (
                    <tr key={baptism.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(baptism.registrationDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {baptism.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {baptism.godchildName}
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


