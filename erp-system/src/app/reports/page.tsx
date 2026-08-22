export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { PieChart, AlertCircle, CheckCircle2 } from "lucide-react";

export default async function ReportsPage() {
  const projects = await prisma.project.findMany({
    include: {
      remittances: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Program Reports</h1>
        <p className="text-slate-600 mt-2">Track funding, budgets, and remittance execution for all initiatives.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {projects.map(project => {
          const totalSpent = project.remittances.reduce((sum, r) => sum + r.amount, 0);
          const budget = project.budget || 0;
          const percentage = budget > 0 ? Math.min((totalSpent / budget) * 100, 100) : 0;
          
          let statusColor = "text-slate-600";
          let bgColor = "bg-slate-100";
          let barColor = "bg-slate-500";
          
          if (budget > 0) {
            if (percentage >= 100) {
              statusColor = "text-red-600";
              bgColor = "bg-red-50";
              barColor = "bg-red-500";
            } else if (percentage >= 75) {
              statusColor = "text-amber-600";
              bgColor = "bg-amber-50";
              barColor = "bg-amber-500";
            } else {
              statusColor = "text-emerald-600";
              bgColor = "bg-emerald-50";
              barColor = "bg-emerald-500";
            }
          }

          return (
            <div key={project.id} className="bg-white p-6 rounded-none shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{project.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {project.workStage || "PLANNING"}
                    </span>
                    <span className="text-sm text-slate-600">
                      Code: {project.code || "N/A"}
                    </span>
                  </div>
                </div>
                {budget > 0 && percentage >= 100 ? (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-1.5 rounded-none font-medium text-sm">
                    <AlertCircle className="w-4 h-4" /> Over Budget
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-none font-medium text-sm">
                    <CheckCircle2 className="w-4 h-4" /> On Track
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 mt-6">
                <div>
                  <p className="text-sm font-semibold text-slate-600 uppercase">Target Budget</p>
                  <p className="text-xl font-bold text-slate-900">€{budget.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 uppercase">Total Spent (Remittances)</p>
                  <p className="text-xl font-bold text-slate-900">€{totalSpent.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600 uppercase">Remaining</p>
                  <p className={`text-xl font-bold ${budget > 0 && budget - totalSpent < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    €{budget > 0 ? (budget - totalSpent).toLocaleString() : '---'}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              {budget > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium text-slate-600">
                    <span>Budget Utilization</span>
                    <span>{percentage.toFixed(1)}%</span>
                  </div>
                  <div className={`w-full h-3 rounded-full ${bgColor} overflow-hidden`}>
                    <div 
                      className={`h-full ${barColor} transition-all duration-1000`} 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
        
        {projects.length === 0 && (
          <div className="bg-white p-12 rounded-none shadow-sm border border-slate-200 text-center text-slate-600">
            <PieChart className="w-12 h-12 mx-auto mb-4 text-slate-600" />
            <p className="text-lg font-medium text-slate-900">No active projects</p>
            <p>Create a project to see financial reports here.</p>
          </div>
        )}
      </div>
    </div>
  );
}






