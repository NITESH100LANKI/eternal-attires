const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

function findAndReplace(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findAndReplace(filePath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      const hasHttpReplaces = content.includes("'http://localhost:5000");
      
      if (hasHttpReplaces) {
          // Replace with an inline environment variable fallback string structure safely
          content = content.replace(/'http:\/\/localhost:5000/g, "(process.env.REACT_APP_API_URL || 'http://localhost:5000') + '");
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`Updated ${filePath}`);
      }
    }
  });
}

findAndReplace(directoryPath);
console.log('Finished updating URLs');
