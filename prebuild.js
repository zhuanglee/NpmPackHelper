const config = require('./config');
let fsHelper = require("./lib/fs_helper");
const fs = require('fs');
const path = require('path');

// 清空 build 目录
fsHelper.clearDir(config.buildPath);

// 如果不存在，则创建 build 目录
fsHelper.mkdirs(config.buildPath);

// 复制package.json.template
fs.copyFileSync(path.join(config.relativeRootPath, './config/package.json.template'),
    path.join(config.buildPath, 'package.json'));
