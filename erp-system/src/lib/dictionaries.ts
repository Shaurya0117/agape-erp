export const dictionaries = {
  en: {
    sidebar: {
      dashboard: "Dashboard",
      reports: "Program Reports",
      financials: "Financials",
      accounts: "Accounts",
      transactions: "Transactions",
      contributors: "Contributors",
      donations: "Donations",
      projects: "Projects",
      baptisms: "Baptisms",
      logistics: "Logistics",
      inventory: "Inventory",
      adminAssets: "Admin & Assets",
      documents: "Documents",
      remittances: "Remittances",
      accessRoles: "Access Roles",
      logout: "Log Out",
      administration: "Administration",
      mainMenu: "Main Menu"
    },
    dashboard: {
      title: "Financial Command Center",
      subtitle: "Live overview of global operations and financial health.",
      netSurplus: "Net Surplus / Deficit",
      liquidAssets: "Liquid Assets",
      revenue: "YTD Revenue",
      missions: "Active Missions",
      cashflowTrend: "Cashflow Trend",
      cashflowDesc: "Monthly revenues vs expenses overview.",
      budget: "Project Budgets",
      budgetDesc: "Allocated vs spent funds per initiative.",
      recentActivity: "Recent Activity",
      recentDesc: "Latest financial transactions across all accounts."
    }
  },
  el: {
    sidebar: {
      dashboard: "Πίνακας Ελέγχου",
      reports: "Αναφορές Προγραμμάτων",
      financials: "Οικονομικά",
      accounts: "Λογαριασμοί",
      transactions: "Συναλλαγές",
      contributors: "Συνεισφέροντες",
      donations: "Δωρεές",
      projects: "Έργα",
      baptisms: "Βαπτίσεις",
      logistics: "Εφοδιαστική",
      inventory: "Αποθήκη",
      adminAssets: "Διαχείριση & Πάγια",
      documents: "Έγγραφα",
      remittances: "Εμβάσματα",
      accessRoles: "Ρόλοι Πρόσβασης",
      logout: "Αποσύνδεση",
      administration: "Διαχείριση",
      mainMenu: "Κύριο Μενού"
    },
    dashboard: {
      title: "Οικονομικό Κέντρο Ελέγχου",
      subtitle: "Ζωντανή επισκόπηση λειτουργιών και οικονομικής υγείας.",
      netSurplus: "Καθαρό Πλεόνασμα / Έλλειμμα",
      liquidAssets: "Ρευστά Διαθέσιμα",
      revenue: "Έσοδα Έτους",
      missions: "Ενεργές Αποστολές",
      cashflowTrend: "Τάση Ταμειακών Ροών",
      cashflowDesc: "Μηνιαία επισκόπηση εσόδων έναντι εξόδων.",
      budget: "Προϋπολογισμοί Έργων",
      budgetDesc: "Κατανεμημένα έναντι δαπανηθέντων κεφαλαίων ανά πρωτοβουλία.",
      recentActivity: "Πρόσφατη Δραστηριότητα",
      recentDesc: "Τελευταίες οικονομικές συναλλαγές σε όλους τους λογαριασμούς."
    }
  }
}

export type Locale = keyof typeof dictionaries;
