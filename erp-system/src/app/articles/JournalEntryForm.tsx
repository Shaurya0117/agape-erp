"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Save, AlertCircle } from "lucide-react";
import { createArticle } from "./actions";
import { Account } from "@prisma/client";

export default function JournalEntryForm({ accounts }: { accounts: Account[] }) {
  const [isPending, startTransition] = useTransition();
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reference, setReference] = useState("");
  const [vendor, setVendor] = useState("");
  
  const [debits, setDebits] = useState<{ id: string, accountId: string, amount: string }[]>([
    { id: "d1", accountId: "", amount: "" }
  ]);
  const [credits, setCredits] = useState<{ id: string, accountId: string, amount: string }[]>([
    { id: "c1", accountId: "", amount: "" }
  ]);
  
  const [error, setError] = useState("");

  const addDebit = () => setDebits([...debits, { id: Math.random().toString(), accountId: "", amount: "" }]);
  const removeDebit = (id: string) => setDebits(debits.filter(d => d.id !== id));
  const updateDebit = (id: string, field: string, value: string) => 
    setDebits(debits.map(d => d.id === id ? { ...d, [field]: value } : d));

  const addCredit = () => setCredits([...credits, { id: Math.random().toString(), accountId: "", amount: "" }]);
  const removeCredit = (id: string) => setCredits(credits.filter(c => c.id !== id));
  const updateCredit = (id: string, field: string, value: string) => 
    setCredits(credits.map(c => c.id === id ? { ...c, [field]: value } : c));

  const totalDebits = debits.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);
  const totalCredits = credits.reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);
  const isBalanced = totalDebits === totalCredits && totalDebits > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !date) return setError("Description and Date are required.");
    if (debits.some(d => !d.accountId || !d.amount) || credits.some(c => !c.accountId || !c.amount)) {
      return setError("All debit and credit lines must have an account and amount.");
    }
    if (!isBalanced) return setError("Journal entry is not balanced. Debits must equal Credits.");

    setError("");
    startTransition(() => {
      createArticle({
        description,
        date,
        referenceNumber: reference,
        vendorName: vendor,
        debits: debits.map(d => ({ accountId: d.accountId, amount: parseFloat(d.amount) })),
        credits: credits.map(c => ({ accountId: c.accountId, amount: parseFloat(c.amount) }))
      });
      // Reset form
      setDescription("");
      setReference("");
      setVendor("");
      setDebits([{ id: Math.random().toString(), accountId: "", amount: "" }]);
      setCredits([{ id: Math.random().toString(), accountId: "", amount: "" }]);
    });
  };

  return (
    <div className="bg-white rounded-none shadow-sm border border-slate-200 overflow-hidden sticky top-24">
      <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
        <Plus className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-bold text-slate-900">New Journal Entry</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 border border-red-200 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Date *</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full px-3 py-2 border border-slate-200 focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Description *</label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)} required className="w-full px-3 py-2 border border-slate-200 focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Contractor Invoice" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Reference Number</label>
            <input type="text" value={reference} onChange={e => setReference(e.target.value)} className="w-full px-3 py-2 border border-slate-200 focus:ring-2 focus:ring-indigo-500" placeholder="INV-2026-001" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Vendor / Payee</label>
            <input type="text" value={vendor} onChange={e => setVendor(e.target.value)} className="w-full px-3 py-2 border border-slate-200 focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Alpha Bank" />
          </div>
        </div>

        {/* Debits Section */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold text-indigo-700">Debits</label>
            <button type="button" onClick={addDebit} className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"><Plus className="w-3 h-3"/> Add Line</button>
          </div>
          <div className="space-y-2">
            {debits.map((d, index) => (
              <div key={d.id} className="flex gap-2 items-center">
                <select value={d.accountId} onChange={e => updateDebit(d.id, 'accountId', e.target.value)} className="flex-1 px-3 py-2 border border-slate-200 focus:ring-2 focus:ring-indigo-500">
                  <option value="">Select Account...</option>
                  {accounts.map(a => <option key={a.id} value={a.id}>{a.gasCode} - {a.title}</option>)}
                </select>
                <input type="number" step="0.01" value={d.amount} onChange={e => updateDebit(d.id, 'amount', e.target.value)} placeholder="0.00" className="w-32 px-3 py-2 border border-slate-200 focus:ring-2 focus:ring-indigo-500 text-right font-mono" />
                {debits.length > 1 && (
                  <button type="button" onClick={() => removeDebit(d.id)} className="p-2 text-slate-500 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Credits Section */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold text-amber-700">Credits</label>
            <button type="button" onClick={addCredit} className="text-xs text-amber-600 hover:text-amber-800 font-bold flex items-center gap-1"><Plus className="w-3 h-3"/> Add Line</button>
          </div>
          <div className="space-y-2">
            {credits.map((c, index) => (
              <div key={c.id} className="flex gap-2 items-center">
                <select value={c.accountId} onChange={e => updateCredit(c.id, 'accountId', e.target.value)} className="flex-1 px-3 py-2 border border-slate-200 focus:ring-2 focus:ring-indigo-500">
                  <option value="">Select Account...</option>
                  {accounts.map(a => <option key={a.id} value={a.id}>{a.gasCode} - {a.title}</option>)}
                </select>
                <input type="number" step="0.01" value={c.amount} onChange={e => updateCredit(c.id, 'amount', e.target.value)} placeholder="0.00" className="w-32 px-3 py-2 border border-slate-200 focus:ring-2 focus:ring-indigo-500 text-right font-mono" />
                {credits.length > 1 && (
                  <button type="button" onClick={() => removeCredit(c.id)} className="p-2 text-slate-500 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="pt-4 border-t border-slate-200 flex justify-end gap-8">
          <div className="text-right">
            <p className="text-xs text-slate-600 uppercase tracking-wider font-bold mb-1">Total Debits</p>
            <p className="font-mono font-bold text-indigo-700">€{totalDebits.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-600 uppercase tracking-wider font-bold mb-1">Total Credits</p>
            <p className="font-mono font-bold text-amber-700">€{totalCredits.toFixed(2)}</p>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={!isBalanced || isPending}
          className={`w-full flex justify-center items-center gap-2 py-3 px-4 rounded-none shadow-sm text-sm font-bold transition-colors ${
            isBalanced 
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer' 
              : 'bg-slate-200 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Save className="w-4 h-4" />
          {isPending ? 'Saving...' : (isBalanced ? 'Post Journal Entry' : 'Entry is Out of Balance')}
        </button>
      </form>
    </div>
  );
}

