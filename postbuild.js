const config = require('./config');
const fsHelper = require("./lib/fs_helper");
const generalScript = require('./lib/general_script');

// 拷贝 config.relativeRootPath 目录下所有 .tgz 文件到 config.libPath 目录中
const copyFiles = fsHelper.copyFiles(config.relativeRootPath,
    config.libPath, config.libExt, config.ignores, true);

// 删除所有 .tgz 文件
// let ignores = config.ignores.concat(config.libPath);// 忽略config.libPath
// fsHelper.deleteFiles(config.relativeRootPath, config.libExt, ignores);

// 生成安装本地库的脚本文件
generalScript(copyFiles, config);

