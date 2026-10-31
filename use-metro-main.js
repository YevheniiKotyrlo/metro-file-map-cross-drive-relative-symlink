// Puts the metro-file-map a react/metro checkout built (`yarn install`, then `node scripts/build.js`)
// in place of the installed one, so the steps run on that checkout's code.
//
// Usage: node use-metro-main.js <a react/metro checkout>
const fs = require('node:fs');
const path = require('node:path');

const checkoutArgument = process.argv[2];
if (checkoutArgument === undefined) {
  console.error('Usage: node use-metro-main.js <a react/metro checkout, built with node scripts/build.js>');
  process.exit(1);
}
const built = path.resolve(checkoutArgument, 'packages', 'metro-file-map', 'build');
if (!fs.existsSync(path.join(built, 'index.js'))) {
  console.error(`${built} holds no build: run yarn install and node scripts/build.js in the checkout first`);
  process.exit(1);
}
const installed = path.join(__dirname, 'node_modules', 'metro-file-map', 'src');
fs.rmSync(installed, { recursive: true });
fs.cpSync(built, installed, { recursive: true });
console.log(`${installed} now holds ${built}`);
