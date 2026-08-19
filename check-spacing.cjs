const fs = require('fs');
const path = require('path');

const routesDir = 'src/routes';
const files = fs.readdirSync(routesDir).filter(f => f.endsWith('.tsx'));

files.forEach(f => {
  const filePath = path.join(routesDir, f);
  let c = fs.readFileSync(filePath, 'utf8');
  if (c.includes('main className="min-h-screen bg-background text-foreground pb-safe"') && !c.includes('pt-20')) {
    console.log('missing top padding: ' + filePath);
  }
});
