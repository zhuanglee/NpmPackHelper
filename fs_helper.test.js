const config = require('./config');
const fsHelper = require("./fs_helper");
const path = require('path');

function testPath() {
    console.log(path.extname('temp.tgz') === '.tgz');
    console.log(path.join('./lib', 'temp.tgz'));
    console.log(path.join('./', '.idea'));
    console.log(path.join(path.join('./', '.idea'), '.name'));
    console.log(path.dirname('build/lib'));
}

function test() {
    fsHelper.mkdirs('build/lib');
    let files = fsHelper.getFiles(
        config.relativeRootPath, config.libExt, config.ignores);
    console.log(files);
    // 删除 lib 目录
    fsHelper.deleteDir(config.libPath);
    // 删除所有 .tgz 文件
    fsHelper.deleteFiles(config.relativeRootPath, config.libExt, config.ignores);
}

testPath();
// test();


