---
layout: post
title: H5终端自适应解决方案 -- flexible + rem
category: ['web前端']
tags: ['rem', 'Web']
author: 刘益伟
email: liuyw6@asiainfo.com
description: H5终端自适应解决方案
---

|  |  *目 录* |
| --- | --- |
| 1 | [目前移动端现状](#1st) |
| 2 | [像素的概念](#2nd) |
| 3 | [初识rem与flexible](#3nd) |
| 4 | [制作rem小例子](#end) |

<a id="1st"></a>

## 一、目前移动端现状
	
#### 随着移动设备的普及，不同的手机屏幕与尺寸接连出现；作为前端开发人员，虽然H5的页面与PC的Web页面相比简单了不少，但让我们头痛的事情是要想尽办法让页面能适配众多不同的终端设备，让我们来看看目前市场上的情况

![20160826img01](/images/liuyw6/20160826img01.png)

#### 而作为前端开发人员，需要适配终端设备数据如下图

![20160826img02](/images/liuyw6/20160826img02.png)

#### 看到这些数据，是否死的心都有了，或者说为此捏了一把汗出来。

#### 为了应对如此多的终端设备，设计师和前端开发之间又应该采用什么协作模式？

#### 目前淘宝的设计思路为：

#### 1.选择一种尺寸作为设计和开发基准

#### 2.定义一套适配规则，自动适配剩下的两种尺寸(其实不仅这两种，你懂的)

#### 3.特殊适配效果给出设计效果	

#### 如下图为手淘的协作模式

![20160826img03](/images/liuyw6/20160826img03.jpg)

#### 通过上图可以看出，手淘设计师常选择iPhone6作为基准设计尺寸，交付给前端的设计尺寸是按750px * 1334px为准(高度会随着内容多少而改变)。前端开发人员通过一套适配规则（flexible+rem）自动适配到其他的尺寸，flexible+rem会在后面详解。

## 二、像素的概念

#### 做为前端开发人员，对于像素的概念是不可或缺的，其中包含了“物理像素(physical pixel)”、“设备独立像素(density-independent pixel)”、“CSS像素”、“屏幕密度”、“设备像素比(device pixel ratio)”等基本概念，让我们一个个的理解

### 1.物理像素(physical pixel)

#### 物理像素又被称为设备像素，他是显示设备中一个最微小的物理部件。每个像素可以根据操作系统设置自己的颜色和亮度。正是这些设备像素的微小距离欺骗了我们肉眼看到的图像效果。

### 2.设备独立像素(density-independent pixel)

#### 设备独立像素也称为密度无关像素，可以认为是计算机坐标系统中的一个点，这个点代表一个可以由程序使用的虚拟像素(比如说CSS像素)，然后由相关系统转换为物理像素。

### 3.CSS像素

#### CSS像素是一个抽像的单位，主要使用在浏览器上，用来精确度量Web页面上的内容。一般情况之下，CSS像素称为与设备无关的像素(device-independent pixel)，简称DIPs。

### 4.屏幕密度

#### 屏幕密度是指一个设备表面上存在的像素数量，它通常以每英寸有多少像素来计算(PPI)。

### 5.设备像素比(device pixel ratio)

#### 设备像素比简称为dpr，其定义了物理像素和设备独立像素的对应关系。它的值可以按下面的公式计算得到：

#### 设备像素比 ＝ 物理像素 / 设备独立像素

#### 在JavaScript中，可以通过window.devicePixelRatio获取到当前设备的dpr。而在CSS中，可以通过-webkit-device-pixel-ratio，-webkit-min-device-pixel-ratio和 -webkit-max-device-pixel-ratio进行媒体查询，对不同dpr的设备，做一些样式适配(这里只针对webkit内核的浏览器和webview)。

#### dip或dp,（device independent pixels，设备独立像素）与屏幕密度有关。dip可以用来辅助区分视网膜设备还是非视网膜设备

#### 众所周知，iPhone6的设备宽度和高度为375pt * 667pt,可以理解为设备的独立像素；而其dpr为2，根据上面公式，我们可以很轻松得知其物理像素为750pt * 1334pt。


## 三、初识rem与flexible

### 1.CSS3新成员：rem

#### 在W3C规范中是这样描述rem的:   

#### font size of the root element.

#### 简单的理解，rem就是相对于根元素<html>的font-size来做计算。而我们的方案中使用rem单位，是能轻易的根据<html>的font-size计算出元素的盒模型大小。而这个特色对我们来说是特别的有益处。

#### 在整个手淘团队，我们有一个名叫lib-flexible的库，而这个库就是用来解决H5页面终端适配的。
	
	
### 2.lib-flexible是什么？

#### lib-flexible是一个制作H5适配的开源库，获取需要的JavaScript和CSS文件，可以直接下载或直接通过阿里CDN云

#### 下载地址：https://github.com/amfe/lib-flexible/archive/master.zip

#### 下载后解压，同时引入js库，如

#### <script src="build/flexible_css.debug.js"></script>
#### <script src="build/flexible.debug.js"></script>

#### 云引用：<script src="http://g.tbcdn.cn/mtb/lib-flexible/0.3.4/??flexible_css.js,flexible.js"></script>

#### 3.lib-flexible有什么用？

#### lib-flexible加入执行后，会在<html>元素上增加一个data-dpr属性，以及一个font-size样式。

#### JS会根据不同的设备添加不同的data-dpr值，比如说2或者3，同时会给html加上对应的font-size的值，比如说75px；

#### 如此一来，页面中的元素，都可以通过rem单位来设置。他们会根据html元素的font-size值做相应的计算，从而实现屏幕的适配效果。


## 四、rem小例子分析

#### 请用手机扫下面的二维码查看最终实现效果

![20160826img04](/images/liuyw6/20160826img04.jpg)

#### 该界面是如何实现的？首先我们来看一张750的设计图稿

![20160826img05](/images/liuyw6/20160826img05.png)

#### 通过该设计稿可知每个元素的边距、大小在750*1334上的比例；前端开发人员可在750设备上完成框架设计（即iphone6上进行开发），之后通过将px转化为rem实现终端适配，详细流程如下

### 1.创建HTML模版

```
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta content="yes" name="apple-mobile-web-app-capable">
        <meta content="yes" name="apple-touch-fullscreen">
        <meta content="telephone=no,email=no" name="format-detection">
        <script src="http://g.tbcdn.cn/mtb/lib-flexible/0.3.4/??flexible_css.js,flexible.js"></script>
        <link rel="apple-touch-icon" href="favicon.png">
        <link rel="Shortcut Icon" href="favicon.png" type="image/x-icon">
        <title>flexible+rem实战用例</title>
    </head>
    <body>
        <!-- 页面结构写在这里 -->
    </body>
</html>
```

#### 首先需要加载Flexible所需的配置

```
<script src="http://g.tbcdn.cn/mtb/lib-flexible/0.3.4/??flexible_css.js,flexible.js"></script>
```

### 2.根据设计图编写<body>中的内容，具体如下

```
<div class="item-section" data-repeat="sections">
    <div class="item-section_header">
        <h2><img src="http://xxx.cdn.com/B1PNLZKXXXXXaTXXXXXXXXXXXX-750-481.jpg" alt=""></h2>
    </div>
    <ul>
        <li data-repeat="items" class="flag" role="link" href="##">
            <a class="figure flag-item" href="##">
                <img src="https://placeimg.com/350/350/people/grayscale" alt="">
            </a>
            <div class="figcaption flag-item">
                <div class="flag-title"><a href="##" title="">Carter's1年式灰色长袖连体衣包脚爬服全棉鲸鱼男婴儿童装115G093</a></div>
                <div class="flag-price"><span>双11价</span><strong>¥299.06</strong><small>(满400减100)</small></div>
                <div class="flag-type">1小时内热卖5885件</div>
                <a class="flag-btn" href="##">马上抢！</a>
            </div>
        </li>
    </ul>
</div>
```

### 3.将px转化为rem，以适配不同终端

#### 在实际生产当中，如果每一次计算px转换rem，或许会觉得非常麻烦，或许直接影响大家平时的开发效率。为了能让大家更快进行转换，我们团队内的同学各施所长，为px转换rem写了各式各样的小工具。

#### （1）CSSREM

#### CSSREM是一个CSS的px值转rem值的Sublime Text3自动完成插件。这个插件是由@正霖编写。先来看看插件的效果：

![20160826img06](/images/liuyw6/20160826img06.gif)

#### （2）在线转换器

#### 地址：http://520ued.com/tools/rem ； 该转换器上传工程CSS文件，然后定义html font size，即可转换


## 结束语

#### 本文主要就目前移动终端的适配做了一个简单的阐述，目的在于认识移动终端，知晓目前主流的适配方法；详细的学习请参考丰富的网络资源，谢谢！