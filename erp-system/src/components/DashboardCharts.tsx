"use client"

import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts'

interface ChartDataProps {
  monthlyData: { month: string; revenues: number; expenses: number }[]
  projectData: { name: string; budget: number; spent: number }[]
}

export function DashboardCharts({ monthlyData, projectData }: ChartDataProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">
      
      {/* Cashflow Area Chart */}
      <div className="bg-white p-6 rounded-none shadow-2xl border border-slate-200">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900">Cashflow Trend</h3>
          <p className="text-sm text-slate-500">Monthly revenues vs expenses overview.</p>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fb7185" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#fb7185" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `€${val/1000}k`} />
              <Tooltip 
                contentStyle={{ borderRadius: '0px', border: '1px solid rgba(255,255,255,0.05)', backgroundColor: '#09090b', color: '#fff', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
                formatter={(value: any) => [`€${Number(value).toLocaleString()}`, "" as any]}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ color: '#94a3b8' }} />
              <Area type="monotone" name="Revenues" dataKey="revenues" stroke="#34d399" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              <Area type="monotone" name="Expenses" dataKey="expenses" stroke="#fb7185" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Project Budgets Bar Chart */}
      <div className="bg-white p-6 rounded-none shadow-2xl border border-slate-200">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-900">Project Budgets</h3>
          <p className="text-sm text-slate-500">Target budgets vs actual expenditures.</p>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={projectData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `€${val/1000}k`} />
              <Tooltip 
                cursor={{fill: '#ffffff05'}}
                contentStyle={{ borderRadius: '0px', border: '1px solid rgba(255,255,255,0.05)', backgroundColor: '#09090b', color: '#fff', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
                formatter={(value: any) => [`€${Number(value).toLocaleString()}`, "" as any]}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ color: '#94a3b8' }} />
              <Bar name="Target Budget" dataKey="budget" fill="#334155" radius={[4, 4, 0, 0]} />
              <Bar name="Spent" dataKey="spent" fill="#818cf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  )
}

