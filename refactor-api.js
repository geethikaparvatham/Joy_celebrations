const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, 'api');

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function refactorApiRoutes() {
  const routes = [];
  walkDir(apiDir, (filePath) => {
    if (filePath.endsWith('route.ts')) {
      routes.push(filePath);
    }
  });

  routes.forEach(filePath => {
    // e.g. api/booking/save/route.ts -> api/booking/save.ts
    const dir = path.dirname(filePath);
    const newFilePath = dir + '.ts';
    
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Replace NextResponse with standard res.status().json()
    content = content.replace(/import \{ NextResponse \} from ['"]next\/server['"];?\n?/g, '');
    content = content.replace(/export async function GET\(request: Request\) \{/g, 'export default async function handler(req, res) {\n  if (req.method === "GET") {');
    content = content.replace(/export async function GET\(\) \{/g, 'export default async function handler(req, res) {\n  if (req.method === "GET") {');
    content = content.replace(/export async function POST\(request: Request\) \{/g, 'export default async function handler(req, res) {\n  if (req.method === "POST") {');
    content = content.replace(/export async function PATCH\(request: Request\) \{/g, 'export default async function handler(req, res) {\n  if (req.method === "PATCH") {');
    
    content = content.replace(/const body = await request\.json\(\);/g, 'const body = req.body;');
    
    content = content.replace(/return NextResponse\.json\((.*?)\);/g, 'return res.status(200).json($1);');
    content = content.replace(/return NextResponse\.json\((.*?), \{ status: (\d+) \}\);/g, 'return res.status($2).json($1);');

    // Close the if blocks
    content += '\n  return res.status(405).json({ error: "Method not allowed" });\n}';
    
    // For files with multiple exports (GET and PATCH), we need to handle them inside one default export
    if (content.includes('export async function PATCH')) {
       // This is too complex for simple regex. We will do it manually if it has multiple exports.
    }
    
    fs.writeFileSync(newFilePath, content);
    fs.unlinkSync(filePath); // remove route.ts
    
    // Clean up empty directories
    if (fs.readdirSync(dir).length === 0) {
      fs.rmdirSync(dir);
    }
  });
}

refactorApiRoutes();
