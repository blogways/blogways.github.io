---
layout: post
category: Sencha
title: Sencha Touch 体验
tags: ['Sencha Touch', 'Mobile Web', 'Html5']
author: Jacky
email: shenyj5@asiainfo-linkage.com
image:
description: Sencha Touch（下称ST） 框架第一个应用体验。
---

## Sencha Touch 体验

### 下载&&安装
Sencha Touch 2 SDK ：
http://www.sencha.com/products/touch/

SDK Tool：
http://www.sencha.com/products/sdk-tools/download

解压 SDK 后是不能直接打开帮助文档的，需要部署到 web 服务器，通过 WebKit 的浏览器（chrome或者safari等）才能查看自带的帮助文档以及 Demo。

安装好 SDK Tool，在命令窗口输入 sencha 可以查询到 st cmd 相关信息。

### 创建第一个 Sencha Touch 应用

命令行格式：

	sencha generate app 应用的命名空间 app路径

示例：

	E:\program\download\Html5\sencha\touch-2.2.1>sencha generate app myapp ../myapp
	Sencha Cmd v3.1.2.342
	[INF]
	[INF] init-plugin:
	[INF]
	[INF] -before-generate-workspace:
	[INF]
	[INF] cmd-root-plugin.init-properties:
	[INF]
	[INF] init-properties:
	[INF]
	[INF] init-sencha-command:
	[INF]
	[INF] init:
	[INF]
	[INF] generate-workspace-impl:
	[INF]      [echo] generating into E:\program\download\Html5\sencha\touch-2.2.1\..\myapp from D:\program\Sencha\Cmd\3.1.2.342/templates/workspace
	[INF]     [mkdir] Created dir: E:\program\download\Html5\sencha\myapp\packages
	[INF]
	[INF] cmd-root-plugin.copy-framework-to-workspace-impl:
	[INF] [propertyfile] Updating property file: E:\program\download\Html5\sencha\myapp\.sencha\workspace\sencha.cfg
	[INF]
	[INF] copy-framework-to-workspace-impl:
	[INF]      [copy] Copying 1862 files to E:\program\download\Html5\sencha\myapp\touch
	[INF]      [copy] Copied 218 empty directories to 3 empty directories under E:\program\download\Html5\sencha\myapp\touch
	[INF]      [copy] Copying 1 file to E:\program\download\Html5\sencha\myapp\touch
	[INF]      [copy] Copying 1 file to E:\program\download\Html5\sencha\myapp\touch
	[INF] [propertyfile] Updating property file: E:\program\download\Html5\sencha\myapp\.sencha\workspace\sencha.cfg
	[INF]
	[INF] copy-framework-to-workspace:
	[INF]
	[INF] generate-workspace:
	[INF]
	[INF] -after-generate-workspace:
	[INF]
	[INF] init-plugin:
	[INF]
	[INF] cmd-root-plugin.init-properties:
	[INF]
	[INF] init-properties:
	[INF]
	[INF] init-sencha-command:
	[INF]
	[INF] init:
	[INF]
	[INF] before-upgrade:
	[INF]
	[INF] generate-app-impl:
	[INF]
	[INF] generate-starter-app:
	[INF]     [mkdir] Created dir: E:\program\download\Html5\sencha\myapp\app\profile
	[INF]
	[INF] copy-sdk:
	[INF]      [copy] Copying 1 file to E:\program\download\Html5\sencha\myapp\resources\css
	[INF]      [copy] Copying 4 files to E:\program\download\Html5\sencha\myapp\resources\sass\stylesheets
	[INF] [x-property-file] Updating property file: E:\program\download\Html5\sencha\myapp\.sencha\app\sencha.cfg
	[INF]
	[INF] after-upgrade:
	[INF]
	[INF] generate-app:
	[INF]
	[INF] -after-generate-app:
	[INF] [x-property-file] Updating property file: E:\program\download\Html5\sencha\myapp\.sencha\app\sencha.cfg

将产生的 myapp 项目部署到 web 服务器，通过 chrome 浏览器查看应用是否创建成功。

![第一个 Sencha Touch 应用](/images/st-1.png)

### 项目结构分析
将生成的项目使用 IDE 打开

![Sencha Touch 项目结构](/images/st-2.png)

app - 目录，MVC 相关程序文件，下一章会做详细介绍
app.js - 应用的 js 入口文件
app.json - 应用配置文件，ST 采用动态加载 js 以及 css 文件机制，在 html 文件里面只需要加载 `touch/microloader/development.js` js 文件就可以了，其他的都配在这个文件里面
index.html - 应用入口 index 文件
packager.json - 打包原生程序的配置文件
resources - 目录，项目资源文件
touch - Sencha Touch SDK的副本

### 编译打包
这个时候的项目虽然都能正常运行，但项目明显太大了，因为整个 ST sdk 的东西都包含在里面，而且目录也很多，通过打包将代码都打到一个文件夹里面，去除不必要的项目文件，形成最简洁的项目文件。

