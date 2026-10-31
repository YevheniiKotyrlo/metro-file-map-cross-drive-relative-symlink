const fs = require('node:fs');
const path = require('node:path');

// node_modules/greeting is a link into the store make-store.js wrote, whose node_modules Metro has to watch.
const greeting = fs.realpathSync(path.join(__dirname, 'node_modules', 'greeting'));

module.exports = {
  watchFolders: [path.resolve(greeting, '..', '..', '..', '..')],
};
