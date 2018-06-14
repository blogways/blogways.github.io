---
layout: post
title: cordova插件的使用与开发
category: ['杂记']
tags: ['cordova', 'webapp']
author: 唐 治
email:
description: cordova插件使用与开发
---


|  |  *目 录* |
| --- | --- |
| 1 | [使用插件](#use_plugin) |
| 2 | [开发插件](#dev_plugin) |
| 3 | [参考文献](#reference) |

使用cordova可以开发手机App的绝大部分功能。如想给你的App增加更多的偏手机级别特性功能，可以通过cordova插件实现。cordova插件很多，有官方的，也有社区开源的，还可以自己定制。

下面简单介绍一下，插件的使用与开发。


## 一、使用插件 <a href="use_plugin"></a>

两种方法都可以帮你的cordova项目添加插件：

### 1.1 方法一

使用`cordova plugin`命令。属于套装命令，快速搞定所有平台。

```
cordova {plugin | plugins} [
    add <plugin-spec> [..] {--searchpath=<directory> | --noregistry | --link | --save | --browserify | --force | --nofetch} |
    {remove | rm} {<pluginid> | <name>} --save --nofetch |
    {list | ls} |
    search [<keyword>] |
    save |
]
```

举例：

* 安装 `cordova-plugin-camera`和`cordova-plugin-file`两个插件:

  ```
cordova plugin add cordova-plugin-camera cordova-plugin-file
```

* 从指定git仓库安装插件：

  ```
cordova plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-device.git
```

* 从指定本地目录安装插件:

  ```
cordova plugin add ../cordova-plugin-camera
```
 
* 从指定tar包安装插件:

  ```
cordova plugin add ../cordova-plugin-camera.tgz
```

* 删除插件：

  ```
cordova plugin rm camera
```

* 查看项目中已安装插件：

  ```
cordova plugin ls
```

### 1.2 方法二：

使用底层命令`Plugman`去管理插件，可以更灵活地实现安装。

#### 1.2.1 安装Plugman

```
npm install -g plugman
```

#### 1.2.2 安装插件

```
plugman install --platform <ios|android|blackberry10|wp8> --project <directory> --plugin <name|url|path> [--plugins_dir <directory>] [--www <directory>] [--variable <name>=<value> [--variable <name>=<value> ...]]
```

举例，在`android`平台下安装`cordova-plugin-camera`插件：

```
plugman install --platform android --project myProject --plugin cordova-plugin-battery-status
```

#### 1.2.3 删除插件

```
plugman uninstall --platform <ios|android|blackberry10|wp8> --project <directory> --plugin <id> [--www <directory>] [--plugins_dir <directory>]
```


## 二、开发插件 <a href="dev_plugin"></a>


### 2.1 插件目录结构

一般，一个插件的目录结构如下：

```
.
├── src
│   ├── android
│   ├── ios
│   └── windows
├── www
├── package.json
└── plugin.xml
```

#### 2.1.1 `plugin.xml`

plugin.xml 内容大约如下：

```
<?xml version="1.0" encoding="UTF-8"?>
<plugin xmlns="http://apache.org/cordova/ns/plugins/1.0"
        id="cordova-plugin-device" version="0.2.3">
    <name>Device</name>
    <description>Cordova Device Plugin</description>
    <license>Apache 2.0</license>
    <keywords>cordova,device</keywords>
    <js-module src="www/device.js" name="device">
        <clobbers target="device" />
    </js-module>
    <platform name="ios">
        <config-file target="config.xml" parent="/*">
            <feature name="Device">
                <param name="ios-package" value="CDVDevice"/>
            </feature>
        </config-file>
        <header-file src="src/ios/CDVDevice.h" />
        <source-file src="src/ios/CDVDevice.m" />
    </platform>
</plugin>
```

其中：

* `xmlns`设置命名空间，一般为：`http://apache.org/cordova/ns/plugins/1.0`
* `id`为插件的标识
* `version`为插件版本
* `name`、`description`、`license`、`keywords`，顾名思义，不解释。
* `js-module`.大部分插件都包含一到多个Javascript文件，每个`js-module`包含一个js文件。`src`是文件路径，`name`是可以通过`cordova.require`在其他js文件中导入这个js文件。
* `clobbers`是js模块导出到`window`对象下的命名空间。
* `platform`是指定对应平台下的代码文件及相关设置。

更多约定可以查看[plugin.xml规范](http://cordova.apache.org/docs/en/latest/plugin_ref/spec.html)。

#### 2.1.2 `www`目录

一般插件的Js文件会放在这个目录下。

### 2.1.3 `src`目录

一般下面会按支持的平台新建对应的子目录，比如：`android`、`ios`、`windows`...

具体各平台上功能实现代码都放在对应的子目录内，层次清晰。

### 2.1.4 `package.json`

编辑完`plugin.xml`后，可以通过命令生成`package.json`，如下：

```
plugman createpackagejson /path/to/your/plugin
```


### 2.2 `JavaScript`接口

你可以按需设计你的JavaScript接口，但是需要调用`cordova.exec`来和原生平台进行交互。

```
cordova.exec(<successFunction>, <failFunction>, <service>, <action>, [<args>]);
```

其中：

* `successFunction`：成功后回调函数；
* `failFunction` ： 错误回调函数；
* `service`: 原生侧程序服务名；
* `action`: 原生侧程序动作名；
* `args`: 传给原生侧程序的参数；

举例：

```
window.echo = function(str, callback) {
    cordova.exec(callback, function(err) {
        callback('Nothing to echo.');
    }, "Echo", "echo", [str]);
};
```

### 2.3 Android侧实现代码

#### 2.3.1 service

`plugin.xml`里配置service对应的源码文件：

```
<feature name="<service_name>">
    <param name="android-package" value="<full_name_including_namespace>" />
</feature>
```

举例：

```
<platform name="android">
    <config-file target="config.xml" parent="/*">
        <feature name="Echo">
            <param name="android-package" value="org.apache.cordova.plugin.Echo"/>
        </feature>
    </config-file>

    <source-file src="src/android/Echo.java" target-dir="src/org/apache/cordova/plugin" />
</platform>
```

#### 2.3.2 原生代码

1. 首先，根据需要，可以选择添加`initialize`、`onResume`、`onDestroy`等方法，举例:

        @Override
        public void initialize(CordovaInterface cordova, CordovaWebView webView) {
			    super.initialize(cordova, webView);
			    // your init code here
		}


1. JavaScript接口中的 `cordova.exec` 会执行 Android代码中的 `execute`方法。举例（`src/android/Echo.java`）：


		package org.apache.cordova.plugin;
		import org.apache.cordova.CordovaPlugin;
		import org.apache.cordova.CallbackContext;
		import org.json.JSONArray;
		import org.json.JSONException;
		import org.json.JSONObject;
	
		public class Echo extends CordovaPlugin {
	
			@Override
			public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
			    if (action.equals("echo")) {
			        String message = args.getString(0);
			        this.echo(message, callbackContext);
			        return true;
			    }
			    return false;
			}
			
			private void echo(String message, CallbackContext callbackContext) {
			    if (message != null && message.length() > 0) {
			        callbackContext.success(message);
			    } else {
			        callbackContext.error("Expected one non-empty string argument.");
			    }
			}
  	    }



## 三、参考文献<a name="reference"></a>

* http://cordova.apache.org/docs/en/latest/guide/hybrid/plugins/index.html
* http://cordova.apache.org/docs/en/latest/reference/cordova-cli/index.html#cordova-plugin-command
* http://cordova.apache.org/docs/en/latest/guide/platforms/android/plugin.html
* http://cordova.apache.org/docs/en/latest/plugin_ref/plugman.html
* http://cordova.apache.org/docs/en/latest/guide/platforms/android/plugin.html#echo-android-plugin-example
