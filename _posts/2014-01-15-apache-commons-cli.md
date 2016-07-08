---
layout: post
category: Apache
title: Apache Commons 系列简介 之 CLI
tags: ['Apache Commons', 'cli']
author: 唐 治
email: tangzhi@asiainfo-linkage.com
description: 介绍Apache Commons 系列中的 CLI 库

---

`Apache Commons`的主要目的就是，创建和维护一个可重用的java组件库集合。这样Apache社区的开发者，就可以使用相同的基础组件库来开发不同的Apache项目了。

而`Apache Commons`的开发者们，将尽量减少这些组件对其他外部库的影响，来确保这些组件可以很容易地进行部署。另外，这些组件将尽可能地保证接口稳定，以便Apache用户（包括Apache项目）可以实现这些组件，而不必担心未来发生变化。

本文将介绍Commons系列中的CLI组件库。


### 一、Commons CLI 概述

`Apache Commons CLI` 库提供API，可以帮助程序去解析传递给程序的命令行参数。他也可以打印帮助信息，来说明可以运用于命令行的有效参数。

CLI库支持不同格式的选项：

1. POSIX格式的选项（比如：`tar -zxvf foo.tar.gz`）
2. GNU格式的长参数选项（比如：`du --human-readable --max-depth=1`）
3. Java格式的属性（比如：`java -Djava.awt.headless=true -Djava.net.useSystemProxies=true Foo`）
4. 带值的单选项（比如：`gcc -O2 foo.c`）
5. 单`-`号的长参数选项（比如：`ant -projecthelp`）

CLI库可以提供的帮助信息，类似如下：

```
usage: ls
 -A,--almost-all          do not list implied . and ..
 -a,--all                 do not hide entries starting with .
 -B,--ignore-backups      do not list implied entried ending with ~
 -b,--escape              print octal escapes for nongraphic characters
    --block-size <SIZE>   use SIZE-byte blocks
 -c                       with -lt: sort by, and show, ctime (time of last
                          modification of file status information) with
                          -l:show ctime and sort by name otherwise: sort
                          by ctime
 -C                       list entries by columns
```

### 二、Commons CLI 下载

截止本文撰写时，CLI的最新发布版本为`1.2`。

官方下载地址：

    http://commons.apache.org/proper/commons-cli/download_cli.cgi
    
源码：

    svn checkout http://svn.apache.org/repos/asf/commons/proper/cli/trunk/ commons-cli
    
在Maven工程中添加依赖：

    <dependency>
		<groupId>commons-cli</groupId>
		<artifactId>commons-cli</artifactId>
		<version>1.2</version>
	</dependency>
	
### 三、使用场景

### 3.1 布尔选项

布尔选项是命令行最常见的选项，作为开关使用，不带参数。如果命令行中存在该选项，那么选项值就为`true`，否则其值为`false`。

举例，如果程序需要布尔选项`-t`,代码如下：

```
// create Options object
Options options = new Options();

// add t option
options.addOption("t", false, "display current time");
```

如上，必须创建`Options`选项，然后为其添加`Option`对象。

上例中，`addOption`方法有三个参数：第一个参数类型为`String`，给出参数的名字；第二个参数类型为`boolean`，用来标记该选项是否需要参数,在上面例子中，布尔选项不需要参数，所以设置为`false`；第三个参数是选项的描述信息，该描述信息在打印命令行帮助信息时，会显示出来。

另外，`addOption`还存在一个四个参数的调用方式：

    addOption(String opt, String longOpt, boolean hasArg, String description)
    
在这里，多了一个长选项参数，在后面的例子中，我们可以看到具体的使用。


### 3.2 解析命令行参数

`CommandLineParser`提供的方法`parse`，就是用来解析命令行中的参数。接口`CommandLineParser`存在多种实现类，比如`BasicParser`、`PosixParser`和`GnuParser`，可以根据实际需求选择使用.

