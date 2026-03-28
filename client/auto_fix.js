const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function fixFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixFiles(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;

      // 1. Replace the awful string concatenation: (process.env...) + '/api/...'
      // Becomes `${BASE_URL}/api/...`
      content = content.replace(/\(process\.env\.REACT_APP_API_URL \|\| 'http:\/\/localhost:5000'\) \+ '([^']+)'/g, '`${BASE_URL}$1`');
      
      // 2. Replace hardcoded localhost in template literals: `http://localhost:5000/api/products/${id}`
      // Becomes `${BASE_URL}/api/products/${id}`
      content = content.replace(/http:\/\/localhost:5000/g, '${BASE_URL}');

      // 3. Inject the BASE_URL declaration if we modified any URLs
      if (content !== originalContent && !content.includes('const BASE_URL =')) {
        // Insert after the last import statement
        const lastImportRegex = /(import.*?;?\n)(?!import)/;
        if (lastImportRegex.test(content)) {
            content = content.replace(lastImportRegex, match => {
                return match + '\nconst BASE_URL = "https://eternal-attires.onrender.com";\n';
            });
        } else {
             content = 'const BASE_URL = "https://eternal-attires.onrender.com";\n' + content;
        }
      }

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✅ Fixed APIs in ${fullPath}`);
      }
    }
  }
}

fixFiles(srcDir);

// Finally, inject global axios.defaults.withCredentials = true into index.js
const indexFile = path.join(srcDir, 'index.js');
if (fs.existsSync(indexFile)) {
    let indexContent = fs.readFileSync(indexFile, 'utf8');
    if (!indexContent.includes('axios.defaults.withCredentials = true;')) {
        // Place it right after the imports
        const lastImportRegex = /(import.*?;?\n)(?!import)/;
        indexContent = indexContent.replace(lastImportRegex, match => {
            return match + '\nimport axios from "axios";\naxios.defaults.withCredentials = true;\n';
        });
        fs.writeFileSync(indexFile, indexContent, 'utf8');
        console.log(`✅ Injected Global Credentials into index.js`);
    }
}
