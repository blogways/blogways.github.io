---
layout: post
category: Jekyll
title: jekyll 教程入门
tags: ['jekyll', '教程入门']
author: 唐 治
email: tangzhi@asiainfo-linkage.com
image: /images/post/jekyll.png
description: Jekyll是一款简单的博客系统，也可以说是一个静态网站生成器。她有一个模版目录，存放整个静态网站的模版文件，可以通过Liquid处理模版文件，把使用标记语言Textile或Markdown编写的内容文件，按照模版格式，转换成最终的静态网站页面。大名鼎鼎的GitHub Pages就是通过她实现的。在这里，我们将告诉你如果使用jekyll搭建一个简单的博客网站
---


## jekyll 教程入门

<div class="code fl">
    <dl>
    <dt>目录</dt>
    <dd>
    <ol>
        <li><a href="#1">安装jekyll</a></li>
        <li><a href="#2">搭建网站框架</a></li>
        <li><a href="#3">编写博文</a></li>
        <li><a href="#4">一些Jekyll网站例子及源码</a></li>
    </ol>
    </dd>
    </dl>
</div>

[jekyll] 是一款简单的博客系统，也可以说是一个静态网站生成器。她有一个模版目录，存放整个静态网站的模版文件，可以通过[Liquid]处理模版文件，把使用标记语言[Textile]或[Markdown]编写的内容文件，按照模版格式，转换成最终的静态网站页面。大名鼎鼎的GitHub Pages就是通过她实现的。

在这里，我们将告诉你如果使用jekyll搭建一个简单的博客网站。


[jekyll]: https://github.com/mojombo/jekyll/wiki
[Liquid]: https://github.com/shopify/liquid/wiki
[Textile]: http://en.wikipedia.org/wiki/Textile
[Markdown]: http://en.wikipedia.org/wiki/Markdown


### <a name="1"></a>一、安装jekyll

---

使用[RubyGems]安装jekyll。安装了Ruby之后，默认会自动安装RubyGems，也可以单独安装RubyGems.

使用RubyGems安装jekyll很简单，命令如下：

	gem install jekyll 
	
如果使用的标记语言是Markdown，则需要另外安装
	
	gem install rdiscount

如果使用的标记语言是Textile,则需要另外安装

	gem install RedCloth

上面三个可以一次性安装，如下

	gem install jekyll rdiscount RedCloth
	
另外，如需安装和github pages相同版本的jekyll，那么不需要安装上面这几个，直接用下面命令安装

	gem install github-pages

如果是Mac环境下面，可能会出现版本问题，无法安装，可以参考我的另外一篇博文——[MAC OS X 10.8 下安装jekyll](/blog/2013/04/08/install-jekyll-on-mac.html) 进行安装。

[RubyGems]: http://rubygems.org/

### <a name="2"></a>二、搭建博客网站框架

jekyll 的内核实际上就是一个格式文本转换引擎，她允许你使用标记语言Markdown或者Textile再或者原始的html语言，编写内容。她通过模版文件，将这些内容转换成最终的静态网页。

