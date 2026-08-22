export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { createAccount, deleteAccount } from "./actions";
import { Building2, Plus, Wallet, Trash2, Hash } from "lucide-react";

export default async function AccountsPage() {
  const accounts = await prisma.account.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Chart of Accounts</h1>
        <p className="text-slate-500 mt-2">Manage your financial buckets, assets, and liabilities.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Premium Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-none shadow-sm border border-slate-200 overflow-hidden sticky top-24">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">Add New Account</h2>
            </div>
            
            <form action={createAccount as any} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Account Title</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-slate-500" />
                  </div>
                  <input 
                    type="text" 
                    name="title" 
                    required 
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors sm:text-sm text-slate-900 bg-slate-50 focus:bg-white" 
                    placeholder="e.g. Main Bank Account"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Category Type</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Wallet className="h-5 w-5 text-slate-500" />
                  </div>
                  <select 
                    name="accountType" 
                    required
                    className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors sm:text-sm text-slate-900 bg-slate-50 focus:bg-white appearance-none"
                  >
                    <option value="ASSETS">Assets</option>
                    <option value="EQUITY">Equity</option>
                    <option value="LIABILITIES">Liabilities</option>
                    <option value="EXPENSES">Expenses</option>
                    <option value="REVENUES">Revenues</option>
                    <option value="RESULT">Result</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">GAS Code <span className="text-slate-500 font-normal">(Optional)</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Hash className="h-4 w-4 text-slate-500" />
                  </div>
                  <input 
                    type="text" 
                    name="gasCode" 
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors sm:text-sm text-slate-900 bg-slate-50 focus:bg-white" 
                    placeholder="Greek Accounting Std"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full mt-2 bg-indigo-600 text-slate-900 py-2.5 px-4 rounded-none hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg font-medium flex justify-center items-center gap-2"
              >
                Create Account
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
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Account Info</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">GAS Code</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {accounts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-500">
                          <Building2 className="w-12 h-12 mb-3 text-slate-200" />
                          <p className="text-base font-medium text-slate-600">No accounts found</p>
                          <p className="text-sm">Create your first account using the form.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    accounts.map((account) => (
                      <tr key={account.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-none bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                              <Wallet className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-semibold text-slate-900">{account.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-none text-xs font-bold bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10 uppercase tracking-wide">
                            {account.accountType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-slate-500 font-mono bg-slate-100 px-2 py-1 rounded">
                            {account.gasCode || '---'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <form action={deleteAccount as any}>
                            <input type="hidden" name="id" value={account.id} />
                            <button type="submit" className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-none transition-colors" title="Delete Account">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </form>
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



