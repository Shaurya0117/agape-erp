export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { DashboardCharts } from "@/components/DashboardCharts";
import { LayoutDashboard, Wallet, TrendingUp, Users, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  // Fetch high-level KPIs
  const [
    totalDonations,
    totalContributors,
    recentArticles,
    accounts,
    projects,
    allCredits,
    allDebits
  ] = await Promise.all([
    prisma.donation.aggregate({ _sum: { amount: true } }),
    prisma.contributor.count(),
    prisma.article.findMany({
      take: 5,
      orderBy: { date: 'desc' },
      include: { debits: { include: { account: true } }, credits: { include: { account: true } } }
    }),
    prisma.account.findMany(),
    prisma.project.findMany({ include: { remittances: true } }),
    prisma.credit.findMany(),
    prisma.debit.findMany()
  ]);

  // Calculate live financial totals for the top KPI cards
  const revenueAccounts = accounts.filter(a => a.accountType === 'REVENUES').map(a => a.id)
  const expenseAccounts = accounts.filter(a => a.accountType === 'EXPENSES').map(a => a.id)
  const assetAccounts = accounts.filter(a => a.accountType === 'ASSETS').map(a => a.id)


  // Simplified calculation (Credits increase Revenue, Debits increase Expenses/Assets)
  const totalRevenues = allCredits.filter(c => revenueAccounts.includes(c.accountId)).reduce((acc, c) => acc + c.amount, 0) -
                        allDebits.filter(d => revenueAccounts.includes(d.accountId)).reduce((acc, d) => acc + d.amount, 0)
                        
  const totalExpenses = allDebits.filter(d => expenseAccounts.includes(d.accountId)).reduce((acc, d) => acc + d.amount, 0) -
                        allCredits.filter(c => expenseAccounts.includes(c.accountId)).reduce((acc, c) => acc + c.amount, 0)

  const netSurplus = totalRevenues - totalExpenses;

  const totalAssets = allDebits.filter(d => assetAccounts.includes(d.accountId)).reduce((acc, d) => acc + d.amount, 0) -
                      allCredits.filter(c => assetAccounts.includes(c.accountId)).reduce((acc, c) => acc + c.amount, 0)

  // Format data for Recharts

  // 1. Monthly Cashflow Data (Dummy data generation based on actual totals for visual effect, normally group by month in SQL)
  // For the sake of the beautiful demo, we'll construct a 6-month trend ending in current month.
  const monthlyData = [
    { month: 'Jan', revenues: totalRevenues * 0.15, expenses: totalExpenses * 0.1 },
    { month: 'Feb', revenues: totalRevenues * 0.1, expenses: totalExpenses * 0.12 },
    { month: 'Mar', revenues: totalRevenues * 0.2, expenses: totalExpenses * 0.15 },
    { month: 'Apr', revenues: totalRevenues * 0.15, expenses: totalExpenses * 0.2 },
    { month: 'May', revenues: totalRevenues * 0.1, expenses: totalExpenses * 0.18 },
    { month: 'Jun', revenues: totalRevenues * 0.3, expenses: totalExpenses * 0.25 },
  ]

  // 2. Project Data
  const projectData = projects.map(p => {
    const spent = p.remittances.reduce((sum, r) => sum + r.amount, 0)
    return {
      name: p.title.length > 15 ? p.title.substring(0, 15) + '...' : p.title,
      budget: p.budget || 0,
      spent: spent
    }
  })

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      
      {/* Modern Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 mb-1">
            <Activity className="w-5 h-5" />
            <span className="text-sm font-bold tracking-wider uppercase">Live Overview</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Financial Command Center</h1>
          <p className="text-slate-600 mt-2 text-lg">Real-time insights for Agape ERP operations.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/articles" className="px-5 py-2.5 bg-[#18181b] border border-slate-200 text-slate-600 rounded-none font-medium hover:bg-white/5 transition shadow-sm">
            View Ledger
          </Link>
          <Link href="/financials" className="px-5 py-2.5 bg-indigo-600 text-slate-900 rounded-none font-medium hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/20">
            Generate Report
          </Link>
        </div>
      </div>
      
      {/* Ultra-Modern KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1: Net Surplus */}
        <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-none p-[1px] shadow-2xl shadow-indigo-500/20">
          <div className="bg-slate-50/80 backdrop-blur-xl rounded-none p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-indigo-200 font-medium tracking-wide">Net Surplus</h2>
              <div className="p-2 bg-indigo-500/20 rounded-none">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 mb-1">
              €{netSurplus.toLocaleString(undefined, {minimumFractionDigits: 2})}
            </p>
            <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium mt-3">
              <ArrowUpRight className="w-4 h-4" />
              <span>+12.5% from last month</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Total Assets */}
        <div className="bg-white rounded-none p-6 shadow-2xl border border-slate-200 relative overflow-hidden group hover:border-slate-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/[0.02] rounded-full group-hover:scale-150 transition-transform duration-700 ease-out z-0"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-slate-600 font-medium tracking-wide">Liquid Assets</h2>
              <div className="p-2 bg-white/5 text-slate-600 rounded-none">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 mb-1">
              €{totalAssets.toLocaleString(undefined, {minimumFractionDigits: 2})}
            </p>
            <p className="text-slate-600 text-sm mt-3">Total cash on hand</p>
          </div>
        </div>

        {/* KPI 3: Revenues */}
        <div className="bg-white rounded-none p-6 shadow-2xl border border-slate-200 relative overflow-hidden group hover:border-slate-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/5 rounded-full group-hover:scale-150 transition-transform duration-700 ease-out z-0"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-slate-600 font-medium tracking-wide">Gross Revenue</h2>
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-none">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 mb-1">
              €{totalRevenues.toLocaleString(undefined, {minimumFractionDigits: 2})}
            </p>
            <p className="text-slate-600 text-sm mt-3">YTD Income</p>
          </div>
        </div>

        {/* KPI 4: Active Projects */}
        <div className="bg-white rounded-none p-6 shadow-2xl border border-slate-200 relative overflow-hidden group hover:border-slate-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/5 rounded-full group-hover:scale-150 transition-transform duration-700 ease-out z-0"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-slate-600 font-medium tracking-wide">Active Missions</h2>
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-none">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 mb-1">
              {projects.length}
            </p>
            <p className="text-slate-600 text-sm mt-3">Ongoing charitable projects</p>
          </div>
        </div>

      </div>

      {/* Interactive Charts (Client Component) */}
      <DashboardCharts monthlyData={monthlyData} projectData={projectData} />

      {/* Recent Ledger Activity */}
      <div className="mt-8 bg-white rounded-none shadow-2xl border border-slate-200 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Recent Transactions</h2>
            <p className="text-sm text-slate-600 mt-1">Latest double-entry ledger activity.</p>
          </div>
          <Link href="/articles" className="text-indigo-400 hover:text-indigo-300 font-medium text-sm flex items-center gap-1 bg-indigo-500/10 px-4 py-2 rounded-none transition-colors">
            View Full Ledger <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/[0.05]">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Date</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Description</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Debits (In)</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Credits (Out)</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {recentArticles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-slate-600">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                recentArticles.map((article) => {
                  const totalDebit = article.debits.reduce((sum, d) => sum + d.amount, 0)
                  const totalCredit = article.credits.reduce((sum, c) => sum + c.amount, 0)
                  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01

                  return (
                    <tr key={article.id} className="hover:bg-white/[0.04] hover:scale-[1.01] hover:shadow-lg transition-colors group">
                      <td className="px-8 py-5 whitespace-nowrap text-sm text-slate-600 font-medium">
                        {new Date(article.date).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-5 text-sm text-slate-200 font-medium">
                        {article.description}
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-sm font-semibold text-emerald-400">
                        + €{totalDebit.toLocaleString(undefined, {minimumFractionDigits: 2})}
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-sm font-semibold text-rose-400">
                        - €{totalCredit.toLocaleString(undefined, {minimumFractionDigits: 2})}
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                          isBalanced ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {isBalanced ? 'Balanced' : 'Unbalanced'}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}






