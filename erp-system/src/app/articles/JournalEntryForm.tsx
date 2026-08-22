"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Save, AlertCircle } from "lucide-react";
import { createArticle } from "./actions";
import { Account } from "@prisma/client";

type LineItem = {
  id: string;
  accountId: string;
  amount: string;
  reference: string;
  consignee: string;
};

export default function JournalEntryForm({ accounts }: { accounts: Account[] }) {
  const [isPending, startTransition] = useTransition();
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [debits, setDebits] = useState<LineItem[]>([{ id: "d1", accountId: "", amount: "", reference: "", consignee: "" }]);
  const [credits, setCredits] = useState<LineItem[]>([{ id: "c1", accountId: "", amount: "", reference: "", consignee: "" }]);
  
  const [error, setError] = useState("");

  const addDebit = () => setDebits([...debits, { id: Math.random().toString(), accountId: "", amount: "", reference: "", consignee: "" }]);
  const removeDebit = (id: string) => setDebits(debits.filter(d => d.id !== id));
  const updateDebit = (id: string, field: keyof LineItem, value: string) => 
    setDebits(debits.map(d => d.id === id ? { ...d, [field]: value } : d));

  const addCredit = () => setCredits([...credits, { id: Math.random().toString(), accountId: "", amount: "", reference: "", consignee: "" }]);
  const removeCredit = (id: string) => setCredits(credits.filter(c => c.id !== id));
  const updateCredit = (id: string, field: keyof LineItem, value: string) => 
    setCredits(credits.map(c => c.id === id ? { ...c, [field]: value } : c));

  const totalDebits = debits.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);
  const totalCredits = credits.reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);
  const isBalanced = totalDebits === totalCredits && totalDebits > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !date) return setError("Description and Date are required.");
    
    // Validation
    const allLines = [...debits, ...credits];
    for (const line of allLines) {
      if (!line.accountId || !line.amount) return setError("All lines must have an account and amount.");
      const acc = accounts.find(a => a.id === line.accountId);
      if (acc?.requiresReference && !line.reference) return setError(`Reference is required for account ${acc.title}`);
      if (acc?.requiresConsignee && !line.consignee) return setError(`Consignee is required for account ${acc.title}`);
    }

    if (!isBalanced) return setError("Journal entry is not balanced. Debits must equal Credits.");

    setError("");
    startTransition(() => {
      createArticle({
        description,
        date,
        debits: debits.map(d => ({ accountId: d.accountId, amount: parseFloat(d.amount), reference: d.reference, consignee: d.consignee })),
        credits: credits.map(c => ({ accountId: c.accountId, amount: parseFloat(c.amount), reference: c.reference, consignee: c.consignee }))
      });
      // Reset
      setDescription("");
      setDebits([{ id: Math.random().toString(), accountId: "", amount: "", reference: "", consignee: "" }]);
      setCredits([{ id: Math.random().toString(), accountId: "", amount: "", reference: "", consignee: "" }]);
    });
  };

  const renderLine = (line: LineItem, updateFn: any, removeFn: any, showRemove: boolean) => {
    const acc = accounts.find(a => a.id === line.accountId);
    
    return (
      <div key={line.id} className="p-3 bg-slate-50 border border-slate-200 mb-2 relative">
        <div className="flex gap-4 items-start">
          <div className="flex-1 space-y-2">
            <select value={line.accountId} onChange={e => updateFn(line.id, 'accountId', e.target.value)} className="w-full px-3 py-2 border border-slate-300 text-slate-900 bg-white">
              <option value="">Select Account...</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.gasCode ? a.gasCode + " - " : ""}{a.title}</option>)}
            </select>
            
            <div className="flex gap-2">
              {acc?.requiresReference && (
                <input type="text" value={line.reference} onChange={e => updateFn(line.id, 'reference', e.target.value)} placeholder="Reference # *" className="flex-1 px-3 py-1.5 border border-slate-300 text-sm text-slate-900" required />
              )}
              {acc?.requiresConsignee && (
                <input type="text" value={line.consignee} onChange={e => updateFn(line.id, 'consignee', e.target.value)} placeholder="Consignee (e.g. Vendor/Client) *" className="flex-1 px-3 py-1.5 border border-slate-300 text-sm text-slate-900" required />
              )}
            </div>
          </div>
          
          <input type="number" step="0.01" value={line.amount} onChange={e => updateFn(line.id, 'amount', e.target.value)} placeholder="0.00" className="w-40 px-3 py-2 border border-slate-300 text-right font-mono text-lg text-slate-900" />
          
          {showRemove && (
            <button type="button" onClick={() => removeFn(line.id)} className="p-2 text-slate-400 hover:text-red-500 absolute -right-10 top-2"><Trash2 className="w-5 h-5"/></button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border border-slate-200 shadow-sm">
      <div className="px-6 py-5 border-b border-slate-200 bg-slate-100 flex items-center gap-2">
        <Plus className="w-5 h-5 text-indigo-700" />
        <h2 className="text-lg font-bold text-slate-900">New Journal Entry</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {error && (
          <div className="p-4 bg-red-50 text-red-700 border border-red-200 font-bold flex items-center gap-2">
            <AlertCircle className="w-5 h-5" /> {error}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-900">Date *</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full px-4 py-2.5 border border-slate-300 text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-900">Description *</label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)} required className="w-full px-4 py-2.5 border border-slate-300 text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600" placeholder="e.g. Office Supplies Purchase" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 pr-8">
          {/* Debits */}
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b-2 border-indigo-200 pb-2">Debits</h3>
            <div className="space-y-4">
              {debits.map(d => renderLine(d, updateDebit, removeDebit, debits.length > 1))}
            </div>
            <button type="button" onClick={addDebit} className="mt-4 text-sm font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"><Plus className="w-4 h-4"/> Add Debit Line</button>
          </div>

          {/* Credits */}
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b-2 border-amber-200 pb-2">Credits</h3>
            <div className="space-y-4">
              {credits.map(c => renderLine(c, updateCredit, removeCredit, credits.length > 1))}
            </div>
            <button type="button" onClick={addCredit} className="mt-4 text-sm font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1"><Plus className="w-4 h-4"/> Add Credit Line</button>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 flex justify-end gap-12 items-center">
          <div className="text-right">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Debits</p>
            <p className="font-mono font-bold text-2xl text-slate-900">€{totalDebits.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Credits</p>
            <p className="font-mono font-bold text-2xl text-slate-900">€{totalCredits.toFixed(2)}</p>
          </div>
          
          <div className="w-px h-12 bg-slate-200 mx-4"></div>
          
          <button 
            type="submit" 
            disabled={!isBalanced || isPending}
            className={`py-3 px-8 text-base font-bold transition-colors ${
              isBalanced 
                ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-lg cursor-pointer' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isPending ? 'Saving...' : (isBalanced ? 'Post Journal Entry' : 'Entry is Out of Balance')}
          </button>
        </div>
      </form>
    </div>
  );
}
