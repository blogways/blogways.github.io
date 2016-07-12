---
layout: post
category: NoSQL
title: MAC OSX 环境下搭建 memcached 环境
tags: ['memcached', 'libmemcached']
author: 唐 治
email: tangzhi@asiainfo-linkage.com
description: MAC OSX 下搭建 memcached 环境及测试demo

---

在MAC OSX下搭建 memcached 环境，那是轻松的一塌糊涂啊。整个过程几分钟就搞定了，让我再次感叹，MacBook 就是为 *nux 下程序员量身定制的！

我是使用 brew 来安装的，让我们再回顾一下整个过程吧。如果你没有装 brew ,先看步骤一，否则直接看步骤二。


### 步骤一：安装 Homebrew

先看看是否满足下面条件：

	Intel 的 CPU
	OS X 10.5 或者更高
	安装了XCode 或者 XCode命令行工具
	
满足了，就可以安装 Homebrew，命令如下：

	$ ruby -e "$(curl -fsSL https://raw.github.com/mxcl/homebrew/go)"
	
打开Terminal, 粘贴上面的语句.该脚本首先将会解释它要做什么, 然后暂停下来, 直到您确认继续. 更多的安装选项在[这里](https://github.com/mxcl/homebrew/wiki/Installation)可以看到 .

### 步骤二：安装 memcached

安装前，可以先查找一下，看看有没有：

	$ brew search memcache
	
返回结果:
	
	libmemcached	memcache-top	memcached	memcacheq
	
说明和关键字`memcache`相关的有上面这四个，这样就确认了，有我们需要的东西，第一个是客户端，第三个是服务器。

那么安装吧！

先装服务器：

    $ brew install memcached
    
安装日志：

    ==> Installing memcached dependency: libevent
    ==> Downloading https://github.com/downloads/libevent/libevent/libevent-2.0.21-s
    ######################################################################## 100.0%
    ==> ./configure --disable-debug-mode --prefix=/usr/local/Cellar/libevent/2.0.21
    ==> make
    ==> make install
    🍺  /usr/local/Cellar/libevent/2.0.21: 48 files, 1.8M, built in 84 seconds
    ==> Installing memcached
    ==> Downloading http://memcached.googlecode.com/files/memcached-1.4.15.tar.gz
    ######################################################################## 100.0%
    ==> ./configure --prefix=/usr/local/Cellar/memcached/1.4.15 --disable-coverage
    ==> make install
    ==> Caveats
    To have launchd start memcached at login:
        ln -sfv /usr/local/opt/memcached/*.plist ~/Library/LaunchAgents
    Then to load memcached now:
        launchctl load ~/Library/LaunchAgents/homebrew.mxcl.memcached.plist
    Or, if you don't want/need launchctl, you can just run:
        /usr/local/opt/memcached/bin/memcached
    ==> Summary
    🍺  /usr/local/Cellar/memcached/1.4.15: 10 files, 176K, built in 8 seconds
        
从上面安装日志，可以看出:

1. 安装 memcached 前，先安装了其所依赖的 libevent 库
2. 下载的libevent和memcached，被安装到/usr/local/Cellar下面，但是又自动在/usr/local/bin下面建立了软连接，方便使用。

安装后可以查看安装的结果：

	$ which memcached
	/usr/local/bin/memcached
	
	$ memcached -h
	memcached 1.4.15
	...


### 步骤二：安装 libmemcached

继续安装客户端库：

    $ brew install libmemcached
    ==> Downloading https://launchpad.net/libmemcached/1.0/1.0.16/+download/libmemca
    ######################################################################## 100.0%
    ==> ./configure --prefix=/usr/local/Cellar/libmemcached/1.0.16
    ==> make install
    🍺  /usr/local/Cellar/libmemcached/1.0.16: 110 files, 1.4M, built in 108 seconds
      
### 步骤三：启动服务器

先默认参数启动吧：

	$ /usr/local/bin/memcached -d
	
### 步骤四：编写客户端测试程序并运行

编写程序文件 `example.cpp` :

    #include <libmemcached/memcached.h>
    #include <string.h>
    #include <stdio.h>
    #include <sys/time.h>
    
    #define TEST_NUM 500000
    
    void printNowTime() {
        struct timeval current;
        
        gettimeofday(& current, NULL);
        struct tm * mtm = localtime(& current.tv_sec);
        
        printf("[%04d-%02d-%02d %02d:%02d:%02d.%03d] ", mtm->tm_year+1900, mtm->tm_mon + 1, mtm->tm_mday, mtm->tm_hour, mtm->tm_min, mtm->tm_sec, current.tv_usec / 1000);
    }
    
    int main() {
    
        const char *config_string = "--SERVER=localhost";
        memcached_st *memc= memcached(config_string, strlen(config_string));
        
        //const char  *keys[]= {"key1", "key2", "key3","key4"};
        const  size_t key_length[]= {4, 4, 4, 4};   
        const char *values[] = {"This is 1 first value", "This is 2 second value", "This is 3 third value","this is 4 forth value"};   
        size_t val_length[]= {21, 22, 21, 21};  
        
        char keys[TEST_NUM][10];
        
        printNowTime();
        printf("start init keys.\n");
        
        for(int i=0; i<TEST_NUM; ++i) {
            sprintf(keys[i], "key%06d", i);
        }
        
        printNowTime();
        printf("end init keys.\n\n");
        
        
        memcached_return_t rc;
        
        printNowTime();
        printf("start set value.\n");
        
        for (int i=0; i < TEST_NUM; i++)        
        {  
            rc = memcached_set(memc, keys[i], 9, values[i%4], val_length[i%4], (time_t)180,(uint32_t)0);
            //printf("key: %s  rc:%s\n", keys[i], memcached_strerror(memc, rc));   // 输出状态
        }
        
        printNowTime();
        printf("end set value.\n\n");
        
        
        char * result;
        uint32_t flags;
        size_t value_length;
        
        
        
        printNowTime();
        printf("start read value.\n");
        
        for(int i=0; i < TEST_NUM; i++)
        {  
            result = memcached_get(memc, keys[i], 9, &value_length, &flags, &rc);
            
            //if (i%10000 == 0)
            //    printf("key: %s, value: %s.\n", keys[i], result);
        } 
        
        printNowTime();
        printf("end read value.\n");
        
        memcached_free(memc);
    
        return 0;
    }

编写 `Makefile` 文件:

	example: example.cpp
    	gcc -o example example.cpp -lmemcached
    
    clean:
    	rm example

编译：

	$ make
	
运行测试:

	$ ./example
    [2013-05-01 20:20:39.500] start init keys.
    [2013-05-01 20:20:39.593] end init keys.
    
    [2013-05-01 20:20:39.593] start set value.
    [2013-05-01 20:21:04.527] end set value.
    
    [2013-05-01 20:21:04.527] start read value.
    [2013-05-01 20:21:26.959] end read value.
  
整个过程结束！
  
确实很简单吧！
	