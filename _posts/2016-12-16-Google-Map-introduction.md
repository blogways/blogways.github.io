---
layout: post
title: Google地图入门
category: ['杂记']
tags: ['Google']
author: 陈凡
email: chenfan@asiainfo.com
description: GoogleMapsAPI是Google为开发者提供的Maps编程API。它允许开发者在不必建立自己的地图服务器的情况下，将GoogleMaps地图数据嵌入到网站之中，从而实现嵌入GoogleMaps的地图服务应用，并借助GoogleMaps的地图数据为用户提供位置服务。
---

|      | *目 录*             |
| ---- | ----------------- |
| 1    | [Google地图简介](#link1) |
| 2    | [创建一个简单的 Google 地图](#link2) |
| 3    | [总结与心得](#link3)    |

<a id="link1"></a>

## 一.Google地图简介

GoogleMapsAPI除了帮助开发者将地图嵌入到Web应用中之外，还允许开发者利用JavaScript脚本进行应用开发拓展，给地图添加标注和路径及其他图层覆盖物，或者响应用户的点击动作，并显示包含内容信息在内的气泡提示窗口。

通过GoogleMaps为开发者提供的地图API，可以开发出各种各样有趣的地图Mash-up应用，还可以将不同地图图层加载到应用中，如卫星影像、根据海拔高度绘制的高山和植被地形图、街道视图等，从而帮助开发者打造个性化的地图应用站点。

Google 地图 API 是一种通过 JavaScript 将 Google 地图嵌入到您的网页的 API。该 API 提供了大量实用工具用以处理地图,并通过各种服务向地图添加内容，从而使您能够在您的网站上创建功能全面的地图应用程序。

地图 API 是一项免费的服务，任何非盈利性网站均可使用。

<a id="link2"></a>

## 二.创建一个简单的 Google 地图

我们通过引入插件的方式创建Google地图

    <!DOCTYPE html>
    <html>
    <head>
    <script src="http://maps.googleapis.com/maps/api/js?key=AIzaSyDY0kkJiTPVd2U7aTOAwhc9ySH6oHxOIYM&sensor=false">
    </script>
    
    <script>
    function initialize()
    {
    var mapProp = {
      center:new google.maps.LatLng(51.508742,-0.120850),
      zoom:5,
      mapTypeId:google.maps.MapTypeId.ROADMAP
      };
    var map=new google.maps.Map(document.getElementById("googleMap")
      ,mapProp);
    }
    
    google.maps.event.addDomListener(window, 'load', initialize);
    </script>
    </head>
    
    <body>
    <div id="googleMap" style="width:500px;height:380px;"></div>
    
    </body>
    </html>
    
### 1.应用为什么要声明 HTML5?

`<!DOCTYPE html>`大多数浏览器使用 "标准模式" 的 HTML5 文档渲染页面，这就意味着你的应用是兼容各大浏览器的。

另外，如果没有DOCTYPE标签，浏览器则使用混杂模式 (quirks mode)进行渲染页面内容。

**提示**： 应该注意的是一些"混杂模式 "中的CSS并不能使用与标准模式中。在具体的应用中，所有基于百分比的大小都必须从父块元素继承 。如果在父模块中没有指定大小，默认值为 0 x 0 像素。如果你想使用百分比，可以在<style> 标签中声明，如下所示：

    <style type="text/css">
    html {height:100%}
    body {height:100%;margin:0;padding:0}
    #googleMap {height:100%}
    </style>
这个样式声明表明地图模块的（GoogleMap）应 HTML高度为100%。

### 2.添加 Google 地图 API Key

在以下实例中第一个<script> 标签中必须包含 Google 地图 API：

    <script src="http://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&sensor=TRUE_OR_FALSE">
    </script>
    
将google生成的 API key 放置于 key 参数中(key=YOUR_API_KEY)。
**sensor**
这个参数是必须的，该参数用于指明应用程序是否使用一个传感器 (类似 GPS 导航) 来定位用户的位置。参数值可以设置为 true 或者 false。
**HTTPS**
如果你的应用是安全的HTTP(HTTPS:HTTP Secure)应用,你可以使用 HTTPS 来加载 Google 地图 API：

    <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&sensor=TRUE_OR_FALSE">
    </script>

### 3.异步加载

同样我们也可以在页面完全载入后再加载 Google 地图 API。
以下实例使用了 window.onload 来实现页面完全载入后加载 Google 地图 。 loadScript() 函数创建了加载 Google 地图 API     `<script>` 标签。此外在标签的末尾添加了 callback=initialize 参数， initialize()作为回调函数会在API完全载入后执行：

**实例**

    function loadScript()
    {
    var script = document.createElement("script");
    script.src = "http://maps.googleapis.com/maps/api/js?      key=AIzaSyDY0kkJiTPVd2U7aTOAwhc9ySH6oHxOIYM&sensor=false&callback=initialize"; document.body.appendChild(script);
    }
    
    window.onload = loadScript;


### 4.定义地图属性
在初始化地图前，我们需要先创建一个 Map 属性对象来定义一些地图的属性：

    var mapProp = {
      center:new google.maps.LatLng(51.508742,-0.120850),
      zoom:7,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
**center（中心点）**
中心属性指定了地图的中心，该中心通过坐标（纬度，经度）在地图上创建一个中心点。

**Zoom（缩放级数）**
zoom 属性指定了地图的 缩放级数。zoom: 0
显示了整个地球地图的完全缩放。

MapTypeId（地图的初始类型）

mapTypeId 属性指定了地图的初始类型。

mapTypeId包括如下四种类型：

 - google.maps.MapTypeId.HYBRID：显示卫星图像的主要街道透明层

 - google.maps.MapTypeId.ROADMAP：显示普通的街道地图

 - google.maps.MapTypeId.SATELLITE：显示卫星图像

 - google.maps.MapTypeId.TERRAIN：显示带有自然特征（如地形和植被）的地图

**在哪里显示 Google 地图**

通常 Google 地图使用于` <div>` 元素中：

    <div id="googleMap" style="width:500px;height:380px;">
    </div>
>注意： 地图将以div中设置的大小来显示地图的大小，所以我们可以在   `<div>`元素中设置地图的大小。

### 5.创建一个 Map 对象

    var map=new google.maps.Map(document.getElementById("googleMap")
    ,mapProp);
以上代码使用参数(mapProp)在<div> 元素 (id为googleMap) 创建了一个新的地图。
>提示：如果想在页面中创建多个地图，你只需要添加新的地图对象即可。

以下实例定义了四个地图实例 (四个地图使用了不同的地图类型):
实例:

    var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
    var map2 = new google.maps.Map(document.getElementById("googleMap2"),mapProp2);
    var map3 = new google.maps.Map(document.getElementById("googleMap3"),mapProp3);
    var map4 = new google.maps.Map(document.getElementById("googleMap4"),mapProp4);


### 6.加载地图
窗口载入后通过执行 initialize() 函数来初始化 Map 对象，这样可以确保在页面完全载入后再加载 Google 地图：

    google.maps.event.addDomListener(window, 'load', initialize);
    
<a id="link3"></a>

### 三.总结与心得

最近在做凤来的临柜时长，涉及了山西地图等问题，用的是echart地图来画，偶然看到了Google地图API插件，做出来的效果不错，如果有兴趣大家可以深入的了解一下。




