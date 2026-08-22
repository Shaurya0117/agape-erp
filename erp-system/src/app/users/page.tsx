export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Shield, ShieldAlert, Key } from "lucide-react";
import PermissionToggle from "./PermissionToggle";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.isSuperAdmin && !session?.user?.canManageUsers) {
    redirect("/"); // Unauthorized
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Access Control</h1>
          <p className="text-slate-500 mt-2">Manage staff accounts and module-specific permissions.</p>
        </div>
      </div>

      <div className="bg-white shadow-2xl border border-slate-200 overflow-hidden rounded-none">
        <div className="px-8 py-6 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
          <Key className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl font-bold text-slate-900">System Users</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/[0.05]">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-8 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Super Admin</th>
                <th className="px-8 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Financials</th>
                <th className="px-8 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Projects</th>
                <th className="px-8 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Logistics</th>
                <th className="px-8 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Users</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="text-sm font-bold text-slate-900">{user.name || "Unknown"}</div>
                    <div className="text-sm text-slate-500">{user.email}</div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-center">
                    <PermissionToggle userId={user.id} field="isSuperAdmin" initialValue={user.isSuperAdmin} />
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-center">
                    <PermissionToggle userId={user.id} field="canManageFinancials" initialValue={user.canManageFinancials} disabled={user.isSuperAdmin} />
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-center">
                    <PermissionToggle userId={user.id} field="canManageProjects" initialValue={user.canManageProjects} disabled={user.isSuperAdmin} />
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-center">
                    <PermissionToggle userId={user.id} field="canManageLogistics" initialValue={user.canManageLogistics} disabled={user.isSuperAdmin} />
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-center">
                    <PermissionToggle userId={user.id} field="canManageUsers" initialValue={user.canManageUsers} disabled={user.isSuperAdmin} />
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-slate-500">
                    No registered users found in the database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


