---
layout: post
category: JUnit
title: JUnit4 使用进阶二
tags: ['Junit4']
author: 唐 治
email: tangzhi@asiainfo-linkage.com
description: 在《JUnit4 使用进阶一》中，我们介绍了JUnit4的下载安装，简单调用及运行测试方法，在本文中将继续对JUnit4提供的一些常用功能（忽略某个测试、对异常进行测试、设置超时时间、测试前后及顺序）进行介绍。

---

<div class="code fl">
    <dl>
    <dt>目录</dt>
    <dd>
    <ol>
        <li><a href="#1">忽略某个测试</a></li>
        <li><a href="#2">对异常的测试</a></li>
        <li><a href="#3">测试的超时时间</a></li>
        <li><a href="#4">测试前后</a></li>
        <li><a href="#5">小结</a></li>
    </ol>
    </dd>
    </dl>
</div>

在[JUnit4 使用进阶一]中，我们介绍了JUnit4的下载安装，简单调用及运行测试方法，在本文中将继续对JUnit4提供的一些常用功能（忽略某个测试、对异常进行测试、设置超时时间、测试前后及顺序）进行介绍。

[JUnit4 使用进阶一]: junit-usage-1.html

### <a name="1"></a>一、忽略某个测试

在测试过程中，我们可能需要临时禁止某个方法或者某个测试类的测试，比如：由于没完全准备好或者平台差异。这时，我们需要有一个方法可以告诉JUnit4框架，不要对这些方法或者类进行测试。

基于这个需要，JUnit4提供了一个注释`@Ignore`。

举个例子：

	@Ignore 
	@Test 
	public void something() { ...
	
`@Ignore`也可以添加一个可选的字符串参数，来说明为什么要忽略这个测试，如下：

	@Ignore("还没准备好") 
	@Test 
	public void something() { ...

当然，`@Ignore`也可以直接作用在一个测试类上，如下：

	@Ignore 
	public class IgnoreMe {
		@Test 
		public void test1() { ... }
		
		@Test 
		public void test2() { ... }
	}


### <a name="2"></a>二、对异常的测试

程序是否会按照我们所期待的，在运行过程中抛出异常呢？比如下面这个语句：

	new ArrayList<Object>().get(0);
	
上面的代码将会抛出`IndexOutOfBoundsException`异常，`@Test`注释有一个可选参数`expected`,这个参数的取值是`Throwable`的子类。如果我们想判断上面的代码是否抛出正确的异常，测试代码可以这样写：

    @Test(expected= IndexOutOfBoundsException.class) 
    public void empty() { 
    	new ArrayList<Object>().get(0); 
    }

JUnit4框架会对上面`expected`参数值进行检查，被测试的方法中如果抛出`IndexOutOfBoundsException`异常，那么测试就通过了。

一般，对异常的简单的测试，使用上面的方法就够了，但是有时，我们需要检查异常所包含的提示信息，那么我们就需要使用`ExpectedException`规则，来帮助我们实现了。

看下面这个例子：

    @Rule
    public ExpectedException thrown = ExpectedException.none();

    @Test
    public void shouldTestExceptionMessage() throws IndexOutOfBoundsException {
        List<Object> list = new ArrayList<Object>();

        thrown.expect(IndexOutOfBoundsException.class);
        thrown.expectMessage("Index: 0, Size: 0");
        list.get(0); // execution will never get past this line
    }
  
**说明:**  

1. 利用`@Rule`，我们可以对异常的提示信息进行检查。
1. `expectMessage`方法还支持使用`CoreMatchers.containsString`来进行提示信息的匹配判断,如下：

		thrown.expectMessage(CoreMatchers.containsString("Size: 0"));


### <a name="3"></a>三、测试的超时时间

有时，我们需要控制程序的执行时间，当超出预设的超时时间，那么就判断测试失败。JUnit4框架也提供了这种检查，看下面例子：

    @Test(timeout=1000)
    public void testWithTimeout() {
      ...
    }

通过`@Test`注释的一个可选参数`timeout`的数值(单位毫秒)，我们可以告诉框架，预设的超时时间是多少。当测试运行中，执行时间超出了这个预设值，框架就会抛出`TimeoutException`异常，标记这个测试失败了。

我们也可以使用规则，来为整个测试类里面所有测试方法设置一个统一的超时时间，如下：

    public class HasGlobalTimeout {
        public static String log;
    
        @Rule
        public Timeout globalTimeout = new Timeout(10000); // 10 seconds max per method tested
    
        @Test
        public void testInfiniteLoop1() {
            log += "ran1";
            for (;;) {
            }
        }
    
        @Test
        public void testInfiniteLoop2() {
            log += "ran2";
            for (;;) {
            }
        }
    }


### <a name="4"></a>四、测试前后

每个测试之前，我们可能需要做一些数据准备操作，再每个测试之后，我们可能需要将测试数据进行恢复。那么，JUnit4框架如何提供什么样的方式，来实现我们的需求呢？

没错，JUnit4提供了四个注释，来标注测试类中的某些方法，是用来做测试前后的准备或者恢复操作的。这四个注释分别为:`@Before`、`@After`、`@BeforeClass`和`@AfterClass`。

看下面这个例子：


    package test;
    
    import java.io.Closeable;
    import java.io.IOException;
    
    import org.junit.After;
    import org.junit.AfterClass;
    import org.junit.Before;
    import org.junit.BeforeClass;
    import org.junit.Test;
    
    public class TestFixturesExample {
      static class ExpensiveManagedResource implements Closeable {
        @Override
        public void close() throws IOException {}
      }
    
      static class ManagedResource implements Closeable {
        @Override
        public void close() throws IOException {}
      }
    
      @BeforeClass
      public static void setUpClass() {
        System.out.println("@BeforeClass setUpClass");
        MyExpensiveManagedResource = new ExpensiveManagedResource();
      }
    
      @AfterClass
      public static void tearDownClass() throws IOException {
        System.out.println("@AfterClass tearDownClass");
        MyExpensiveManagedResource.close();
        MyExpensiveManagedResource = null;
      }
    
      private ManagedResource myManagedResource;
      private static ExpensiveManagedResource MyExpensiveManagedResource;
    
      private void println(String string) {
        System.out.println(string);
      }
    
      @Before
      public void setUp() {
        this.println("@Before setUp");
        this.myManagedResource = new ManagedResource();
      }
    
      @After
      public void tearDown() throws IOException {
        this.println("@After tearDown");
        this.myManagedResource.close();
        this.myManagedResource = null;
      }
    
      @Test
      public void test1() {
        this.println("@Test test1()");
      }
    
      @Test
      public void test2() {
        this.println("@Test test2()");
      }
    }


这个例子的执行结果，如下：


    @BeforeClass setUpClass
    @Before setUp
    @Test test2()
    @After tearDown
    @Before setUp
    @Test test1()
    @After tearDown
    @AfterClass tearDownClass


**说明：**

1. `@Before`和`@After`定义的方法，会在每个测试方法运行的前后执行一遍；
2. `@BeforeClass`和`@AfterClass`定义的方法，会在整个测试类运行的开始和结束执行且仅执行一遍。
3. 一般来说，`@Before`、`@After`、`@BeforeClass`和`@AfterClass`提供的方法，是在某个测试类里面所使用的，无法被另外的测试类所公用，如果你想写一个类来处理数据，并被几个测试类所使用，那么你可以使用规则来实现。关于这一点，你可以看看我们后面的教程。


### <a name="5"></a>五、小结

在本文中，我们进一步介绍了JUnit4框架提供的一些功能，在继续的教程中，我们将介绍几个有特色的运行器，来提高测试效率。

