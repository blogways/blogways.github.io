---
layout: post
category: Apache Commons
title: Apache Commons 系列简介 之 Lang
tags: ['Apache Commons', 'Lang', 'Builder', 'Time']
author: 万洲
description: 介绍Apache Commons 系列中的 Lang 库

---


###一、概述###
`Apache Commons Lang`库提供了标准Java库函数里所没有提供的Java核心类的操作方法。`Apache Commons Lang`为java.lang API提供了大量的辅助工具，尤其是在String操作方法，基础数值方法，对象引用，并发行，创建及序列化，系统属性方面。

Lang3.0及其后续版本使用的包名为`org.apache.commons.lang3`，而之前的版本为`org.apache.commons.lang`，允许其在被使用的同时作为一个较早的版本。

`Apache Commons Lang 3.3 API`包列表：
>+  org.apache.commons.lang3
>+  org.apache.commons.lang3.builder
>+  org.apache.commons.lang3.concurrent
>+  org.apache.commons.lang3.event
>+  org.apache.commons.lang3.exception
>+  org.apache.commons.lang3.math
>+  org.apache.commons.lang3.mutable
>+  org.apache.commons.lang3.reflect
>+  org.apache.commons.lang3.text
>+  org.apache.commons.lang3.text.translate
>+  org.apache.commons.lang3.time
>+  org.apache.commons.lang3.tuple

###二、下载###
官方下载页:

	http://http://commons.apache.org/proper/commons-lang/download_lang.cgi
源码:

	svn checkout http://svn.apache.org/repos/asf/commons/proper/pool/trunk commons-pool2

Maven工程依赖：

	<dependency>
		<groupId>org.apache.commons</groupId>
  		<artifactId>commons-lang3</artifactId>
  		<version>3.3</version>
	</dependency>

###三、使用说明###
####3.1 org.apache.commons.lang3####
此包提供了高度可重用静态的工具方法，主要是对`java.lang`类的一些补充。

由于此包中方法绝大多数都为静态的，因此__不需要创建实例化相应的对象__，而是通过类名__直接调用__需要的方法。

`ArrayUtils`是一个对数组进行特殊处理的类。当然 `jdk`中的`Arrays`是有一些功能的，`Array`也提供了一些动态访问 `java`数组的方法，这里的`ArrayUtils`扩展提供了更多的功能。

下面是`indexOf`方法的具体实现，用以从指定的`startIndex`开始，从数组`array`中返回第一个值为`valueToFind`的下标。

	public static int indexOf(final double[] array, final double valueToFind, int startIndex) {
        if (ArrayUtils.isEmpty(array)) {
            return INDEX_NOT_FOUND;
        }
        if (startIndex < 0) {
            startIndex = 0;
        }
        for (int i = startIndex; i < array.length; i++) {
            if (valueToFind == array[i]) {
                return i;
            }
        }
        return INDEX_NOT_FOUND;
    }


在使用此方法的时候__不应该__：

	ArrayUtils au = new ArrayUtils();
	au.indexOf(array,valueToFind,startIndex);

__正确的使用方式__：

	ArrayUtils.indexOf(array,valueToFind,startIndex);


一个比较完整的例子：

	package wz.lang3.test;

	import org.apache.commons.lang3.ArrayUtils;
	public class arrayutilstest 
	{
		public static void main(String[] args)
		{
			double[] array = {1.23,2.34,3.45,4.56,5.67,6.78,7.89,8.90};
			
			int result = ArrayUtils.indexOf(array, 5.67, 3);
			
			System.out.println(result);
		}
	} 
	//输出结果：4

以下是网络实例：
__[ArrayUtils实例][]__！
__[StringUtils实例][]__！
[ArrayUtils实例]: http://www.blogjava.net/sean/archive/2005/07/30/8775.html "ArrayUtils实例"
[StringUtils实例]: http://www.blogjava.net/sean/archive/2005/07/30/8776.html "StringUtils实例"

其他的一些类的用途：

- `AnnotationUtils`用于辅助处理注释实例。
- `CharSetUtils`用于操作字符集实例。
- `CharUtils`用于操作字符基本类型及字符类对象。
- `StringUtils`用于实现对字符串的操作，处理null输入。
- __[其他类][OtherClass]__。
[OtherClass]: http://commons.apache.org/proper/commons-lang/javadocs/api-release/index.html "Org.apache.commons.lang3类列表"

####3.2 org.apache.commons.lang3.builder####
辅助实现`equals(Object)`，`toString()`，`hashCode()`, 和 `compareTo(Object)`方法，
在这个包里面一共有7个类：

* `CompareToBuilder` : 用于辅助实现`Comparable.compareTo(Object)`方法；
* `EqualsBuilder` : 用于辅助实现`Object.equals(Object)`方法；
* `HashCodeBuilder` : 用于辅助实现`Object.hashCode()`方法；
* `ToStringBuilder` : 用于辅助实现`Object.toString()`方法；
* `ReflectionToStringBuilder` : 使用反射机制辅助实现`Object.toString()`方法；
* `ToStringStyle` : 辅助`ToStringBuilder`控制输出格式；
* `StandardToStringStyle` : 辅助`ToStringBuilder`控制标准格式。

