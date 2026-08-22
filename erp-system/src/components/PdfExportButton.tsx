"use client";

import { Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface PdfExportButtonProps {
  title: string;
  data: any[];
  columns: { header: string; dataKey: string }[];
  fileName: string;
}

export default function PdfExportButton({ title, data, columns, fileName }: PdfExportButtonProps) {
  
  const generatePdf = () => {
    const doc = new jsPDF();
    
    // Add Branding / Header
    doc.setFontSize(22);
    doc.setTextColor(30, 58, 138); // Indigo 900
    doc.text("Agape ERP", 14, 20);
    
    doc.setFontSize(14);
    doc.setTextColor(71, 85, 105); // Slate 600
    doc.text(title, 14, 30);
    
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 38);

    // Generate Table
    autoTable(doc, {
      startY: 45,
      columns: columns,
      body: data,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] }, // Indigo 600
      styles: { fontSize: 9, cellPadding: 4 },
      alternateRowStyles: { fillColor: [248, 250, 252] } // Slate 50
    });

    doc.save(`${fileName}.pdf`);
  };

  return (
    <button 
      onClick={generatePdf}
      className="bg-indigo-600 text-slate-900 px-4 py-2.5 rounded-none shadow-md hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
    >
      <Download className="w-4 h-4" />
      Download PDF
    </button>
  );
}