其中，`PosixParser`与`GnuParser`，顾名思义，其区别在于，前者把形如`-log`的选项作为三个选项(`l`、`o`和`g`)处理，而后者作为一个选项处理。

具体代码，参考如下：

```
CommandLineParser parser = new GnuParser();
CommandLine cmd = parser.parse( options, args);
```

如果，我们要检查命令行中`t`选项是否被列出，可以使用`hasOption`方法。例如：

```
if(cmd.hasOption("t")) {
    // 存在t选项的处理
}
else {
    // 不存在t选项的处理
}
```

### 3.2 带参数选项

除了布尔选项外，还有些选项是需要参数的。比如`c`选项需要参数，那么可以如下设置：

```
// add c option
options.addOption("c", true, "country code");
```

并且，可以通过`getOptionValue`方法，获取命令行传入的参数：

```
// get c option value
String countryCode = cmd.getOptionValue("c");

if(countryCode == null) {
    // print default date
}
else {
    // print date for country specified by countryCode
}
```


### 3.3 Ant命令行实例

在这里，我们使用一个被普遍使用的java应用程序Ant来解释如果使用CLI库的。

#### 3.3.1 先看看Ant的命令帮助

```
ant [options] [target [target2 [target3] ...]]
  Options: 
  -help                  print this message
  -projecthelp           print project help information
  -version               print the version information and exit
  -quiet                 be extra quiet
  -verbose               be extra verbose
  -debug                 print debugging information
  -emacs                 produce logging information without adornments
  -logfile <file>        use given file for log
  -logger <classname>    the class which is to perform logging
  -listener <classname>  add an instance of class as a project listener
  -buildfile <file>      use given buildfile
  -D<property>=<value>   use value for given property
  -find <file>           search for buildfile towards the root of the
                         filesystem and use it
```

#### 3.3.2 创建布尔选项

为了代码清晰，在这里我们使用`Option`的构造方法来创建。

```
Option help = new Option( "help", "print this message" );
Option projecthelp = new Option( "projecthelp", "print project help information" );
Option version = new Option( "version", "print the version information and exit" );
Option quiet = new Option( "quiet", "be extra quiet" );
Option verbose = new Option( "verbose", "be extra verbose" );
Option debug = new Option( "debug", "print debugging information" );
Option emacs = new Option( "emacs",
                           "produce logging information without adornments" );
```

#### 3.3.3 创建带参数的选项

我们使用`OptionBuilder`来创建：

```
Option logfile   = OptionBuilder.withArgName( "file" )
                                .hasArg()
                                .withDescription(  "use given file for log" )
                                .create( "logfile" );

Option logger    = OptionBuilder.withArgName( "classname" )
                                .hasArg()
                                .withDescription( "the class which it to perform "
                                                  + "logging" )
                                .create( "logger" );

Option listener  = OptionBuilder.withArgName( "classname" )
                                .hasArg()
                                .withDescription( "add an instance of class as "
                                                  + "a project listener" )
                                .create( "listener"); 

Option buildfile = OptionBuilder.withArgName( "file" )
                                .hasArg()
                                .withDescription(  "use given buildfile" )
                                .create( "buildfile");

Option find      = OptionBuilder.withArgName( "file" )
                                .hasArg()
                                .withDescription( "search for buildfile towards the "
                                                  + "root of the filesystem and use it" )
                                .create( "find" );
```

#### 3.3.4 创建java属性选项

```
Option property  = OptionBuilder.withArgName( "property=value" )
                                .hasArgs(2)
                                .withValueSeparator()
                                .withDescription( "use value for given property" )
                                .create( "D" );
```

#### 3.3.5 创建Options

上面已经创建了每个选项，下面我们需要创建`Options`，然后继续使用`addOption`方法，向其中添加每个选项，代码如下：

```
Options options = new Options();

options.addOption( help );
options.addOption( projecthelp );
options.addOption( version );
options.addOption( quiet );
options.addOption( verbose );
options.addOption( debug );
options.addOption( emacs );
options.addOption( logfile );
options.addOption( logger );
options.addOption( listener );
options.addOption( buildfile );
options.addOption( find );
options.addOption( property );
```              