一个简单的jekyll网站结构如下：
	
	.
	|-- _config.yml
	|-- _includes
	|-- _layouts
	|   |-- default.html
	|   `-- post.html
	|-- _posts
	|   |-- 2007-10-29-why-every-programmer-should-play-nethack.textile
	|   `-- 2009-04-26-barcamp-boston-4-roundup.textile
	|-- _site
	`-- index.html

在这基本结构中，有几个关键的文件或者目录，其作用如下：

1. **`_config.yml`**

	这是jekyll的主要配置文件。这些配置选项，大部分都可以在启动jekyll时，作为命令行参数执行。只不过，把这些选项配置在文件中，就省去记住他们，且每次执行jekyll时命令也简单一点。
	
	关于jekyll的参数，其实系统已经设置了[默认值]，如无特殊需要，空文件也可以。
	
	个人推荐，可以添加两个参数：
	
		markdown: rdiscount
		pygments: true
	
	**`rdiscount`**是markdown标记语言的一个转换引擎，比默认的`maruku`性能要好一些。
	
	**`pygments`**是支持语法高亮显示的工具。设置开通后，可以通过 `{\% highlight \%}` 标签在博文中嵌入语法高亮的代码。
	
1. **`_includes`**
	
	这个目录的存在是区分高手和普通用户的，嘿嘿。在网站设计中，页面的共有部分，可以存储成一个单独的文件。这样设计可以方便以后的维护。而这个单独的公用文件就存放在这个目录里面。这里面的公用文件，可以被`_layouts`和`_post`目录下面的文件嵌入。其嵌入方法，采用的是Liquid标签实现。比如：`{\% include file.ext \%}`，就指在文件中嵌入公用文件`_includes/file.ext`中的内容。
	
	是不是很方便！？哈哈！
	
1. **`_layouts`**
	
	这个目录下存放的是整个网站的模版文件，可以是一个文件，也可以是一套文件。这个要看整个网站是怎么规划了。
	
1. **`_posts`**

	这个目录是存放你的博文的，整个网站搭建完成后，以后每次添加博文，只需要提交到这个目录下就可以了。
	
	不过，编写的博文，必须符合一定的规则。见下面[编写博文](#3)小节内容。
	
1. **`_site`**
	
	这个目录，是jekyll运行之后生成的。存放着整个网站的最终静态页面。其中的内容，不用去关心。
	
1. **`index.html和其他的 HTML/Markdown/Textile文件`**
	
	这些文件如果包含`YAML`信息块，那么jekyll运行时就会自动对他进行转换。你网站根目录，以及任何不在上述目录下的文件(包括`.html`/`.markdown`/`.md`/`texitle`文件，但不仅这些文件)。
	
1. **其他文件和目录**

	除了上述文件和目录，你还可以添加一些其他的文件或者目录。比如，添加css目录，存放网站的css文件；添加images目录，存放网站涉及到的图片资源。噢，对了，你还可以在网站的根目录下一个网站图标文件`favicon.ico`，这样别人访问你的网站时，体验会更好一点。设计优秀的网站图标，能帮助访问者，更容易记住你的网站哦！	
	
[默认值]: https://github.com/mojombo/jekyll/wiki/Configuration

### <a name="3"></a>三、编写博文

从上一小节的内容，我们知道`_posts`目录下面存放的是我们的博文，这些博文必须满足一定的规则。这里，我将告诉大家相关的规则。

1. 博文的命名是有讲究的，必须符合`YEAR-MONTH-DAY-title.MARKUP`这个格式。
1. 博文的永久链接(PermaLink)生成规则很灵活，可以配置(在`_config.yml`中)。系统内置三种格式：
	
	<table>
	<thead>
	<tr>
	<th> 模版名 </th>
	<th> 模版内容 </th>
	</tr>
	</thead>
	<tbody>
	<tr>
	<td> date </td>
	<td> /:categories/:year/:month/:day/:title/  </td>
	</tr>
	<tr>
	<td> pretty </td>
	<td> /:categories/:year/:month/:day/:title/  </td>
	</tr>
	<tr>
	<td> none </td>
	<td> /:categories/:title.html </td>
	</tr>
	</tbody>
	</table>
	
	目前系统默认格式是`date`。你也可以修改，比如，在`_config.yml`中配置`permalink: pretty`。这样就会生成类似`/2009/04/29/slap-chop/index.html`这样的文件url.除了内置的格式，也可以自定义格式，比如`permalink: /blog/:month-:day-:year/:title.html`。是不是很酷？哈哈！
	
1. 博文可以是用标记语言Markdown或者Textile再或者原始的html语言编写的文本。但是，博文的开头必须包含一个`YAML`信息块。在这个`YAML`信息块，包含一些信息。比如使用的模版，博文的标题等等。给个简单的例子吧，如下：
	
		---
		layout: post
		title: jekyll 教程入门
		---

1. 到此，基本内容已经讲完了。


### <a name="4"></a>四、运行jekyll生成网站

在网站根目录下，运行`jekyll`命令，就可以生成最终的静态网站内容目录`_site`。如果，你还想通过浏览器访问，可以运行下面命令。

	jekyll --server
	
这样，通过`http://localhost:4000`就可以访问你做出来的网站了。

如果你的博客网站是类似`http://localhost:4000/blog/index.html`这样的路径。那么，在运行时，需要添加参数`base-url`来实现，比如：

	jekyll --base-url '/blog' --server


### <a name="5"></a>五、一些Jekyll网站例子及源码

下面给一些建在GitHub上面的jekyll博客，及其源码。

1. [tom.preston-werner.com](http://tom.preston-werner.com/)——[源码](http://github.com/mojombo/mojombo.github.io)
2. [gitready.com](http://gitready.com/)——[源码](http://github.com/gitready/gitready)
3. [zen.id.au](http://zen.id.au/)——[源码](https://github.com/zensavona/zensavona.github.com)

