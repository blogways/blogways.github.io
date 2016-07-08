---
layout: post
title: webpack的几个常用loader
category: ['杂记']
tags: ['webpack','require','expose-loader', 'imports-loader', 'provideplugin', 'exports-loader', 'script-loader', 'html-loader']
author: 唐 治
email: 
description: 使用webpack对原有web工程进行改造，遇到各种问题，适当地使用各种loader加以解决。感觉有些问题具备普遍性，还是有必要记录一下的。
---

使用webpack对原有web工程进行改造，遇到各种问题，适当地使用各种loader加以解决。感觉有些问题具备普遍性，还是有必要记录一下的。故有此文！

在webpack中对javascript的管理也是模块化管理，所以需要使用`require`和`exports`或者`define`来对js模块进行引用或者导出。

当你的前端web工程没有采用js模块化编码，那么就会遇到一些问题。问题的根源分为两种：js的调用者，没有`require`；js的提供者，没有`exports`。

此时，你一个个文件去修改，按规范添加`require`和`exports`，当然可以解决这些问题。你也可以使用webpack提供的各种`loader`去解决这些问题。

下面，我们分情况讨论解决。

## 一、和jQuery相关的那些事儿

`jQuery`本身并没有问题，自身代码里兼容了`exports`和`define`方法。

只是，很多依赖`jQuery`模块的js文件，都没有`require('jquery')`，导致文件内的`jQuery`对象不可识别。

比如`Bootstrap v3.3.2`，走上来，就是如下代码：

```javascript
if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery')
}
```

作为模块化调用，当然无法识别`jQuery`了。

解决方法有三个：

### 1. 方法一：采用`import-loader`

**1.1 解决方法**

在加载`bootstrap.js`时，使用`imports-loader`,
代码如下：

```javascript
require('imports?jQuery=jquery!bootstrap/dist/js/bootstrap');
```

好了，可以正常使用`bootstrap.js`了！

**1.2 原理**

imports-loader会在bootstrap的源码前面，注入如下代码:

```javascript
/*** IMPORTS FROM imports-loader ***/
var jQuery = require("jquery");
```

**1.3 使用说明:**

| 查询参数  | 等效代码 |
| ---- | ---- |
| `angular` | `var angular = require('angular');` |
| `$=jquery` | `var $ = require('jquery');` |
| `config=>{size:50}` | `var config = {size:50};` |
| `this=>window` | `(function(){...}).call(window);` |

支持一次多个查询参数，之间通过逗号分隔，比如：

```javascript
require("imports?$=jquery,jQuery=jquery,angular,config=>{size:50}!./file.js");
```

### 2. 方法二：采用`expose-loader`

`expose-loader`的思路是将某个对象暴露成一个全局变量。

具体到这个问题中，就是把`jQuery`对象暴露成全局变量。这样，那些`bootstrap.js`之类的文件就都能访问这个变量了。

具体做法，修改`webpack.config.js`文件:

```json
module: {
  loaders: [
    { test: require.resolve("jquery"), loader: "expose?$!expose?jQuery" },
  ]
}
```

### 3. 方法三：使用`webpack.ProvidePlugin`

具体做法，修改`webpack.config.js`文件：

```json
plugins: [   
    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery"
    })
]
```

### 4. 小节

从上面的介绍可以看出，三种解决方法的思路分两类：方法一，是修改调用者；方法二、三是修改提供者。

## 二、自定义的js文件

这里问题，属于模块提供方没有调用`export`导出模块，或者没有`define`定义模块。

好办，使用`exports-loader`!这个作用和前面提到的`imports-loader`类似，他是在文件的最后添加一行，类似如下的代码：

```javascript
/*** EXPORTS FROM exports-loader ***/
module.exports = YouModule
```

同样，如果需要一次导出多个对象，如同`imports-loader`调用，多个对象间也是逗号分隔。比如：

```
require("exports?file,parse=helpers.parse!./file.js");
```

那么，`./file.js`文件的最后会添加如下代码：

```javascript
/*** EXPORTS FROM exports-loader ***/
exports["file"] = (file);
exports["parse"] = (helpers.parse);
```

## 三、稍微复杂一点的情况

自定义的多个js模块直接存在相互调用的情况。

比如，`b.js`里面调用了`a.js`提供的对象，但是都没有`exports`或者`require`。见示例：

文件： `a.js`

```js
var A = { ... };
```

文件: `b.js`

```js
A.exec(....)
```

解决办法：

```
require([
	'expose?A!exports?A!./a.js',
	'./b.js'
], ...);
```

如上，把`a.js`中的A定义成全景对象公布出去，这样`b.js`里面就可以正常使用`A`对象了。

