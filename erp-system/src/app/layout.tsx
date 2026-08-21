import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Wallet, 
  ReceiptText, 
  Users, 
  Briefcase, 
  HeartHandshake, 
  Baby, 
  Send, 
  LogOut,
  FileText,
  TrendingUp,
  Ship,
  FileBadge,
  Building2, ShieldAlert
} from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agape ERP",
  description: "Modern Custom ERP System for Nonprofit Organization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#09090b] text-slate-300 flex h-screen overflow-hidden selection:bg-amber-500/30`}>
        {/* Sidebar Navigation */}
        <aside className="w-72 bg-[#09090b] flex flex-col hidden md:flex border-r border-white/[0.05] z-20 relative">
          
          {/* Subtle background glow in sidebar */}
          <div className="absolute top-0 left-0 w-full h-64 bg-indigo-500/10 blur-[100px] pointer-events-none"></div>

          <div className="p-8 flex flex-col items-center border-b border-white/[0.05] relative z-10">
            <div className="w-28 h-28 rounded-none overflow-hidden mb-6 shadow-2xl shadow-black/50 border border-white/10 relative bg-black flex items-center justify-center group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img src="/cross-art.png" alt="Orthodox Cross" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
            </div>
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 tracking-[0.2em] uppercase text-sm">Agape ERP</span>
          </div>
          
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-4">Overview</p>
            <Link href="/" className="flex items-center gap-3 py-2.5 px-4 rounded-none transition-all duration-200 hover:bg-white/[0.08] hover:translate-x-1 hover:text-white group shadow-none hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <LayoutDashboard className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              <span className="font-medium">Dashboard</span>
            </Link>
            <Link href="/reports" className="flex items-center gap-3 py-2.5 px-4 rounded-none transition-all duration-200 hover:bg-white/[0.08] hover:translate-x-1 hover:text-white group shadow-none hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <TrendingUp className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              <span className="font-medium">Program Reports</span>
            </Link>

            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6">Accounting</p>
            <Link href="/financials" className="flex items-center gap-3 py-2.5 px-4 rounded-none transition-all duration-200 hover:bg-white/[0.08] hover:translate-x-1 hover:text-white group shadow-none hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <FileText className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              <span className="font-medium">Financials</span>
            </Link>
            <Link href="/accounts" className="flex items-center gap-3 py-2.5 px-4 rounded-none transition-all duration-200 hover:bg-white/[0.08] hover:translate-x-1 hover:text-white group shadow-none hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <Wallet className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              <span className="font-medium">Accounts</span>
            </Link>
            <Link href="/articles" className="flex items-center gap-3 py-2.5 px-4 rounded-none transition-all duration-200 hover:bg-white/[0.08] hover:translate-x-1 hover:text-white group shadow-none hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <ReceiptText className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              <span className="font-medium">Transactions</span>
            </Link>

            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6">CRM & Operations</p>
            <Link href="/contributors" className="flex items-center gap-3 py-2.5 px-4 rounded-none transition-all duration-200 hover:bg-white/[0.08] hover:translate-x-1 hover:text-white group shadow-none hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <Users className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              <span className="font-medium">Contributors</span>
            </Link>
            <Link href="/donations" className="flex items-center gap-3 py-2.5 px-4 rounded-none transition-all duration-200 hover:bg-white/[0.08] hover:translate-x-1 hover:text-white group shadow-none hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <HeartHandshake className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              <span className="font-medium">Donations</span>
            </Link>
            <Link href="/projects" className="flex items-center gap-3 py-2.5 px-4 rounded-none transition-all duration-200 hover:bg-white/[0.08] hover:translate-x-1 hover:text-white group shadow-none hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <Briefcase className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              <span className="font-medium">Projects</span>
            </Link>
            <Link href="/baptisms" className="flex items-center gap-3 py-2.5 px-4 rounded-none transition-all duration-200 hover:bg-white/[0.08] hover:translate-x-1 hover:text-white group shadow-none hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <Baby className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              <span className="font-medium">Baptisms</span>
            </Link>
            <Link href="/logistics" className="flex items-center gap-3 py-2.5 px-4 rounded-none transition-all duration-200 hover:bg-white/[0.08] hover:translate-x-1 hover:text-white group shadow-none hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <Ship className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              <span className="font-medium">Logistics</span>
            </Link>
            
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6">Administration</p>
              <Link href="/users" className="flex items-center gap-3 py-2.5 px-4 rounded-none transition-all duration-200 hover:bg-white/[0.08] hover:translate-x-1 hover:text-white group shadow-none hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                <ShieldAlert className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                <span className="font-medium">Access Roles</span>
              </Link>
            <Link href="/admin" className="flex items-center gap-3 py-2.5 px-4 rounded-none transition-all duration-200 hover:bg-white/[0.08] hover:translate-x-1 hover:text-white group shadow-none hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <Building2 className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              <span className="font-medium">Admin & Assets</span>
            </Link>
            <Link href="/documents" className="flex items-center gap-3 py-2.5 px-4 rounded-none transition-all duration-200 hover:bg-white/[0.08] hover:translate-x-1 hover:text-white group shadow-none hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <FileBadge className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              <span className="font-medium">Documents</span>
            </Link>
            <Link href="/remittances" className="flex items-center gap-3 py-2.5 px-4 rounded-none transition-all duration-200 hover:bg-white/[0.08] hover:translate-x-1 hover:text-white group shadow-none hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <Send className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              <span className="font-medium">Remittances</span>
            </Link>

            <div className="pt-8 pb-4">
              <a href="/api/auth/signout" className="flex items-center gap-3 py-2.5 px-4 rounded-none text-red-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-300">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </a>
            </div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
          {/* Header */}
          <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center px-8 sticky top-0 z-10 shadow-sm">
            <div className="flex-1">
              <div className="text-sm font-medium text-slate-500">Welcome back,</div>
              <div className="text-lg font-bold text-slate-800 leading-tight">Admin User</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-indigo-200">
              <span className="text-indigo-700 font-bold">A</span>
            </div>
          </header>
          
          {/* Page Content */}
          <div className="flex-1 overflow-auto p-8">
            <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              {children}
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}

