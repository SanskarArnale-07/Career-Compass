const fs = require('fs');
const content = fs.readFileSync('frontend/.next/dev/static/chunks/main-app.js', 'utf8');

let pos = 0;
while ((pos = content.indexOf('.get(', pos)) !== -1) {
  const snippet = content.slice(Math.max(0, pos - 80), Math.min(content.length, pos + 80)).replace(/\n/g, ' ');
  console.log(`pos ${pos}: ${snippet}`);
  pos += 5;
}
