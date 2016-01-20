---
layout: post
title: Html5 建站学习笔记
category: ['杂记']
tags: ['html5']
author: 唐 治
email:
description: 以 html5-boilerplate 为引子，围绕其中的关键点，学习了html5相关的知识，笔记之
---

以 html5-boilerplate 为引子，围绕其中的关键点，学习了html5相关的知识，笔记之

## 一、Html5网站常见的目录结构

一个Html5网站常见的目录结构，如下：

```
.
├── css
│   ├── main.css
│   └── normalize.css
├── doc
├── img
├── js
│   ├── main.js
│   ├── plugins.js
│   └── vendor
│       ├── jquery.min.js
│       └── modernizr.min.js
├── .editorconfig
├── .htaccess
├── 404.html
├── apple-touch-icon.png
├── browserconfig.xml
├── index.html
├── humans.txt
├── robots.txt
├── crossdomain.xml
├── favicon.ico
├── tile-wide.png
└── tile.png
```

其中:

1. `.htaccess` 是Apache web服务器的默认配置文件。
1. `browserconfig.xml` 是为 `Internet Explorer 11` 提供的配置文件，里面自定义了网站的磁贴。

    在采用新 Windows UI 的 `Internet Explorer` 中为站点创建自定义磁贴和通知以建立用户兴趣和点击量。 可以为 `IE11` 创建自定义磁贴。

    当用户首次固定你的站点时，它在“开始”屏幕上显示为一个静态磁贴。默认情况下，磁贴上的图像是网站的 Favicon 或默认 IE11 徽标。你可以通过将元数据标志添加到网站的标志或添加浏览器 config 文件来自定义图像。

    `browserconfig.xml`的内容大致如下：

    ```xml
	<?xml version="1.0" encoding="utf-8"?>
	<browserconfig>
   		<msapplication>
   			<tile>
   				<square70x70logo src="tile.png"/>
				<square150x150logo src="tile.png"/>
				<wide310x150logo src="tile-wide.png"/>
				<square310x310logo src="tile.png"/>
			</tile>
		</msapplication>
	</browserconfig>
	```
    你也可以不使用默认的`browserconfig.xml`文件名，可以通过`<head>`中的`<meta>`来指定一个文件，示例如下：

    ```html
    <head>
        ...
        <meta name="msapplication-config" content="ieconfig.xml" />
        ...
    </head>
    ```

    另外，Windows8.1 还支持动态磁贴。你可以从[这里](https://msdn.microsoft.com/library/dn455106.aspx)找到详细的介绍信息。

1. `robots.txt` 告诉爬虫在网站上的爬取权限。（当然了，有些流氓爬虫是无视这个配置文件的）

    * 示例：容许爬虫爬取所有内容

        ```
    	User-agent: *
    	Disallow:
        ```

        其中：

        * `User-agent: *` 表示下面规则对所有web爬虫都适用；
        * `Disallow:` 表示网站所有内容都可以被抓取。如果你想禁止爬取所有内容，可以配置为`Disallow:/`,如果想禁止某个目录，可以配置为`Disallow:/path`
        * 更多信息可以从[这里](http://www.robotstxt.org/)获取

1. `crossdomain.xml` 是跨域策略文件。此文件是一种 XML 文档，旨在为 Web 客户端，比如 `Adobe Flash Player` 或 `Adobe Reader`（但不限于这两类客户端）授予跨域处理数据的权限。当客户端请求获取特定源域上托管的内容、且该内容将请求定向至除自身域以外的其他域时，远程域需要托管跨域策略文件，从而授予源域的访问权限，使客户端继续执行事务。。

    * 主策略文件。 策略文件用于授予数据读取权限，允许客户端在跨域请求中包含自定义标头，并授予基于套接字的连接权限。策略文件在服务器上的最常见位置是文件名为 crossdomain.xml (例如 `http://example.com/crossdomain.xml`) 的目标域根目录中——当客户端需要策略文件时的默认检查位置。以这种方式托管的策略文件称作主策略文件。

    * crossdomain.xml 文件示例

        - 示例 1：`allow-access-from`：允许访问根域

			```xml
			<?xml version="1.0"?>
        	<!DOCTYPE cross-domain-policy SYSTEM "http://www.adobe.com/xml/dtds/cross-domain-policy.dtd">
        	<cross-domain-policy>
				<site-control permitted-cross-domain-policies="master-only"/>
				<allow-access-from domain="*.example.com"/>
				<allow-access-from domain="www.example.com"/>
				<allow-http-request-headers-from domain="*.adobe.com" headers="SOAPAction"/>
			</cross-domain-policy>
        	```
	    	此处的site-control 元素用于指定该域仅将此主策略文件视为有效文件。allow-access-from 元素用于指定 example.com 请求域中的内容可以访问目标域（保存此策略文件的域）中的所有数据。最后，allow-http-request-headers-from 元素表示，通过从 adobe.com 向目标域发送请求还允许发送SOAPAction 标头。

        - 示例2：`cross-domain-policy`：最严格的限制策略

            ```xml
            <?xml version="1.0"?>
            <!DOCTYPE cross-domain-policy SYSTEM "http://www.adobe.com/xml/dtds/cross-domain-policy.dtd">
            <cross-domain-policy>
                <site-control permitted-cross-domain-policies="none"/>
            </cross-domain-policy>
            ```

            这是最严格的主策略文件定义。它可以限制任何策略文件（包括这个文件在内）向发出请求的任何域授予任何类型的权限。

        - 示例3：cross-domain-policy：最宽松的限制策略

            ```xml
            <?xml version="1.0"?>
            <!DOCTYPE cross-domain-policy SYSTEM "http://www.adobe.com/xml/dtds/cross-domain-policy.dtd">
            <cross-domain-policy>
                <site-control permitted-cross-domain-policies="all"/>
                <allow-access-from domain="*" secure="false"/>
                <allow-http-request-headers-from domain="*" headers="*" secure="false"/>
            </cross-domain-policy>
            ```
            这是最宽松的主策略文件定义（不推荐使用）。它允许目标域上的任意策略文件授予权限，允许访问它的任何文件，并且允许向服务器发送任何标头，尽管源是 HTTP，即使通过 HTTPS 也可以执行所有操作。

    * 关于 `crossdomain.xml`的更多信息可以从[这里](http://www.adobe.com/cn/devnet/adobe-media-server/articles/cross-domain-xml-for-streaming.html)获取。

1. 图标

    * `favicon.ico` 网站图标
    * `tile.png`和`tile-wide.png` 是提供给`IE11`的磁贴图片
    * `apple-touch-icon.png` 提供给iOS设备上的书签图标，或者将网站添加到主屏幕后的图标。不同iOS设备的分辨率不同，推荐图片分辨率大小为:`180×180px`。可以在`<head>`中使用如下标签：`<link rel="apple-touch-icon" href="apple-touch-icon.png">`.

## 二、关于Html的那些事儿

1. `<!doctype html>` 
	
	<!DOCTYPE> 声明必须是 HTML 文档的第一行，位于 <html> 标签之前。<!DOCTYPE> 声明不是 HTML 标签；它是指示 web 浏览器关于页面使用哪个 HTML 版本进行编写的指令。在 HTML 4.01 中，<!DOCTYPE> 声明引用 DTD，因为 HTML 4.01 基于 SGML。DTD 规定了标记语言的规则，这样浏览器才能正确地呈现内容。HTML5 不基于 SGML，所以不需要引用 DTD。常用的DOCTYPE 声明，如下：

    * HTML5： `<!DOCTYPE HTML>`
    * HTML 4.01 有三种方式：
        - Strict（该 DTD 包含所有 HTML 元素和属性，但不包括展示性的和弃用的元素（比如 font）。不允许框架集（Framesets）。）：

            ```
            <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
            ```
        - Transitional (该 DTD 包含所有 HTML 元素和属性，包括展示性的和弃用的元素（比如 font）。不允许框架集（Framesets）。)

            ```
            <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
            ```
        - Frameset (该 DTD 等同于 HTML 4.01 Transitional，但允许框架集内容。)

            ```
            <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">
            ```
    * 还有一些其他的规范。详见[这里](https://www.w3.org/QA/2002/04/valid-dtd-list.html)

1. `lang`. HTML 的 lang 属性可用于网页或部分网页的语言。这对搜索引擎和浏览器是有帮助的。根据 W3C 推荐标准，您应该通过 <html> 标签中的 lang 属性对每张页面中的主要语言进行声明，比如：

    ```html
    <html lang="zh">
    ...
    </html>
    ```

1. `<title>`与`<meta>`的先后

    * 字符集定义`<meta charset="utf-8">`，需要包含在HTML文档的前1024个字符内。尽可能早地把它列出来（比如在`<title>`之前），可以避免一些浏览器bug。
    * 尽可能地把`<meta http-equiv="x-ua-compatible" content="ie=edge">`放在`<title>`和其他的`<meta>`之前。`x-ua-compatible`这个关键字不区分大小写。`Edge`模式通知 `Windows Internet Explorer` 以最高级别的可用模式显示内容。

        - IE 8/9/10 支持兼容模式。网站的访问者可能使用的是IE9，但是IE9并不使用最新的渲染引擎，而是使用IE5.5的渲染引擎去渲染页面。你可以设置`x-ua-compatible`元标签`<meta http-equiv="x-ua-compatible" content="ie=edge">`，或者是在页面的HTTP响应头里添加`X-UA-Compatible: IE=edge`，这样就会强制IE 8/9/10使用最新的渲染引擎，获取最佳的体验效果。推荐使用HTTP响应头的方式，而非`<meta>`元标签，这样 IE 能兼顾各种情况，支持得更好。更多信息可以看[这里](https://msdn.microsoft.com/en-us/library/jj676915(v=vs.85).aspx)

1. 移动设备支持（`viewtype`）。为了尽可能更合适地在移动终端上显示页面。需要在`<head>`里添加元标签：`<meta name="viewport" content="width=device-width, initial-scale=1">`



## 参考文献
*  [https://github.com/h5bp/html5-boilerplate/blob/5.3.0/dist/doc](https://github.com/h5bp/html5-boilerplate/blob/5.3.0/dist/doc/TOC.md)
* [https://msdn.microsoft.com/library/dn455106.aspx](https://msdn.microsoft.com/library/dn455106.aspx)
*  [http://www.adobe.com/cn/devnet/adobe-media-server/articles/cross-domain-xml-for-streaming.html](http://www.adobe.com/cn/devnet/adobe-media-server/articles/cross-domain-xml-for-streaming.html)
* [https://css-tricks.com/favicon-quiz/](https://css-tricks.com/favicon-quiz/)
* [https://msdn.microsoft.com/en-us/library/jj676915(v=vs.85).aspx](https://msdn.microsoft.com/en-us/library/jj676915(v=vs.85).aspx)
* [http://www.w3school.com.cn/tags/tag_doctype.asp](http://www.w3school.com.cn/tags/tag_doctype.asp)
* [https://www.w3.org/QA/2002/04/valid-dtd-list.html](https://www.w3.org/QA/2002/04/valid-dtd-list.html)
* [http://www.w3school.com.cn/tags/html_ref_language_codes.asp](http://www.w3school.com.cn/tags/html_ref_language_codes.asp)
