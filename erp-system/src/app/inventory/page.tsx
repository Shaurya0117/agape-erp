export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { createItem } from "./actions";
import { Package, Plus, Search, MapPin, Tag } from "lucide-react";
import SearchInput from "@/components/SearchInput";
import StockAdjuster from "./StockAdjuster";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const params = await searchParams;
  const query = params?.q || "";

  const items = await prisma.inventoryItem.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { sku: { contains: query, mode: 'insensitive' } }
      ]
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Warehouse Inventory</h1>
          <p className="text-slate-400 mt-2">Manage stock levels, SKUs, and physical storage locations.</p>
        </div>
        <SearchInput placeholder="Search by name or SKU..." />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Form Column */}
        <div className="xl:col-span-1">
          <div className="bg-[#131316] rounded-none shadow-2xl border border-white/[0.05] overflow-hidden sticky top-24">
            <div className="px-6 py-5 border-b border-white/[0.05] bg-black/20 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white">Add New Item</h2>
            </div>
            <form action={createItem as any} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-300">Item Name</label>
                <input type="text" name="name" required className="w-full pl-3 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white" placeholder="e.g., Medical Blankets" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-300">SKU Code</label>
                  <input type="text" name="sku" required className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white" placeholder="BLK-001" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-300">Category</label>
                  <select name="category" className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white">
                    <option value="Supplies">Supplies</option>
                    <option value="Food">Food</option>
                    <option value="Medical">Medical</option>
                    <option value="Literature">Literature</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-300">Initial Qty</label>
                  <input type="number" name="quantity" defaultValue={0} className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-none text-white" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-300">Unit</label>
                  <input type="text" name="unit" defaultValue="pcs" className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-none text-white" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-300">Warehouse Location</label>
                <input type="text" name="location" className="w-full px-3 py-2.5 bg-black/40 border border-white/10 rounded-none text-white" placeholder="e.g., Aisle 4, Shelf B" />
              </div>
              <button type="submit" className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-none shadow-lg text-sm font-bold text-black bg-emerald-400 hover:bg-emerald-500 transition-colors">
                Save Item to Inventory
              </button>
            </form>
          </div>
        </div>

        {/* List Column */}
        <div className="xl:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.id} className="bg-[#131316] rounded-none shadow-xl border border-white/[0.05] p-5 hover:border-white/20 transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/[0.03] rounded-none border border-white/[0.05] group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10 transition-colors">
                  <Package className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {item.name}
                    {item.quantity < 10 && <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] uppercase font-bold tracking-wider">Low Stock</span>}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> {item.sku}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {item.location || 'Unassigned'}</span>
                    <span className="px-2 py-0.5 bg-white/[0.05] border border-white/10 text-slate-300">{item.category}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end gap-6 bg-black/20 p-3 sm:bg-transparent sm:p-0 border border-white/[0.05] sm:border-none">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Stock Level</p>
                  <p className="text-sm font-medium text-slate-300">{item.unit}</p>
                </div>
                <StockAdjuster itemId={item.id} initialQuantity={item.quantity} />
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-center p-12 bg-[#131316] border border-white/[0.05] rounded-none">
              <Package className="mx-auto h-12 w-12 text-slate-600 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">No items found</h3>
              <p className="text-slate-400 text-sm">Add your first item to the inventory using the form.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
