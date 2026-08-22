import fs from 'fs';
import path from 'path';

const dirsToScan = ['src/app', 'src/components'];

const replacements = [
  { regex: /className="dark"/g, replacement: 'className=""' },
  { regex: /bg-\[\#09090b\]/g, replacement: 'bg-slate-50' },
  { regex: /bg-\[\#131316\]/g, replacement: 'bg-white' },
  { regex: /bg-black\/40/g, replacement: 'bg-white' },
  { regex: /bg-black\/20/g, replacement: 'bg-slate-50' },
  { regex: /bg-white\/\[0\.05\]/g, replacement: 'bg-slate-100' },
  { regex: /bg-white\/\[0\.1\]/g, replacement: 'bg-slate-200' },
  { regex: /bg-white\/\[0\.03\]/g, replacement: 'bg-slate-50' },
  { regex: /bg-white\/10/g, replacement: 'bg-slate-100' },
  { regex: /text-slate-300/g, replacement: 'text-slate-600' },
  { regex: /text-slate-400/g, replacement: 'text-slate-500' },
  { regex: /text-white/g, replacement: 'text-slate-900' },
  { regex: /border-white\/\[0\.05\]/g, replacement: 'border-slate-200' },
  { regex: /border-white\/10/g, replacement: 'border-slate-200' },
  { regex: /border-white\/20/g, replacement: 'border-slate-300' },
  { regex: /hover:bg-white\/\[0\.08\]/g, replacement: 'hover:bg-slate-100' },
  { regex: /hover:text-white/g, replacement: 'hover:text-slate-900' },
  { regex: /shadow-\[0_0_15px_rgba\(255,255,255,0\.05\)\]/g, replacement: 'shadow-md' },
  { regex: /bg-slate-900\/50/g, replacement: 'bg-slate-100' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      
      // Some manual exceptions or order matters
      for (const { regex, replacement } of replacements) {
        content = content.replace(regex, replacement);
      }
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated theme in ${fullPath}`);
      }
    }
  }
}

dirsToScan.forEach(processDirectory);
console.log('Theme conversion complete!');
