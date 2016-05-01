---
layout: post
title: AIX主机性能监控命令
category: ['杂记']
tags: ['AIX', 'command', 'shell']
author: 汪 回
email: wanghui6@asiainfo.com
description: 最近在学习编写抓取AIX主机性能数据的Shell脚本，包括CPU、内存/SWAP、磁盘、目录的数据，在经过一番研究之后，决定将这些命令和脚本记录下来，以便以后复用。
---

|  |  *目 录* |
| --- | --- |
| 1 | [获取CPU数据](#cpu) |
| 2 | [获取内存/SWAP数据](#mem) |
| 3 | [获取磁盘数据](#disk) |
| 4 | [获取目录数据](#dir)|



## 一、获取CPU数据 <a name="cpu"></a>


mpstat是MultiProcessor Statistics的缩写，用于收集和显示系统中的所有处理器的性能统计，并且得到详细的单个处理器的运行状况。

```
   $mpstat
   
   System configuration: lcpu=16 mode=Capped 
   
   cpu  min  maj  mpc  int   cs  ics   rq  mig lpa sysc us sy wa id   pc
     0 184046638 214424  274 3908673210 3782119157 1326252330    0 26139925 100 6707390946  1  1  0 98 0.14
     1 7171412 14613  254 193245713 154941530 78622875    0 1126081 100 693934930  0  0  0 100 0.14
     2 170845575 230472  101 1308931839 2167522165 818427086    0 26083149 100 4900640467  1  1  0 99 0.14
     3 3193293 7611  101 236575152 198239437 153835438    0 1207732 100 139876648  0  0  0 100 0.14
     4 159868990 227718  129 1130251601 1850725273 692517872    0 12009046 100 2854042300  1  1  0 99 0.14
     5 5647834 30697  101 195761607 162561260 82402841    0 1132055 100 362309277  0  0  0 100 0.14
     6 157000962 211598  128 1099788787 1740814939 640685578    0 11993602 100 2992005605  1  1  0 99 0.14
     ......
   ALL 1370435922 2192633 3012 14099748600 18474769270 6889638308    1 139959495 100 36629470849  0  0  0 99 2.29
   
   #该命令检测系统中全部处理器的利用情况，并且给出各项的总和。下面是几个常用的输出项
   #lcpu: 工作的逻辑处理器的个数 
   #us: 运行的用户程序所占用的 CPU 百分比 
   #sy: 运行的内核程序所占用的 CPU 百分比 
   #wa: CPU 用来等待 IO 所占用的百分比 
   #id: CPU 空闲且不等待 IO 所占用的百分比
```

但在实际使用中，往往会加上 -a 参数，即 mpstat -a ，以宽输出模式显示所有的统计信息，下面来感受一下......

``` 
    $mpstat -a
    
    
System configuration: lcpu=16 mode=Capped 

cpu    min    maj   mpcs   mpcr    dev   soft    dec     ph     cs    ics  bound     rq   push S3pull  S3grd  S0rd  S1rd  S2rd  S3rd  S4rd  S5rd   sysc    us    sy    wa    id    pc   ilcs   vlcs  istol  bstol S3hrd S4hrd S5hrd
  0 184061070 214424    150    124 4310333 590469189 3306344682 8099285 3782890620 1326486636      0      0      0   7911 172073  98.9   0.0   0.0   1.0   0.0   0.0 6707965194   0.7   1.2   0.0  98.1  0.14      0 2681118967    0.0    0.0 100.0   0.0   0.0
  1 7171412  14613    167     87 4313856 1079722 186685547 1177054 154944893 78624637      0      0      0    579     21  98.6   1.4   0.0   0.0   0.0   0.0 693937155   0.0   0.1   0.0  99.9  0.14     17 200960974    0.0    0.0  99.4   0.0   0.6
  2 170859397 230472      3     98 4311630 24093376 1267078359 13630503 2167851281 818525974      1      1      0   3487  23722  98.1   0.0   0.0   1.9   0.0   0.0 4900880379   0.6   0.8   0.0  98.6  0.14     68 1049149272    0.0    0.0 100.0   0.0   0.0
  3 3193904   7611      3     98 4314206 1526924 229574778 1176611 198256684 153848135      0      0      0    266     44  99.2   0.7   0.0   0.1   0.0   0.0 139878645   0.0   0.1   0.0  99.9  0.14     30 275388781    0.0    0.0  99.7   0.0   0.3
  4 159881624 227718     33     96 4312115 20541062 1104121880 1401356 1850937520 692592197      0      0      0   4393  27574  99.0   0.0   0.0   0.9   0.0   0.1 2854195957   0.5   0.6   0.0  98.8  0.14     60 905205613    0.0    0.0  99.9   0.0   0.1
  5 5647840  30697      3     98 4314215 1797627 188492566 1175045 162579018 82411800      0      0      0    129    978  98.6   1.4   0.0   0.0   0.0   0.0 362318106   0.0   0.1   0.0  99.9  0.14     27 203720025    0.0    0.0  99.3   0.0   0.7
  6 157024188 211598     32     96 4313516 22509032 1071873739 1262410 1741141601 640807004      0      0      0   4196  10466  98.9   0.0   0.0   1.1   0.0   0.0 2992221777   0.5   0.8   0.0  98.7  0.14     56 876887437    0.0    0.0  99.9   0.0   0.1
  ......
ALL 1370536873 2192649   1506   1506 69017506 783158186 13210473966 38730670 18477226175 6890502684      1      1      0  38922 271366  98.8   0.1   0.0   1.1   0.0   0.0 36632650675   0.3   0.4   0.0  99.3  2.29    596 10830086125    0.0    0.0  99.9   0.0   0.1
```

输出的结果很详细，但也很混乱，让人眼花缭乱，没关系，我们可以将结果格式化处理，得到我们想要的数据.


#### 例1:获取当前主机总CPU使用率
```
    $mpstat -a|grep ALL|awk '{printf "当前主机总CPU使用率=%s",$24+$25}'
    当前主机总CPU使用率=0.7
    
    #通过 grep ALL 仅输出总计一行的数据,再使用 awk 命令,将第24、25域,也就是us和sy两列的数据相加获得完整的CPU使用率
    
```    

####  例2:显示所有处理器的CPU使用率

```
    $mpstat -a|sed -n '5,$'p|sed '$d'|awk '{print "cpu"$1"使用率:",$24+$25}'
    cpu0使用率: 1.9
    cpu1使用率: 0.1
    cpu2使用率: 1.4
    cpu3使用率: 0.1
    cpu4使用率: 1.1
    cpu5使用率: 0.1
    cpu6使用率: 1.3
    cpu7使用率: 0.1
    cpu8使用率: 1.2
    cpu9使用率: 0.2
    cpu10使用率: 1.3
    cpu11使用率: 0.2
    cpu12使用率: 1.2
    cpu13使用率: 0.1
    cpu14使用率: 1.3
    cpu15使用率: 0.1
    
    # sed -n '5,$'p 命令表示取第5行到最后一行的数据
    # sed '$d' 命令表示删除最后一行
```


## 二、获取内存/SWAP数据 <a name="mem"></a>


想要获取主机当前内存使用情况，可通过svmon -G来显示。

```
    $svmon -G
                   size       inuse        free         pin     virtual   mmode
    memory     65667072    12659615    53007457     3591255     7719427     Ded
    pg space    8388608       20086
    
                   work        pers        clnt       other
    pin         1719367           0           0     1871888
    in use      7719427           0     4940188
    
    PageSize   PoolSize       inuse        pgsp         pin     virtual
    s    4 KB         -    10953407       20086     2153575     6013219
    m   64 KB         -      106638           0       89855      106638


    # 其中,内存情况可查看memory一行
    # pg space一行即SWAP的情况
    # size -- 总容量
    # inuse -- 已使用量
    # free -- 空闲量
    # 另外,这里还有一个要注意的地方
    # 比如上图中,pg space的size为8388608,而这里的单位是页,并不是平常的KB、MB等，这涉及到内存段(segment)的知识，这里就不加以赘述，仅说明换算方式
    # 1页=4KB 1MB=256页
    # 所以,此处pg space的size实际上是 33554432KB 32768MB
```

知道了命令,下面来看看具体的例子。


#### 例1:获取当前主机内存和SWAP的总容量、已使用量和使用率
```
    $svmon -G|grep -E 'memory|pg space'|awk '{if($1=="memory"){print $1,$2/256"M",$3/256"M",$3/$2} else {print $1$2,$3/256"M",$4/256"M",$4/$3}}'
    memory 256512M 49452.9M 0.19279
    pgspace 32768M 78.4609M 0.00239444
    
    # grep -E 'memory|pg space' 仅输出带有 memory 和 pg space 的两行
    # awk 命令中,首先判断一下当前行是memory还是pg space,因为pg space中有个空格,此处占了两个域,所以必须先判断
    # 之后根据不同情况,输出结果就可以了
    # 值得一提的是,awk的if条件语句与shell的语句是不一样的
    # awk 的if条件语句格式:
    # if(表达式){
    #       语句1
    #     }else if{
    #       语句2
    #     }else{
    #       语句3
    #     }
    
```

#### 例2:获取当前主机内存占用top10的进程的id、名称、内存占用量

查看进程情况可使用ps命令

```
    $ps -elf
         F S      UID     PID    PPID   C PRI NI ADDR    SZ    WCHAN    STIME    TTY  TIME CMD
    200003 A     root       1       0   0  60 20 1070187480  1688            Dec 24      -  0:00 /etc/init 
    240001 A     root 1114204  918412   0  60 20 80288480   992            Dec 24      -  0:00 /usr/bin/X11/aixconsole 
    240001 A     root 1245188       1   0  60 20 15b01db480   980            Dec 24      -  0:00 /usr/sbin/srcmstr 
    240001 A     root 1310854       1   0  60 20 2f00af590   428 f1000000a05fc098   Dec 24      -  0:00 /usr/ccs/bin/shlap64 
    240001 A     root 1638646 1377066   0  60 20 4b04cb480   940 f1000e00002a0878   Dec 24   vty2  0:00 /bin/ksh /usr/lib/assist/assist_main 
    240001 A     root 1704120 1245188   0  60 20 a00020480  2452            Dec 24      -  2:13 sendmail: accepting connections 
    40001 A     root 1769708       1   0  60 20 3702b7480   308            Dec 24      -  0:00 /opt/freeware/cimom/pegasus/bin/CIM_diagd 
    240001 A     root 1835192       1   0  60 20 3102b1480  5224 f1000a0a003be4b0   Dec 24      -  0:09 /opt/ibm/director/cimom/bin/tier1slp 
    41001 A     root 1900728       1   0  60 20 1890309480  4500            Dec 24      -  0:11 ./slp_srvreg -D 
    ......
     
    #options:
    # -e 将除内核进程以外所有进程的信息写到标准输出。
    # -l 生成长列表
    # -f 生成一个完整列表
    
    #字段:
    #PID -- 进程ID
    #SZ -- 内存占用量(单位仍是页)
    #CMD -- 内存名
    
    #由此可见,通过ps命令再加上一些格式化处理命令应该可以得到我们想要的结果
      
```

下面开始尝试输出进程的id、名称、内存占用量

```
    $ps -elf|sort -rn +9|head -10|awk 'BEGIN{print "PID","PNAME","SZ"}{print $4,$15,$10}'
    PID PNAME SZ
    2621660 2031:33 3885164
    1639166 ora_lgwr_rhjftst 108252
    1376752 ora_mmon_rhjftst 98324
    1245552 ora_cjq0_rhjftst 97868
    1704826 ora_dbw0_rhjftst 97824
    917888 ora_pmon_rhjftst 97660
    2687194 ora_ckpt_rhjftst 97584
    1049374 ora_smon_rhjftst 95628
    1311046 ora_dbw1_rhjftst 95232
    2752842 0:35 94932
    
```

结果让人失望,由于各行的域数量不一致,导致$15无法一直指向进程名所在的域。在经过一系列尝试后，仍然不能单用命令得到进程名，所以改用脚本来获取。

#### 用脚本的方式获取
```
    $vi test.sh
    
    
# !/bin/sh

    tops='';
    rst=`ps -ealf|sort -rn +9|head -10|awk '{print $4,$10/256}'`
    cnt=0

    for item in ${rst[*]}
    do
        if [[ $((cnt%2)) -eq 0 ]]
        then
            tops="${tops}${item},"`ps $item|grep -v PID|awk '{printf "%s,",$5}'`
        else
            tops="${tops}""${item}""\`"
        fi
        let cnt=$cnt+1
    done

    tops=${tops%\`}
    echo $tops
    
    # 整体思路是先得到top10的进程id和所占内存大小,循环通过id去获得对应的进程名称
```

```
    # 输出结果
    $./test.sh
    2621660,/altibase/bin/altibase,15176.4`1639166,ora_lgwr_rhjftst,422.859`1376752,
    ora_mmon_rhjftst,384.078`1245552,ora_cjq0_rhjftst,382.297`1704826,ora_dbw0_rhjftst,
    382.125`917888,ora_pmon_rhjftst,381.484`2687194,ora_ckpt_rhjftst,381.188`1049374,
    ora_smon_rhjftst,373.547`1311046,ora_dbw1_rhjftst,372`2752842,oraclerhjftst,370.828
    
    # 为了展示效果,稍微调整一下格式
    #2621660,/altibase/bin/altibase,3885164`
    #1639166,ora_lgwr_rhjftst,108252`
    #1376752,ora_mmon_rhjftst,98324`
    #1245552,ora_cjq0_rhjftst,97868`
    #1704826,ora_dbw0_rhjftst,97824`
    #917888,ora_pmon_rhjftst,97660`
    #2687194,ora_ckpt_rhjftst,97584`
    #1049374,ora_smon_rhjftst,95628`
    #1311046,ora_dbw1_rhjftst,95232`
    #2752842,oraclerhjftst,94932
    
```

不得不承认这是一个笨方法,但对于效率没有多少影响,在找到新方法之前,可以先用着。

## 三、获取磁盘数据 <a name="disk"></a>

lvps命令可以显示物理卷的相关信息

```
    $lspv
    hdisk0          00c5cc969e7f0175                    rootvg          active
    hdisk1          00c5cc96a1c7d95e                    datavg          active
    hdisk2          00c5cc96a1c7e1a9                    datavg          active
    hdisk3          00c5cc96a1c7e863                    dicvg           active
    hdisk4          00c5cc96a1c7ef0b                    dicvg           active
    
    # 单独使用lspv可以得到所有物理卷的物理卷名称(pvname)、物理卷ID(pvid)、卷组名称(vgname)以及状态(status)
    
    $lspv hdisk0
    PHYSICAL VOLUME:    hdisk0                   VOLUME GROUP:     rootvg
    PV IDENTIFIER:      00c5cc969e7f0175 VG IDENTIFIER     00c5cc9600004c000000012e9e7f11e5
    PV STATE:           active                                     
    STALE PARTITIONS:   0                        ALLOCATABLE:      yes
    PP SIZE:            512 megabyte(s)          LOGICAL VOLUMES:  16
    TOTAL PPs:          558 (285696 megabytes)   VG DESCRIPTORS:   2
    FREE PPs:           414 (211968 megabytes)   HOT SPARE:        no
    USED PPs:           144 (73728 megabytes)    MAX REQUEST:      1 megabyte
    FREE DISTRIBUTION:  111..03..77..111..112                      
    USED DISTRIBUTION:  01..109..34..00..00                        
    MIRROR POOL:        None
    
    # 使用lspv pvname 则会显示该pv的详细信息
```

pp（physial partition）是一个物理分区，vg由pv组成，pv里边的最小分配单位就是pp,pp size就是vg里最小分配单位大小,
该物理卷的总容量=TOTAL PPS*PP SIZE/1024,单位是GB。
所以,想要得到所有物理卷的总容量、已使用量、已使用百分比,还是得通过脚本。

#### 例1:物理卷的总容量、已使用量、已使用百分比

```
    $vi test.sh
        #!/bin/sh
        
        disks=`lspv|awk '{print $1}'`
        
        for disk in $disks
        do
            printf $disk": "
            lspv $disk|sed -n '5,8p'|awk '{if(NR==1){size=$3}else if(NR==2){total=$3*size/1024}else if(NR==4){used=$3*size/1024}else{}}END{print  "总容量:"total,"已使用量"used,"已使用百分比"used/total}'
        done
    
    $./test.sh
    hdisk0: 总容量:279 已使用量72 已使用百分比0.258065
    hdisk1: 总容量:279 已使用量279 已使用百分比1
    hdisk2: 总容量:279 已使用量276.5 已使用百分比0.991039
    hdisk3: 总容量:279.25 已使用量279.25 已使用百分比1
    hdisk4: 总容量:279.25 已使用量271 已使用百分比0.970457
```

## 四、获取目录数据 <a name="dir"></a>
    
查看目录情况,一般使用du命令
下面是一些常用选项
-a	显示目录下所有子目录和文件的磁盘使用情况,与-s相对
-g	用 GB 单位统计;
-k	用 1024 字节单位统计;
-m	用 MB 单位统计;
-r	报告不可访问的文件或者目录名,此为缺省设置;
-s	仅显示指定目录的整体磁盘使用情况,不显示子目录及文件使用情况,与-a相对。

#### 例1:仅获取目录整体磁盘使用情况,用GB单位统计
```
    $du -sg $dirname
    3.65    /ngbss/crmdev/.pangu
```

#### 例2:显示指定目录下所有子目录及文件磁盘使用情况,用MB单位统计
```
    $du -am $dirname
    
    ......
    0.14    /ngbss/crmdev/.pangu/test/pangu-monitor/test/main.o
    0.00    /ngbss/crmdev/.pangu/test/pangu-monitor/test/monitor.template
    8.13    /ngbss/crmdev/.pangu/test/pangu-monitor/test
    75.58   /ngbss/crmdev/.pangu/test/pangu-monitor
    0.00    /ngbss/crmdev/.pangu/test/runmon.sh
    163.58  /ngbss/crmdev/.pangu/test
    3734.79 /ngbss/crmdev/.pangu
    
    #此命令会在最后一行显示指定目录的整体磁盘使用情况
```

#### 例3:显示指定目录下大文件Top10

本以为会很简单,只要使用降序,再取前10行就可以了

```
    $du -am $dirname|sort -rn|head -10
    3734.79 /ngbss/crmdev/.pangu
    3347.17 /ngbss/crmdev/.pangu/log
    2045.48 /ngbss/crmdev/.pangu/log/4Glog-20150210
    326.80  /ngbss/crmdev/.pangu/log/134_32_28_198
    310.17  /ngbss/crmdev/.pangu/log/134_32_28_197
    300.05  /ngbss/crmdev/.pangu/log/4Glog-20150210/trade_4G_129_01.log.2015-02-10.2
    300.04  /ngbss/crmdev/.pangu/log/4Glog-20150210/trade_4G_127_01.log.2015-02-10.0
    300.02  /ngbss/crmdev/.pangu/log/4Glog-20150210/trade_4G_129_01.log.2015-02-10.1
    300.02  /ngbss/crmdev/.pangu/log/4Glog-20150210/trade_4G_129_01.log.2015-02-10.0
    300.01  /ngbss/crmdev/.pangu/log/4Glog-20150210/trade_4G_127_01.log.2015-02-10.2
    
```

然而并不是,上面的结果除了文件,还包含着目录。
如果想要只输出文件,必须另寻他法。
尝试过其他很多方法,比如find,比如ls,虽然能达到想要的结果,但是执行效率都不高,没有du来得快,若想用du,关键在于判断该行地址是否是目录。
观察整个命令流程,最有可能可以判断的地方只能是在awk环节。
于是研究了awk的用法后,发现awk的'{}'中,是可以可以执行系统命令及shell命令的。
通过system(cmd)结合getline[var]便可以实现。
于是......

```
    $du -am $dirname|sort -rn|awk '{cmd="test -d "$2";echo $?";cmd|getline rst;if(rst==1){print "路径: "$2 ,"占用空间"$1"MB"}}'|head -10
    路径: /ngbss/crmdev/.pangu/log/4Glog-20150210/trade_4G_129_01.log.2015-02-10.2 文件大小: 300.05MB
    路径: /ngbss/crmdev/.pangu/log/4Glog-20150210/trade_4G_127_01.log.2015-02-10.0 文件大小: 300.04MB
    路径: /ngbss/crmdev/.pangu/log/4Glog-20150210/trade_4G_129_01.log.2015-02-10.1 文件大小: 300.02MB
    路径: /ngbss/crmdev/.pangu/log/4Glog-20150210/trade_4G_129_01.log.2015-02-10.0 文件大小: 300.02MB
    路径: /ngbss/crmdev/.pangu/log/4Glog-20150210/trade_4G_127_01.log.2015-02-10.2 文件大小: 300.01MB
    路径: /ngbss/crmdev/.pangu/log/4Glog-20150210/trade_4G_127_01.log.2015-02-10.1 文件大小: 300.01MB
    路径: /ngbss/crmdev/.pangu/log/trade_4G_127_01.log 文件大小: 170.82MB
    路径: /ngbss/crmdev/.pangu/log/4Glog-20150210/trade_4G_127_01.log.2015-02-10.3 文件大小: 124.88MB
    路径: /ngbss/crmdev/.pangu/log/134_32_28_198/tux20141228.log 文件大小: 122.79MB
    路径: /ngbss/crmdev/.pangu/log/4Glog-20150210/trade_4G_129_01.log.2015-02-10.3 文件大小: 120.45MB
```

终于得到了期望的输出结果。