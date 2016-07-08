---
layout: post
category: JUnit
title: JUnit4 使用进阶一
tags: ['Junit4']
author: 唐 治
email: tangzhi@asiainfo-linkage.com
description: JUnit4 使用进阶一，对JUnit4的下载安装、基本测试方法及运行，配合实例进行基础介绍。帮助读者看完之后，就可以将JUnit4运用到单元测试中去。
---

<div class="code fl">
    <dl>
    <dt>目录</dt>
    <dd>
    <ol>
        <li><a href="#1">简介</a></li>
        <li><a href="#2">下载安装</a></li>
        <li><a href="#3">一个简单的模版</a></li>
        <li><a href="#4">运行测试</a></li>
        <li><a href="#5">JUnit4的核心之一是断言</a></li>
        <li><a href="#6">小结</a></li>
    </ol>
    </dd>
    </dl>
</div>

### <a name="1"></a>一、简介

JUnit是一个Java语言的单元测试框架。它由Kent Beck和Erich Gamma建立，逐渐成为源于Kent Beck的sUnit的xUnit家族中为最成功的一个。来自JUnit的体验对测试驱动开发是很重要的，所以一些 JUnit知识经常 和测试驱动开发的讨论融合在一起。可以参考Kent Beck的 [《Test-Driven Development: By Example》][0]一书（有中文版和影印版）。

本文，对JUnit4的下载安装、基本测试方法及运行，配合实例进行基础介绍。帮助读者看完之后，就可以将JUnit4运用到单元测试中去。而JUnit4的更多功能可以参考后续的[JUnit4使用进阶二][1]。

[0]: http://book.douban.com/subject/1771049/


### <a name="2"></a>二、下载安装

JUnit当前版本是4.11，如果，你的工程是使用Maven进行管理构建，那么只需要在工程的pom.xml文件中添加如下依赖信息：

	<dependency>
  		<groupId>junit</groupId>
  		<artifactId>junit</artifactId>
  		<version>4.11</version>
  		<scope>test</scope>
	</dependency>
	
