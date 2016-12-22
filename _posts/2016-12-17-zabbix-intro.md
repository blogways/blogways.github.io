---
layout: post
title: zabbix安装部署
category: ['杂记']
tags: ['zabbix', '系统监控']
author: 汪 回
email: wanghui6@asiainfo.com
description: zabbix安装部署及踩过的坑.
---

|  |  *目 录* |
| --- | --- |
| 1 | [zabbix简介](#part1) |
| 2 | [搭建依赖环境](#part2) |
| 3 | [zabbix安装配置](#part3) |
| 4 | [问题汇总](#part4)|

<a id="part1"></a>

## 1. zabbix简介

### 1.1 zabbix自述

Zabbix是一个企业级的、开源的、分布式的监控套件；

Zabbix 可以监控网络和服务的运行状况。 Zabbix 利用灵活的告警机制，允许用户对事件发送基于 Email 的告警。

Zabbix利用存储数据提供杰出的报告及图表，这一特性将帮助用户完成配置规划；

Zabbix支持polling和trapping两种方式. 所有的Zabbix报告都可以通过配置参数在WEB前端进行访问。Web 前端将帮助你在任何区域都能够迅速获得你的网络及服务状况。

### 1.2 功能特点

* 分布式监控，天生具有的功能，适合于构建分布式监控系统，具有node，proxy2种分布式模式;
* 自动化功能，自动发现，自动注册主机，自动添加模板，自动添加分组，是适应于自动化运维利器的首选;
* 自定义监控比较方便，自定义监控项非常简单，支持变量;
* 支持多种监控方式，agentd，snmp，ipmi，jmx;
* 提供api功能，二次开发方便，可以进行二次深度开发。

### 1.3 进程构成

* zabbix_server：
zabbix 服务端守护进程，获取的主机数据最终都是提交到 server（server可主动访问agentd获取数据，也可配置agentd主动推送数据至server）。

* zabbix_agentd：
客户端守护进程，此进程收集客户端数据，例如 cpu 负载、内存、硬盘使用情况等。

* zabbix_get：
zabbix 工具，单独使用的命令，通常在 server 或者 proxy 端执行获取远程客户端信息的命令，排查客户端与服务端是否连接故障。

* zabbix_sender：
zabbix 工具，用于发送数据给 server 或者 proxy，通常用于耗时比较长的检查。很多检查非常耗时间，导致zabbix 超时。可在脚本执行完毕之后，使用 sender 主动提交数据。

* zabbix_proxy：
zabbix 代理守护进程。功能类似 server，唯一不同的是它只是一个中转站，它需要把收集到的数据提交（或被提交)到 server 里。

* zabbix_java_gateway：
Java 网关，类似 agentd，但是只用于 Java 方面。它只能主动去获取数据，而不能被动获取数据。它的数据最终会给到 server 或者 proxy。

### 1.4 操作系统支持

以下操作系统支持所有进程：

* Linux
* IBM AIX
* FreeBSD
* NetBSD
* OpenBSD
* HP-UX
* Mac OSX
* Solaris

以下操作系统仅支持客户端agentd：

* Windows 2000
* Windows Server 2003
* Windows Server 2008
* Windows Server 2012
* Windows XP
* Windows Vista
* Windows 7
* Windows 8


### 1.5 磁盘占用量计算

zabbix的数据有以下几种数据构成：

* 配置数据：zabbix的配置文件等，一般固定大小在10MB以下；
* 历史数据：zabbix会保存一定时间内监控数据，记录时间段内的主机运行情况；
* 趋势数据：即监控指标的最大值、最小值、平均值、计数等此类数据；
* 时间记录：当监控项指标超过某阀值时zabbix会产生事件提示运维人员，zabbix会保存此事件的数据直至被删除。

####场景：

假设要监控100台服务器，每台30个监控项，每个监控项60秒刷新一次，即每秒会有50(30*100/60)条数据入库。

#### 配置数据大小：

    zabbix配置数据:	固定大小，一般<10MB。

#### 历史数据大小：

    历史数据（保留30天，一条历史数据约50字节）：
	    30天*24小时*3600秒*50条数据*50字节 ≈ 6.5G 

#### 趋势数据大小：
    趋势数据（保留5年，当查看一周或一个月的图表，其中的MAX/MIN/AVG/COUNT取自趋势数据，一条趋势数据约128字节）：
	    5年*365天*24小时*3000个监控项*128字节 ≈ 16.8G

#### 事件数据大小：

    事件记录（一个事件约占130个字节，每秒产生一个事件，保留1年）：
	    1年*365天*24小时*3600秒*130字节 ≈ 4.1G

#### 结论：

    此场景下需要的数据库硬盘容量 ≈ 27.41G 。

<a id="part2"></a>

## 2. 搭建依赖环境

### 2.1 zabbix依赖环境

zabbix后端程序是用c语言写的，前台web页面是用php语言写的，需要数据库的支持。

操作系统前面已介绍，此处不再赘述。

zabbix可使用以下数据库：

* MySQL  5.0.3  及以上，推荐使用InnoDB引擎
* Oracle  10g  及以上
* PostgreSQL  8.1  及以上 
* SQLite  3.3.5  及以上
* IBM DB2  9.7  及以上

web环境依赖如下:

* Apache HTTP Server 1.3.12  及以上
* PHP  5.3.0  及以上

本例操作系统为Mac OS 10.12.1，数据库采用MySQL 5.7.16，此处主要介绍Apache HTTP Server 和 PHP 的安装。

### 2.2 安装 Apache HTTP Server

* 下载源码包`httpd-2.4.23.tar.gz`至`/usr/local/src`目录并解压，的到`/usr/local/src/httpd-2.4.23`目录
* `cd httpd-2.4.23`，执行命令`./configure --prefix=/usr/local/httpd`，配置完毕后执行`make && make install`，无报错即安装成功。
* `cp /usr/local/httpd/bin/apachectl  /usr/sbin`，之后可通过命令：

```
		    sudo apachectl start -- 启动服务
		    
		    sudo apachectl stop -- 停止服务
		    
		    sudo apachectl status -- 查看状态
		    
		    sudo apachectl restart -- 重启服务
```

来管理服务的启停。

* 编辑 `/usr/local/httpd/conf/httpd.conf` 修改配置项：

```
1.去掉
	#LoadModule php5_module        modules/libphp5.so 
 此行的注释
 
2.<Directory />标签内部内容做如下修改：
	<Directory />
	    Options Includes ExecCGI FollowSymLinks
	    AllowOverride All
	    Order deny,allow
	    Deny from all
	</Directory>

3.修改DocumentRoot内容为：
	DocumentRoot "/usr/local/httpd/htdocs"

4.将<Directory "/usr/local/httpd/htdocs">标签内容修改为：
	<Directory "/usr/local/httpd/htdocs">
	    Options FollowSymLinks
	    AllowOverride None
	    Order allow,deny
	    Allow from all
	    Require all granted
	</Directory>

5. 将<IfModule dir_module>标签内容修改为：
	<IfModule dir_module>
    	DirectoryIndex index.html index.php
	</IfModule>
```

以上修改主要是添加对php的支持，至此Apache HTTP Server安装完毕。

### 2.3 安装PHP

php的安装会比较麻烦，因为php有很多扩展需要额外配置安装，zabbix所需要的php扩展支持如下：

* bcmath
* socket
* mbstring
* gettext
* snmp
* libxml
* gd（gd扩展最为麻烦，除gd本身以外，还需要向gd添加png、jpeg、freetype三种支持）

其中，`bcmath`、`socket`、`mbstring`只需要在configure的时候加上`--enable-xxx`的参数就能在编译安装的同时添加。

而`gettext`、`snmp `、`libxml`、`gd`则需要在configure时指定这些扩展的目录路径，也就是说在本机要先安装这些扩展，配置php时指定路径才能给php添加上所需扩展。

所以此时先不急着安装php，而应先安装php扩展的依赖扩展。

`snmp `、`gettext`和`libxml`的安装比较简单，下载源码包编译安装即可，这里简单介绍相对比较麻烦的`gd`扩展的安装。

libgd是一个开源的图像处理的库程序，全称是GD Graphics Library，php开发中对于图像的处理会使用到。libgd可在官网下载源码安装，但是各种图片类型的支持需要额外添加，zabbix必须的图片支持有`libjpeg`、`libpng`、`freetype`三种。

所以整个php的安装顺序应是：

1、安装`libjpeg`、`libpng`、`freetype`三种gd库需要的支持；
2、安装`gd`、`gettext`、`snmp `、`libxml`四个php需要指定路径的扩展；
3、安装`php`，在配置阶段把所需扩展添加上。

以上扩展的安装此处不赘述，可自行查阅其他资料进行安装，本文只介绍php的安装。

最终，php的configure命令应是：

```
./configure \
--prefix=/usr/local/php \
--with-apxs2=/usr/local/httpd/bin/apxs \
--enable-bcmath \
--enable-socket \ 
--with-mysql=/Users/mysql/mysql \
--with-mysqli=/Users/mysql/mysql/bin/mysql_config \
--with-mysql-sock=/tmp/mysql.sock \
--with-libxml-dir=libxml安装目录 \
--with-snmp=libsnmp安装目录 \
--with-gettext=libgettext安装目录 \
--with-gd=libgd安装目录;

make && make test;
make install;
```

php安装完毕后，拷贝源码包内的`php.ini-production`至安装目录的`lib`目录下：

```
cp /usr/local/src/php-5.6.28/php.ini-production  /usr/local/php/lib/php.ini
```

并根据zabbix的需要编辑修改：

```
max_execution_time = 300
max_input_time = 300
memory_limit = 128M
post_max_size = 32M
date.timezone = Asia/Shanghai
mbstring.func_overload=2
```

至此，php安装完毕。

<a id="part3"></a>

## 3. 安装zabbix

下载源码包`zabbix-3.2.1.tar.gz`至`/Users/zabbix/src`并解压。

### 3.1 数据库初始化

连接mysql并创建名为zabbix的database。

`cd /Users/zabbix/src/zabbix-3.2.1/database/mysql`

在此目录下有三个sql脚本文件`schema.sql、images.sql、data.sql`，将这三个文件导入zabbix database即完成了初始化：

```
mysql -uzabbix -p123456 -hlocalhost zabbix < /usr/local/src/zabbix-3.2.0/database/mysql/schema.sql

mysql -uzabbix -p123456 -hlocalhost zabbix < /usr/local/src/zabbix-3.2.0/database/mysql/images.sql

mysql -uzabbix -p123456 -hlocalhost zabbix < /usr/local/src/zabbix-3.2.0/database/mysql/data.sql
```

注意导入顺序，需要按照此顺序导入，否则失败。

### 3.2 安装zabbix

```
#配置
./configure \ 
--prefix=/Users/zabbix/zabbix \
--enable-server \ # 安装server进程服务
--enable-agent \  # 安装agentd进程服务
--with-net-snmp \  # 安装net-snmp监控接口
--with-libcurl \		
--with-mysql=/usr/bin/mysql_config  # mysql数据库配置

#编译
make 

#安装
make install 

#添加系统软连接
ln -s /Users/zabbix/zabbix/sbin/* /usr/local/sbin/ 

#添加系统软连接
ln -s /Users/zabbix/zabbix/bin/* /usr/local/bin/ 
```

在配置时候不需要的组件可以不进行配置，如只想在主机上安装agentd进程，只需要`./configure --enable-agent`即可。

### 3.3 修改配置

编辑 `/etc/services` 在最后一行添加：

```
zabbix-agent 10050/tcp # Zabbix Agent
zabbix-agent 10050/udp # Zabbix Agent
zabbix-trapper 10051/tcp # Zabbix Trapper
zabbix-trapper 10051/udp # Zabbix Trapper
```

由于安装了server和agentd两个进程，所以在`/Users/zabbix/zabbix/etc`目录下有`zabbix_server.conf、zabbix_agentd.conf`对应两个进程的配置文件，下面就要修改这两个文件。

```
vi zabbix_server.conf

DBName=zabbix #数据库名称

DBUser=zabbix #数据库用户名

DBPassword=123456 #数据库密码

ListenIP=127.0.0.1 #数据库ip地址

AlertScriptsPath=/Users/zabbix/zabbix/share/zabbix/alertscripts #zabbix运行脚本存放目录
```

```
vi zabbix_agentd.conf

Server=127.0.0.1  #服务端Server的IP，配置此项agentd会被动等待服务端拉去监控数据

ListenIP=127.0.0.1 #客户端agentd的IP

ServerActive=127.0.0.1	#服务端Server的IP，配置此项agentd会主动向服务端推送监控数据

```

添加系统软连接

```
ln -s /Users/zabbix/zabbix/sbin/* /usr/sbin/
```

### 3.4 配置Web

在zabbix源码包的`frontends`目录下存放zabbix的前端php文件，此时需将这些文件复制到Apache HTTP Server服务维护的目录。

```
cp -r /User/zabbix/src/	zabbix-3.2.1/frontends/php /usr/local/httpd/htdocs/zabbix
```

然后启动服务：

```
sudo apachectl start;	# 启动Apache HTTP Server服务
sudo zabbix_server;		# 启动zabbix server服务
sudo zabbix_agentd;		# 启动zabbix agentd服务
```

此时，可在浏览器访问`localhost/zabbix`进行Web配置。

![img1](/images/wanghui/zabbix/img1.png)

访问可看到上面的欢迎页面，点击下一步。

![img2](/images/wanghui/zabbix/img2.png)

从欢迎页面来的上面的页面，此页面展示zabbix检测必要配置的结果，主要检测PHP对于zabbix的各项支持，当所有必要项都检测通过(即最后字段显示OK)，方可进行下一步，否则需要重新配置。

![img3](/images/wanghui/zabbix/img3.png)

配置检查通过点击下一步来到第三个页面，此处主要是配置数据库连接，填写上mysql数据库的信息后点击下一步。

![img4](/images/wanghui/zabbix/img4.png)

此处主要填写server的IP、端口和名称。

![img5](/images/wanghui/zabbix/img5.png)

来到最后一个配置页面，这里是zabbix自动生成的php页面配置文件，下载此文件放置在zabbix页面目录下的conf目录下。

![img6](/images/wanghui/zabbix/img6.png)

点击finish后，跳转至登录页面，默认账号/密码是`admin/zabbix`，至此，zabbix安装完毕。

<a id="part4"></a>

## 4. 问题汇总

在这里列举了几个安装过程中遇到的问题和解决办法，以便以后查阅。

### 4.1 mysql lib 缺失

```
error while loading shared libraries: libmysql.so.20: cannot open shared object file: No such file or directory
```

在mac os中，mysql的安装目录中的lib目录下有`libmysqlclient.20.dylib`，可将此文件复制到`/usr/sbin`中，创建软链接解决。

### 4.2 libjpeg相关问题

#### 4.2.1 configure时报错

```
-bash: ./configure: /bin/sh^M:
```

此问题是系统编码不同而引起的，libjpeg貌似是在windows系统下开发的，configure文件的系统编码是dos，此时在mac下执行需要改为unix。

```
vi configure 			# vi 编辑configure文件

:set ff=unix			# 修改系统编码

:wq						# 保存退出
```

#### 4.2.2 目录不存在
 
```
-c -m 644 ./cjpeg.1 　/usr/local/man/man1/cjpeg.1　　/usr/bin/install: cannot create regular file 　　`/usr/local/man/man1/cjpeg.1': No such file or directory
```

此问题是安装目录未创建导致，与大多数库不同，libjpeg不会自动创建安装目录，需要自己手动创建。

#### 4.2.3 libtool库缺失

```
./libtool --mode=compile mipsel-linux-gcc -O2  -I. -c ./jcapimin.c  \ make: ./libtool: Command not found \make: *** [jcapimin.lo] Error 127
```

缺少`libtool`库，需要自行安装。

安装`libtool`后，需要复制`libtool`的配置文件覆盖到`libjpeg`目录下的，即：

```
cp /usr/local/share/libtool/config.sub /usr/local/src/jpeg-6b/
cp /usr/local/share/libtool/config.guess /usr/local/src/jpeg-6b/
```

之后才可安装`libjpeg`。

### 4.3 动态安装php扩展

有时安装了php后，发现忘记安装某项扩展，此时可使用`phpize`命令进行动态安装，避免重新整体安装php。

在php的源码包的`ext`目录下存放着大部分扩展的源文件，本机是在`/usr/local/src/php-5.6.28/ext`目录中，例如此时要动态安装`gd`库。

```
cd /usr/local/src/php-5.6.28/ext/gd;		# 进入gd扩展源码目录

/usr/local/php/bin/phpize;					# 使用phpize命令建立外挂模块

# 配置
./configure \
--with-php-config=/usr/local/php/bin/php-config \ # 指定php-config目录
--with-jpeg-dir=/usr/local/jpeg/ \	# 添加jpeg支持
--with-freetype-dir=/usr/local/freetype/ \    # 添加freetype支持
--with-png-dir=/usr/local/png/；    # 添加png支持

make && make install
```

安装完毕后要在`php.ini`配置文件中加入扩展模块的信息：`extension = “memcache.so”`