在我们的日常编码过程当中，经常会使用到比较两个对象是否相等、比较大小、取hash、获取对象信息等。但是在实现这些方法的具体代码当中，稍微有点不注意就会出现一些BUG，而且有些往往还非常难以发现，因此`org.apache.commons.lang3.builder`中提供的这些用于辅助实现上述功能的方法就比较好了，有了这些类，就可以更好、更快、更方便的实现上述方法。

以下例子来自网络：
	 
	//利用反射机制的版本自动化实现需要的功能
	//比较两个对象
    public int compareTo(Object o) {
        return CompareToBuilder.reflectionCompare(this, o);
    }
	//判断相等
    public boolean equals(Object o) {
        return EqualsBuilder.reflectionEquals(this, o);
    }
	//取hash
    public int hashCode() {
        return HashCodeBuilder.reflectionHashCode(this);
    }
	//获取基本信息
    public String toString() {
        return ReflectionToStringBuilder.toString(this);
    }
	
详细例子__[请参考][]__！
[请参考]: http://www.blogjava.net/sean/archive/2005/07/30/8781.html "org.apache.commons.lang.builder"	

####3.3 org.apache.commons.lang3.time####
用于提供操作时间（Date）和日期（Duration）的方法和类，在这个包里面一共有7个类：

* `DateFormatUtils` ： 提供格式化日期和时间的功能及相关常量，
* `DateUtils` ： 在Calendar和Date的基础上提供更方便的访问，
* `DurationFormatUtils` ： 提供格式化时间跨度的功能及相关常量，
* `FastDateFormat` ： 为java.text.SimpleDateFormat提供一个的线程安全的替代类，
* `FastDateParser` ： 为java.text.SimpleDateFormat提供一个的线程安全的替代类，
* `FastDatePrinter` ： 为java.text.SimpleDateFormat提供一个的线程安全的替代类，
* `StopWatch` ： 提供一套方便的计时器的API。

这些包除了`StopWatch`，其他的因为都是不可变的，所以是__线程安全__的，此包包含了一些操作时间的基础工具。更`Apache Commons Lang`中的其他的大部分类一样，此包中的方法基本均为`static`方法，应该__直接使用类名调用__相应的方法予以实现相应的功能。

以下例子来自网络：

	package sean.study.jakarta.commons.lang;
	import java.util.Calendar;
	import java.util.Date;
	import org.apache.commons.lang.StringUtils;
	import org.apache.commons.lang.time.*;
	public class DateTimeUsage 
	{
	    public static void main(String[] args) 
		{
	        demoDateUtils();
	        demoStopWatch();
	    }
	    public static void demoDateUtils() 
		{
	
	        System.out.println(StringUtils.center(" demoDateUtils ", 30, "="));
	        Date date = new Date();
	        String isoDateTime = DateFormatUtils.ISO_DATETIME_FORMAT.format(date);
	        String isoTime = DateFormatUtils.ISO_TIME_NO_T_FORMAT.format(date);
	        FastDateFormat fdf = FastDateFormat.getInstance("yyyy-MM");
	        String customDateTime = fdf.format(date);
	        System.out.println("ISO_DATETIME_FORMAT: " + isoDateTime);
	        System.out.println("ISO_TIME_NO_T_FORMAT: " + isoTime);
	        System.out.println("Custom FastDateFormat: " + customDateTime);
	        System.out.println("Default format: " + date);
	        System.out.println("Round HOUR: " + DateUtils.round(date, Calendar.HOUR));
	        System.out.println("Truncate HOUR: " + DateUtils.truncate(date, Calendar.HOUR));
	        System.out.println();
	    }
	    public static void demoStopWatch() 
		{
	
	        System.out.println(StringUtils.center(" demoStopWatch ", 30, "="));
	        StopWatch sw = new StopWatch();
	        sw.start();
	        operationA();
	        sw.stop();
	        System.out.println("operationA used " + sw.getTime() + " milliseconds.");
	        System.out.println();
	    }
	    public static void operationA() 
		{
	        try {
	            Thread.sleep(999);
	        }
	        catch (InterruptedException e) {
	            // do nothing
	        }
	    }
	}

输出结果：

	======= demoDateUtils ========
	ISO_DATETIME_FORMAT: 2005-08-01T12:41:51
	ISO_TIME_NO_T_FORMAT: 12:41:51
	Custom FastDateFormat: 2005-08
	Default format: Mon Aug 01 12:41:51 CST 2005
	Round HOUR: Mon Aug 01 13:00:00 CST 2005
	Truncate HOUR: Mon Aug 01 12:00:00 CST 2005
	======= demoStopWatch ========
	operationA used 1000 milliseconds.