命令

	sencha app build package

进入项目根目录下

	E:\program\download\Html5\sencha\myapp>sencha app build package
	[INF] Saving certificate as D:\Program Files\Sencha\cmd\Sencha\Cmd\repo\pkgs\cer
	t.json
	[INF] Saving private key as D:\Program Files\Sencha\cmd\Sencha\Cmd\repo\.sencha\
	repo\private-key.json
	Sencha Cmd v3.1.2.342
	[INF]
	[INF] init-plugin:
	[INF]
	[INF] cmd-root-plugin.init-properties:
	[INF]
	[INF] init-properties:
	[INF]
	[INF] init-sencha-command:
	[INF]
	[INF] init:
	[INF]
	[INF] app-build-impl:
	[INF]
	[INF] -before-init-local:
	[INF]
	[INF] -init-local:
	[INF]
	[INF] -after-init-local:
	[INF]
	[INF] init-local:
	[INF]
	[INF] find-cmd:
	[INF]
	[INF] -before-init:
	[INF]
	[INF] -init:
	[INF] Initializing Sencha Cmd ant environment
	[INF] Adding antlib taskdef for com/sencha/command/compass/ant/antlib.xml
	[INF] [x-load-properties] Loading optional properties file E:\program\download\H
	tml5\sencha\myapp\.sencha\app\package.properties
	[INF] [x-load-properties] Loading required properties file E:\program\download\H
	tml5\sencha\myapp\.sencha\app\build.properties
	[INF]
	[INF] -after-init:
	[INF]
	[INF] -before-init-default:
	[INF]
	[INF] -init-default:
	[INF]
	[INF] -after-init-default:
	[INF]
	[INF] init:
	[INF]
	[INF] -before-build:
	[INF]
	[INF] sass:
	[INF]
	[INF] -before-sass:
	[INF]
	[INF] -sass:
	[INF] executing compass using system installed ruby runtime
	Error loading gem paths on load path in gem_prelude
	can't modify frozen string
	<internal:gem_prelude>:69:in `force_encoding'
	<internal:gem_prelude>:69:in `set_home'
	<internal:gem_prelude>:38:in `dir'
	<internal:gem_prelude>:76:in `set_paths'
	<internal:gem_prelude>:47:in `path'
	<internal:gem_prelude>:286:in `push_all_highest_version_gems_on_load_path'
	<internal:gem_prelude>:355:in `<compiled>'
	   remove ../css/app.css
	   create ../css/app.css
	[INF]
	[INF] -after-sass:
	[INF]
	[INF] page:
	[INF]
	[INF] -before-page:
	[INF]
	[INF] -page:
	[INF] building application
	[INF] Deploying your application to E:\program\download\Html5\sencha\myapp\build
	\myapp\package
	[INF] Copied E:\program\download\Html5\sencha\myapp\app.js to E:\program\downloa
	d\Html5\sencha\myapp\build\myapp\package\app.js
	[INF] Copied E:\program\download\Html5\sencha\myapp\resources\css\app.css to E:\
	program\download\Html5\sencha\myapp\build\myapp\package\resources\css\app.css
	[WRN] File or folder E:\program\download\Html5\sencha\myapp\resources\images not
	 found
	[INF] Copied E:\program\download\Html5\sencha\myapp\resources\icons
	[INF] Copied E:\program\download\Html5\sencha\myapp\resources\startup
	[INF] Resolving your application dependencies (file:///E:/program/download/Html5
	/sencha/myapp/index.html)
	[INF] Compiling app.js and dependencies
	[INF] Loading classpath entry E:\program\download\Html5\sencha\myapp\touch\src
	[INF] Loading classpath entry E:\program\download\Html5\sencha\myapp\app.js
	[INF] Loading classpath entry E:\program\download\Html5\sencha\myapp\app
	[INF] Concatenating output to file E:\program\download\Html5\sencha\myapp\build\
	myapp\package\app.js
	[INF] Completed compilation.
	[INF] Processed remote file touch/sencha-touch.js
	[INF] Processed local file app.js
	[INF] Minified app.js
	[INF] Generated app.json
	[INF] Embedded microloader into index.html
	[INF] Successfully deployed your application to E:\program\download\Html5\sencha
	\myapp\build\myapp\package
	[INF]
	[INF] -after-page:
	[INF]
	[INF] run:
	[INF]
	[INF] -build:
	[INF]
	[INF] -after-build:
	[INF]
	[INF] build:
	[INF]
	[INF] app-build:

执行有报错，貌似也没什么多大的影响，查看根目录下 build 文件里面会生成打包后的项目文件。

注意，这个地方的打包并不是说将 web 应用打包成终端的 native 应用，ST 的 cmd 虽然提供打包功能，但打出来的包问题太多，目前并不推荐使用，打包本地应用在后面章节再做介绍，如果实在想看效果的话，网上有几个在线打包工具可以试下。