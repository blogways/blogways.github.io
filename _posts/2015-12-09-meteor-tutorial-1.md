---
layout: post
category: Node.js
title: meteor入门学习笔记一：开始
tags: ['meteor','javascript', '入门', '学习笔记']
author: 唐 治
description: Meteor是一个Javascript应用框架。可以轻松构建高品质的实时Web应用程序或移动端App。
---

这几天在学习Meteor，当前版本为:`1.2.1`。学习的主要资料来自官网，笔记如下.

## 一、安装

Meteor目前支持OS X，Windows,和Linux主机，安装非常方便。
在Mac OS X 10.7（Lion)以上版本，和基于x86/x86_64架构的Linux主机上，可以通过命令行进行安装。
Window版本的支持Windows 7,Windows 8.1,Windows Server 2008和Windows Server 2012。

### 1.1 OS X 或 Linxu系统

使用下面命令安装：

```sh
curl https://install.meteor.com/ |sh
```

可以使用下面命令删除:

```sh
rm  /usr/local/bin/meteor
rm -rf ~/.meteor
```


### 1.2 Windows系统

猛戳[这里](https://install.meteor.com/windows).

## 二、快速开始

安装Meteor之后，创建一个应用程序非常简单。由于Meteor提供免费的托管，你也可以通过命令，很容易地在线部署到它的免费服务器上，供世界各地的人来浏览。

创建一个新的应用程序：

```sh
meteor create ~/my_cool_app
```

在本地运行：

```sh
cd ~/my_cool_app
meteor
```

本地访问: [http://localhost:3000](http://localhost:3000)


在线部署到他提供的免费服务器上:

```sh
meteor deploy myapp.meteor.com
```

## 三、原则

* **只传输数据。** Meteor不通过网络发送Html，服务器端仅发送数据，由客户端负责渲染页面。
* **Javascript是唯一的开发语言。**整个程序，无论服务器端还是客户端都由Javascript开发。
* **随处都可访问数据库。**无论服务端还是客户端，都使用相同的方法访问数据库。
* **延迟补偿。** 在客户端，采用预读数据和模拟模型，使与服务器的交互如同立即返回.
* **全栈响应式。** Meteor中，默认是实时处理。从数据库到模版层，所有的层级，都是按需自动更新。
* **拥抱开源。**Meteor本身就是开源的，集成了很多开源的工具与框架.
* **简单而高效。**让每一点都很简单，Meteor的主要功能代码都是一些简练而经典的API。

## 四、目录结构

Meteor有固定的目录结构，它可以据此自动加载工程中的各类文件。

### 4.1 默认的加载方式

下文`4.2 特定目录`以外的文件，按以下逻辑处理：

1. HTML模版被编译，发送给客户端。
2. CSS文件也被发送至客户端。在生产模式下，他们会把合并及压缩。
3. Javascript文件会被客户端及服务端调用。可以使用`Meteor.isClient`和`Meteor.isServer`，在代码中区分执行的环境。

如果你想做更多的控制，可以使用Meteor的特定目录。

### 4.2 特定目录

* **`/client`** 这个目录下的所有文件都会被发送到客户端。你可以将 HTML、CSS及和UI有关的Javascript文件都放在这里。
* **`/server`** 这个目录下的所有文件只在服务器端使用，不会暴露给客户端
* **`/public`** 这个目录下的文件也是给客户端使用的，你可以存放诸如图片的一些资源。例如：存放一个图片于`/public/background.png`。那么你可以在HTML模版中，如此引用：`<img src='/background.png'/>`；或者在css文件中，如此引用：`background-image:
url(/background.png)`。需要注意的是：**`/public`不要出现在图片资源URL中。**
* **`/private`** 这个目录下的文件只能在服务器端，被`Assets`API所使用。不对客户端开放。

文件的加载顺序依次按如下规则:

1. HTML模版文件总是最先被加载；
2. `main.`开头的文件，在同类文件中最后被加载；
3. 路径中包含`lib/`的文件被接着加载；
4. 子目录中的文件被接着加载（也就是说，父目录中的文件后加载）；
5. 同一目录下的不同文件按文件名的字母顺序加载；

加载顺序，举例如下：

```
nav.html
main.html
client/lib/methods.js
client/lib/styles.js
lib/feature/styles.js
lib/collections.js
client/feature-y.js
feature-x.js
client/main.js
```

## 五、构建移动端应用

如果使用了Meteor构建了你的web应用，那么你可以很容易地给你的应用打一个原始的包，发布到Google Play商店或者iOS应用商店，做到这些仅仅需要几个命令而已。Meteor在桌面版和移动版之间，已经定制了很多相同的包及API，所以，你不需要太关心移动端应用开发的一些边边角角的琐事。

### 5.1 环境准备

**iOS**

要想使你构建的应用能够在iOS设备或者模拟器上运行，你需要安装[Xcode](https://itunes.apple.com/us/app/xcode/id497799835?ls=1&mt=12).

**Android**

你需要安装Android开发工具以及Java JDK。
Mac环境下的安装可以看[这里](https://github.com/meteor/meteor/wiki/Mobile-Development-Install:-Android-on-Mac)，Linux下的安装细节看[这里]().


### 5.2 添加删除平台

每个Meteor工程都可以设置自己的可以适配的平台。使用`meteor add-platform`命令来向工程中添加平台。

* `meteor add-platform ios` 在工程中添加iOS平台
* `meteor add-platform android` 在工程中添加Android平台
* `meteor remove-platform ios android` 从工程中删除iOS和Android平台
* `meteor list-platforms` 列出工程的目标平台

### 5.3 运行

**在模拟器中运行**

```sh
meteor run android             # for Android
meteor run ios                 # for iOS
```

**在设备上运行**

用USB线连接设备与电脑，输入命令：

```sh
meteor run android-device      # for Android
meteor run ios-device          # for iOS
```

可以指定本地服务器的端口:

```sh
meteor run android-device -p <local port>
meteor run ios-device -p <local port>
```

你也可以使用`--mobile-server`参数来指定客户端访问的服务器ip:

```sh
meteor run android-device --mobile-server <host>:<port>
meteor run io-device --mobile-server <host>:<port>
```

如果运行出错，可以通过`--verbose`打开详细日志:

```sh
meteor run android-device --verbose
```

### 5.4 Cordova侧Javascript代码

在Javascript文件中，类似可以`Meteor.isServer`和`Meteor.isClient`来区分服务器端代码和客户端代码，我们也可以使用`Meteor.isCordova`来区分Cordova侧的代码，这些代码就只会在移动设备中运行。

```javascript
if (Meteor.isServer) {
  console.log("仅在服务器中运行");
}

if (Meteor.isClient) {
  console.log("在浏览器和移动端App中运行");
}

if (Meteor.isCordova) {
  console.log("仅在移动端App中运行");
}
```

另外，有些函数依赖Cordova插件，那么需要包在`Meteor.startup()`代码块内。比如：

```javascript
Meteor.startup(function () {
    // 正确的方式
    navigator.geolocation.getCurrentPosition(success);
});

// 错误，无法正常工作
navigator.geolocation.getCurrentPosition(success);
```

更多细节看[这里](https://github.com/meteor/mobile-packages)。

### 5.5 配置应用的图标和元数据

可以在`mobile-config.js`文件中配置移动App的图标、标题、版本号，启动界面等等元数据。

### 5.6 更多

更多信息可以查看[这里](https://github.com/meteor/meteor/wiki/Meteor-Cordova-integration)。

## 六、参考

* http://docs.meteor.com/
* http://stackoverflow.com/questions/24686971/how-can-i-completely-uninstall-and-then-reinstall-meteor-js
* https://github.com/meteor/meteor/wiki/Meteor-Cordova-integration