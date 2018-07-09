# NpmPackHelper
用于批量打包某目录下的所有库（含有package.json的文件夹），并将.tgz文件拷贝到指定目录，最后生成安装本地库的脚本。

## [config](config/index.js)
- ignores 忽略规则，用于配置忽略的目录或文件的（相对或绝对）路径，支持正则表达式
- 其他配置项 详见代码中注释

## lib
### [cmd_helper](lib/cmd_helper.js)
- setConsoleEncoding 设置控制台输出的编码，默认为'65001'，即UTF-8编码
- execSync 同步执行cmd命令的函数，即childProcess模块的execSync函数
- execAsync 异步执行cmd命令的函数，对childProcess模块的exec函数进行Promise封装

### [fs_helper](lib/fs_helper.js)
对fs模块的扩展，封装了一些业务模块需要用到的功能
- copyFiles 复制源目录（src）下某类型(ext)的文件到目标目录(target)中，支持忽略项
- clearDir 清空指定目录
- deleteDir 删除指定目录
- deleteFiles 删除指定目录下某类型(ext)的文件
- deleteFile 删除指定文件
- find 在某目录（包含子目录）中查找指定的文件
- mkdirs 对 fs 模块的 mkdir 函数的扩展，支持多级目录
- ls 列出指定目录下的文件信息
- getFileStat 获取文件的状态
- getFiles 获取某目录（包含子目录）下某类型(ext)的文件，支持忽略项
- gzip 压缩
- unzip 解压
    
### [general_script](lib/general_script.js)
生成安装本地库的脚本文件

### [untgz](lib/untgz.js)
目前无用，待扩展

## 业务模块
### [prebuild](./prebuild.js)
build 的准备工作
- 如果 config.buildPath 存在，则清空，否则创建
- 拷贝[package.json.template](./config/package.json.template)到 config.buildPath 中

### [build](./build.js)
- 获取所有包含package.json的目录（不包括config.ignores中忽略的）
- 遍历包含package.json的目录，并执行打包命令生成`.tgz`文件

### [postbuild](./postbuild.js)
build 的收尾工作
- 拷贝 config.relativeRootPath 目录下所有`.tgz`文件到 config.libPath 目录中
- 生成安装本地库的脚本文件

## 运行
>修改[config](config/index.js)，执行：
```bash
npm run build
```