const path = require('path');
const fs = require('fs');

/**
 * 生成 npm install 的脚本文件
 * @param tgzFiles 安装包路径数组
 * @param scriptLibPath  脚本中lib的相对路径
 * @param batScript  windows 安装脚本的相对路径
 * @param bashScript  linux 安装脚本的相对路径
 */
function generalScriptForNpmInstall(tgzFiles, {scriptLibPath, batScript, bashScript}) {
    let scripts = tgzFiles.map(function (file) {
        let tgzRelativePath = path.join(scriptLibPath, path.basename(file));
        return 'npm install --save '.concat(tgzRelativePath);
    });
    // 生成 windows 安装脚本
    fs.writeFileSync(batScript, scripts.join(" && "), {encoding: "utf-8"});
    // 生成 linux 安装脚本
    fs.writeFileSync(bashScript, scripts.join("\n"), {encoding: "utf-8"});
}

module.exports = generalScriptForNpmInstall;