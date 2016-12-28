---
layout: post
title: 微信小程序
category: ['杂记']
tags: ['wchart']
author: 陈凡
email: chenfan@asiainfo.com
description: 微信小程序是一种全新的连接用户与服务的方式，它可以在微信内被便捷地获取和传播，同时具有出色的使用体验。
---

|      | *目 录*             |
| ---- | ----------------- |
| 1    | [微信小程序简介](#link1) |
| 2    | [工具安装](#link2)    |
| 3    | [基本介绍](#link3)    |
| 4    | [代码编写](#link4)    |
| 5    | [demo](#link5)    |

<a id="link1"></a>

## 一.微信小程序介绍

微信应用号是一个APP应用推广平台，微信应用号目前暂定名为“小程序”，使用微信应用号平台，用户关注一个应用号就如同安装一个App一样，而微信应用号就相当于另一个App Store，主要功能就是应用推广。用户关注一个应用号就如同安装一个App一样，而微信应用号就相当于另一个App Store，主要功能就是应用推广。微信的目的似乎很简单，就是希望把用户使用App的动作都集中在微信上。应用号有两大特色：首先APP功能可以直接通过关注应用号来实现，所以用户就省去了安装下载卸载等等一系列动作，对那些使用频率不高的软件来说，你完全可以用“应用号”代替;另外，用户也免去了不定时下载软件更新包的困扰。

然而微信应用号要能获取足够多的用户，还得要开发者的支持。毫无疑问，开发者将是微信应用号的最大获益群体。对于开发者而言，应用号可以节省开发成本，并且可以提升研发效率，开发人员只需要研发出一款适用于浏览器应用的产品，就可满足不同操作系统的使用需求。另外，入驻应用号的APP营销推广工作也能取到事半功倍的效果。

<a id="link2"></a>

## 二.工具安装

点击https://mp.weixin.qq.com，点击微信小程序，点击工具下载，选择对应的版本，即可安装，这是官方提供编辑工具

<a id="link3">

## 三. 基本介绍

开发者工具安装完成后，打开并使用微信扫码登录。选择创建“项目”，填入上文获取到的 AppID ，设置一个本地项目的名称（非小程序名称），比如“我的第一个项目”，并选择一个本地的文件夹作为代码存储的目录，点击“新建项目”就可以了。

为方便初学者了解微信小程序的基本代码结构，在创建过程中，如果选择的本地文件夹是个空文件夹，开发者工具会提示，是否需要创建一个 quick start 项目。选择“是”，开发者工具会帮助我们在开发目录里生成一个简单的 demo。

![](/images/chenfan/wchart1.png)

项目创建成功后，我们就可以点击该项目，进入并看到完整的开发者工具界面，点击左侧导航，在“编辑”里可以查看和编辑我们的代码，在“调试”里可以测试代码并模拟小程序在微信客户端效果，在“项目”里可以发送到手机里预览实际效果。

<a id="link4"></a>

## 四.代码编写

#### 创建小程序实例

点击开发者工具左侧导航的“编辑”，我们可以看到这个项目，已经初始化并包含了一些简单的代码文件。最关键也是必不可少的，是 app.js、app.json、app.wxss 这三个。其中，.js后缀的是脚本文件，.json后缀的文件是配置文件，.wxss后缀的是样式表文件。微信小程序会读取这些文件，并生成小程序实例。

下面我们简单了解这三个文件的功能，方便修改以及从头开发自己的微信小程序。

- app.js

app.js是小程序的脚本代码。我们可以在这个文件中监听并处理小程序的生命周期函数、声明全局变量。调用框架提供的丰富的API，如本例的同步存储及同步读取本地数据。

    App({
      onLaunch: function () {
        //调用API从本地缓存中获取数据
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
      },
      getUserInfo:function(cb){
        var that = this;
        if(this.globalData.userInfo){
          typeof cb == "function" && cb(this.globalData.userInfo)
        }else{
          //调用登录接口
          wx.login({
            success: function () {
              wx.getUserInfo({
                success: function (res) {
                  that.globalData.userInfo = res.userInfo;
                  typeof cb == "function" && cb(that.globalData.userInfo)
                }
              })
            }
          });
        }
      },
      globalData:{
        userInfo:null
      }
    })

- app.json

app.json 是对整个小程序的全局配置。我们可以在这个文件中配置小程序是由哪些页面组成，配置小程序的窗口背景色，配置导航条样式，配置默认标题。注意该文件不可添加任何注释。

    {
      "pages":[
        "pages/index/index",
        "pages/logs/logs"
      ],
      "window":{
        "backgroundTextStyle":"light",
        "navigationBarBackgroundColor": "#fff",
        "navigationBarTitleText": "WeChat",
        "navigationBarTextStyle":"black"
      }
    }

  

- app.wxss

app.wxss 是整个小程序的公共样式表。如同web编写的CSS一样，我们可以在页面组件的 class 属性上直接使用 app.wxss中声明的样式规则。

    .container {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 200rpx 0;
      box-sizing: border-box;
    }

>基本写作规则和css一样

- 创建页面

在这个教程里，我们有两个页面，index 页面和 logs 页面，即欢迎页和小程序启动日志的展示页，他们都在 pages 目录下。微信小程序中的每一个页面的【路径+页面名】都需要写在 app.json 的 pages 中，且 pages 中的第一个页面是小程序的首页。

每一个小程序页面是由同路径下同名的四个不同后缀文件的组成，如：index.js、index.wxml、index.wxss、index.json。.js后缀的文件是脚本文件，.json后缀的文件是配置文件，.wxss后缀的是样式表文件，.wxml后缀的文件是页面结构文件。

index.wxml 是页面的结构文件：

    <!--index.wxml-->
    <view class="container">
      <view  bindtap="bindViewTap" class="userinfo">
        <image class="userinfo-avatar" src="{{userInfo.avatarUrl}}" background-size="cover"></image>
        <text class="userinfo-nickname">{{userInfo.nickName}}</text>
      </view>
      <view class="usermotto">
        <text class="user-motto">{{motto}}</text>
      </view>
    </view>
本例中使用了 `<view/>`、`<image/>`、`<text/>`来搭建页面结构，绑定数据和交互处理函数。

- index.js

index.js 是页面的脚本文件，在这个文件中我们可以监听并处理页面的生命周期函数、获取小程序实例，声明并处理数据，响应页面交互事件等。

    //index.js
    //获取应用实例
    var app = getApp()
    Page({
      data: {
        motto: 'Hello World',
        userInfo: {}
      },
      //事件处理函数
      bindViewTap: function() {
        wx.navigateTo({
          url: '../logs/logs'
        })
      },
      onLoad: function () {
        console.log('onLoad')
        var that = this
        //调用应用实例的方法获取全局数据
        app.getUserInfo(function(userInfo){
          //更新数据
          that.setData({
            userInfo:userInfo
          })
        })
      }
    })

- index.wxss

index.wxss 是页面的样式表：
​    
    /**index.wxss**/
    .userinfo {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .userinfo-avatar {
      width: 128rpx;
      height: 128rpx;
      margin: 20rpx;
      border-radius: 50%;
    }
    
    .userinfo-nickname {
      color: #aaa;
    }
    
    .usermotto {
      margin-top: 200px;
    }
页面的样式表是非必要的。当有页面样式表时，页面的样式表中的样式规则会层叠覆盖 app.wxss 中的样式规则。如果不指定页面的样式表，也可以在页面的结构文件中直接使用 app.wxss 中指定的样式规则。

- index.json

index.json 是页面的配置文件：

页面的配置文件是非必要的。当有页面的配置文件时，配置项在该页面会覆盖 app.json 的 window 中相同的配置项。如果没有指定的页面配置文件，则在该页面直接使用 app.json 中的默认配置。

logs 的页面结构

    <!--logs.wxml-->
    <view class="container log-list">
      <block wx:for="{{logs}}" wx:for-item="log">
        <text class="log-item">{{index + 1}}. {{log}}</text>
      </block>
    </view>
logs 页面使用  `<block/>` 控制标签来组织代码，在 `<block/>` 上使用 wx:for 绑定 logs 数据，并将 logs 数据循环展开节点

    //logs.js
    var util = require('../../utils/util.js')
    Page({
      data: {
        logs: []
      },
      onLoad: function () {
        this.setData({
          logs: (wx.getStorageSync('logs') || []).map(function (log) {
            return util.formatTime(new Date(log))
          })
        })
      }
    })

<a id="link5"></a>

## 五.demo编写

我在网上找了个比较简单上手的小例子，一个读书的demo

先上个效果图

![](/images/chenfan/wchart2.png)

1. 首先我们先要在最下面添加导航,即在app.json中添加tabBar的配置


        "tabBar": {
            "color": "#dddddd",
            "selectedColor": "#d92121",
            "borderStyle": "white",
            "backgroundColor": "#fff",
            "list": [{
              "pagePath": "pages/index",
              "iconPath": "images/main.png",
              "selectedIconPath": "images/main-s.png",
              "text": "主页"
            },{
              "pagePath": "pages/layout/hot",
              "iconPath": "images/hot.png",
              "selectedIconPath": "images/hot-s.png",
              "text": "最热"
            },{
              "pagePath": "pages/layout/new",
              "iconPath": "images/new.png",
              "selectedIconPath": "images/new-s.png",
              "text": "最新"
            }]
          }

pagePath，就是此tabBar对应的页面链接

2. 然后开始我们的主要工作，即制作主页

先看下目录结构，

![](/images/chenfan/wchart3.png)

即在pages下写我们的js，html和样式表

我们打开首页index页面

    var app = getApp();
    Page({
      data: {
        indexList:app.getBoookList()
      },
      onLoad: function(options) {
        // Do some initialize when page load.
      },
      onReady: function() {
        // Do something when page ready.
      },
      onShow: function() {
        // Do something when page show.
      },
      onHide: function() {
        // Do something when page hide.
      },
      onUnload: function() {
        // Do something when page close.
      },
      // Event handler.
      viewTap: function() {
        this.setData({
          text: 'Set some data for updating view.'
        })
      }
    })

可以看到上面的页面生命周期，我们可以在事件中写我们自己要处理的事件。

其中getApp();方法获取全局实例。

我们打开视图页面：

    <view class="banner">
      <image src="../images/banner.jpg" />
    </view>
    
    <view class="list clearfix">
        <view class="list-item" wx:for="{{indexList}}">
          <navigator url="bookList/bookDetails?title={{item.bookName}}&id={{item.id}}" hover-class="navigator-hover"> <image src="{{item.bookUrl}}" /></navigator>
          <view class="book-name">
             <navigator url="bookList/bookDetails?title={{item.bookName}}&id={{item.id}}" hover-class="navigator-hover"> {{item.bookName}}</navigator>
         </view>
        </view>
    
        <view class="menus">
          <image src="../images/menu.png" class="menu-btn" />
          <!--<view class="menu-list" id="menu-list">
            <view>本机书架</view>
            <view>wifi传书</view>
            <view>云书架</view>        
          </view>-->
        </view>
    </view>

这里看到箭头指向的 wx：for=“”，这个是一个出来数组或列表对象的循环方法，而item是默认（又是默认）的单个列表元素。用不不想用item也可以起别名。

navigator就是导航标签了，这里，类似于html中的<a>标签，就不在说了。点击navigator的内容页面跳转对应页面，同样是用url传递数据。

打开index.wxss

    .list{
        width: 100%;
        background: #fff;
    }
    .list-item{
        width: 33.333333%;
        height: 370rpx;
        text-align: center;
        padding-top: 5px;
        float: left;
    }
    .list-item image {
        width: 80%;
        height: 300rpx;
    }
    .book-name{
        font-size: 28rpx;
        color: #000;
    }
    .menus{
        position: fixed;
        bottom: 5px;
        right: 5px;
        border-radius:100%;
        background-color: rgba(0, 0, 0, 0.5);
        text-align: center;
    }
    .menus image{
        width: 64rpx;
        height: 64rpx;
        vertical-align: middle
    }
    .banner image {
        width:750rpx;
        height: auto;
    }

可以看下后台代码：

    var app = getApp();
    Page({
      onLoad: function(options) {
        this.setData({
          title: options.title,
          id:options.id,
          bookDetails:app.getOneBook(options.id)
        })
      }
    })

数据可以通过url传递，目标页面通过onLoad方法中的参数（ 对象）获取。这里还可以看到书的详情是通过全局getApp获取全局实例，获取数据。这个数据就是在全局app.js里面。

    App( {
        getBanner:function(){
            var bannerUrl=["../images/banner.jpg"];
            return bannerUrl;
        },
        getOneBook:function(id){
            var abook;
          var books =  [
                        {   id:"1",
                            bookUrl:"../images/img1.jpg",
                            bookName:"西方哲学史",
                            bookInfor:"关于哲学"
                        }
                        ];
                    for(i=0;i<books.length;i++){
                        if(books[i].id == id){
                            abook = books[i];  
                        }
                    }
                     return abook;
      },
        getBoookList:function(){
            var indexList = [
                        {   id:"1",
                            bookUrl:"../images/img1.jpg",
                            bookName:"西方哲学史",
                            bookInfor:"关于哲学"
                        }
                        ];
    
                         return indexList;
                    }


    })