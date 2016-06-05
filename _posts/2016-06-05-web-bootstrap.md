---
layout: post
title: bootstrap的响应式布局
category: ['Web前端']
tags: ['bootstrap', 'Web']
author: 汪 回
email: wanghui6@asiainfo.com
description: 最近在学习bootstrap，希望可以在了解其使用方式的同时，也能够学习到bootstrap对于页面的布局和响应式设计的理念。
---

|  |  *目 录* |
| --- | --- |
| 1 | [响应式设计(Responsive Web Design)](#responsive) |
| 2 | [栅格系统和媒体查询](#tools) |
| 3 | [Bootstrap的响应式布局](#bootstrap) |
| 4 | [小结](#end) |
| 5 | [参考文献](#doc)|

## 一、响应式设计(Responsive Web Design) <a name="responsive"></a>

### 起源

响应式网页设计最初是出自 Ethan Marcotte 在A List Apart发表过一篇文章"Responsive Web Design"，文中援引了响应式建筑设计的概念：

最近出现了一门新兴的学科——"响应式建筑(responsive architecture)"——提出，物理空间应该可以根据存在于其中的人的情况进行响应。结合嵌入式机器人技术以及可拉伸材料的应用，建筑师们正在尝试建造一种可以根据周围人群的情况进行弯曲、伸缩和扩展的墙体结构；还可以使用运动传感器配合气候控制系统，调整室内的温度及环境光。已经有公司在生产"智能玻璃"：当室内人数达到一定的阀值时，这种玻璃可以自动变为不透明，确保隐私。

将这个思路延伸到Web设计的领域，我们就得到了一个全新的概念。
为什么一定要为每个用户群各自打造一套设计和开发方案？Web设计应该做到根据不同设备环境自动响应及调整。当然响应式Web设计不仅仅是关于屏幕分辨率自适应以及自动缩放的图片等等，它更像是一种对于设计的全新思维模式；我们应当向下兼容、移动优先。

### 背景

PC互联网加速向移动端迁移：2012年12月底我国网民规模达到5.64亿，互联网普及率为42.1%，手机用户占网民总数的74.5%。预计到2015年，移动互联网的数据流量将超越PC端的流量。

移动端入口：当用户希望通过手机来完成PC页的操作时，常见的是商家的运营微博，期文案足够吸引用户点击链接参加活动，如果该活动页没做响应式处理：页面体积大、请求多、体验差、兼容性差，层层阻碍最终导致用户放弃参加。

### 目的

因为越来越多的智能移动设备（ mobile, tablet device ）加入到互联网中来，移动互联网不再是独立的小网络了，而是成为了 Internet 的重要组成部分。响应式网络设计 （ RWD / AWD）的出现，目的是为移动设备提供更好的体验，并且整合从桌面到手机的各种屏幕尺寸和分辨率，用技术来使网页适应从小到大（现在到超大）的不同分辨率的屏幕。

_注： Responsive Web Design ＝ RWD，Adaptive Web Design ＝ AWD_

### 方法论

RWD：
- 采用 CSS 的 media query 技术
- 流体布局（ fluid grids ）
- 自适应的图片/视频等资源素材
（为小、中、大屏幕做一些优化，目的是让任何尺寸的屏幕空间都能得到充分利用）

AWD：
- CSS media query 技术（仅针对有限几种预设的屏幕尺寸设计）
- 用 Javascript 来操作 HTML 内容
- 在服务器端操作 HTML 内容（比如为移动端减少内容，为桌面端提供更多内容）

### 设计思路

Mobile First（从移动端开始，RWD ）：
一切从最小屏幕的移动端开始（比如 iPhone 的 320px ），先确定内容，然后逐级往大屏幕设计。
不同于原来网页设计，总是从桌面电脑的 1024px 开始的。
之所以从最小的屏幕开始设计，并不是因为移动端的重要性高于PC端，而是因为以最小的屏幕开始，可以从一开始就知道，哪些内容是必须的，哪些内容是次要的，减少开发受到的阻碍。



## 二、栅格系统和媒体查询 <a name="tools"></a>
如我们需要兼容不同屏幕分辨率、清晰度以及屏幕定向方式竖屏(portrait)、横屏(landscape)，怎样才能做到让一种设计方案满足所有情况？

那么我们的布局应该是一种弹性的栅格布局，不同尺寸下弹性适应，如以下页面中各模块在不同尺寸下的位置：

![gridSystem](/images/diffSize.jpg)

那么,我们应该如何实现呢?

### 栅格系统(Grid System)

栅格系统英文为“grid systems”，也有人翻译为“网格系统”，运用固定的格子设计版面布局，其风格工整简洁，是web页面设计的主流风格之一,是响应式设计的一种实现。

从上图中可以看到，一个页面可以拆分成多个区块来理解，而正是这些区块共同构成了这个页面的布局。根据不同的屏幕尺寸情况，调整这些区块的排版，就可以实现响应式设计。另外，屏幕宽度较大的时候，区块倾向于水平分布，而屏幕宽度较小的时候，区块倾向于竖直堆叠。
这些方方正正的区块是不是和栅格系统的格子挺相似？对的，为了让响应式设计更简单易用，于是有了很多称为“栅格”（grid）的样式库。
栅格样式库一般是这样做的：将页面划分为若干等宽的列（column），然后推荐你通过等宽列来创建响应式的页面区块。
虽然看起来都是这样的思路，但不同的栅格样式库，在方法和表现上有各自的特点。
在第三节，本文将以bootstrap为例，介绍它的Grid System简要原理和用法。

### 媒体查询(Media Queries)

在CSS中，有一个极其实用的功能：@media 响应式布局。具体来说，就是可以根据客户端的介质和屏幕大小，提供不同的样式表或者只展示样式表中的一部分。通过响应式布局，可以达到只使用单一文件提供多平台的兼容性，省去了诸如浏览器判断之类的代码。

下面大致介绍一些Media的用法。

> 在 head 链接CSS文件时提供判断语句，选择性加载不同的CSS文件

```
<link rel="stylesheet" href="middle.css" media="screen and (min-width: 400px)">  
```

这句意味在满足 media 的判断语句 screen and (min-width: 400px) 即 屏幕并且最小宽度不小于400px 的介质上面使用 middle.css 。

> 在CSS文件中分段书写不同设备的代码

```
@media screen and (min-width: 600px) { /* CSS Code */ }  
@media screen and (max-width: 1200px) { /* CSS Code */ }  
```

写在 @media 语句段外的是共用代码，第一个 @media 当屏幕宽度以及大于最小宽度600px时执行内部CSS代码 ，第二个 @media 当屏幕宽度小于最大宽度1200px时执行内部CSS代码。


反应灵敏的栅格系统，搭配上合理的媒体查询，就可以让web页面具备良好的响应性。

下面将以bootstrap为例，介绍bootstrap的响应式设计。

## 三、Bootstrap的响应式布局 <a name="bootstrap"></a>

Bootstrap是Twitter推出的一个用于前端开发的开源工具包。它由Twitter的设计师Mark Otto和Jacob Thornton合作开发,是一个CSS/HTML框架,目前最新版本是v3.3.6(bootstap 4.0即将推出)。
Bootstrap的内容包括三大部分,分别是:全局CSS样式、通用组件以及Javascript插件。
由于响应式设计的实现主要是基于栅格系统和媒体查询,所以直接了解bootstrap的Grid System 和 Media Query。

### 3.1 布局容器(container)和栅格系统(Grid System)

### 布局容器(container)
页面内容和栅格系统需要用到一个容器将其包裹起来，为此，bootstrap提供了两个作此用处的类: <font color="red">.container .container-fluid</font>。

注意，由于 padding 等属性的原因，这两种 容器类不能互相嵌套。

<font color="red">.container</font> 类用于固定宽度并支持响应式布局的容器。

```
<div class="container">
  ...
</div>
```

<font color="red">.container-fluid</font> 类用于 100% 宽度，占据全部视区(viewport)的容器。

```
<div class="container-fluid">
  ...
</div>
```

### 栅格系统(Grid System) 

Bootstrap提供了一套响应式的流式栅格系统，随着屏幕或视区(viewport)尺寸的增加，系统会自动分为最多12列。它包含了易于使用的预定义类，还有强大的mixin用于生成更具语义的布局。

栅格系统用于通过一系列的行（row）与列（column）的组合来创建页面布局，你的内容就可以放入这些创建好的布局中。下面就介绍一下 Bootstrap 栅格系统的工作原理：

- “行（row）”必须包含在 .container （固定宽度）或 .container-fluid （100% 宽度）中，以便为其赋予合适的排列（aligment）和内补（padding）。
- 通过“行（row）”在水平方向创建一组“列（column）”。
- 你的内容应当放置于“列（column）”内，并且，只有“列（column）”可以作为行（row）”的直接子元素。
- 类似 .row 和 .col-xs-4 这种预定义的类，可以用来快速创建栅格布局。Bootstrap 源码中定义的 mixin 也可以用来创建语义化的布局。
- 通过为“列（column）”设置 padding 属性，从而创建列与列之间的间隔（gutter）。通过为 .row 元素设置负值 margin 从而抵消掉为 .container 元素设置的 padding，也就间接为“行（row）”所包含的“列（column）”抵消掉了padding。
- 栅格系统中的列是通过指定1到12的值来表示其跨越的范围。例如，三个等宽的列可以使用三个 .col-xs-4 来创建。
- 如果一“行（row）”中包含了的“列（column）”大于 12，多余的“列（column）”所在的元素将被作为一个整体另起一行排列。
- 栅格类适用于与屏幕宽度大于或等于分界点大小的设备 ， 并且针对小屏幕设备覆盖栅格类。 因此，在元素上应用任何 .col-md-* 栅格类适用于与屏幕宽度大于或等于分界点大小的设备,并且针对小屏幕设备覆盖栅格类。因此，在元素上应用任何 .col-lg-* 不存在，也影响大屏幕设备。

容器（container），行（row）和列（column）之间的层级关系。一个正确的写法示例如下：

```
<div class="container">  
    <div class="row">  
        <div class="col-md-6"></div>  
        <div class="col-md-6"></div>  
    </div>  
</div>  
```

row（.row）必须位于container的内部，column（如.col-md-6）必须位于row的内部。也就是说，container、row、column必须保持特定的层级关系，栅格系统才可以正常工作。
为什么需要这样？查看这些元素的样式，会发现container有15px的水平内边距，row有-15px的水平负外边距，column则有15px的水平内边距。这些边距是故意的、相互关联的，也因此就像齿轮啮合那样，限定了层级结构。
这些边距其实也是Bootstrap栅格的精巧之处。
如果要嵌套使用栅格，正确的做法是在column内直接续接row，然后再继续接column，而不再需要container：

```
<div class="container">   
    <div class="row">   
        <div class="col-md-8">   
            <div class="row">   
                <div class="col-md-6"></div>   
                <div class="col-md-6"></div>   
            </div>   
        </div>   
        <div class="col-md-4"></div>   
    </div>   
</div>  
```


### 3.2 媒体查询(Media Grid)
Bootstrap栅格的column对应的类名形如.col-xx-y。
y是数字，表示该元素的宽度占据12列中的多少列。而xx只有特定的几个值可供选择，分别是xs、sm、md、lg，它们就是断点类型。
在Bootstrap栅格的设计中，断点的意义是，当视口（viewport）宽度小于断点时，column将竖直堆叠（display: block的默认表现），而当视口宽度大于或等于断点时，column将水平排列（float的效果）。按照xs、sm、md、lg的顺序，断点像素值依次增大，其中xs表示极小，即认为视口宽度永远不小于xs断点，column将始终水平浮动。
有时候，会需要将多种断点类型组合使用，以实现更细致的响应式设计。此时不同的断点类型之间会有怎样的相互作用呢？
先看看Bootstrap的sass源码是如何定义栅格的：

```
@include make-grid-columns;   
@include make-grid(xs);   
@media (min-width: $screen-sm-min) {   
  @include make-grid(sm);   
}   
@media (min-width: $screen-md-min) {   
  @include make-grid(md);   
}   
@media (min-width: $screen-lg-min) {   
  @include make-grid(lg);   
}  
```

可以看到，用了min-width的写法，而且断点像素值越大的，对应代码越靠后。所以，如果有这样的一些元素：

```
<div class="container">   
    <div class="row">   
        <div class="col-sm-6 col-lg-3">1</div>   
        <div class="col-sm-6 col-lg-3">2</div>   
        <div class="col-sm-6 col-lg-3">3</div>   
        <div class="col-sm-6 col-lg-3">4</div>   
    </div>   
</div>  
```
那么它们应该是这样的效果：
![gridSystem](/images/gridSystem.png)

结合前面的源码，可以想到，在上面这样视口宽度由小变大的过程中，首先是保持默认的竖直堆叠，然后超过了sm的断点，sm的样式生效，变为一行两列的排版，再继续超过lg的断点后，lg的样式也生效，由于lg的样式代码定义在sm之后，所以会覆盖掉sm的样式，从而得到一行四列的排版。
所以，结合使用多个断点类型，就可以引入多个断点变化，把响应式做得更加细致。

通过下表可以详细查看Bootstrap的栅格系统和媒体查询是如何在多种屏幕设备上工作的。

|	|超小屏幕 手机 (<768px)|小屏幕 平板 (≥768px)|中等屏幕 桌面显示器 (≥992px)|大屏幕 大桌面显示器 (≥1200px)|
| --- | --- | --- | --- | --- | 
|栅格系统行为|	总是水平排列|开始是堆叠在一起的，当大于这些阈值时将变为水平排列  |||
|.container最大宽度|None（自动|750px|970px|1170px|
|类前缀|.col-xs-|	.col-sm-|.col-md-|.col-lg-|
|列（column）数|12||
|最大列（column）宽|自动|~62px|~81px|~97px|
|槽（gutter）宽|30px(每列左右均有 15px)   ||||
|可嵌套|是||||
|偏移（Offsets）|是  ||||
|列排序|是  ||||


当然，bootstrap只预定义了基本的媒体查询，bootstrap鼓励用户对其进行扩展，用户可结合项目实际情况，添加、修改媒体查询的规则，让自己的页面在不同的设备环境准确响应。

## 四、小结 <a name="end"></a>
完整且层次分明的栅格系统，可扩展的媒体查询，bootstrap基于这两者，构建了自己的强大的响应式布局功能，让用户能够轻松的为自己的页面实现响应式设计。
当然，这也仅仅是技术上的实现，而响应式设计是一种设计方式和理念，还更多的包括前期对页面展示的规划和设计，如何让页面展示得自然、全面，让用户在不同的设备上得到到同样优质的体验，也是响应式设计的重点内容。

## 五、参考文献 <a name="doc"></a>
[http://getbootstrap.com/](http://getbootstrap.com/)


[http://www.jb51.net/css/362199.html/](http://www.jb51.net/css/362199.html/)


[http://isux.tencent.com/responsive-web-design.html/](http://isux.tencent.com/responsive-web-design.html)