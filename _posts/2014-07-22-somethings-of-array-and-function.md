---
layout: post
category: 杂记
title: JavaScript中，Array和Function的那些事儿
tags: ['Array', 'Function', 'push', 'shift', '使用', 'bind', 'call', 'slice', 'splice', 'apply', 'sort', 'uncurryThis', 'concat','forEach','map','reduce']
author: 唐 治
email: 
url: http://t.qq.com/TZ000000001
description: 在JavaScript中，内置对象Array和Function本身提供了不少方法，有些方法为人所熟知，有些方法则不被注意。而有些方法虽然被人所熟悉，却又有不被重视的使用场景，去实现一些妙用。本文结合当下自己的使用心得，一方面做个分享，一方面也是个备忘.

---

<div class="code fl">
    <dl>
    <dt>目录</dt>
    <dd>
    <ol type="I">
        <li><a href="#1">概述</a></li>
        <li>
            <a href="#2">Function的那些事儿</a>
            <ol type="1">
                <li>arguments不是Array，但可以构造出一个Array对象来！</li>
                <li>相同功能，不同调用形式的两方法——apply和call</li>
                <li>去优雅地使用apply和call吧！</li>
                <li>使用bind方法，再造函数！</li>
                <li>uncurryThis，你知道吗？</li>
            </ol>
        </li>
        <li>
            <a href="#3">Array的那些事儿</a>
            <ol type="1">
                <li>可以浅度复制数组的slice方法</li>
                <li>不仅仅作用于数组的堆栈操作，四方法：push/pop/shift/unshift</li>
                <li>可删可插入的splice方法</li>
                <li>forEach/map/reduce的实现与效率！</li>
                <li>其他：join/concat/sort/reverse/...</li>
            </ol>
        </li>
        <li><a href="#4">结束</a></li>
    </ol>
    </dd>
    </dl>
</div>


<a name="1"></a>
### 一、概述

在JavaScript中，内置对象Array和Function本身提供了不少方法，有些方法为人所熟知，有些方法则不被注意。而有些方法虽然被人所熟悉，却又有不被重视的使用场景，去实现一些妙用。

本文结合当下自己的使用心得，一方面做个分享，一方面也是个备忘，哈哈！

<a name="2"></a>
### 二、Function的那些事儿

#### 2.1 arguments不是Array！

`arguments`是函数被执行时，传入的实参集合。他直接在函数里面被类似于一个数组进行访问。

在Chrome浏览器的控制台执行下面代码（*本文代码都可以在Chrome浏览器的控制台中运行*）：

```
function testFunc() { 
    console.log(arguments);
    
    for(var i=0; i<arguments.length; ++i) {
        console.log(arguments[i]);
    }
        
    for(var idx in arguments) {
        console.log(arguments[idx]);
    }
}
```
传入参数运行:

```
testFunc(1,2,3,4)
```
执行结果：

```
[1, 2, 3, 4]
1
2
3
4
1
2
3
4
```

从上面例子中，我们可以访问`arguments`的`length`属性，来确定实参的个数，以及通过下标对`arguments`进行访问，获取我们需要的某个参数。

**<span style="color:red">注意</span>：arguments不是一个Array！** 

示例代码：

```
var testFunc = function() { 
    console.log("[] 是一个 Array？"+Array.isArray([]));
    console.log("arguments 是一个Array？"+Array.isArray(arguments));
    console.log("arguments toString:" + arguments.toString());
}
```
传入参数运行:

```
testFunc(1,2,3,4)
```
执行结果：

```
[] 是一个 Array？true
arguments 是一个Array？false
arguments toString:[object Arguments] 
```

**<span style="color:red">提示</span>：我们可以基于arguments构造一个数组对象** 

示例代码：

```
var testFunc = function() { 
    var args = Array.prototype.slice.apply(arguments);
    console.log("args 是一个 Array?"+Array.isArray(args));
    console.log(args);
}
```

运行：

```
testFunc(1,2,3,4)
```

结果：

```
args 是一个 Array?true
[1, 2, 3, 4]
```

当然，你也可以在构造的同时，对实参进行裁剪。参考代码如下：

```
var testFunc = function() { 
    var args = Array.prototype.slice.call(arguments, 1);
    console.log(args);
}
```