否则，在你的测试classpath中放置下面两个jar:`junit.jar`和`hamcrest-core.jar`，这两个jar可以在[这里](http://search.maven.org/)找到并下载。

### <a name="3"></a>三、一个简单的模版

	package com.example.foo;

	import static org.junit.Assert.assertEquals;

	import org.junit.Test;
	import org.junit.Ignore;
	import org.junit.runner.RunWith;
	import org.junit.runners.JUnit4;

	/**
	 * Tests for {@link Foo}.
	 *
	 * @author user@example.com (John Doe)
	 */
	@RunWith(JUnit4.class)
	public class FooTest {

    	@Test
    	public void thisAlwaysPasses() {
    	}

    	@Test
    	@Ignore
    	public void thisIsIgnored() {
    	}
	}
	
这个模版是不是很简单！

* 需要测试的方法，只需要通过`@Test`标注出来就可以了。

* 测试类只需要添加`@RunWith`注释，不再需要继承`junit.framework.TestCase`这个父类了。

当然了，JUnit4还提供了很多特色功能，后面我们会一一介绍。

### <a name="4"></a>四、运行测试
	
* 在命令行，对写好的测试类，进行测试很简单，只需要下面一个命令就ok了：	

		java -cp .:/usr/share/java/junit.jar org.junit.runner.JUnitCore [test class name]
	
* 在IDE里面进行测试就更简单了，`Netbeans`, `Eclipse` 和 `IntelliJ Idea`都内置了图形化的测试运行器。

测试类如何运行，是由`@RunWith`注释来决定。JUnit4当前版本的默认基本测试方式是`JUnit4.class`。除此之外，还有一些其他特殊的，我们将在[JUnit4 使用进阶四][3]中进行介绍。


### <a name="5"></a>五、JUnit4的核心之一是断言

JUnit4框架主要是通过断言来判断运行结果正确与否，针对Java的原生类型(long,boolean,float...)或者Objects或者数组，JUnit都提供了对应的断言方法。

下面，我们先来看个例子：

    import static org.hamcrest.CoreMatchers.allOf;
    import static org.hamcrest.CoreMatchers.anyOf;
    import static org.hamcrest.CoreMatchers.equalTo;
    import static org.hamcrest.CoreMatchers.not;
    import static org.hamcrest.CoreMatchers.sameInstance;
    import static org.hamcrest.CoreMatchers.startsWith;
    import static org.junit.Assert.assertThat;
    import static org.junit.matchers.JUnitMatchers.both;
    import static org.junit.matchers.JUnitMatchers.containsString;
    import static org.junit.matchers.JUnitMatchers.everyItem;
    import static org.junit.matchers.JUnitMatchers.hasItems;
    
    import java.util.Arrays;
    
    import org.hamcrest.core.CombinableMatcher;
    import org.junit.Test;
    
    public class AssertTests {
      @Test
      public void testAssertArrayEquals() {
        byte[] expected = "trial".getBytes();
        byte[] actual = "trial".getBytes();
        org.junit.Assert.assertArrayEquals("failure - byte arrays not same", expected, actual);
      }
    
      @Test
      public void testAssertEquals() {
        org.junit.Assert.assertEquals("failure - strings not same", 5l, 5l);
      }
    
      @Test
      public void testAssertFalse() {
        org.junit.Assert.assertFalse("failure - should be false", false);
      }
    
      @Test
      public void testAssertNotNull() {
        org.junit.Assert.assertNotNull("should not be null", new Object());
      }
    
      @Test
      public void testAssertNotSame() {
        org.junit.Assert.assertNotSame("should not be same Object", new Object(), new Object());
      }
    
      @Test
      public void testAssertNull() {
        org.junit.Assert.assertNull("should be null", null);
      }
    
      @Test
      public void testAssertSame() {
        Integer aNumber = Integer.valueOf(768);
        org.junit.Assert.assertSame("should be same", aNumber, aNumber);
      }
    
      // JUnit Matchers assertThat
      @Test
      public void testAssertThatBothContainsString() {
        org.junit.Assert.assertThat("albumen", both(containsString("a")).and(containsString("b")));
      }
    
      @Test
      public void testAssertThathasItemsContainsString() {
        org.junit.Assert.assertThat(Arrays.asList("one", "two", "three"), hasItems("one", "three"));
      }
    
      @Test
      public void testAssertThatEveryItemContainsString() {
        org.junit.Assert.assertThat(Arrays.asList(new String[] { "fun", "ban", "net" }), everyItem(containsString("n")));
      }
    
      // Core Hamcrest Matchers with assertThat
      @Test
      public void testAssertThatHamcrestCoreMatchers() {
        assertThat("good", allOf(equalTo("good"), startsWith("good")));
        assertThat("good", not(allOf(equalTo("bad"), equalTo("good"))));
        assertThat("good", anyOf(equalTo("bad"), equalTo("good")));
        assertThat(7, not(CombinableMatcher.<Integer> either(equalTo(3)).or(equalTo(4))));
        assertThat(new Object(), not(sameInstance(new Object())));
      }
    }


**注意：**

1. `assertEquals`和`assertSame` 的区别在于，前者是调用`期待值`的`equals`方法来判断`真实值`(`expected.equals(actual)`)，而后者是判断`期待值`和`真实值`是否是同一个对象(`expected == actual`)。
2. 例子中，这样调用`org.junit.Assert.assertEquals("failure - strings not same", 5l, 5l);`是不是觉得有点累，没关系，我们可以通过JDK1.5中的静态导入(`import static`)来简化这一切，看下面的代码。

简化后的例子：

    package tangzhi.mytest;
    
    import static org.hamcrest.CoreMatchers.allOf;
    import static org.hamcrest.CoreMatchers.anyOf;
    import static org.hamcrest.CoreMatchers.equalTo;
    import static org.hamcrest.CoreMatchers.not;
    import static org.hamcrest.CoreMatchers.sameInstance;
    import static org.hamcrest.CoreMatchers.startsWith;
    import static org.junit.Assert.assertThat;
    import static org.junit.matchers.JUnitMatchers.both;
    import static org.junit.matchers.JUnitMatchers.containsString;
    import static org.junit.matchers.JUnitMatchers.everyItem;
    import static org.junit.matchers.JUnitMatchers.hasItems;
    
    import static org.junit.Assert.*;
        
    import java.util.Arrays;
    
    import org.hamcrest.core.CombinableMatcher;
    import org.junit.Test;
    
    public class AppTest {
      @Test
      public void testAssertArrayEquals() {
        byte[] expected = "trial".getBytes();
        byte[] actual = "trial".getBytes();
        assertArrayEquals("failure - byte arrays not same", expected, actual);
      }
    
      @Test
      public void testAssertEquals() {
        assertEquals("failure - strings not same", 5l, 5l);
      }
    
      @Test
      public void testAssertFalse() {
        assertFalse("failure - should be false", false);
      }
    
      @Test
      public void testAssertNotNull() {
        assertNotNull("should not be null", new Object());
      }
    
      @Test
      public void testAssertNotSame() {
        assertNotSame("should not be same Object", new Object(), new Object());
      }
    
      @Test
      public void testAssertNull() {
        assertNull("should be null", null);
      }
    
      @Test
      public void testAssertSame() {
        Integer aNumber = Integer.valueOf(768);
        assertSame("should be same", aNumber, aNumber);
      }
    
      // JUnit Matchers assertThat
      @Test
      public void testAssertThatBothContainsString() {
        assertThat("albumen", both(containsString("a")).and(containsString("b")));
      }
    
      @Test
      public void testAssertThathasItemsContainsString() {
        assertThat(Arrays.asList("one", "two", "three"), hasItems("one", "three"));
      }
    
      @Test
      public void testAssertThatEveryItemContainsString() {
        assertThat(Arrays.asList(new String[] { "fun", "ban", "net" }), everyItem(containsString("n")));
      }
    
      // Core Hamcrest Matchers with assertThat
      @Test
      public void testAssertThatHamcrestCoreMatchers() {
        assertThat("good", allOf(equalTo("good"), startsWith("good")));
        assertThat("good", not(allOf(equalTo("bad"), equalTo("good"))));
        assertThat("good", anyOf(equalTo("bad"), equalTo("good")));
        assertThat(7, not(CombinableMatcher.<Integer> either(equalTo(3)).or(equalTo(4))));
        assertThat(new Object(), not(sameInstance(new Object())));
      }
    }


在上面的代码中，我们静态导入了`import static org.junit.Assert.*;`后，在测试类中就可以直接使用`assertEquals`这些方法了。是不是很方便！


**常用的断言方法有：**

    assertTrue([message ,] condition);
    assertFalse([message ,] condition);
    assertEquals([message ,] expected, actual);
    assertNotEquals([message ,] first, second);
    assertArrayEquals([message ,] expecteds, actuals);
    assertNotNull([message ,] object);
    assertNull([message ,] object);
    assertSame([message ,] expected, actual);
    assertNotSame([message ,] unexpected, actual);
    assertThat([message ,] actual, matcher);
    

**从上面的列表可以看出：**

1. 大部分断言方法的参数顺序都是:`[Message] 期待值  真实值`，第一个参数是个可选字符串，出错时的描述信息。第二个参数是期待值，第三个参数是真实值。

1. 只有一个断言方法`assertThat`的参数顺序例外：可选的出错提示信息、真实值和一个`Matcher`对象。它参数中的期待值与真实值的顺序，与其他断言方法的参数顺序正好相反。

这个`assertThat`方法是断言中的神器，后面我们会在[进阶三][2]介绍！敬请期待吧！

### <a name="6"></a>六、小结

前面我们介绍了JUnit4的基本知识。至此，你已经可以使用JUnit4进行代码测试了。如果你想知道更多信息，可以继续看看[JUnit 使用进阶二][1]。

[1]: junit-usage-2.html
[2]: junit-usage-3.html
[3]: junit-usage-4.html
