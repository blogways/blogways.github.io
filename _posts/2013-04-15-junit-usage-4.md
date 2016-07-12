---
layout: post
category: JUnit
title: JUnit4 使用进阶四
tags: ['Junit4']
author: 唐 治
email: tangzhi@asiainfo-linkage.com
description: 本文，我们将向大家介绍JUnit4框架提供的几个非常实用的运行器(Runner)：Suite、Parameterized、Categories、Enclosed 和 Theories。

---

<div class="code fl">
    <dl>
    <dt>目录</dt>
    <dd>
    <ol>
        <li><a href="#1">Suite测试</a></li>
        <li><a href="#2">Parameterized测试</a></li>
        <li><a href="#3">Categories测试</a></li>
        <li><a href="#4">Theories测试</a></li>
        <li><a href="#5">第三方的Runner</a></li>
        <li><a href="#6">小结</a></li>
    </ol>
    </dd>
    </dl>
</div>

在[进阶一]，我们介绍了默认的JUnit4默认的运行器是`JUnit4`。本文，我们将继续向大家介绍JUnit4框架提供的另外几个非常实用的运行器(Runner)：`Suite`、`Parameterized`、`Categories`、`Enclosed`和`Theories`。

在测试中，可以使用注释`@RunWith`来指定这些运行器，比如:

	@RunWith(Parameterized.class)
	public class MyTest { …
	
好吧，下面我们来一一介绍吧！

[进阶一]: junit-usage-1.html

### <a name="1"></a>一、Suite测试

进行`Suite`测试可以将多个待测试的类，打包(Suite)一起测试。在入口测试类上加两个注释:

	@RunWith(Suite.class)
	@SuiteClasses(TestClass1.class, ...)

当你运行这个入口测试类，框架就会把打包在一起的所有待测试类都测试一遍。

	import org.junit.runner.RunWith;
	import org.junit.runners.Suite;

	@RunWith(Suite.class)
	@Suite.SuiteClasses({
  		TestFeatureLogin.class,
		TestFeatureLogout.class,
  		TestFeatureNavigate.class,
  		TestFeatureUpdate.class
	})

	public class FeatureTestSuite {
	  // the class remains empty,
	  // used only as a holder for the above annotations
	}
	
框架运行那些待测试的类，是按他们在`@Suite.SuiteClasses`中罗列的顺序开始测试。


### <a name="2"></a>二、Parameterized测试

很多时候，需要用很多测试数据进行多次测试。怎么办？通过复制粘贴代码来实现？累...

针对这种情况，JUnit4框架提供`Parameterized`测试器(`Runner`)来实现这种需求。

看下面这个例子:

    package mytest;
    
    import static org.junit.Assert.*;
    
    import java.util.Arrays;
    import org.junit.Test;
    import org.junit.runner.RunWith;
    import org.junit.runners.Parameterized;
    import org.junit.runners.Parameterized.Parameters;
    
    @RunWith(Parameterized.class)
    public class FibonacciTest {
        @Parameters
        public static Iterable<Object[]> data() {
            return Arrays.asList(new Object[][] { { 0, 0 }, { 1, 1 }, { 2, 1 },
                    { 3, 2 }, { 4, 3 }, { 5, 5 }, { 6, 8 } });
        }
    
        private int fInput;
    
        private int fExpected;
    
        public FibonacciTest(int input, int expected) {
            fInput= input;
            fExpected= expected;
        }
        @Test
        public void test() {
            assertEquals(fExpected, Fibonacci.compute(fInput));
        }
    }

很简单，很方便是吧！

1. 用`@Parameters`来标记，我们为测试准备的数据
2. 定义一个构造函数，构造函数的参数顺序和准备数据的顺序一致
3. 写你需要的测试方法，用`@Test`注释
4. 运行起来，每个数据都会测试一遍

如果，你不习惯去写那样一个构造函数，也可以用下面的方法：

    @RunWith(Parameterized.class)
    public class FibonacciTest {
        @Parameters
        public static Iterable<Object[]> data() {
            return Arrays.asList(new Object[][] { { 0, 0 }, { 1, 1 }, { 2, 2 },
                    { 3, 2 }, { 4, 3 }, { 5, 5 }, { 6, 8 } });
        }
    
        @Parameter(0)
        public int fInput;
    
        @Parameter(1)
        public int fExpected;
    
        @Test
        public void test() {
            assertEquals(fExpected, Fibonacci.compute(fInput));
        }
    }

运行起来是不是很爽！

可能，你是一个完美主义者，对运行后报错信息不是很满意，现在报错时反馈的信息可能是这样：

	test[3](mytest.FibonacciTest): expected:<2> but was:<0>
	
你想报错时显示测试的输入数据，希望报错类似如下：

	test[the 3 test, input:3,2](mytest.FibonacciTest): expected:<2> but was:<0>

要实现这点很简单，给`@Parameters`加个参数`name`，整个代码如下：

    package mytest;
    
    import static org.junit.Assert.*;
    
    import java.util.Arrays;
    import org.junit.Test;
    import org.junit.runner.RunWith;
    import org.junit.runners.Parameterized;
    import org.junit.runners.Parameterized.Parameters;
    
    @RunWith(Parameterized.class)
    public class FibonacciTest {
        @Parameters(name="the {index} test, input:{0},{1}")
        public static Iterable<Object[]> data() {
            return Arrays.asList(new Object[][] { { 0, 0 }, { 1, 1 }, { 2, 1 },
                    { 3, 2 }, { 4, 3 }, { 5, 5 }, { 6, 8 } });
        }
    
        private int fInput;
    
        private int fExpected;
    
        public FibonacciTest(int input, int expected) {
            fInput= input;
            fExpected= expected;
        }
        @Test
        public void test() {
            assertEquals(fExpected, Fibonacci.compute(fInput));
        }
    }
    
在这里需要稍微解释一下`name`中的几个参数的含义：

	{index} 表示序号，测试数据在整个数据列表中的序号
	{0} 表示第一个参数
	{1} 表示第二个参数
	...
	{n} 表示第n+1个参数

### <a name="3"></a>三、Categories测试

一个测试类里面包含很多待测试的方法，很多时候，我们需要把这些待测试的方法分类，某些时候测试某类方法，那么需要怎么做呢？

看下面这个例子：

    public interface FastTests { /* category marker */ }
    public interface SlowTests { /* category marker */ }
    
    public class A {
      @Test
      public void a() {
        fail();
      }
    
      @Category(SlowTests.class)
      @Test
      public void b() {
      }
    }
    
    @Category({SlowTests.class, FastTests.class})
    public class B {
      @Test
      public void c() {
    
      }
    }
    
    @RunWith(Categories.class)
    @IncludeCategory(SlowTests.class)
    @SuiteClasses( { A.class, B.class }) // Note that Categories is a kind of Suite
    public class SlowTestSuite {
      // Will run A.b and B.c, but not A.a
    }
    
在上面的例子中，将会测试`A.b`和`B.c`两个方法，不会测试`A.a`。

再看下面：
	
	@RunWith(Categories.class)
	@IncludeCategory(SlowTests.class)
	@ExcludeCategory(FastTests.class)
	@SuiteClasses( { A.class, B.class }) // Note that Categories is a kind of Suite
	public class SlowTestSuite {
	  // Will run A.b, but not A.a or B.c
	}
	
这次，只会运行`A.b`，而不会运行`A.a`和`B.c`。


### <a name="4"></a>四、Theories测试

结合前面[进阶三][3]中介绍的假设(assumeThat)，我们可以对大量的测试数据做一些理论测试。

先看例子：

    @RunWith(Theories.class)
    public class UserTest {
        @DataPoint
        public static String GOOD_USERNAME = "optimus";
        @DataPoint
        public static String USERNAME_WITH_SLASH = "optimus/prime";
    
        @Theory
        public void filenameIncludesUsername(String username) {
            assumeThat(username, not(containsString("/")));
            assertThat(new User(username).configFileName(), containsString(username));
        }
    }
    
是不是看得有点苦涩难懂，没关系，我来给你一一讲解：

1. `@RunWith(Theories.class)` 是告诉框架，下面的测试类将要做理论测试；
2. `@DataPoint` 告诉框架，标注的这些数据都是准备用来测试的数据；
3. `@Theory`标注的方法，是需要进行理论测试的方法；
4. `assumeThat` 是对待测试的数据(`@DataPoint`标注的数据)进行检查，符合的数据继续往下走，不符合的数据忽略掉.如果，所有的数据都不符合，那么`@Theory`标注的测试，则算失败(fail)。

关于理论测试，也可以扩展更多的功能，网上已经有人做了一些扩展，比如[这里](http://web.archive.org/web/20071012143326/popper.tigris.org/tutorial.html).


[3]: junit-usage-3.html

### <a name="5"></a>五、第三方的Runner

我们也可以使用`@RunWith`来标注一些第三方的Runner，比如：

1. SpringJUnit4ClassRunner

	* [http://static.springsource.org/spring/docs/3.0.x/javadoc-api/org/springframework/test/context/junit4/SpringJUnit4ClassRunner.html](http://static.springsource.org/spring/docs/3.0.x/javadoc-api/org/springframework/test/context/junit4/SpringJUnit4ClassRunner.html)
 
1. MockitoJUnitRunner
	* [http://docs.mockito.googlecode.com/hg/latest/org/mockito/runners/MockitoJUnitRunner.html](http://docs.mockito.googlecode.com/hg/latest/org/mockito/runners/MockitoJUnitRunner.html)


### <a name="6"></a>六、小结

让我们回顾一下，本文介绍了JUnit4里面内置的几个特色运行器（Runner），包括：将多个测试类打包一起测试的Suite、可以实现参数化测试的Parameterized、可以实现分类测试的Categories、可以实现理论测试的Theories，还有网络上的一些第三方Runner。

根据实际情况的需要，合理的利用这些Runner，可以达到事半功倍的效果。
