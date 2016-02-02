---
layout: post
title: ESLint使用介绍
category: ['杂记']
tags: ['ESLint', 'JSHint', 'JSLint', 'JavaScript']
author: 唐 治
email:
description: 之前用的是JSHint，感觉挺不错的。最近发现了ESLint，试用了一下，发现更好！特此，把所了解的信息分享一下。
---


|  |  *目 录* |
| --- | --- |
| 1 | [JavaScript Linting工具的比较](#comparison) |
| 2 | [ESLint的安装](#install) |
| 3 | [ESLint的使用说明](#usage) |
| 4 | [与编辑工具的集成](#editor) |
| 5 | [不可不知的airbnb编码规范与配置](#airbnb) |
| 6 | [参考文献](#reference) |

之前用的是JSHint，感觉挺不错的。最近发现了ESLint，试用了一下，发现更好！特此，把所了解的信息分享一下。


## 一、Linting工具的比较 <a href="comparison"></a>

不用说，大家最常用的JavaScript Linting工具应该是下面四个之一：

**JSLint - JSHint - JSCS - ESLint**

这四种工具，工作方式基本相同。他们都定义了一些规则去分析报告JavaScript文件中的问题；可以通过`npm`进行安装；可以在命令行运行；可以作为Grunt等工具的插件；可以集成到常用编辑工具中去；可以在文件中通过注释进行配置。

### 1.1 JSLint

四个工具中最老的一个。`Douglas Crockford`在2002年创建，根据他的经验，强制校验了JavaScript编码中一些更合理的限制规则。其使用最大的缺点，就是不支持个性化配置，但优点也是无需配置，如果你认同这些规则，那么用起来就很顺手。

### 1.2 JSHint

JSHint是JSLint的改良版，支持通过配置文件配置规则级别。对ES6的规范也做了简单的支持。很好用！缺点就是所有规则都是内置的，无法自定义新规则。实际上在大部分项目中，就已经足够用了。

### 1.3 JSCS

JSCS和前两个最大的不同就是没有配置文件就不能工作。他已经有了超过90个内置规则，并且你可以自定义新规则。但是他只是对编码风格进行检查，无法对代码中潜在的bug（如未使用的变量/突兀的全局变量等等）或者错误进行判断。

### 1.4 ESLint

四个工具中最新的。借鉴了前辈的经验。每个规则都可以开关，很多规则都有多个选项，供微调；易于扩展，可以自定义新规则，有很多有用的插件；包含了很多另外三个没有的规则；不但可以发现问题，在某些规则上面，还支持自动纠错；对ES6的支持最到位；是四者中唯一一个支持JSX的。

## 二、ESLint的安装<a name="install"></a>

在你的项目目录下，输入命令：

```bash
npm i eslint --save-dev  
```

如果之前安装了低版本，需要升级，可以如下：

```bash
npm i eslint@latest --save-dev
```

这样，你就在当前目录下安装了`eslint`。不过，`ESLint`作为一个常用工具，我建议最好还是全局安装，这样使用起来会很方便。如下：

```bash
npm i eslint -g
```


## 三、ESLint使用说明<a name="usage"></a>

### 3.1 创建配置文件

如果全局模式安装的`eslint`，那么进入项目目录，键入：

```bash
eslint --init
```

如果只是在当前目录下安装了`eslint`，那么键入：

```bash
./node_modules/.bin/eslint --init
```

然后，根据提示，使用方向键、空格键或者回车，进行回答。

比如：

```bash
$ eslint --init
? How would you like to configure ESLint? Answer questions about your style
? What style of indentation do you use? Spaces
? What quotes do you use for strings? Single
? What line endings do you use? Unix
? Do you require semicolons? Yes
? Are you using ECMAScript 6 features? No
? Where will your code run? Node, Browser
? Do you use JSX? No
? What format do you want your config file to be in? JSON
Successfully created .eslintrc.json file in /Users/<username>/path/to/yourdir
```

我们可以看看刚生成的配置文件：

```bash
$ cat .eslintrc.json
{
    "rules": {
        "indent": [
            2,
            4
        ],
        "quotes": [
            2,
            "single"
        ],
        "linebreak-style": [
            2,
            "unix"
        ],
        "semi": [
            2,
            "always"
        ]
    },
    "env": {
        "node": true,
        "browser": true
    },
    "extends": "eslint:recommended"
}
```

这里，你看到的配置文件有三块内容：`rules`、`env`和`extends`.

其中，`"extends": "eslint:recommended"`，指我们使用eslint的推荐配置。你也可以使用自己定制的配置。自定义，也很简单，[这里](https://github.com/feross/eslint-config-standard)有个例子，你也可以看[ESLint Shareable Configs](http://eslint.org/docs/developer-guide/shareable-configs)的规则，进行了解，简单来说就是分三步：

  1. 正常创建一个Node.js模块，模块的名字，需要前缀为`eslint-config-`（比如全名`eslint-config-myconfig`）,创建一个`index.js`文件，输出你的配置。

    - 比如`index.js`内容如下：
    
        ```javascript
        module.exports = {
            rules: {
                quotes: [2, "double"];
            }
        };
        ```

  1. 把这个模块发布到npmjs上供人使用。可以看[这里](https://docs.npmjs.com/getting-started/publishing-npm-packages).

  1. 使用`npm install`安装`eslint-config-myconfig`，并在`.eslintrc`文件中，通过`extends`来使用：

    - 比如：

      ```json
      {
        "extends": "eslint-config-myconfig"
      }
      ```

    - 或者，省略前缀，如下使用：

      ```json
      {
        "extends": "myconfig"
      }
      ```

继续前面话题，`"env"`指程序运行所在环境，可以是：`Node`, `Browser`,`amd`,`mocha`,`jasmine`,`jquery`等等，设定了这些环境后，这些环境的全局变量就可以被识别。你可以在文件中采用注释的方式来告诉单个文件的环境变量，比如：`/*eslint-env node, mocha */`.

`"rules"`,只一些不包括在`"extends"`中的配置，或者重新定义`"extends"`中部分配置。我们注意到，每个规则的值都是一个数组。数组的第一个值是错误级别，第二个值是规则值。错误级别分三个：`0` - 不报错； `1` - 告警; `2` - 报错。 各种规则的详细说明，可见[ESLint Rules](http://eslint.org/docs/user-guide/configuring#configuring-rules).

### 3.2 查错

查错命令：

```bash
eslint [options] [file|dir]*
```

比如：

```bash
eslint file1.js file2.js
```

或者

```bash
eslint lib/**
```

其中，相关参数可以通过命令`eslint -h`获知。

欲知各种规则的含义，可以看[ESLint Rules](http://eslint.org/docs/rules/).

### 3.3 局部禁止查错

在实际使用中，有些代码需要局部禁止查错，比如：可能是已经存在的依赖的模块，再或者是调试语句。

这就需要局部禁止查错。支持四种方式：

1. 语句块，全部所有规则

    ```javascript
    /* eslint-disable */

    //suppress all warnings between comments
    alert('foo');

    /* eslint-enable */
    ```
    
1. 语句块，禁止指定规则

	```javascript
	/* eslint-disable no-alert, no-console */

	alert('foo');
	console.log('bar');

	/* eslint-enable no-alert */
	```

1. 单行，禁止所有规则
	
	```javascript
	alert('foo'); // eslint-disable-line
	```

1. 单行，禁止指定规则

	```javascript
	alert('foo'); // eslint-disable-line no-alert
	```

### 3.4 修正

光发现错误，还不行，程序员希望可以自动修正错误。`ESLint`使用`--fix`选项，支持对一部分规则进行纠错。命令如下：

```bash
eslint file.js --fix
```

执行一下，你就会发现文件内容的缩进按照规则自动纠正了...

### 3.5 高级

1. 支持[自定义规则](http://eslint.org/docs/developer-guide/working-with-rules);
1. 支持[自定义插件](http://eslint.org/docs/developer-guide/working-with-plugins);
1. 支持[自定义解析器](http://eslint.org/docs/user-guide/configuring#specifying-parser).ESLint默认的解析器是`Espree`，你还可以选择其他的解析器，比如webpack在用的`Esprima`，或者支持`ES2016/ES7`的`babel-eslint`解析器;
1. 支持通过[`.eslintignore`](http://eslint.org/docs/user-guide/configuring#ignoring-files-and-directories)文件配置不检查某些文件或者目录;


## 四、与编辑工具集成<a name="editor"></a>

### 4.1 WebStorm

在配置界面： Languanges & Frameworks -> JavaScript -> Code Quality Tools -> ESLint，开启。

Windows系统下：

![webstorm-eslint-enable](/images/post/20160202-01.png)

### 4.2 Atom

1. 安装atom包([linter](https://atom.io/packages/linter),[linter-eslint](https://atom.io/packages/linter-eslint))：

	```sh
	apm install linter linter-eslint
	```

2. 在当前项目目录下安装npm包([eslint](https://www.npmjs.com/package/eslint)):

	```sh
	npm install --save-dev eslint
	```



## 五、airbnb的编码风格与配置<a name="airbnb"></a>


### 5.1 JavaScript编码风格
airbnb在github上分享了他们的的编码规范。可见[Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript/blob/master/README.md). 这个规范，现在已经或者即将，成为国际JavaScript编码规范了。 

### 5.2 规则配置

他们除了分享了编码风格，还提供了与之对应的`eslint`配置文件。他们提供的配置文件，根据使用环境不同，分三种（总有一款适合你:D）：

1. **eslint-config-airbnb**

	这块默认的配置，包括`EcmaScript 6+`和`React`。使用如下：
	
	1. `npm install --save-dev eslint-config-airbnb eslint-plugin-react eslint`
	1. 添加`"extends": "airbnb"`至你的`.eslintrc`文件。
	

1. **eslint-config-airbnb/base**

	包括`ES6+`但是不需要`React`，使用如下：
	
	1. `npm install --save-dev eslint-config-airbnb eslint`
	1. 添加`"extends": "airbnb/base"`至你的`.eslintrc`文件。

1. **eslint-config-airbnb/legacy**

	支持`ES5`，使用如下：
	
	1. `npm install --save-dev eslint-config-airbnb eslint`
	1. 添加`"extends": "airbnb/legacy"`至你的`.eslintrc`文件。

### 5.3 小瑕疵

使用了一下，发现他们提供的配置和他们的规范，也有一点小参差。所以，我在使用他们的配置的同时，做了一处修正。`.eslintrc.json`如下：

```json
{
  'extends': 'airbnb/legacy',
  'rules': {
    'comma-dangle': [2, 'never']
  }
}
```
是的，他们分享的配置中的规则是`'comma-dangle': [2, 'always-multiline']`，真是不习惯。

## 六、参考文献<a name="reference"></a>

* http://www.sitepoint.com/comparison-javascript-linting-tools/
* http://devnull.guru/get-started-with-eslint/
* http://eslint.org/docs/user-guide/configuring
* http://eslint.org/docs/user-guide/command-line-interface
* http://eslint.org/docs/rules/
* https://www.npmjs.com/package/eslint-config-airbnb
* https://github.com/kriasoft/react-starter-kit/blob/master/docs/how-to-configure-text-editors.md
