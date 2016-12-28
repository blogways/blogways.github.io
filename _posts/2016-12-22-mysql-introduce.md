---
layout: post
title: mysql入门及在nodejs下的简单应用
category: ['杂记']
tags: ['MySql','Nodejs']
author: 胡青海
email: huqh@asiainfo.com
description: MySQL是一个关系型数据库管理系统，由瑞典MySQL AB 公司开发，目前属于Oracle旗下公司。MySQL 最流行的关系型数据库管理系统，在WEB应用方面MySQL是最好的 RDBMS(Relational Database Management System，关系数据库管理系统) 应用软件之一。体积小、速度快、成本低、开放源代码等特点。
---

|  |  *目 录* |
| --- | --- |
| 1 | [mysql安装](#p1) |
| 2 | [mysql基本命令](#p2) |
| 3 | [mysql在nodejs中的简单应用](#p3) |


<a id="p1"></a>



## mysql安装
  1. MySQL安装文件有两种，一种是msi格式的，一种是zip格式的，这就决定了mysql的安装有两种。
 2. 如果你下载的文件是msi格式的，可以直接点击安装，按照它给出的安装提示进行安装（相信大家的英文可以看懂英文提示），该步骤较为复杂，
我之前用过这种安装方法，大概有好几十步。该安装方法没什么好说的，一路next基本上没什么问题了。
 3. zip格式解压后进行配置可以使用了，该方法较为简便，值得推荐。
   解压后把文件放在一个合适的位置，最好重命名为Mysql_server+版本号，可以放在任意目录下。


    然后配置环境变量，右击我的电脑->属性->高级->环境变量，选择PATH,在其后面添加:你的mysql bin文件夹的路径(如D:\software\mysql-5.7\bin),
PATH=.......;D:\software\mysql-5.7\bin;(注意是追加,不是覆盖)。


    接着修改mysql的配置文件my.ini,该文件在mysql_server目录下。用文本编辑器打开，修改或添加配置，

    [mysqld] 

    basedir=D:\software\mysql-5.7（mysql所在目录） 

    datadir=D:\software\mysql-5.7data（mysql所在目录\data）



    以管理员身份运行cmd（必须要用管理员身份运行，不然权限不够），键入 cd D:\software\mysql-5.7\bin,回车。再键入mysqld -install，若前面操作正确系统会提示安装成功。


    安装成功后就要启动服务了，继续在cmd中输入:net start mysql。


    然后登录：

    输入mysql -u root -p（第一次登录没有密码，直接按回车过）,登录成功！


    登录之后建议立即设置密码，输入一下命令：mysqladmin -u root -p[oldpass] password newpass 


    注意oldpass(老密码)可选，如果root默认密码为空，则不需要输入，如果需要更改老密码，请注意老密码与-p之间不要有空格，否则会报错，另外password和newpass(新密码)之间以空格分隔。 

<a id="p2"></a>	
	
## mysql基本命令
1. 创建数据库 create database dbname;
2. 删除数据库 drop database dbname;
3. 进入数据库 use dbname;
4. 创建表 CREATE TABLE table_name (column_name column_type);
5. 修改表名 alter table table_name rename table_new_name;
6. 修改字段名 alter table table_name change old_column_name new_column_name column_type 
7. 修改字段类型 alter table table_name modify column table_name column_type;
8. 增加字段 alter table table_name add COLUMN new_column_name column_type;
9. 删除字段 alter table table_name DROP COLUMN column_name; 
10. 删除主键 alter table table_name drop primary key;
11. 把某字段设为主键 alter table table_name add primary key(column_name);
12. 删除表 drop table table_name;
13. 增加记录 insert into table values(record);
14. 删除记录 delete from table (不加where则删除全部记录）;
15. 修改记录 update table set column='new record'(不加条件则修改全部记录）
16. 查询记录 select * from table;
注意：在mysql命令行中输入命令结尾处必须有';'

<a id="p3"></a>

## mysql在nodejs中的简单应用
   结合我的"图书管理系统"项目，简单谈一下mysql在nodejs中的应用。nodejs开发的web项目，把dao层和控制层糅合在一起。因此mysql放在控制层中。


1. 下载mysql模块 npm install mysql
2. 引入模块 var mysql = require('mysql');
3. 创建连接 var conn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'123qwe',
    database:'hqh',
    port:3306
});host是数据库地址，user用户名，password为密码，database为要连接的数据库，port是mysql的端口，默认是3306。


- 无论增删改查，对sql的执行语句都是conn.query(sql)  
如：

{conn.query('select * from book where book_status=0' ,function(err, rows, fields) {
   //具体业务逻辑
    });


conn.query('update book set book_status=1 where book_name=(?)',[book_name],function(err,result){
            //具体业务逻辑
        });



conn.query('delete from borrowing  where book_name=(?)',[book_name],function(err,result){
        //具体业务逻辑
    });



conn.query('insert into user VALUES(?,?,1)',[name,pwd], function(err, result) {
                   //具体业务逻辑
                });

注意：如有牵涉到对条件的操作，可在sql中用'?'做占位符，紧接着在[]中传入条件。

