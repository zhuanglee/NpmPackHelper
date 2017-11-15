const config = require('./config');
let fsHelper = require("./fs_helper");
// 删除 build 目录
fsHelper.deleteDir(config.buildPath);
// 删除所有 .tgz 文件
fsHelper.deleteFiles(config.relativeRootPath, config.libExt, config.ignores);

