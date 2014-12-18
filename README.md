#This is the data for my blog

It is automatically transformed by "Jekyll":http://github.com/mojombo/jekyll into a static site whenever I push this repository to GitHub.

I was tired of having my blog posts end up in a database off on some remote server. That is backwards. I've lost valuable posts that way. I want to author my posts locally in Textile or Markdown. My blog should be easily stylable and customizable any way I please. It should take care of creating a feed for me. And most of all, my site should be stored on GitHub so that I never lose data again.

#License

The following directories and their contents are Copyright www.blogways.net . You may not reuse anything therein without my permission:

* _posts/
* images/

All other directories and files are MIT Licensed. Feel free to use the HTML and CSS as you please. If you do use them, a link back to http://github.com/mojombo/jekyll would be appreciated, but is not required.

##博客添加
将编写号的`*.md`文件添加到根目录下的`_post/`目录下，`.md`文件命名格式：YYYY-MM-DD-XXXX.md（如：2014-01-02-jekyll-introduction.md，则访问路径为www.blogways.net/blog/2014/01/02/jekyll-introduction.html）
在新添加一篇博客之后需要的操作：

1. 删除本地categories文件夹：`rm -r categories`
2. 本地编译工程：`jekyll build` （或者`jekyll serve`）
3. 将categories添加到根目录：`cp -r _site/categories .`

##作者添加
在新增加作者之后，需要进行如下的后续操作：

1. 在_author目录下添加一个xxxx.html，其中xxxx为当前作者的唯一标示符，最好为全为英文
2. 其中的内容如下:

    //---
    //layout: layout
    //name: 姓名（小李）
    //page_path: 路径名 （/authors/xiaoli/）
    //image: 头像URL （/images/userpic.gif）
    //page_tags: 标签 （不需要改）
    //page_type: author （不需要改）
    //no_content: 暂无
    //description: 个人描述/简介
    //---

    //{% include authors_list.html %}
