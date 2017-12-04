const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

/**
 * 格式化忽略项
 * @param ignores
 * @return {*}
 * @private
 */
function _formatIgnores(ignores=[]) {
    return ignores.map(function (item) {
        return 'string'!== typeof item
        || path.isAbsolute(item) ? item : path.resolve(item);
    });
}

/**
 * 是否忽略
 * @param ignores 忽略规则
 * @param item 待验证项
 * @return {boolean} true忽略，false不忽略
 */
function _isIgnore(ignores, item) {
    let isIgnore = false;
    for (let ignoreItem of ignores) {
        if (ignoreItem instanceof RegExp) {
            isIgnore = ignoreItem.test(item);
        } else {
            isIgnore = ignoreItem === item;
        }
        if (isIgnore) {
            break;
        }
    }
    return isIgnore;
}

/**
 * 过滤
 * @param ignores 忽略规则
 * @param item 待验证项
 * @return {boolean} true不忽略，false忽略
 */
function _filter(ignores, item) {
    return !_isIgnore(ignores, item);
}

/**
 *
 * 拷贝src目录下的所有ext格式文件到target目录中
 * @param src 原目录
 * @param target 目标目录
 * @param ext 扩展名
 * @param ignores 需要被忽略的文件或目录(相对路径会被转为绝对路径)
 * @param delSrc 是否删除源文件
 * @return {Array|*|{}} 拷贝后的文件路径数组
 */
function copyFiles(src, target, ext, ignores = [target], delSrc = false) {
    if (!target) {
        throw new Error('target is %s.', target);
    }
    if (!mkdirs(target)) {
        throw new Error('%s is not exists and make directory failed.', target);
    }
    if (ignores && ignores.indexOf(target) === -1) {
        ignores.push(target);
    }
    return getFiles(src, ext, ignores).map(function (file) {
        let dest = path.join(target, path.basename(file));
        console.log("copy %s to %s", file, dest);
        fs.copyFileSync(file, dest);
        if(delSrc){
            fs.unlinkSync(file);
        }
        return path.resolve(dest);
    });
}

/**
 * 清空并删除目录
 * @param dir
 */
function clearDir(dir) {
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
            clearDir(file);
            fs.rmdirSync(file);
            // arguments.callee(file);
        } else {
            fs.unlinkSync(file);
        }
    });
}
/**
 * 清空目录
 * @param dir
 */
function deleteDir(dir) {
    clearDir(dir);
    fs.rmdirSync(dir);
    console.log("rmdir %s", dir);
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
        console.log("unlink %s", file);
    });
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
 * 查找指定文件
 * @param dir
 * @param filename 如：package.json
 * @param ignores 忽略规则
 * @return {Array}
 */
function find(dir, filename, ignores = []) {
    let fileSet = [];
    getFiles(dir, path.extname(filename), ignores).forEach(function (file) {
        // 遍历当前目录及子目录下的文件
        let fileStat = getFileStat(file);
        if (!fileStat) {
            return;
        }
        if (fileStat.isDirectory()) {
            fileSet.push(...find(file, filename, ignores));
        } else if (filename === path.basename(file)) {
            fileSet.push(file)
        }
    });
    return fileSet;
}

/**
 * 递归创建多级目录
 * @param dir
 * @return {boolean} 目录是否存在
 */
function mkdirs(dir) {
    if (fs.existsSync(dir)) {
        return true;
    } else if (mkdirs(path.dirname(dir))) {
        fs.mkdirSync(dir);
        return true;
    }
}

/**
 * 列出指定目录下的文件信息
 * @param path
 */
function ls(path) {
    let files = fs.readdirSync(path);
    files.forEach(function (file) {
        console.log(file)
    });
    return files;
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
 * 获取 dir 及其子目录下的所有的 ext 格式文件，可通过 ignores 设置忽略
 * @param dir 目录
 * @param ext 扩展名
 * @param ignores 需要被忽略的文件或目录(相对路径会被转为绝对路径)
 * @param isFirst 是否为第一次调用，默认为true（会格式化忽略规则），递归调用时为false
 * @return {Array}
 */
function getFiles(dir, ext, ignores = [], isFirst = true) {
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
    if (isFirst) {
        ignores = _formatIgnores(ignores);
    }
    let files = fs.readdirSync(dir);
    let fileSet = [];
    files.forEach(function (file) {
        // 转为绝对路径
        file = path.resolve(path.join(dir, file));
        if(_isIgnore(ignores, file)){
            return;// 忽略
        }
        // 遍历当前目录及子目录下的文件
        let fileStat = getFileStat(file);
        if (!fileStat) {
            return;
        }
        if (fileStat.isDirectory()) {
            fileSet.push(...getFiles(file, ext, ignores, false));
        } else if (ext === path.extname(file)) {
            fileSet.push(file)
        }
    });
    return fileSet;
}

/**
 * 压缩
 * @param src
 * @param target
 */
function gzip(src, target) {
    if (!target)
        target = src + ".gz";
    try {
        fs.createReadStream(src)
            .pipe(zlib.createGzip())
            .pipe(fs.createWriteStream(target));
        console.log(src + " 成功压缩到 " + target);
    } catch (e) {
        console.log(e);
    }
}

/**
 * 解压
 * @param src
 * @param target
 */
function unzip(src, target) {
    if (!target)
        target = src.substr(0, src.length - 3);
    try {
        fs.createReadStream(src)
            .pipe(zlib.createUnzip())
            .pipe(fs.createWriteStream(target));
        console.log(src + " 成功解压到 " + target);
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    copyFiles,
    clearDir,
    deleteDir,
    deleteFiles,
    deleteFile,
    find,
    mkdirs,
    ls,
    getFileStat,
    getFiles,
    gzip,
    unzip
};
