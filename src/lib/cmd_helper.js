const childProcess = require('child_process');
const exec = childProcess.exec;
const execSync = childProcess.execSync;

/**
 * 设置控制台输出的编码
 * @param encoding 编码代号（默认为'65001'，即UTF-8编码）
 */
function setConsoleEncoding(encoding = '65001') {
    let result = execSync('CHCP').toString();
    let isNeedReset = result.indexOf(encoding) === -1;
    console.log(result, 'is ', isNeedReset ? 'not' : '', encoding);
    if (isNeedReset) {
        try {
            console.log(execSync('CHCP ' + encoding).toString());
        } catch (e) {
            console.warn('设置CMD编码为%s时出错', encoding);
        }
    }
}

/**
 * 执行指定命令
 * @param cmd
 * @return {Promise}
 */
function execAsync(cmd) {
    return new Promise(function (resolve, reject) {
        exec(cmd, function (err, stdout, stderr) {
            if (err || stderr) {
                reject(err, stderr);
            } else {
                resolve(stdout);
            }
        });
    });
}

// 设置CMD编码为:UTF-8
setConsoleEncoding();

module.exports = {setConsoleEncoding, execSync, execAsync};