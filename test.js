const assert = require('assert');
const config = require('./config');
const fsHelper = require("./src/lib/fs_helper");
const cmdHelper = require("./src/lib/cmd_helper");
const path = require('path');
const fs = require('fs');


function testPath() {
    console.log(path.extname('temp.tgz') === '.tgz');
    console.log(path.join('./lib', 'temp.tgz'));
    console.log(path.join('./', '.idea'));
    console.log(path.join(path.join('./', '.idea'), '.name'));
    console.log(path.dirname('build/lib'));
    // 测试正则
    let regExp = /([\\|\/]node_modules[\\|\/]?)/;
    console.log(regExp);
    console.log(regExp.test('./apl-connect/node_modules'));
    console.log(regExp.test('.\\apl-connect\\node_modules\\'));
}

function testFsHelper() {
    fsHelper.mkdirs('build/lib');
    // 查找所有扩展名为 '.tgz' 的文件
    let files = fsHelper.getFiles(
        config.targetPath, config.libExt, config.ignores);
    console.log('getFiles', files);
    // 查找所有 package.json 文件
    let ignores = config.ignores.concat('./package.json');
    let packages = fsHelper.find(config.targetPath,
        'package.json', ignores).map(function (file) {
        return path.dirname(file);
    });
    console.log('find package.json\n', packages);
    // 删除 lib 目录
    fsHelper.deleteDir(config.libPath);
    // 清空目录
    fsHelper.clearDir(config.buildPath);
    // 删除所有 .tgz 文件
    fsHelper.deleteFiles(config.targetPath,
        config.libExt, config.ignores);
}

function testCopyPackageJson() {
    // 复制package.json.template
    fs.copyFileSync(path.join(config.targetPath, './config/package.json.template'),
        path.join(config.buildPath, 'package.json'));
}

function testCMD() {
    console.log(cmdHelper.execSync('dir').toString());
    cmdHelper.execAsync('cd apl-connect && npm pack').then(function (stdout) {
        console.log(stdout);
    }).catch(err=>console.log(err));
}

// testPath();
testFsHelper();
// testCopyPackageJson();
// testCMD();




