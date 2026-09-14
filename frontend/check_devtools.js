const fs = require('fs');
const content = fs.readFileSync('frontend/.next/dev/static/chunks/app-pages-internals.js', 'utf8');

const regex = /"[^"]*segment-explorer-node\.js"/g;
let m;
while ((m = regex.exec(content)) !== null) {
  console.log('Match:', m[0]);
}

