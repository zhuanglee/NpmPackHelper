module.exports = {
    // 相对根目录
    relativeRootPath:'./',
    // build的相对路径
    buildPath: './build',
    // lib的相对路径
    libPath: './build/lib',
    // 生成的安装包的扩展名（固定的）
    libExt: '.tgz',
    // 脚本中lib的相对路径
    scriptLibPath: './lib',
    // windows 安装脚本的相对路径
    batScript: './build/install_tgz.bat',
    // linux 安装脚本的相对路径
    bashScript: './build/install_tgz.sh',
    // 忽略的目录或文件的（相对或绝对）路径
    ignores: ['./.idea','./build','./lib']
};