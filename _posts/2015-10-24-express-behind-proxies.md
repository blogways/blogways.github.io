---
layout: post
category: nodejs express        
title: 为express设置代理
tags: ['express behind proxies']
author: 付奎
email: fukui@asiainfo.com  
description: 为 Express 设置代理  
---


原文：<http://expressjs.com/en/guide/behind-proxies.html>  

  
当在代理服务器之后运行 `Express` 时，请将应用变量 `trust proxy` 设置（使用 `app.set()`）为下述序列中的一项。
>如果没有设置应用变量 `trust proxy`，应用将不会运行，除非 `trust proxy` 设置正确，否则应用会误将代理服务器的 `IP` 地址注册为客户端 `IP` 地址.  
 
## 1、Boolean  
如果为 `true`，客户端 `IP` 地址为 `X-Forwarded-*` 头最左边的项。  
如果为 `false`, 应用直接面向互联网，客户端 `IP` 地址从 `req.connection.remoteAddress` 得来，这是默认的设置。

## 2、IP 地址  
IP 地址、子网或 `IP` 地址数组和可信的子网。下面是预配置的子网列表。  
> * loopback - 127.0.0.1/8, ::1/128
> * linklocal - 169.254.0.0/16, fe80::/10
> * uniquelocal - 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, fc00::/7

使用如下方式设置 `IP` 地址： 
 
	app.set('trust proxy', 'loopback') // 指定唯一子网
	app.set('trust proxy', 'loopback, 123.123.123.123') // 指定子网和 IP 地址
	app.set('trust proxy', 'loopback, linklocal, uniquelocal') // 指定多个子网
	app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']) // 使用数组指定多个子网
当指定地址时，`IP` 地址或子网从地址确定过程中被除去，离应用服务器最近的非受信 `IP` 地址被当作客户端 `IP` 地址。  
  
## 3、Number
将代理服务器前第 n 跳当作客户端。  

## 4、Function
定制实现，只有在您知道自己在干什么时才能这样做。  

	app.set('trust proxy', function (ip) {
	  if (ip === '127.0.0.1' || ip === '123.123.123.123') return true; // 受信的 IP 地址
	  else return false;
	})
以上就是 `trust proxy` 设置项  

设置 `trust proxy` 为非假值会带来两个重要变化：  
>* 反向代理可能设置 `X-Forwarded-Proto` 来告诉应用使用 `https` 或简单的 `http` 协议。请参考 `req.protocol`。  
>* 无论是 `HTTP`、`HTTPS` 或者是无效的名称，都可以通过反向代理来设置 `X-Forwarded-For` 通知应用程序。这个值是通过 `req.protocol` 来反应的。
>* `req.ip` 和 `req.ips` 的值将会由 `X-Forwarded-For` 中列出的 IP 地址构成。  


`trust proxy` 设置由 `proxy-addr` 软件包实现，请参考其文档了解更多信息。