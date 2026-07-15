const fs = require('fs');
const path = require('path');

const cssMap = {
  'about': 'About',
  'add-ons': 'AddOns',
  'admin': 'Admin',
  'admin/login': 'admin/Login',
  'book-now': 'BookNow',
  'contact': 'Contact',
  'gallery': 'Gallery',
  'packages': 'Packages',
  'themes': 'Themes'
};

for (const [route, component] of Object.entries(cssMap)) {
  const oldCssPath = path.join(__dirname, 'src/app', route, 'page.module.css');
  const newCssPath = path.join(__dirname, 'src/pages', component + '.module.css');
  const tsxPath = path.join(__dirname, 'src/pages', component + '.tsx');
  
  if (fs.existsSync(oldCssPath)) {
    // ensure dir exists
    const dir = path.dirname(newCssPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // rename css file
    fs.renameSync(oldCssPath, newCssPath);
    console.log(`Moved CSS: ${oldCssPath} -> ${newCssPath}`);
    
    // update import in tsx
    if (fs.existsSync(tsxPath)) {
      let content = fs.readFileSync(tsxPath, 'utf-8');
      
      const componentName = path.basename(component);
      // It was previously changed to import styles from "@/page.module.css";
      // Change it to import styles from "./ComponentName.module.css";
      content = content.replace(/import styles from ["'].*?page\.module\.css["'];/g, `import styles from "./${componentName}.module.css";`);
      
      fs.writeFileSync(tsxPath, content);
      console.log(`Updated TSX: ${tsxPath}`);
    }
  }
}

// Check admin nested pages
const adminPackagesCssPath = path.join(__dirname, 'src/app/packages/page.module.css');
const packageManagerPath = path.join(__dirname, 'src/pages/admin/packages/PackagesManager.tsx');
if (fs.existsSync(packageManagerPath)) {
    let content = fs.readFileSync(packageManagerPath, 'utf-8');
    content = content.replace(/import frontendStyles from ["'].*?page\.module\.css["'];/g, `import frontendStyles from "../../Packages.module.css";`);
    fs.writeFileSync(packageManagerPath, content);
}

// Home page CSS
const homeTsxPath = path.join(__dirname, 'src/pages/Home.tsx');
if (fs.existsSync(homeTsxPath)) {
  let content = fs.readFileSync(homeTsxPath, 'utf-8');
  content = content.replace(/import styles from ["']\.\.?\/?page\.module\.css["'];/g, `import styles from "../page.module.css";`);
  fs.writeFileSync(homeTsxPath, content);
  console.log('Fixed Home CSS import');
}
