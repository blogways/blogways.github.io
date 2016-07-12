---
layout: post
category: WordPress
title: linux下源码安装wordpress全过程
tags: ['WordPress']
author: 王栋
# image: /images/xxx.jpg
email: wangdong3@asiainfo.com
description: linux主机源码安装wordpress的全过程
---

## 搭建lamp环境
### 一 准备安装包
#### 库文件：
1. libxml2-2.6.30.tar.gz
2. libmcrypt-2.5.8.tar.gz
3. zlib-1.2.3.tar.gz  
4. libpng-1.2.31.tar.gz
5. jpegsrc.v6b.tar.gz
6. freetype-2.3.5.tar.gz  
7. autoconf-2.61.tar.gz  
8. gd-2.0.35.tar.gz  
9. apr-1.4.6.tar.gz
10. apr-util-1.5.1.tar.gz

#### 主要文件:
1. httpd-2.2.9.tar.gz
2. mysql-5.1.59.tar.gz  
3. php-5.2.6.tar.gz
4. phpMyAdmin-3.0.0

#### 将安装包都上传到/usr/local/src目录
### 二 安装apache前期准备（库文件安装）
#### 1. 解包
##### 编写一个shell脚本tar.sh进行解包。
```
#!/bin/sh
cd /usr/local/src
ls *.tar.gz > ls.list      
for TAR in ’cat ls.list‘
do
tar -zxvf $TAR
done
```
##### 执行脚本tar.sh进行解包
#### 2. 按顺序安装
##### 【安装libxml2】
```  
cd libxml2-2.6.30  
./configure --prefix=/usr/local/libxml2/  
make   
make install  
```
##### 【安装libmcrypt】
```
cd libmcrypt-2.5.8  
./configure --enable-ltdl-install  
make  
make install  
```
##### 【安装zlib】
```
cd zlib-1.2.3  
./configure  
make  
make install
```
##### 【安装libpng】
```
cd libpng-1.2.31  
./configure --prefix=/usr/local/libpng/  
make  
make install  
```
##### 【安装jpegsrc.v6b】
```
mkdir /usr/local/jpeg6  
mkdir /usr/local/jpeg6/bin  
mkdir /usr/local/jpeg6/lib  
mkdir /usr/local/jpeg6/include  
mkdir -p /usr/local/jpeg6/man/man1  
cd jpeg-6b  
./configure --prefix=/usr/local/jpeg6/ --enable-shared --enable-static  
make  
make install  
```
##### 【安装freetype】
```
cd freetype-2.3.5  
./configure --prefix=/usr/local/freetype/  
make  
make install  
```
##### 【安装autoconf】
```
cd autoconf-2.61  
./configure  
make  
make install
```
##### 【安装gd】  
```
cd gd-2.0.35  
./configure --prefix=/usr/local/gd2/ --with-jpeg=/usr/local/jpeg6/ --with-freetype=/usr/local/freetype/  
make  
make install  
```
##### 【安装apr】
```
./configure
make
make install
```
##### 【安装apr-util】
```
./configure  --with-apr=/usr/local/apr/
make
make install
```
### 三 安装apache
#### apache安装与配置
##### 【安装apache】
```
cd httpd-2.2.9  
./configure --prefix=/usr/local/apache2/ --sysconfdir=/etc/httpd/ --with-included-apr --disable-userdir --enable-so --enable-deflate=shared --enable-expires=shared --enable-rewrite=shared --enable-static-support  
make  
make install  
```
###### 启动apache
```
/usr/local/apache2/bin/apachectl start  
```
###### 修改配置文件  
```
vi /etc/httpd/httpd.conf
#查找ServerName,将注释去掉  
ServerName 'www.example.com:80'
```
###### 将apache添加到系统服务中
```
cp /usr/local/apache2/bin/apachectl /etc/init.d/httpd  
vi /etc/rc.d/init.d/httpd  
#在#!/bin/sh后添加下面两行(包含"#")  
# chkconfig:2345 85 15
# description:Apache
#添加执行权限  
chmod 755 /etc/init.d/httpd  
#添加到系统服务中  
chkconfig --add httpd  
```
###### 开启apache  
```
service httpd start
```  
### 四 安装mysql
#### mysql安装与配置
##### 【安装mysql】
```
groupadd mysql  
useradd -g mysql mysql  
cd mysql-5.1.59  
./configure --prefix=/usr/local/mysql/ --with-extra-charsets=all  
make  
make install
```
```  
cp support-files/my-medium.cnf /etc/my.cnf  
/usr/local/mysql/bin/mysql_install_db --user=mysql  
chown -R root /usr/local/mysql  
chown -R mysql /usr/local/mysql/var  
chgrp -R mysql /usr/local/mysql  
/usr/local/mysql/bin/mysqld_safe  --user=mysql &  
cp /lamp/src/mysql-5.1.59/support-files/mysql.server /etc/rc.d/init.d/mysqld  
chown root.root /etc/rc.d/init.d/mysqld  
chmod 755 /etc/rc.d/init.d/mysqld  
chkconfig --add mysqld  
chkconfig --list mysqld  
chkconfig --levels 245 mysqld off  
```
###### 配置mysql  
```
cd /usr/local/mysql  
bin/mysqladmin version //简单的测试  
bin/mysqladmin Variables //查看所有mysql参数  
bin/mysql -uroot //没有密码可以直接登录本机服务器  
DELETE FROM mysql.user WHERE Host='localhost' AND User='';  
FLUSH PRIVILEGES;  
#设置root密码为123456  
SET PASSWORD FOR 'root'@'localhost' = PASSWORD('123456');  
#配置可远程连接mysql  
use mysql  
SELECT user,password,host FROM user;  
DELETE FROM user WHERE host='localhsot.localdomain'  
DELETE FROM user WHERE host='10.20.16.79';  
UPDATE user SET host='%' WHERE user='root';  
```
###### 重启mysql  
```
service mysqld restart
```  
### 五 安装php
#### php安装与配置
##### 【安装php】
```
cd php-5.2.6  
./configure --prefix=/usr/local/php/ --with-config-file-path=/usr/local/php/etc/ --with-apxs2=/usr/local/apache2/bin/apxs --with-mysql=/usr/local/mysql/ --with-libxml-dir=/usr/local/libxml2/ --with-jpeg-dir=/usr/local/jpeg6/ --with-freetype-dir=/usr/local/freetype/ --with-gd=/usr/local/gd2/ --with-mcrypt=/usr/local/libmcrypt/ --with-mysqli=/usr/local/mysql/bin/mysql_config --enable-soap --enable-mbstring=all --enable-sockets  
make  
make install
```
###### 创建配置文件
```
# cp php.ini-dist /usr/local/php/etc/php.ini
```
###### 使用vi编辑apache配置文件
```
# vi /etc/httpd/httpd.conf
```
添加这一条代码
```
Addtype application/x-httpd-php .php .phtml
```
###### 重启Apache
```
# /usr/local/apache2/bin/apachectl restart
```
##### 【apache配置】
######建立工作目录
```
mkdir -p /var/www/html  
```
###### 修改httpd.conf
```
vi /etc/httpd/httpd.conf  
#功能: 设置工作目录  
#说明: 搜索DocumentRoot, 修改为  
DocumentRoot "/var/www/html"  
#功能: 设置目录选项
搜索<Directory "/usr/local/apache2//htdocs">, 修改为  
<Directory "/var/www/html">  
#功能: 设置默认文档  
搜索<IfModule dir_module>, 修改为  
DirectoryIndex index.html index.php
#功能: 增加php类型  
搜索 AddType application/x-gzip .gz .tgz在后面添加  
AddType application/x-httpd-php .html .php  
功能: 不允许访问目录  
说明: 搜索Options Indexes FollowSymLinks项并注释  
#Options Indexes FollowSymLinks   
#注意: 修改配置文件后, 重启apache才能生效  
```
###### 重启apache
```
service httpd restart
```
##### 【添加PDO_MYSQL扩展】
```
cd /lamp/src/php-5.2.6/ext/pdo_mysql  
/usr/local/php/bin/phpize  
./configure --with-php-config=/usr/local/php/bin/php-config --with-pdo-mysql=/usr/local/mysql  
make  
make install  
```
###### 执行完make install后会生成
```
#Installing shared extensions: /usr/local/php/lib/php/extensions/no-debug-non-zts-20060613/  
```
###### 修改php.ini
```
vi /usr/local/php/etc/php.ini  
#查找extension_dir,修改为
extension_dir = "/usr/local/php/lib/php/extensions/no-debug-non-zts-20060613/"  
#添加pdo_mysql
extension = pdo_mysql.so  
```
######重启apache
```
service httpd restart
```
### 六 安装phpmyadmin
#### phpmyadmin安装与配置
##### 【安装phpmyadmin】
###### 拷贝目录到指定位置并改名为phpmyadmin
```
#cp -a  phpMyAdmin-3.0.0-rc1-all-languages /var/www/html/phpmyadmin
#cd /var/www/html/phpmyadmin/
#cp config.sample.inc.php config.inc.php
```
##### 配置phpMyAdmin
```
#vi /var/www/html/phpmyadmin/config.inc.php
```
将auth_type 改为http
```
$cfg['Servers'][$i]['auth_type'] = 'http';
```

##### 测试
###### 编写info.php文件，查看php配置详细
```
 vi /var/www/html/info.php
```
```
<?php
phpinfo();
?>
```
##### 通过浏览器访问http://10.20.16.79/info.php，获得php的详细配置信息

## 安装wordpress
1. 将解压后的wordpress移动到/var/www/html目录下
2. 在浏览器中访问 http://localhost/wordpress/wp-admin/install.php，会访问失败，问题解决方法是修改wp-config.php配置信息，提供数据库的名(wordpress)，用户名(root)，密码()。然后刷新浏览器就能成功访问
3. 根据提示注册账号，登录即可进入

## 安装过程参考网址
1. [http://www.cnblogs.com/BTMaster/p/3551073.html](http://www.cnblogs.com/BTMaster/p/3551073.html)
2. [http://www.cnblogs.com/mchina/archive/2012/11/28/2778779.html](http://www.cnblogs.com/mchina/archive/2012/11/28/2778779.html)
