const config = require('./config');
const fsHelper = require("./fs_helper");
const generalScript = require('./general_script');
const path = require('path');
const fs = require('fs');

// 拷贝当前目录下所有 .tgz 文件到 ./lib 目录中
const copyFiles = fsHelper.copyFiles(config.relativeRootPath,
    config.libPath, config.libExt, config.ignores);

// 生成脚本文件
generalScript(copyFiles, config);

// 复制package.json.template
fs.copyFileSync(path.join(config.relativeRootPath, 'package.json.template'),
    path.join(config.buildPath, 'package.json'));

// 删除所有 .tgz 文件
fsHelper.deleteFiles(config.relativeRootPath, config.libExt, config.ignores);