**说明：可以通过`Option`的`setRequired`方法来设置，选项是否为必输项，默认不是必输项。 **             

#### 3.3.6 解析命令行参数

我们需要创建一个`CommandLineParser`，并用它根据之前设置的`Options`来解析命令行参数，代码如下：

```
public static void main( String[] args ) {
    // create the parser
    CommandLineParser parser = new GnuParser();
    try {
        // parse the command line arguments
        CommandLine line = parser.parse( options, args );
    }
    catch( ParseException exp ) {
        // oops, something went wrong
        System.err.println( "Parsing failed.  Reason: " + exp.getMessage() );
    }
}
```

#### 3.3.7 获取命令行参数

使用`hasOption`方法来检查命令行是否传入选项，使用`getOptionValue`来获取传入的参数值。

代码如下：

```
// has the buildfile argument been passed?
if( line.hasOption( "buildfile" ) ) {
    // initialise the member variable
    this.buildfile = line.getOptionValue( "buildfile" );
}
``` 

#### 3.3.8 设置程序用例/帮助信息

CLI库还可以根据`Options`来自动显示程序的用例/帮助信息。代码如下：

```
// automatically generate the help statement
HelpFormatter formatter = new HelpFormatter();
formatter.printHelp( "ant", options, true );
```

执行后生成下面信息：

```
usage: ant
-D <property=value>     use value for given property
-buildfile <file>       use given buildfile
-debug                  print debugging information
-emacs                  produce logging information without adornments
-file <file>            search for buildfile towards the root of the
                        filesystem and use it
-help                   print this message
-listener <classname>   add an instance of class as a project listener
-logger <classname>     the class which it to perform logging
-projecthelp            print project help information
-quiet                  be extra quiet
-verbose                be extra verbose
-version                print the version information and exit
```


### 3.4 再来一个`ls`实例

下面是帮助信息：

```
Usage: ls [OPTION]... [FILE]...
List information about the FILEs (the current directory by default).
Sort entries alphabetically if none of -cftuSUX nor --sort.

-a, --all                  do not hide entries starting with .
-A, --almost-all           do not list implied . and ..
-b, --escape               print octal escapes for nongraphic characters
    --block-size=SIZE      use SIZE-byte blocks
-B, --ignore-backups       do not list implied entries ending with ~
-c                         with -lt: sort by, and show, ctime (time of last
                           modification of file status information)
                           with -l: show ctime and sort by name
                           otherwise: sort by ctime
-C                         list entries by columns
```

下面是代码：

```
// create the command line parser
CommandLineParser parser = new GnuParser();

// create the Options
Options options = new Options();
options.addOption( "a", "all", false, "do not hide entries starting with ." );
options.addOption( "A", "almost-all", false, "do not list implied . and .." );
options.addOption( "b", "escape", false, "print octal escapes for nongraphic "
                                         + "characters" );
options.addOption( OptionBuilder.withLongOpt( "block-size" )
                                .withDescription( "use SIZE-byte blocks" )
                                .hasArg()
                                .withArgName("SIZE")
                                .create() );
options.addOption( "B", "ignore-backups", false, "do not list implied entried "
                                                 + "ending with ~");
options.addOption( "c", false, "with -lt: sort by, and show, ctime (time of last " 
                               + "modification of file status information) with "
                               + "-l:show ctime and sort by name otherwise: sort "
                               + "by ctime" );
options.addOption( "C", false, "list entries by columns" );

String[] args = new String[]{ "--block-size=10" };

try {
    // parse the command line arguments
    CommandLine line = parser.parse( options, args );

    // validate that block-size has been set
    if( line.hasOption( "block-size" ) ) {
        // print the value of block-size
        System.out.println( line.getOptionValue( "block-size" ) );
    }
}
catch( ParseException exp ) {
    System.out.println( "Unexpected exception:" + exp.getMessage() );
}
```

                                
