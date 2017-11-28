const requireFolder = require('apl-require-folder');
const path = require('path');

module.exports = requireFolder(path.join(__dirname, 'lib'));
