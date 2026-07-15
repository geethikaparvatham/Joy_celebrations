const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(srcDir, (filePath) => {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;
  
  // Replace Link href with to
  content = content.replace(/<Link([^>]*?)href=(["'{])/g, '<Link$1to=$2');
  
  // Remove next imports that might have been left over (Metadata)
  content = content.replace(/import type \{ Metadata \} from ["']next["'];?\n?/g, '');
  content = content.replace(/import \{ Metadata \} from ["']next["'];?\n?/g, '');
  
  // Fix search params hook
  if (content.includes('useSearchParams()') && content.includes('get(')) {
    // React Router useSearchParams returns an array [searchParams, setSearchParams]
    content = content.replace(/const searchParams = useSearchParams\(\);/g, 'const [searchParams] = useSearchParams();');
  }

  // Fix imports for CSS module if it points to old location
  content = content.replace(/import styles from ["']\.\.?\/?.*?page\.module\.css["'];/g, 'import styles from "@/page.module.css";');
  
  // Fix Admin components path
  content = content.replace(/import AdminNotifications from ["'].*?components\/admin\/AdminNotifications["'];?/g, 'import AdminNotifications from "@/components/admin/AdminNotifications";');
  content = content.replace(/import AdminSidebar from ["'].*?components\/admin\/AdminSidebar["'];?/g, 'import AdminSidebar from "@/components/admin/AdminSidebar";');
  content = content.replace(/import PackagesManager from ["'].\/PackagesManager["'];?/g, 'import PackagesManager from "./packages/PackagesManager";');

  // Fix firebase path
  content = content.replace(/import \{ db \} from ["'].*?lib\/firebase["'];?/g, 'import { db } from "@/lib/firebase";');

  // Remove useless layout.tsx files (since we have App.tsx)
  if (filePath.endsWith('layout.tsx')) {
    fs.unlinkSync(filePath);
    console.log("Deleted: " + filePath);
    return;
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log("Fixed: " + filePath);
  }
});
