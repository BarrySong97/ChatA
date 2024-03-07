## 快速开始

### 开发

可以把包管理工具换成对应 npm，yarn

electron postinstall 已配置镜像，如果安装缓慢可以考虑检查镜像是否正常，镜像配置在`.npmrc` `electron_mirror`

```bash
pnpm i
```

```bash

pnpm run dev
```

### 构建

```bash
pnpm run build
```

只构建代码正在运行的平台，如果当前使用 macos 只会构建 macos 的安装包，此命令可以用于快速检验打包之后的运行结果。

如果需要全平台请使用`pnpm run build`，会一次性构建三个平台，就是比较慢

```bash
build:only
```