#### 2.2 相同功能，不同参数形式的两方法——apply和call

这两个方法的功能相同，只是定义参数方式不同：
它们的作用都是将函数绑定到另外一个对象上去运行，两者仅在定义参数方式有所区别：


> Function.apply(thisArg,argArray);

> Function.call(thisArg[,arg1,arg2…]);


他们的功能，都是将函数绑定到一个指定的对象上去运行，即所有函数内部的this指针都会被赋值为thisArg。

这种功能，可以实现将函数作为特定对象的方法，进行执行的目的。

为什么会有这两种不同的形式呢？是为满足需求，而决定的！

`Function.call`的形式很自然，调用起来很方便，就像`2.1`小节最后那个例子那样。在这个例子中，你肯定不愿意使用`Function.apply`，是不是？

但是，它存在一个缺点：当函数的参数个数是动态的，只能在运行过程中才能确定下来，那么使用`Function.call`就不合适了，就只能使用`Function.apply`了。在运行过程中，将动态的参数都放到数组中去，然后把数组作为一个参数，传给`Function.apply`。这样就完美的解决问题了！


#### 2.3 去优雅地使用apply和call吧

有一个动态数组:

```
var numbers=[]
for(var i=0; i<100; ++i) {
    numbers[i] = Math.floor(Math.random()*10000);
}
```

要求：从中找到最大数和最小数。

先看看常规的方法吧：

```
max = -Infinity, min = +Infinity;

numbers.forEach(function(item) {
  if (item > max) max = item;
  if (item < min) min = item;
})
```

那么，如何优雅地使用`apply`去编码呢？

```
var max = Math.max.apply(null, numbers);
var min = Math.min.apply(null, numbers);
```

就执行效率而言，后者也比前者快！

