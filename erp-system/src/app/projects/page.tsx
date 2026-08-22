export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { createProject } from "./actions";
import { Briefcase, Target, Euro, Calendar, Plus } from "lucide-react";
import SearchInput from "@/components/SearchInput";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const params = await searchParams;
  const query = params?.q || "";

  const projects = await prisma.project.findMany({
    where: {
      title: { contains: query }
    },
    orderBy: { createdAt: 'desc' },
    include: {
      remittances: true
    }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Project Management</h1>
          <p className="text-slate-600 mt-2">Create and manage initiatives, assign budgets, and track statuses.</p>
        </div>
        <SearchInput placeholder="Search projects..." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-none shadow-sm border border-slate-200 overflow-hidden sticky top-24">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">Create New Project</h2>
            </div>
            <form action={createProject as any} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-900 font-bold">Project Title</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-5 w-5 text-slate-600" />
                  </div>
                  <input 
                    type="text" 
                    name="title" 
                    required 
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors sm:text-sm text-slate-900 bg-slate-50 focus:bg-white text-slate-900" 
                    placeholder="e.g. Clean Water Initiative"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-900 font-bold">Target Budget (€)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Euro className="h-5 w-5 text-slate-600" />
                  </div>
                  <input 
                    type="number"
                    step="0.01" 
                    name="budget" 
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors sm:text-sm text-slate-900 bg-slate-50 focus:bg-white text-slate-900" 
                    placeholder="50000.00"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-900 font-bold">Work Stage</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Target className="h-5 w-5 text-slate-600" />
                  </div>
                  <select 
                    name="workStage" 
                    className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors sm:text-sm text-slate-900 bg-slate-50 focus:bg-white appearance-none text-slate-900"
                  >
                    <option value="PLANNING">Planning</option>
                    <option value="ACTIVE">Active</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="ON_HOLD">On Hold</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-900 font-bold">Start Date</label>
                  <input 
                    type="date" 
                    name="startDate" 
                    className="block w-full px-3 py-2.5 border border-slate-200 rounded-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors sm:text-sm text-slate-900 bg-slate-50 focus:bg-white text-slate-900" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-900 font-bold">Project Code</label>
                  <input 
                    type="text" 
                    name="code" 
                    className="block w-full px-3 py-2.5 border border-slate-200 rounded-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-colors sm:text-sm text-slate-900 bg-slate-50 focus:bg-white text-slate-900" 
                    placeholder="PRJ-001"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full mt-2 bg-indigo-600 text-slate-900 py-2.5 px-4 rounded-none hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg font-medium flex justify-center items-center gap-2"
              >
                Save Project
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-none shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50/80">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Project Info</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Stage</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">Budget</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {projects.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-600">
                          <Briefcase className="w-12 h-12 mb-3 text-slate-200" />
                          <p className="text-base font-medium text-slate-600">No projects found</p>
                          <p className="text-sm">Create your first initiative.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    projects.map((project) => (
                      <tr key={project.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-none bg-indigo-50 text-indigo-600 flex items-center justify-center">
                              <Briefcase className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-slate-900">{project.title}</div>
                              <div className="text-xs text-slate-600">
                                {project.code ? `${project.code} • ` : ''}
                                {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'No start date'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-none text-xs font-bold ring-1 ring-inset uppercase tracking-wide
                            ${project.workStage === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 ring-emerald-700/10' : 
                              project.workStage === 'COMPLETED' ? 'bg-slate-100 text-slate-700 ring-slate-700/10' : 
                              project.workStage === 'ON_HOLD' ? 'bg-red-50 text-red-700 ring-red-700/10' : 
                              'bg-blue-50 text-blue-700 ring-blue-700/10'}`}>
                            {project.workStage || 'PLANNING'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className="text-sm font-bold text-slate-900">
                            {project.budget ? `€${project.budget.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '---'}
                          </span>
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






