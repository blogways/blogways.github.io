---
layout: post
category: JUnit
title: Junit4测试类中测试方法的执行顺序
tags: ['Junit4', '测试顺序']
author: 唐 治
email: tangzhi@asiainfo-linkage.com
description: 我正在使用的Junit的版本为4.11,其中测试类的执行顺序有三种指定方式：默认、按方法名顺序和JVM顺序

---

我正在使用的Junit的版本为4.11,其中测试类的执行顺序有三种指定方式：默认、按方法名顺序和JVM顺序。

如果你不做任何指定，那么就是由默认顺序来执行，那么默认顺序是怎么确定的？他是由方法名的hash值的大小来确定，如果hash值大小一致，则按名字顺序确定。

看下面Junit的实现代码：

	/**
     * DEFAULT sort order
     */
    public static Comparator<Method> DEFAULT = new Comparator<Method>() {
        public int compare(Method m1, Method m2) {
            int i1 = m1.getName().hashCode();
            int i2 = m2.getName().hashCode();
            if (i1 != i2) {
                return i1 < i2 ? -1 : 1;
            }
            return NAME_ASCENDING.compare(m1, m2);
        }
    };
    
除了默认顺序，我们可以指定按方法的名字顺序来执行。指定方法是在测试类上加一个注释`FixMethodOrder(MethodSorters.NAME_ASCENDING)`，代码如下：

	@FixMethodOrder(MethodSorters.NAME_ASCENDING)
	public class MyTest {
		
		@Test
		public void test2() {
		...
		}
		
		@Test
		public void test1() {
		…
		}
	}
	
这样执行顺序就是，先`test1`再`test2`。

除了上述两种顺序，还有`JVM`顺序，`JVM`顺序使之按调用反射API的顺序来执行。什么意思？看代码：

	Method[] methods = testClass.getDeclaredMethods();
	
也即是说,通过上面语句获取测试类的方法，返回的顺序就是测试的顺序。这种顺序，会由JVM的实现不同而顺序不同。一般情况下，是一个未明确的但是固定的顺序。

使用时,也是在测试类上加一个注释`FixMethodOrder(MethodSorters.JVM)`,方法如下：

	@FixMethodOrder(MethodSorters.JVM)
	public class MyTest {
		
		@Test
		public void test2() {
		...
		}
		
		@Test
		public void test1() {
		…
		}
	}
	
在我的机器上，上面代码执行顺序是：先`test2`再`test1`。


通过上面的了解，如果你想指定你的测试类中方法的执行顺序，那么最好使用名字顺序(`MethodSorters.NAME_ASCENDING`)，这样最方便最可靠。