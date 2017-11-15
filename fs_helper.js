const fs = require('fs');
const path = require('path');

/**
 * 递归创建多级目录
 * @param dir
 * @return {boolean}
 */
function mkdirs (dir) {
    if(fs.existsSync(dir)){
        return true;
    }else if(mkdirs(path.dirname(dir))){
        fs.mkdirSync(dir);
        return true;
    }
}

/**
 * 获取文件的状态
 * @param file
 * @returns {*} maybe null
 */
function getFileStat(file) {
    let stat = null;
    try {
        stat = fs.statSync(file);
    } catch (e) {
        console.log(e);
    }
    return stat;
}

/**
 * 删除文件
 * @param file
 */
function deleteFile(file) {
    if (!fs.existsSync(file)) {
        console.log('%s is not exists.', file);
        return;
    }
    fs.unlinkSync(file);
}

/**
 * 清空并删除目录
 * @param dir
 */
function deleteDir(dir) {
    if (!fs.existsSync(dir)) {
        console.log('%s is not exists.', dir);
        return;
    }
    let files = fs.readdirSync(dir);
    files.map(function (file) {
        return path.join(dir, file);
    }).forEach(function (file) {
        let fileStat = getFileStat(file);
        if (!fileStat) {
            return;
        }
        if (fileStat.isDirectory()) {
            deleteDir(file);
        } else {
            fs.unlinkSync(file);
        }
    });
    fs.rmdirSync(dir);
}


/**
 * 获取 dir 及其子目录下的所有的 ext 格式文件，可通过 ignores 设置忽略
 * @param dir 目录
 * @param ext 扩展名
 * @param ignores 需要被忽略的文件或目录(相对路径会被转为绝对路径)
 */
function getFiles(dir, ext, ignores) {
    if (!dir) {
        throw new Error('dir is %s', dir);
    }
    if (!ext) {
        throw new Error('ext is %s.', ext);
    }
    // 验证原目录是否存在
    if (!fs.existsSync(dir)) {
        throw new Error(dir + ' is not exists.');
    }
    // 格式化忽略项
    if (!ignores) {
        ignores = [];
    } else {
        ignores = ignores.map(function (file) {
            return path.isAbsolute(file) ? file : path.resolve(file);
        });
    }
    let files = fs.readdirSync(dir);
    let fileSet = [];
    files.map(function (file) {
        // 转为绝对路径
        return path.resolve(path.join(dir, file));
    }).filter(function (file) {
        // 过滤忽略项
        let isNotIgnore = ignores.indexOf(file) === -1;
        if (!isNotIgnore) {
            console.log('ignore:', file);
        }
        return isNotIgnore;
    }).forEach(function (file) {
        // 遍历当前目录及子目录下的文件
        let fileStat = getFileStat(file);
        if (!fileStat) {
            return;
        }
        if (fileStat.isDirectory()) {
            fileSet = fileSet.concat(getFiles(file, ext));
        } else if (ext === path.extname(file)) {
            fileSet.push(file)
        }
    });
    return fileSet;
}


/**
 * 删除 dir 目录下的所有 ext 格式文件
 * @param dir 目录
 * @param ext 扩展名
 * @param ignores 需要被忽略的文件或目录(相对路径会被转为绝对路径)
 */
function deleteFiles(dir, ext, ignores) {
    getFiles(dir, ext, ignores).forEach(function (file) {
        fs.unlinkSync(file);
        console.log("unlink file %s", file);
    });
}


/**
 *
 * 拷贝src目录下的所有ext格式文件到target目录中
 * @param src 原目录
 * @param target 目标目录
 * @param ext 扩展名
 * @param ignores 需要被忽略的文件或目录(相对路径会被转为绝对路径)
 * @return {Array|*|{}} 拷贝后的文件路径数组
 */
function copyFiles(src, target, ext, ignores) {
    if (!target) {
        throw new Error('target is %s.', target);
    }
    if (!mkdirs(target)) {
        throw new Error('%s is not exists and make directory failed.', target);
    }
    // 格式化忽略项
    if (!ignores) {
        ignores = [];
    } else {
        if (ignores.indexOf(target) === -1) ignores.push(target);
        ignores = ignores.map(function (file) {
            return path.isAbsolute(file) ? file : path.resolve(file);
        });
    }
    return getFiles(src, ext, ignores).map(function (file) {
        let dest = path.join(target, path.basename(file));
        console.log("copy %s to %s", file, dest);
        fs.copyFileSync(file, dest);
        return path.resolve(dest);
    });
}

exports.mkdirs = mkdirs;
exports.getFileStat = getFileStat;
exports.deleteFile = deleteFile;
exports.deleteDir = deleteDir;
exports.getFiles = getFiles;
exports.deleteFiles = deleteFiles;
exports.copyFiles = copyFiles;