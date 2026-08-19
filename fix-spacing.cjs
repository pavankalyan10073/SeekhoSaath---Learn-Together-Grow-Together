const fs = require('fs');
const files = [
  'src/routes/blogs/index.tsx',
  'src/routes/privacy-policy.tsx',
  'src/routes/refund-policy.tsx',
  'src/routes/terms.tsx',
  'src/routes/about.tsx',
  'src/routes/careers.tsx',
  'src/routes/press.tsx',
  'src/routes/contact.tsx',
  'src/routes/help-center.tsx',
  'src/routes/community.tsx',
  'src/routes/trust-safety.tsx',
  'src/routes/cookies.tsx',
];

files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace('main className="min-h-screen bg-background text-foreground pb-safe"', 'main className="min-h-screen bg-background text-foreground pb-safe pt-20 sm:pt-24"');
  fs.writeFileSync(f, c);
  console.log('fixed ' + f);
});
