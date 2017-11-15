const config = require('./config');
const fsHelper = require("./fs_helper");
const path = require('path');
const fs = require('fs');

// 拷贝当前目录下所有 .tgz 文件到 ./lib 目录中
let copyFiles = fsHelper.copyFiles(config.relativeRootPath,
    config.libPath, config.libExt, config.ignores);
// 生成脚本文件
generalScriptFile(copyFiles, config);


/**
 * 生成脚本文件
 * @param tgzFiles 安装包路径数组
 * @param libPath  lib的相对路径
 * @param batScript  windows 安装脚本的文件名
 * @param bashScript  linux 安装脚本的文件名
 */
function generalScriptFile(tgzFiles, {libPath, batScript, bashScript}) {
    let scripts = tgzFiles.map(function (file) {
        return 'npm install --save '.concat(libPath,' ',path.basename(file));
    });
    // 生成 windows 安装脚本
    fs.writeFileSync(batScript, scripts.join(" && "), {encoding: "utf-8"});
    // 生成 linux 安装脚本
    fs.writeFileSync(bashScript, scripts.join("\n"), {encoding: "utf-8"});
}

