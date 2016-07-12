---
layout: post
category: Jekyll
title: windows 下安装jekyll
tags: ['jekyll', '部署', 'Windows']
author: 汤仕忠
email: tangsz@asiainfo-linkage.com
# image:
description: 前面已有文章介绍在mac下安装jekyll，本文中只简单介绍Windows上装jekyll,其中ruby安装的版本是ruby 1.9.1p430，对于其他ruby版本安装jekyll中出现问题此处不做说明
---

### 一、ruby安装
1. 下载 [ruby]
2. 配置环境变量，path中添加ruby安装环境变量
3. 执行 ruby --version 检查ruby是否安装成功


[ruby]: http://www.ruby-lang.org/en/



### 二、DevKit
1.  下载 [DevKit]
3.  解压DevKit，命令行下到DevKit目录，执行ruby dk.rb init    ruby dk.rb install

[DevKit]: https://github.com/oneclick/rubyinstaller/downloads/


### 三、安装jekyll
1. 执行gem install jekyll
2. 执行gem install rdiscount
3. 打开命令窗口到博客工程根目录下执行jekyll --server，如果此处报字符集错误，请先设置环境变量执行
   set LC_ALL=en_US.UTF-8，set  LANG=en_US.UTF-8，2.0及以后版本此方法不行，需修将ruby安装
   目录下lib\ruby\gems\2.0.0\gems\jekyll-1.2.0\lib\jekyll下convertible.rb文件中
   self.content = File.read(File.join(base, name))改为
   self.content = File.read(File.join(base, name), :encoding => "utf-8")，lib\ruby\gems\2.0.0\gems\jekyll-1.2.0\lib\jekyll\tags下include.rb文件中
   source = File.read(File.join(includes_dir, @file))改为
   source = File.read(File.join(includes_dir, @file), :encoding => "utf-8")，然后再执行jekyll --server
   
4. 服务启动成功后，在浏览器访问`localhost:4000`，显示博客列表



