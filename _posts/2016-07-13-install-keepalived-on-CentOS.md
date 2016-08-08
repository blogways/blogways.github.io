---
layout: post
category: keepalived
title: CentOS下安装keepalived
tags: ['keepalived', '部署', 'CentOS']
author: 徐万年
email: xuwn@asiainfo.com
#image:
description: 学习keepalived在CentOS平台安装及配置，所有软件包都是基于源代码安装，未使用yum。
---

### 一、keepalived概述
>keepalived是一个类似于layer3, 4 & 7交换机制的软件，也就是我们平时说的第3层、第4层和第7层交换。

>Keepalived的作用是检测服务器的状态，如果有一台web服务器死机，或工作出现故障，Keepalived将检测到，并将有故障的服务器从系统中剔除，当服务器工作正常后Keepalived自动将服务器加入到服务器群中，这些工作全部自动完成，不需要人工干涉，需要人工做的只是修复故障的服务器。

>Layer3,4&7工作在IP/TCP协议栈的IP层，TCP层，及应用层,原理分别如下：
>Layer3：Keepalived使用Layer3的方式工作式时，Keepalived会定期向服务器群中的服务器发送一个ICMP的数据包（既我们平时用的Ping程序）,如果发现某台服务的IP地址没有激活，Keepalived便报告这台服务器失效，并将它从服务器群中剔除，这种情况的典型例子是某台服务器被非法关机。Layer3的方式是以服务器的IP地址是否有效作为服务器工作正常与否的标准。
	
>Layer4:如果您理解了Layer3的方式，Layer4就容易了。Layer4主要以TCP端口的状态来决定服务器工作正常与否。如web server的服务端口一般是80，如果Keepalived检测到80端口没有启动，则Keepalived将把这台服务器从服务器群中剔除。

>Layer7：Layer7就是工作在具体的应用层了，比Layer3,Layer4要复杂一点，在网络上占用的带宽也要大一些。Keepalived将根据用户的设定检查服务器程序的运行是否正常，如果与用户的设定不相符，则Keepalived将把服务器从服务器群中剔除。

>主要用作RealServer的健康状态检查以及LoadBalance主机和BackUP主机之间failover的实现。

注：摘自百度全科

### 二、keepalived在CentOS安装步骤
> **注：以上安装请以root用户操作，当然您也可以使用有root权限的其它用户操作**

1、安装gcc（g++)
	安装步骤：略；
	
2、安装openssl
	
	2.1、下载源码：https://www.openssl.org/source/openssl-1.0.1t.tar.gz
	2.2、静态库编译：./configure --prefix=/usr/local/ssl --openssldir=/usr/local/ssl、make、make install
	2.3、动态库编译：./configure shared --prefix=/usr/local/ssl --openssldir=/usr/local/ssl、make、make install
	
	注意：一定要编译2次哦，否则keepalived无法找到动态库文件。
	2.4、配置环境变量：LD_LIBRARY_PATH=/usr/local/lib64/，【可以ll查看：/usr/local/lib64目录的内容】
	2.5、配置系统环境变量：.bash_profile，export LD_LIBRARY_PATH
	
	注意：别忘了让系统环境变更生效（. .bash_profile)

3、安装pcre 【Perl Compatible Regular Expressions】


	3.1、下载pcre，地址：http://sourceforge.net/projects/pcre/files/
	3.2、常规安装，步骤：./configure、make、make install
	3.3、配置环境变量：PCRE_HOME、LD_LIBRARY_PATH、export PCRE_HOME LD_LIBRARY_HOME
	3.4、. .bash_profile使环境变量生效
	
4、安装keepalived

	4.1、下载keeepalived，下载地址：
	4.2、安装步骤：./configure --prefix=/usr/local/keepalived & make & make instal
	4.3、keepalived常规配置
		4.3.1、cp /usr/local/keepalived/sbin/keepalived /usr/sbin/
		4.3.2、cp /usr/local/keepalived/etc/sysconfig/keepalived /etc/sysconfig/
		4.3.3、cp /usr/local/keepalived/etc/rc.d/init.d/keepalived /etc/init.d/
		4.3.4、chkconfig --add keepalived
		4.3.5、chkconfig keepalived on
		4.3.6、mkdir /etc/keepalived
		4.3.7、ln -s /usr/local/sbin/keepalived /usr/sbin/
		4.3.8、cp /usr/local/keepalived/etc/keepalived/keepalived.conf /etc/keepalived/keepalived.conf
	4.4、keepalived配置文件配置
		修改keepalived配置文件：/etc/keepalived/keepalived.conf，如下：
	
		global_defs {
		    notification_email {
		        xuwn@asiainfo.com
		    }
			    notification_email_from xuwn@asiainfo.com
			    smtp_server 127.0.0.1
			    smtp_connect_timeout 30
			    router_id lnmp_node1
			}
			vrrp_instance lnmp {
			    state MASTER
			    interface eth0
			    virtual_router_id 100
			    priority 170
			    advert_int 5
			    track_interface {
			        eth0
		    }
		    authentication {
		        auth_type PASS
		        auth_pass 123456
		    }
		    virtual_ipaddress {
		        192.168.10.2
		    }
		}

5、keepalived系统日志配置

	5.1、修改文件：/etc/sysconfig/keepalived，把KEEPALIVED_OPTIONS="-D" 修改为KEEPALIVED_OPTIONS="-D -d -S 0"
	5.2、修改文件：/etc/rsyslog.conf 在最后添加：
		# keepalived -S 0 
		local0.* /var/log/keepalived.log
	5.3、重新启动操作系统日志：/etc/init.d/rsyslog restart
	
6、keepalived启停方法和查看日志

	6.1、/etc/init.d/keepalived start
	6.2、/etc/init.d/keepalived stop
	6.3、/etc/init.d/keepalived restart
	
	6.4、tailf /var/log/keepalived.log
	
7、关闭CentOS系统防火墙
	
	7.1、service iptables   stop  #停止
	7.2、chkconfig iptables off   #禁用
	
	
8、nginx安装及配置
	
	8.1、安装步骤：略；
> **注意编译命令应为如下：./configure --prefix=/usr/local/nginx --without-http_gzip_module**
	
	8.2、配置
		server {
			listen       80;
			server_name  localhost:8080;

			location / {
		        proxy_pass http://localhost:8080 ;
			}
		}

> **注：以上配置为将对浏览器中：localhost的访问映射为：http://localhost:8080，即tomcat的web服务**

