const fs = require('fs');
const path = require('path');

const srcApp = path.join(__dirname, 'src', 'app');
const srcPages = path.join(__dirname, 'src', 'pages');

if (!fs.existsSync(srcPages)) {
  fs.mkdirSync(srcPages, { recursive: true });
}

const componentsToUpdate = [];

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

// 1. Move pages
function migratePages() {
  walkDir(srcApp, (filePath) => {
    if (filePath.includes('api') || !filePath.endsWith('.tsx')) return;
    
    // Determine new path
    let relativePath = path.relative(srcApp, filePath);
    
    // Map layout.tsx and page.tsx correctly
    if (relativePath === 'page.tsx') {
      copyAndTransform(filePath, path.join(srcPages, 'Home.tsx'));
    } else if (relativePath === 'layout.tsx') {
      // layout.tsx logic moved to App.tsx mostly, ignore
    } else if (relativePath === 'not-found.tsx') {
      copyAndTransform(filePath, path.join(srcPages, 'NotFound.tsx'));
    } else if (relativePath.endsWith('page.tsx')) {
      // e.g., about/page.tsx -> About.tsx
      let parts = relativePath.split(path.sep);
      parts.pop(); // remove page.tsx
      
      let newName = parts.map(p => {
        if (p === '[slug]') return 'BlogPost';
        return p.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
      }).join('') + '.tsx';
      
      // For admin nested routes
      if (parts[0] === 'admin' && parts.length > 1) {
        let adminDir = path.join(srcPages, 'admin');
        if (!fs.existsSync(adminDir)) fs.mkdirSync(adminDir, { recursive: true });
        
        newName = parts[1].split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('') + '.tsx';
        copyAndTransform(filePath, path.join(adminDir, newName));
      } else {
        copyAndTransform(filePath, path.join(srcPages, newName));
      }
    } else {
      // Components inside app dir (e.g. LogoutButton.tsx, BlogClient.tsx)
      let parts = relativePath.split(path.sep);
      let newPath = path.join(srcPages, parts.slice(0, -1).join(path.sep), parts[parts.length-1]);
      if (!fs.existsSync(path.dirname(newPath))) fs.mkdirSync(path.dirname(newPath), { recursive: true });
      copyAndTransform(filePath, newPath);
    }
  });
}

// 2. Transform Next.js specifics
function transformContent(content) {
  // 1. Replace next/link
  content = content.replace(/import Link from ["']next\/link["'];?/g, "import { Link } from 'react-router-dom';");
  
  // 2. Replace next/image
  content = content.replace(/import Image from ["']next\/image["'];?/g, "");
  content = content.replace(/<Image([^>]+)\/?>/g, (match, p1) => {
    // Remove specific Next.js image props
    let newProps = p1.replace(/fill/g, '')
                     .replace(/priority/g, '')
                     .replace(/sizes=["'][^"']*["']/g, '');
    return `<img${newProps}/>`;
  });
  
  // 3. Replace next/navigation
  content = content.replace(/import \{ useRouter \} from ["']next\/navigation["'];?/g, "import { useNavigate } from 'react-router-dom';");
  content = content.replace(/const router = useRouter\(\);/g, "const navigate = useNavigate();");
  content = content.replace(/router\.push\(/g, "navigate(");
  content = content.replace(/router\.refresh\(\);?/g, "window.location.reload();");
  
  content = content.replace(/import \{ usePathname \} from ["']next\/navigation["'];?/g, "import { useLocation } from 'react-router-dom';");
  content = content.replace(/const pathname = usePathname\(\);/g, "const location = useLocation();\n  const pathname = location.pathname;");
  
  content = content.replace(/import \{ useSearchParams \} from ["']next\/navigation["'];?/g, "import { useSearchParams } from 'react-router-dom';");

  content = content.replace(/import \{ notFound \} from ["']next\/navigation["'];?/g, "import { useNavigate } from 'react-router-dom';");
  content = content.replace(/notFound\(\);/g, "navigate('/404');");

  // 4. Remove 'use client'
  content = content.replace(/["']use client["'];?\n/g, "");

  // 5. Remove export const metadata
  content = content.replace(/export const metadata.*?};\n?/gs, "");

  return content;
}

function copyAndTransform(src, dest) {
  let content = fs.readFileSync(src, 'utf-8');
  content = transformContent(content);
  fs.writeFileSync(dest, content);
  console.log(`Migrated: ${src} -> ${dest}`);
}

// 3. Process components directory
function processComponents() {
  const componentsDir = path.join(__dirname, 'src', 'components');
  if (fs.existsSync(componentsDir)) {
    walkDir(componentsDir, (filePath) => {
      if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
      let content = fs.readFileSync(filePath, 'utf-8');
      let newContent = transformContent(content);
      if (content !== newContent) {
        fs.writeFileSync(filePath, newContent);
        console.log(`Updated Component: ${filePath}`);
      }
    });
  }
}

migratePages();
processComponents();

// Move API
const destApi = path.join(__dirname, 'api');
if (fs.existsSync(path.join(srcApp, 'api'))) {
  if (!fs.existsSync(destApi)) fs.mkdirSync(destApi);
  // Just rename it for now, we will refactor them later
  fs.cpSync(path.join(srcApp, 'api'), destApi, { recursive: true });
  console.log("Moved api to root.");
}

console.log("Migration script complete.");