当然，就解决这个题目而言，还有更快的方案，有兴趣地话，可以看看笔者的测试：[`http://jsperf.com/apply-vs-loop-for-max/2`](http://jsperf.com/apply-vs-loop-for-max/2)。这个测试的结果，可能会颠覆你的认知，让你惊讶的。^_^


#### 2.4 使用bind方法，定制函数！

先看定义：


> fun.bind(thisArg[, arg1[, arg2[, ...]]])


如果说，前面的`apply`和`call`方法是将函数绑定到特定的对象上去执行。那么，`bind`方法，就是只绑定，不执行。

它生成一个新的方法，它可以给已知的函数`fun`绑定执行的对象`thisArg`，还可以绑定执行的参数`[, arg1[, arg2[, ...]]]`，绑定的参数可以是部分，也可以是全部。

所以，就实现的功能而言，`bind`方法也可以借助`apply`方法，用下面代码模拟：

```
Function.prototype.bind = function(ctx) {
    var fn = this;
    var args = Array.prototype.slice.call(arguments, 1);
    return function() {
        fn.apply(ctx, args.concat(Array.prototype.slice.call(arguments)));
    };
}
```

那么，`bind`有哪些作用，适合用在哪些场合呢？

看下面这段代码：

背景设定：

```
this.x = 9; 
var module = {
  x: 81,
  getX: function() { return this.x; }
};
```

调用：

```
module.getX(); // 81
```

如你所愿，执行结果是 `81`.

有时，你可能不经意间，进行赋值：

```
var getX = module.getX;
```

再运行：

```
getX(); // 9, because in this case, "this" refers to the global object
```
可能，你希望结果是 `81`，但却是`9`.

怎么才能让结果仍然是 `81`呢？

```
// create a new function with 'this' bound to module
var boundGetX = getX.bind(module);
boundGetX(); // 81
```
是的，如上使用`bind`就可以了！

#### 2.5 uncurryThis，你知道吗？

`uncurryThis`话题，来自于`Brendan Eich`(`JavaScript`之父)的一个[tweet](http://twitter.com/BrendanEich/status/128975787448741891).

`uncurryThis`的最重要的用途，就是**将对象的方法变为函数去使用**。

特殊一点，可以将A对象的方法a使用到B对象上去。在前面`2.1`小节中，我们就用到了这个技巧，在`Arguments`对象上使用了`Array`对象的方法`slice`。很有用，不是吗？

那么怎么实现`uncurryThis`呢？

* 扩展Function原型去实现（Brendan Eich写的实现代码）:

    ```
Function.prototype.uncurryThis = function () {
        var f = this;
        return function () {
            var a = arguments;
            return f.apply(a[0], [].slice.call(a, 1));
        };
};
    ```
    
    使用：
    
    ```
var toUpperCase = String.prototype.toUpperCase.uncurryThis();
[ "foo", "bar", "baz" ].map(toUpperCase)
    ```
    
    运行结果：
    
    ```
[ 'FOO', 'BAR', 'BAZ' ]
    ```
    
    
* 独立的函数实现：

    ```
var uncurryThis = function(f) {
        var call = Function.call;
        return function() {
            return call.apply(f, arguments);
        };
};
    ```
    
    使用：
    
    ```
var toUpperCase = uncurryThis(String.prototype.toUpperCase);
[ "foo", "bar", "baz" ].map(toUpperCase)
    ```
    
    运行结果：
    
    ```
[ 'FOO', 'BAR', 'BAZ' ]
    ```
<a name="3"></a>
### 三、Array的那些事儿

Array是个很常用的内置对象，在Javascript规范的逐步完善中，其内置方法在不知不觉中已经提供了很多了。本文仅介绍一些常用的方法。


#### 3.1 可以浅度复制数组的slice方法

定义：

> arr.slice(begin[, end])

说明：返回一个新的浅度复制数组，包含从 `begin` 到 `end` （不包括该元素）的 `arr` 中的元素。(*原数组内容不发生变化*)

`begin`和`end`表示在原数组上，选取的范围。如果`end`省略，表示原数组的结尾。 如果`begin`省略，表示从0位开始。也可以是负数，表示从原数组的尾部开始计算位置。

举例：

```
var arr = [1,2,3,4,5,6,7,8];
arr.slice(2,4);      // [3, 4]
arr.slice(4);        // [5, 6, 7, 8]
arr.slice(-3);       // [6, 7, 8]
arr.slice(3, -2);    // [4, 5, 6]
arr.slice(-3, -1);   // [6, 7]
arr.slice();         // [1,2,3,4,5,6,7,8]
```

**<span style="color:red">提示</span>：利用`Array.prototype.slice`,我们可以将一个类似array对象，转换为array对象** 

`arguments`不是数组，但可以转换为数组。

```
var args = Array.prototype.slice.call(arguments);
```

我们还可以看一个例子：

```
function a() { return {length:2, 0:"hello", 1:"world"}}

var t = a();

var z = Array.prototype.slice.call(t);

t instanceof Array;      // false
z instanceof Array       // true
console.log(z);          // ["hello", "world"] 
```


#### 3.2 不仅仅作用于数组的堆栈操作，四方法：push/pop/shift/unshift

先看定义：

> arr.push(element1, ..., elementN)

> arr.pop()

> arr.shift()

> arr.unshift(element1, ..., elementN)

说明：

* `push`将n个元素`element1, ..., elementN`追加到数组的尾部，其返回值为调用后数组的长度；

    ```
var sports = ["soccer", "baseball"];
var total = sports.push("football", "swimming");
console.log(sports); // ["soccer", "baseball", "football", "swimming"]
console.log(total);  // 4
```

* `pop`将数组的最后一个对象删除，其返还值就是这个删除的元素。如果是个空数组，则返回值为`undefined`;
    
    ```
var myFish = ["angel", "clown", "mandarin", "surgeon"];
var popped = myFish.pop();
console.log(myFish);  // ["angel", "clown", "mandarin"] 
console.log(popped);  // "surgeon"
    ```
    
* `shift` 删除数组的第一个数，并且数组内剩余的值，坐标依次前移。返回值为删掉的元素。如果是个空数组，那么返回值为`undefined`;

    ```
var myFish = ["angel", "clown", "mandarin", "surgeon"];
var shifted = myFish.shift();
console.log(myFish);   // ["clown", "mandarin", "surgeon"]
console.log(shifted);  // "angel"
    ```
* `unshift`将n个元素`element1, ..., elementN`插入道数组的头部。其返回值为调用后数组的长度。

    ```
var arr = [1, 2];
arr.unshift(0); // result of call is 3, the new array length
// arr is [0, 1, 2]
arr.unshift(-2, -1); // = 5
// arr is [-2, -1, 0, 1, 2]
arr.unshift( [-3] );
// arr is [[-3], -2, -1, 0, 1, 2]
    ```

通过上面这四个方法，可以对数组进行堆栈操作了。



**<span style="color:red">注意</span>：这四个用作堆栈操作的方法，其实还支持非数组对象。不过，支持的对象需要类似数组。从某种角度而言，这也是支持你实现自定义的具有堆栈功能的对象。**

所谓的类似数组，就是有`length`属性，可以通过`0...n`下标去访问元素。仅此，即可！

看代码：

```
var myQueue = function() {return {length:0}};

var tz = new myQueue();

Array.prototype.push.call(tz, "hello", "world");  // 2

console.log(Array.prototype.slice.call(tz));  //["hello", "world"] 

Array.prototype.shift.call(tz);     // "hello"

console.log(Array.prototype.slice.call(tz));  //["world"] 

Array.prototype.unshift.call(tz, "hello");    // 2

console.log(Array.prototype.slice.call(tz));  //["hello", "world"] 

Array.prototype.pop.call(tz);     // "world"

console.log(Array.prototype.slice.call(tz));  //["hello"] 

```

神奇吧！



#### 3.3 可删可插入的splice方法

先看定义：

> array.splice(index , howMany[, element1[, ...[, elementN]]])

> array.splice(index)   // SpiderMonkey/Firefox/Chrome extension

其中， `index`表示数组中操作所开始的位置。如果大于数组的长度，那就重定位为数组的尾端。如果是负数，那就从数组的尾端向前移。`howMany`，表示要删除的个数，如果是0，则表示不删除。`[, element1[, ...[, elementN]]]`，表示要插入的个数。 该方法的返回值为：删除的元素数组。

看实例：

```
var myFish = ["angel", "clown", "mandarin", "surgeon"];

//removes 0 elements from index 2, and inserts "drum"
var removed = myFish.splice(2, 0, "drum");
//myFish is ["angel", "clown", "drum", "mandarin", "surgeon"]
//removed is [], no elements removed

//removes 1 element from index 3
removed = myFish.splice(3, 1);
//myFish is ["angel", "clown", "drum", "surgeon"]
//removed is ["mandarin"]

//removes 1 element from index 2, and inserts "trumpet"
removed = myFish.splice(2, 1, "trumpet");
//myFish is ["angel", "clown", "trumpet", "surgeon"]
//removed is ["drum"]

//removes 2 elements from index 0, and inserts "parrot", "anemone" and "blue"
removed = myFish.splice(0, 2, "parrot", "anemone", "blue");
//myFish is ["parrot", "anemone", "blue", "trumpet", "surgeon"]
//removed is ["angel", "clown"]

//removes 2 elements from index 3
removed = myFish.splice(3, Number.MAX_VALUE);
//myFish is ["parrot", "anemone", "blue"]
//removed is ["trumpet", "surgeon"]
```

**<span style="color:red">提示</span>：我们可以用splice方法来实现数组的堆栈操作：push/pop/shift/unshift方法** 

* 函数方式实现：

```
var push = function(arr) {
    var args = Array.prototype.slice.call(arguments,1);
    args = [arr.length, 0].concat(args);
    Array.prototype.splice.apply(arr, args);
    return arr.length;
}

var pop = function(arr) {
    if (arr.length==0) return undefined;
    var el = Array.prototype.splice.call(arr, arr.length-1);
    return el[0];
}

var shift = function(arr) {
    if (arr.length==0) return undefined;
    var el = Array.prototype.splice.call(arr, 0, 1);
    return el[0];
}


var unshift = function(arr) {
    var args = Array.prototype.slice.call(arguments,1);
    args = [0, 0].concat(args);
    Array.prototype.splice.apply(arr, args);
    return arr.length;
}

```

* 原型方式实现：

```
Array.prototype.push = function() {
    var self = this;
    var args = Array.prototype.slice.call(arguments);
    args = [self.length, 0].concat(args);
    Array.prototype.splice.apply(self, args);
    return self.length;
}

Array.prototype.pop = function() {
    var self = this;
    if (self.length==0) return undefined;
    var el = Array.prototype.splice.call(self, self.length-1);
    return el[0];
}

Array.prototype.shift = function() {
    var self = this;
    if (self.length==0) return undefined;
    var el = Array.prototype.splice.call(self, 0, 1);
    return el[0];
}


Array.prototype.unshift = function() {
    var self = this;
    var args = Array.prototype.slice.call(arguments);
    args = [0, 0].concat(args);
    Array.prototype.splice.apply(self, args);
    return self.length;
}

```

由于是使用`splice`方法来替代实现的，所以，这些方法不能用于类似数组对象。

笔者做了下性能对比测试：原生的最快，原型形式模拟的次之，函数形式模拟的最慢。性能测试见：[http://jsperf.com/splice-vs-push-pop-shift-unshift](http://jsperf.com/splice-vs-push-pop-shift-unshift)


#### 3.4 forEach/map/reduce的实现与效率！

先看定义：

> arr.forEach(callback[, thisArg])
> 
> arr.reduce(callback,[initialValue])
> 
> arr.map(callback[, thisArg])


给使用示例：

```
var numbers=[]
for(var i=0; i<100; ++i) {
    numbers[i] = i;
}

var sum = 0;
numbers.forEach(function(item) {
  sum += item;
})

console.log(sum);   //4950

var sum = numbers.reduce(function(sum, item){
    return sum+item;
}, 0);

console.log(sum);  //4950

numbers.slice(1,4).map(function(item){return Math.pow(item,2)});  //[1, 4, 9]

```


不太想写新手入门教程。写到这里，想说的是<span style="color:red">注意</span>下面几点：

* 使用`reduce`可以替代`forEach`的实现，并且效率略高一点点。实现和测试可见：[`http://jsperf.com/apply-vs-loop-for-max/2`](http://jsperf.com/apply-vs-loop-for-max/2)；
* 无论`forEach`还是`reduce`，都没有手写的`loop`循环效率高。具体测试可见[`http://jsperf.com/apply-vs-loop-for-max/2`](http://jsperf.com/apply-vs-loop-for-max/2)；
* 无论`forEach`还是`map`，其中的`callback`都是同步执行的，`async.js`框架中提供了对应的异步实现。


#### 3.5 其他：join/concat/sort/reverse/every/some...

Array内置了很多方法，下面在给出几个使用较多的方法的定义及使用示例。

定义：

> str = arr.join(separator)

> arr.concat(value1, value2, ..., valueN)
> 
> arr.sort([compareFunction])
> 
> arr.reverse()
> 
> arr.every(callback[, thisArg])
> 
> arr.some(callback[, thisArg])



使用示例：

```
var a = new Array("Wind","Rain","Fire");
var myVar1 = a.join();      // assigns "Wind,Rain,Fire" to myVar1
var myVar2 = a.join(", ");  // assigns "Wind, Rain, Fire" to myVar2
var myVar3 = a.join(" + "); // assigns "Wind + Rain + Fire" to myVar3


var alpha = ['a', 'b', 'c'];
var alphaNumeric = alpha.concat(1, [2, 3]);   //["a", "b", "c", 1, 2, 3] 
alphaNumeric = alpha.concat(1,[2,3],[[4]]);   //["a", "b", "c", 1, 2, 3, [4]]
 

var scores = [1, 2, 10, 21]; 
scores.sort(); // [1, 10, 2, 21]
scores.sort(function(a,b){return a-b}); //[1, 2, 10, 21]


var myArray = ["one", "two", "three"];
myArray.reverse();    // ["three", "two", "one"]



function isBigEnough(element, index, array) {
  return (element >= 10);
}
var passed = [12, 5, 8, 130, 44].every(isBigEnough);   //false
passed = [12, 54, 18, 130, 44].every(isBigEnough);     //true


passed = [2, 5, 8, 1, 4].some(isBigEnough);  //false
passed = [12, 5, 8, 1, 4].some(isBigEnough);  //true

```

**<span style="color:red">注意</span>：`concat`是浅层复制，从上面例子中也可以看出来。**，如果想实现深层复制，可以参考`underscore.js`框架中的`_.flatten`,或者参考`prototype.js`框架中的`Array#flatten()`。

<a name="4"></a>
### 四、结束

非常高兴，你能耐心看完这篇文章，希望能给你带来帮助！欢迎讨论！
