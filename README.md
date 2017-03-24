## 一、根目录功能说明

暂无


## 二、博客正文及标题编写说明
### jekyll变量声明

	---
	layout: post 	<== 固定（模板）
	category: JUnit            <== 分类名称
	title: JUnit4 使用进阶三     <== 标题名称
	tags: ['Junit4']     <== 标签
	author: 小李      <== 作者姓名
	#image: /images/xxx.jpg    <== 内容相关图片，不声明则使用默认图片（声明去掉'#'即可）
	email: xiaoli@gmail.com   <==  联系邮箱
	description: JUnit4 结合 Hamcrest 提供了一个全新的断言语法 —— assertThat。程序员可以只使用assertThat 一个断言语句，结合 Hamcrest 提供的匹配符，就可以表达全部的测试思想  <== 内容简述
	---

### 内容标题规范
内容当中的分类标题用`<h2></h2>`、`##`表示，如下所示的“**一、 概述**”和“**二、 ruby、gem安装**”：

![](https://github.com/blogways/blogways.github.io/blob/master/images/post/title-2-1.png)

其它的标题逐级递减。


## 三、博文添加
将编写号的`*.md`文件添加到根目录下的`_post/`目录下，

`.md`文件命名格式：`YYYY-MM-DD-XXXX.md`（如：`2014-01-02-jekyll-introduction.md`，

则访问路径为`www.blogways.net/blog/2014/01/02/jekyll-introduction.html`）
在新添加一篇博客之后需要的操作：

1. 删除本地categories文件夹：`rm -r categories`
2. 本地编译工程：`jekyll build` （或者`jekyll serve`）
3. 将_site目录下的categories子目录，添加到根目录下(以便上传github page后生效)：`cp -r _site/categories .`
4. 将_site目录下的categorycount.json文件，添加到根目录下面（一遍上传github page后生效):`cp -r _site/categorycount.json .`

**便捷脚本**

为了方面操作，每次添加博文后，可以执行脚本自动做上述操作，命令如下:

```sh
./pre-build.sh
```

或者添加测试参数执行：

```sh
./pre-build.sh test
```


## 四、作者添加
在新增加作者之后，需要进行如下的后续操作：

1. 在`_author`目录下添加一个`xxxx.html`，其中xxxx为当前作者的唯一标示符，最好为全为英文
2. 其中的内容如下:

        ---
        layout: layout
        name: 姓名（小李）
        page_path: 路径名 （/authors/xiaoli/）
        image: 头像URL （/images/userpic.gif）
        page_tags: 标签 （不需要改）
        page_type: author （不需要改）
        no_content: 暂无
        description: 个人描述/简介
        ---

        {% include authors_list.html %}

# License

The following directories and their contents are Copyright www.blogways.net . You may not reuse anything therein without my permission:

* _posts/
* images/

All other directories and files are MIT Licensed. Feel free to use the HTML and CSS as you please. If you do use them, a link back to http://github.com/mojombo/jekyll would be appreciated, but is not required.
