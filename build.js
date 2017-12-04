const path = require('path');
const config = require('./config');
const fsHelper = require('./lib/fs_helper');
const cmdHelper = require('./lib/cmd_helper');

let ignores = config.ignores.concat('./package.json');

let packages = fsHelper.find(config.relativeRootPath, 'package.json', ignores).map(function (file) {
    return path.dirname(file);
});
let tgzFiles = packages.map(function (dir) {
    let result = cmdHelper.execSync('cd ' + dir + '&& npm pack');
    result = path.join(dir, result.toString().replace('\n', ''));
    console.log('general ', result);
    return result;
});

module.exports = tgzFiles;