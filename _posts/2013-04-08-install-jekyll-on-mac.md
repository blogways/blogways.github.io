---
layout: post
category: Jekyll
title: MAC OS X 10.8 下安装jekyll
tags: ['jekyll', '部署', 'MAC OSX']
author: 唐 治
email: tangzhi@asiainfo-linkage.com
# image:
description: 本想在本机Macbook pro上装个jekyll,可是本机xcode自动安装了ruby 1.8.7版，导致无法通过当前版本的gem安装jekyll。使用 gem update --system 命令对gem进行升级，可是貌似没有升级成功。所以，我先装了个brew，通过brew安装了最新的ruby，最后通过新版gem成功安装了jekyll.
---

### 一、概述
[jekyll] 是一款简单的博客系统，静态网站生成器。她有一个模版目录，存放整个静态网站的模版文件，可以通过[Liquid]处理模版文件，把使用标记语言[Textile]或[Markdown]编写的内容文件，按照模版格式，转换成最终的静态网站页面。大名鼎鼎的GitHub Pages就是通过她实现的。

本想在本机Macbook pro上装个jekyll,可是本机xcode自动安装了ruby 1.8.7版，导致无法通过当前版本的gem安装jekyll。使用 `gem update --system` 命令对gem进行升级，可是貌似没有升级成功。

所以，我先装了个brew，通过brew安装了最新的ruby，最后通过新版gem成功安装了jekyll.整个过程记录如下。

[jekyll]: https://github.com/mojombo/jekyll/wiki
[Liquid]: https://github.com/shopify/liquid/wiki
[Textile]: http://en.wikipedia.org/wiki/Textile
[Markdown]: http://en.wikipedia.org/wiki/Markdown

### 二、安装Homebrew

[Homebrew]落户于gitHub上，安装是否简单，如下：

	ruby -e "$(curl -fsSL https://raw.github.com/mxcl/homebrew/go)"

打开Terminal, 粘贴上面的语句.该脚本首先将会解释它要做什么, 然后暂停下来, 直到您确认继续. 更多的安装选项在[这里]可以看到 (需要10.5).


[Homebrew]: http://mxcl.github.io/homebrew/index_zh-cn.html
[这里]: https://github.com/mxcl/homebrew/wiki/Installation


### 三、安装最新版ruby

Homebrew安装完成之后，通过她安装最新版ruby.命令如下：

	brew install ruby

最新版ruby安装完成之后，会提示你最新版本安装在`/usr/local/opt/ruby/bin`目录下面。原来的旧版仍然在`/usr/bin`下面.

可以修改环境变量PATH的值，将新版本的路径在查找路径中前置。修改`~/.bash_profile`文件，如下：

	export PATH=/usr/local/opt/ruby/bin:$PATH

修改后`source ~/.bash_profile`或者重新打开一个Terminal，新版Ruby就生效了。

可以通过`ruby --version`查看版本号，我的新版信息如下:

	ruby 2.0.0p0 (2013-02-24 revision 39474) [x86_64-darwin12.3.0]

如果，版本不对，就使用`which ruby`看看，当前生效的ruby是否在`/usr/local/opt/ruby/bin`下，不对，就修改环境变量PATH,如上。

### 四、安装jekyll

有了最新版的ruby,安装jekyll就简单了。

	gem install jekyll 
	
如果使用的标记语言是Markdown，则需要另外安装
	
	gem install rdiscount

如果使用的标记语言是Textile,则需要另外安装

	gem install RedCloth
	
上面三个可以一次性安装，如下

	gem install jekyll rdiscount RedCloth
	
说明：这里安装的jekyll、rdiscount、redcloth都安装在本机的`/usr/local/opt/ruby/bin`目录下面。

另外，如果想和github提供的page环境保持相同的版本，可以安装`github-pages`，这个会保持与github的page版本一致。

    gem install github-pages
   

### 五、运行例子——jekyll作者提供的例子tpw


1. 获取源码，并运行jekyll，命令如下:

		cd ~
		mkdir webroot
		cd webroot
		git clone https://github.com/mojombo/tpw.git
		cd tpw
		jekyll --server
	
	界面显示启动信息，提示端口为4000


1. 在浏览器访问`localhost:4000`，显示博客列表。
1. 相当完美！
2. [说明]新版本的jekyll的命令发生了变化。`jekyll build`用来编译程序；`jekyll serve`用来编译并启动一个web服务。



