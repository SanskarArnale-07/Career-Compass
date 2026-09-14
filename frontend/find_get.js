const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.js')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('frontend/.next/dev/static/chunks');
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let pos = 0;
  let count = 0;
  while ((pos = content.indexOf('.get(', pos)) !== -1) {
    const snippet = content.slice(Math.max(0, pos - 40), Math.min(content.length, pos + 60)).replace(/\n/g, ' ');
    // Filter out obvious ones like Map.get or Element.getAttribute
    if (!snippet.includes('RefreshHelpers') && !snippet.includes('Map') && !snippet.includes('getClientRects') && !snippet.includes('getElementById') && !snippet.includes('getElementsByName')) {
      console.log(`[${path.basename(file)}] ${snippet}`);
    }
    pos += 5;
    count++;
  }
});


