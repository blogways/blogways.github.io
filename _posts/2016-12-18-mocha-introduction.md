---
layout: post
title: 测试框架 Mocha入门
category: ['杂记']
tags: ['Mocha','nodejs']
author: 陈凡
email: chenfan@asiainfo.com
description: Mocha（发音"摩卡"）诞生于2011年，是现在最流行的JavaScript测试框架之一，在浏览器和Node环境都可以使用。所谓"测试框架"，就是运行测试的工具。通过它，可以为JavaScript应用添加测试，从而保证代码的质量
---

|      | *目 录*             |
| ---- | ----------------- |
| 1    | [Mocha测试框架简介](#link1) |
| 2    | [安装Mocha](#link2) |
| 3    | [测试脚本的写法](#link3)    |
| 4    | [测试脚本的写法](#link3)    |
| 5    | [心得体会](#link3)    |

<a id="link1"></a>

## 一.Mocha测试框架简介

Mocha是一款功能丰富的javascript单元测试框架，它既可以运行在nodejs环境中，也可以运行在浏览器环境中。

javascript是一门单线程语言，最显著的特点就是有很多异步执行。同步代码的测试比较简单，直接判断函数的返回值是否符合预期就行了，而异步的函数，就需要测试框架支持回调、promise或其他的方式来判断测试结果的正确性了。mocha可以良好的支持javascript异步的单元测试。

mocha会串行地执行我们编写的测试用例，可以在将未捕获异常指向对应用例的同时，保证输出灵活准确的测试结果报告。

<a id="link2"></a>

## 二.Mocha测试框架安装

- 安装nodejs
- npm install --global mocha

<a id="link3"></a>

## 三.Mocha测试脚本的写法

Mocha的作用是运行测试脚本，首先必须学会写测试脚本。所谓"测试脚本"，就是用来测试源码的脚本。

下面是一个加载模块add.js的代码：
	
	function add(x, y) {
	  return x + y;
	}
	
	module.exports = add;

要测试这个加法模块是否正确，就要写测试脚本。

通常，测试脚本与所要测试的源码脚本同名，但是后缀名为.test.js（表示测试）或者.spec.js（表示规格）。比如，add.js的测试脚本名字就是add.test.js。


	var add = require('./add.js');
	var expect = require('chai').expect;
	
	describe('加法函数的测试', function() {
	  it('1 加 1 应该等于 2', function() {
	    expect(add(1, 1)).to.be.equal(2);
	  });
	});

上面这段代码，就是测试脚本，它可以独立执行。测试脚本里面应该包括一个或多个`describe`块，每个describe块应该包括一个或多个it块。
describe块称为"测试套件"（test suite），表示一组相关的测试。它是一个函数，第一个参数是测试套件的名称（"加法函数的测试"），第二个参数是一个实际执行的函数。

it块称为"测试用例"（test case），表示一个单独的测试，是测试的最小单位。它也是一个函数，第一个参数是测试用例的名称（"1 加 1 应该等于 2"），第二个参数是一个实际执行的函数。

写完测试脚本后，使用Mocha来测试它。

	 mocha add.test.js
	
	  加法函数的测试
	    ✓ 1 加 1 应该等于 2
	
	  1 passing (9ms)

上面的运行结果表示，测试脚本通过了测试，一共只有1个测试用例，耗时是9毫秒。

<a id="link4"></a>

## 四.mocha命令参数

mocha支持任何可以抛出一个错误的断言模块。例如：should.js、better-assert、expect.js、unexpected、chai等。这些断言库各有各的特点，大家可以了解一下它们的特点，根据使用场景来选择断言库。

mocha命令的基本格式是：mocha [debug] [options] [files]
options包括下面这些，我翻译了一部分目前能理解的

     -h, --help                              输出帮助信息    
     -V, --version                           输出mucha版本    
     -A, --async-only                        强制让所有测试用例必须使用callback或者返回promise的方式来异步判断正确性    
     -c, --colors                            启用报告中颜色    
     -C, --no-colors                         禁用报告中颜色    
     -G, --growl                             enable growl notification support    
     -O, --reporter-options <k=v,k2=v2,...>  reporter-specific options    
     -R, --reporter <name>                   specify the reporter to use    
     -S, --sort                              排序测试文件    
     -b, --bail                              bail after first test failure    
     -d, --debug                             enable node's debugger, synonym for node --debug
     -g, --grep <pattern>                    只执行满足 <pattern>格式的用例    
     -f, --fgrep <string>                    只执行含有 <string> 的用例    
     -gc, --expose-gc                        展示gc回收的log    
     -i, --invert                            让 --grep 和 --fgrep 的匹配取反    
     -r, --require <name>                    require一下<name>指定的模块    
     -s, --slow <ms>                         指定slow时间（单位ms，默认75ms）    
     -t, --timeout <ms>                      指定超时时间（单位ms，默认2000ms）    
     -u, --ui <name>                         指定user-interface (bdd|tdd|exports)    
     -w, --watch                             观察用例文件变化，并重新执行    
     --check-leaks                           检测未回收global变量泄露    
     --compilers <ext>:<module>,...          用指定的模块来编译文件    
     --debug-brk                             启用node的debug模式    
     --delay                                 等待异步的用例集（见前边的）    
     --es_staging                            enable all staged features    
     --full-trace                            display the full stack trace    
     --globals <names>                       allow the given comma-delimited global [names]    
     --harmony                               enable all harmony features (except typeof)    
     --harmony-collections                   enable harmony collections (sets, maps, and weak maps)    
     --harmony-generators                    enable harmony generators    
     --harmony-proxies                       enable harmony proxies    
     --harmony_arrow_functions               enable "harmony arrow functions" (iojs)    
     --harmony_classes                       enable "harmony classes" (iojs)    
     --harmony_proxies                       enable "harmony proxies" (iojs)    
     --harmony_shipping                      enable all shipped harmony features (iojs)    
     --inline-diffs                          显示预期和实际结果的string差异比较    
     --interfaces                            display available interfaces    
     --no-deprecation                        silence deprecation warnings    
     --no-exit                               require a clean shutdown of the event loop: mocha will not call process.exit    
     --no-timeouts                           禁用timeout，可通过--debug隐式指定    
     --opts <path>                           定义option文件路径    
     --prof                                  显示统计信息    
     --recursive                             包含子目录    
     --reporters                             展示可用报告    
     --retries                               设置失败用例重试次数    
     --throw-deprecation                     每次调用deprecated函数的时候都抛出一个异常    
     --trace                                 显示函数调用栈    
     --trace-deprecation                     启用的时候显示调用栈    
     --watch-extensions <ext>,...            --watch监控的扩展    


下面是官方文档对部分命令的详细说明：



- -W, --WATCH

用例一旦更新立即执行



- --COMPILERS

例如--compilers coffee:coffee-script编译CoffeeScript 1.6，或者--compilers coffee:coffee-script/register编译CoffeeScript 1.7+



- -B, --BAIL

如果只对第一个抛出的异常感兴趣，可以使用此命令。



- -D, --DEBUG

开启nodejs的debug模式，可以在debugger语句处暂停执行。



- --GLOBALS

names是一个以逗号分隔的列表，如果你的模块需要暴露出一些全局的变量，可以使用此命令，例如mocha --globals app,YUI。
这个命令还可以接受通配符，例如--globals '*bar。参数传入 * 的话，会忽略所有全局变量。



- --CHECK-LEAKS

默认情况下，mocha并不会去检查应用暴露出来的全局变量，加上这个配置后就会去检查，此时某全局变量如果没有用上面的--GLOBALS去配置为可接受，mocha就会报错



- -R, --REQUIRE

这个命令可以用来引入一些依赖的模块，比如should.js等，这个命令相当于在测试目录下每个js文件头部运行一下require('should.js'),模块中对Object、Array等对象的扩展会生效，也可以用--require ./test/helper.js这样的命令去引入指定的本地模块。
但是... 很鸡肋的是，如果要引用模块导出的对象，还是需要require，var should = require('should')这样搞。



- -U, --UI

--ui选项可以用来指定所使用的测试接口，默认是“bdd”

-R, --REPORTER

这个命令可以用来指定报告格式，默认是“spec”。可以使用第三方的报告样式，例如：
npm install mocha-lcov-reporter,--reporter mocha-lcov-reporter



- -T, --TIMEOUT

用来指定用例超时时间



- -S, --SLOW

用来指定慢用例判定时间，默认是75ms



- -G, --GREP

grep pattern可以用来筛选要执行的用例或用例集，pattern参数在mocha内部会被编译成一个正则表达式。
假如有下面的测试用例：

	describe('api', function() {
	  describe('GET /api/users', function() {
	    it('respond with an array of users', function() {
	      // ...
	    });
	  });
	});
	
	describe('app', function() {
	  describe('GET /users', function() {
	    it('respond with an array of users', function() {
	      // ...
	    });
	  });
	});

可以用--grep api、--grep app、--grep users、--grep GET，来筛选出要执行的用例。

## 五.心得与体会

接触Mocha是在上年实习的时候，感觉这个针对nodejs下的单元测试还是很好用的，但是用好Mocha要对断言库有一定的了解，断言接触不多，以后还会继续分析Mocha的一些比较好的测试案例。
