"use client";

import { useTransition, useState } from "react";
import { adjustStock } from "./actions";
import { Minus, Plus } from "lucide-react";

export default function StockAdjuster({ itemId, initialQuantity }: { itemId: string, initialQuantity: number }) {
  const [isPending, startTransition] = useTransition();
  const [qty, setQty] = useState(initialQuantity);

  const handleAdjust = (delta: number) => {
    const newQty = Math.max(0, qty + delta);
    setQty(newQty);
    startTransition(() => {
      adjustStock(itemId, newQty);
    });
  };

  return (
    <div className="flex items-center gap-3">
      <button 
        onClick={() => handleAdjust(-1)}
        disabled={isPending || qty === 0}
        className="p-1 rounded bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 disabled:opacity-50"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="w-8 text-center font-bold text-white">{qty}</span>
      <button 
        onClick={() => handleAdjust(1)}
        disabled={isPending}
        className="p-1 rounded bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 disabled:opacity-50"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