除此之外，还有一个解决方案（不推荐）：使用`script-loader`，它可以在全局环境下执行一次指定的脚本，比如：

```js
require([
	'script!./a.js',
	'./b.js'
], ...);
```

这里，会把`./a.js`直接作为脚本执行一次。在`node.js`环境下，`script-loader`什么都不做。


## 四、其他

1. `file-loader` : 修改文件名，放在输出目录下，并返其对应的 url .
	
	默认修改后的文件名，是文件内容的MD5哈希串。你也可以自定义文件名。比如：
	
	```js
	require("file?name=js/[hash].script.[ext]!./javascript.js");
	// => js/0dcbbaa701328a3c262cfd45869e351f.script.js

	require("file?name=html-[hash:6].html!./page.html");
	// => html-109fa8.html

	require("file?name=[hash]!./flash.txt");
	// => c31e9820c001c9c4a86bce33ce43b679

	require("file?name=[sha512:hash:base64:7].[ext]!./image.png");
	// => gdyb21L.png
	// use sha512 hash instead of md5 and with only 7 chars of base64

	require("file?name=img-[sha512:hash:base64:7].[ext]!./image.jpg");
	// => img-VqzT5ZC.jpg
	// use custom name, sha512 hash instead of md5 and with only 7 chars of base64

	require("file?name=picture.png!./myself.png");
	// => picture.png

	require("file?name=[path][name].[ext]?[hash]!./dir/file.png")
	// => dir/file.png?e43b20c069c4a01867c31e98cbce33c9
	```
	
1. `url-loader` : 这个加载器的工作方式很像`file-loader`。只是当文件大小小于限制值时，它可以返回一个`Data Url`。限制值可以作为查询参数传入。默认不限制。比如：
	
	```js
	require("url?limit=10000!./file.png");
	// => 如果"file.png"小于10kb，则转成一个DataUrl
	
	require("url?mimetype=image/png!./file.png");
	// => 指定文件的mimetype (不指定，则根据文件后缀推测.)
	```
	
1. `style-loader`、`css-loader`: 这个很常用了，不解释。推荐用法是：`require("style!css!./file.css");`,类似的还有`less-loader`，推荐使用：`require("style!css!less!./file.less");`;

1. `raw-loader`: 把文件内容作为字符串返回。
	
	```js
	var fileContent = require('raw!./file.txt');
	```
	这里，把`./file.txt`的内容作为字符串返回。
	

1. `html-loader`: 把Html文件输出成字符串。与`raw-loader`不同的是，它默认处理html中的`<img src="image.png">`为`require("./image.png")`，你同时需要在你的配置中指定image文件的加载器，比如：`url-loader`或者`file-loader`。

	- 你可以通过加载器的查询参数`attrs`来指定哪些html标签可以被处理。比如：`attrs=img:src`。`html-loader`默认只处理图片，你也可以通过`attrs`,告诉他也处理javascript文件，比如：
	
		```	js
		require("html?attrs=attrs=script:src img:src!./file.html");
		```
		或者
		
		```js
		require("html?attrs[]=script:src&attrs[]=img:src!./file.html");
		```
		多个标签用空格分隔或者使用数组设定。
		
	- 你也可以告诉加载器，什么都不转换，包括默认处理的`image`。如下设置：

		```js
		require("html?attrs=false!./file.html");
		```
		
		或者
		
		```js
		require("html?-attrs!./file.html");
		```
		
	- 当使用`webpack --optimize-minimize`时，`html-loader`会对加载的html内容最小化。

1. `source-map-loader`: 方便调试，不解释。

	```js
	module.exports = {
	  module: {
	    preLoaders: [
	      {
	        test: /[\.-]min\.js$/,
	        loader: "source-map-loader"
	      }
	    ]
	  }
	};
	```
	
	上例，是对后缀为`.min.js`或者`-min.js`结尾的文件，做`source-map`操作。不过，你要确保`min.js`文件中按规范指定了`//# sourceMappingURL=xxxx.map`才行！
	
	
## 五、总结

我们讨论了常用的`loader`，包括：`imports-loader`、`exports-loader`、`expose-loader`、`script-loader`、`file-loader`、`url-loader`、`css-loader`、`style-loader`、`raw-loader`、`html-loader`、`source-map-loader`。

官网还提供了一些其他的`loader`，你也可以根据个性化需要，自定义一个`loader`。这里就不再继续讨论了。

更多`webpack`的知识可以从官网获取。网上也有一些不错的第三方入门的博文，比如下面两个：

* [github.com/petehunt/webpack-howto](https://github.com/petehunt/webpack-howto)
* [christianalfoni.github.io/react-webpack-cookbook/](http://christianalfoni.github.io/react-webpack-cookbook/)