let fsHelper = require('./fs_helper');
let files = fsHelper.getFiles('./lib','.tgz');
files.forEach(function (file) {
   fsHelper.unzip(file, file.slice(0, file.lastIndexOf('-')));
});