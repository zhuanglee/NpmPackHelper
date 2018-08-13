module.exports = {
    // 待打包的目标父目录
    targetPath:'./libs',
    // build的相对路径
    buildPath: './build',
    // lib的相对路径
    libPath: './build/lib',
    // package.json.template的目录
    templatePath:'./config/package.json.template',
    // 生成的安装包的扩展名（固定的）
    libExt: '.tgz',
    // 脚本中lib的相对路径
    scriptLibPath: './lib',
    // windows 安装脚本的相对路径
    batScript: './build/install_tgz.bat',
    // linux 安装脚本的相对路径
    bashScript: './build/install_tgz.sh',
    // 忽略规则：用于配置忽略的目录或文件的（相对或绝对）路径，支持正则表达式
    ignores: ['./.idea', './build', './lib', /([\\|\/]node_modules[\\|\/]?)/],
};