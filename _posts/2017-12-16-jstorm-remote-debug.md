---
layout: post
title: 使用idea对jstorm拓扑进行远程调试
category: ['storm']
tags: ['jstorm', 'storm', 'debug']
author: 钱文旭
email:
description: 使用idea对jstorm拓扑进行远程调试
---

在测试过程中，出现沙箱环境中提交的拓扑和本地启动的拓扑运行的结果不一致。查看log日志也没发现出问题原因，
不得已祭出远程debugg大招。下面是操作步骤：

1. 配置yaml
在yaml里增加配置 topology.work。childopts,
```
    topology.worker.childopts : "-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=13006"
```
-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=13006，参数是jdk1.5+后的开启jdwp(Java Debug Wire Protocol)
的命令，这里指定使用socket传输，端口使用13006（端口可以自行指定）。

2. 提交拓扑
提交拓扑命令是jstorm提交拓扑的命令，记得配置文件要更换为修改后的配置。

3. 进入jstorm nimbus监控页面，查看拓扑的worker运行在哪些机器上。
![1](/images/qianwx/nimbus_view1.png)
找到自己的拓扑，点击进去，
![2](/images/qianwx/nimbus_view2.png)
点击Task Stats,
![3](/images/qianwx/nimbus_view3.png)
可以看到自己的tasks，选择其中一个，记录下ip

4. 在idea中创建remote
![4](/images/qianwx/idea_remote.png)
把host修改成task记录的ip，端口填写13006（自定义），点击ok保存。

5. 点击debug按钮
![5](/images/qianwx/idea_remote_succ.png)
出现如图，就可以成功debug了