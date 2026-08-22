"use client";

import { useState } from "react";
import { Building2, Plus, Wallet, Hash, Edit2, Check, X } from "lucide-react";
import { createAccount, updateAccount } from "./actions";

type Account = {
  id: string;
  title: string;
  accountType: string;
  gasCode: string | null;
  requiresReference: boolean;
  requiresConsignee: boolean;
  active: boolean;
};

export default function AccountsClient({ initialAccounts }: { initialAccounts: Account[] }) {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Chart of Accounts</h1>
        <p className="text-slate-600 mt-2">Manage your financial buckets, assets, and liabilities.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Premium Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-none shadow-sm border border-slate-200 overflow-hidden sticky top-24">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">Add New Account</h2>
            </div>
            
            <form action={createAccount as any} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm text-slate-900 font-bold">Account Title</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-slate-600" />
                  </div>
                  <input 
                    type="text" 
                    name="title" 
                    required 
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm text-slate-900 bg-slate-50 focus:bg-white" 
                    placeholder="e.g. Main Bank Account"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm text-slate-900 font-bold">Category Type</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Wallet className="h-5 w-5 text-slate-600" />
                  </div>
                  <select 
                    name="accountType" 
                    required
                    className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm text-slate-900 bg-slate-50 focus:bg-white appearance-none"
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
                <label className="text-sm text-slate-900 font-bold">GAS Code <span className="text-slate-500 font-normal">(Optional)</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Hash className="h-4 w-4 text-slate-600" />
                  </div>
                  <input 
                    type="text" 
                    name="gasCode" 
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-sm text-slate-900 bg-slate-50 focus:bg-white" 
                    placeholder="Greek Accounting Std"
                  />
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="requiresReference" className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-600" />
                  <span className="text-sm font-bold text-slate-700">Requires Reference</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="requiresConsignee" className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-600" />
                  <span className="text-sm font-bold text-slate-700">Requires Consignee</span>
                </label>
                <p className="text-xs text-slate-500 mt-1">If enabled, journal entries using this account will require these fields on their specific line.</p>
              </div>

              <button 
                type="submit" 
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors mt-2 text-sm shadow-sm"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: List */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold tracking-wider text-slate-700">
                <tr>
                  <th className="px-6 py-4">Account</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">GAS Code</th>
                  <th className="px-6 py-4 text-center">Toggles</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {accounts.map((account) => (
                  <tr key={account.id} className="hover:bg-slate-50 transition-colors group">
                    {editingId === account.id ? (
                      <td colSpan={5} className="p-0">
                        <form action={updateAccount as any} className="p-4 bg-indigo-50 border-l-2 border-indigo-600 flex items-center gap-4">
                          <input type="hidden" name="id" value={account.id} />
                          <input type="text" name="title" defaultValue={account.title} className="flex-1 px-2 py-1.5 border border-slate-300 text-slate-900" />
                          <select name="accountType" defaultValue={account.accountType} className="w-32 px-2 py-1.5 border border-slate-300 text-slate-900 bg-white">
                            <option value="ASSETS">Assets</option>
                            <option value="EQUITY">Equity</option>
                            <option value="LIABILITIES">Liabilities</option>
                            <option value="EXPENSES">Expenses</option>
                            <option value="REVENUES">Revenues</option>
                            <option value="RESULT">Result</option>
                          </select>
                          <input type="text" name="gasCode" defaultValue={account.gasCode || ""} className="w-24 px-2 py-1.5 border border-slate-300 text-slate-900" placeholder="GAS" />
                          
                          <div className="flex flex-col gap-1">
                            <label className="flex items-center gap-1 text-xs font-bold text-slate-900"><input type="checkbox" name="requiresReference" defaultChecked={account.requiresReference} /> Ref</label>
                            <label className="flex items-center gap-1 text-xs font-bold text-slate-900"><input type="checkbox" name="requiresConsignee" defaultChecked={account.requiresConsignee} /> Consignee</label>
                          </div>

                          <div className="flex gap-2 ml-auto">
                            <button type="submit" className="p-2 bg-indigo-600 text-white hover:bg-indigo-700"><Check className="w-4 h-4"/></button>
                            <button type="button" onClick={() => setEditingId(null)} className="p-2 bg-slate-200 text-slate-700 hover:bg-slate-300"><X className="w-4 h-4"/></button>
                          </div>
                        </form>
                      </td>
                    ) : (
                      <>
                        <td className="px-6 py-4 font-bold text-slate-900">{account.title}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
                            {account.accountType}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-500">{account.gasCode || "-"}</td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex gap-2 justify-center">
                            {account.requiresReference && <span className="px-2 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold uppercase rounded">Ref</span>}
                            {account.requiresConsignee && <span className="px-2 py-1 bg-blue-100 text-blue-800 text-[10px] font-bold uppercase rounded">Consignee</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => setEditingId(account.id)} className="text-slate-400 hover:text-indigo-600 transition-colors p-2">
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                {accounts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      No accounts found. Create one to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
