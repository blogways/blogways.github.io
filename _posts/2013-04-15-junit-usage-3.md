---
layout: post
category: JUnit
title: JUnit4 使用进阶三
tags: ['Junit4']
author: 唐 治
email: tangzhi@asiainfo-linkage.com
description: JUnit4 结合 Hamcrest 提供了一个全新的断言语法 —— assertThat。程序员可以只使用 assertThat 一个断言语句，结合 Hamcrest 提供的匹配符，就可以表达全部的测试思想

---

<div class="code fl">
    <dl>
    <dt>目录</dt>
    <dd>
    <ol>
        <li><a href="#1">不得不说的`assertThat`方法</a></li>
        <li><a href="#2">还有个`assumeThat`方法</a></li>
    </ol>
    </dd>
    </dl>
</div>

在[JUnit4 使用进阶一]中，我们介绍了JUnit4中断言的基本用法，在本文我们要做深入的介绍。当前JUnit4框架已经引入了 Hamcrest 匹配机制，使得程序员在编写单元测试的 assert 语句时，可以具有更强的可读性，而且也更加灵活。


[JUnit4 使用进阶一]: junit-usage-1.html

### <a name="1"></a>一、不得不说的`assertThat`方法

JUnit4 结合 Hamcrest 提供了一个全新的断言语法——`assertThat`。程序员可以只使用 `assertThat` 一个断言语句，结合 Hamcrest 提供的匹配符，就可以表达全部的测试思想。

其基本语法为：

	assertThat([message,] value, matcher-statement);
	
其中：

1. 第一个参数`message`，为可选参数，为出错是的提示信息；
2. `value`为想要测试的变量；
3. `matcher-statement`为使用 Hamcrest 匹配符来表达的对前面变量所期望的值的声明，如果 value 值与 `matcher-statement` 所表达的期望值相符，则测试成功，否则测试失败。

开发人员可以通过实现 Matcher 接口，定制自己想要的匹配符。当开发人员发现自己的某些测试代码在不同的测试中重复出现，经常被使用，这时用户就可以自定义匹配符，将这些代码绑定在一个断言语句中，从而可以达到减少重复代码并且更加易读的目的。

目前，JUnit提供的匹配符，定义在两个类里面:`org.junit.matchers.JUnitMatchers`和`org.hamcrest.CoreMatchers`。

`org.junit.matchers.JUnitMatchers`提供的匹配符，目前有两个：

	isThrowable(Matcher<T> throwableMatcher);
	isException(Matcher<T> exceptionMatcher);
	
而`org.hamcrest.CoreMatchers`提供的匹配符就很多了，常用的有：

1. 核心

    * anything - 总是匹配,如果你不关心测试下的对象是什么是有用的
    * describedAs - 添加一个定制的失败表述装饰器
    * is - 改进可读性的装饰器 

1. 逻辑

    * allOf - 如果所有匹配器都匹配才匹配, short circuits (很难懂的一个词,意译是短路,感觉不对,就没有翻译)(像 Java &&)
    * anyOf - 如果任何匹配器匹配就匹配, short circuits (像 Java ||)
    * not - 如果包装的匹配器不匹配器时匹配,反之亦然

1. 对象

    * equalTo - 测试对象相等使用Object.equals方法
    * hasToString - 测试Object.toString方法
    * instanceOf, isCompatibleType - 测试类型
    * notNullValue, nullValue - 测试null
    * sameInstance - 测试对象实例

1. Beans

    * hasProperty - 测试JavaBeans属性

1. 集合
    * array - 测试一个数组元素test an array’s elements against an array of matchers
    * hasEntry, hasKey, hasValue - 测试一个Map包含一个实体,键或者值
    * hasItem, hasItems - 测试一个集合包含一个元素
    * hasItemInArray - 测试一个数组包含一个元素

1. 数字
    * closeTo - 测试浮点值接近给定的值
    * greaterThan, greaterThanOrEqualTo, lessThan, lessThanOrEqualTo - 测试次序

1. 文本
    * equalToIgnoringCase - 测试字符串相等忽略大小写
    * equalToIgnoringWhiteSpace - 测试字符串忽略空白
    * containsString, endsWith, startsWith - 测试字符串匹配

	
**如何自定义一个匹配符呢？**

看代码：

    package mytest;
    
    import org.hamcrest.Description;
    import org.hamcrest.Factory;
    import org.hamcrest.Matcher;
    import org.hamcrest.TypeSafeMatcher;
    
    public class IsNotANumber extends TypeSafeMatcher<Double> {
    
      @Override
      public boolean matchesSafely(Double number) {
        return number.isNaN();
      }
    
      public void describeTo(Description description) {
        description.appendText("not a number");
      }
    
      @Factory
      public static <T> Matcher<Double> notANumber() {
        return new IsNotANumber();
      }
    
    }
    
可以这样用于测试：

	@Test
	public void testSquareRootOfMinusOneIsNotANumber() {
  		assertThat(Math.sqrt(-1), is(notANumber()));
	}



### <a name="1"></a>一、还有个`assumeThat`方法


理想情况下，写测试用例的开发人员可以明确的知道所有导致他们所写的测试用例不通过的地方，但是有的时候，这些导致测试用例不通过的地方并不是很容易的被发现，可能隐藏得很深，从而导致开发人员在写测试用例时很难预测到这些因素，而且往往这些因素并不是开发人员当初设计测试用例时真正目的，他们的测试点是希望测试出被测代码中别的出错地方。

比如，一个测试用例运行的 locale（如：Locale.US）与之前开发人员设计该测试用例时所设想的不同（如：Locale.UK），这样会导致测试不通过，但是这可能并不 是开发人员之前设计测试用例时所设想的测试出来的有用的失败结果（测试点并不是此，比如测试的真正目的是想判断函数的返回值是否为 true，返回 false 则测试失败），这时开发人员可以通过编写一些额外的代码来消除这些影响（比如将 locale 作为参数传入到测试用例中，每次运行测试用例时，明确指定 locale），但是花费时间和精力来编写这些不是测试用例根本目的的额外代码其实是种浪费，这时就可以使用 Assumption 假设机制来轻松达到额外代码的目的。编写该测试用例时，首先假设 locale 必须是 Locale.UK，如果运行时 locale 是 Locale.UK，则继续执行该测试用例函数，如果是其它的 locale，则跳过该测试用例函数，执行该测试用例函数以外的代码，这样就不会因为 locale 的问题导致测试出错。

JUnit4 结合 Hamcrest 库提供了 assumeThat 语句，开发人员可以使用其配合匹配符 Matcher 设计所有的假设条件（语法和 assertThat 一样）。

看下面例子：

    import static org.junit.Assume.*
    @Test public void filenameIncludesUsername() {
        assumeThat(File.separatorChar, is('/'));
        assertThat(new User("optimus").configFileName(), is("configfiles/optimus.cfg"));
    }
    
    @Test public void correctBehaviorWhenFilenameIsNull() {
        assumeTrue(bugFixed("13356"));  // bugFixed is not included in JUnit
        assertThat(parse(null), is(new NullDocument()));
    }

JUnit自带的运行器(Runner)会忽略那些假设不成立的测试数据，而自定义运行器的处理逻辑可能会不一样。

上面这个例子，也可以结合[进阶四]中的理论测试来一起理解。

另外，假设也可以用在`@Before` 或者 `@BeforeClass`这两个步骤里面。

[进阶四]: junit-usage-4.html