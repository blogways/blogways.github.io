---
layout: post
title: Spring NoSuchBeanDefinitionException
tags: ['Spring', 'Bean', 'Exception']
author: Jacky
email: shenyj5@asiainfo.com
image:
description: 对于 Java 开发的 web 项目，Spring 成了小伙伴们的首选，几乎成了 JavaEE 的标配，在开发、测试的过程中免不了会碰到很多相关的错误，其中比较常见的一个错误就是  NoSuchBeanDefinitionException，下面来讨论一下常见的几种情况， 本文着重介绍 bootstrap 项目注解实例化 Bean，至于 xml 配置部分逻辑性比较好查，应该更容易定位问题，在这里就不介绍了。
---
对于 Java 开发的 web 项目，Spring 成了小伙伴们的首选，几乎成了 JavaEE 的标配，在开发、测试的过程中免不了会碰到很多相关的错误，其中比较常见的一个错误就是  NoSuchBeanDefinitionException，下面来讨论一下常见的几种情况， 本文着重介绍 bootstrap 项目注解实例化 Bean，至于 xml 配置部分逻辑性比较好查，应该更容易定位问题，在这里就不介绍了。
### 1. 概述

在这篇文章中，我们讨论一下 Spring `BeanFactory` 在试图创建一个未在 Spring 上下文中定义的 Bean 时抛出的常见的异常 `org.springframework.beans.factory.NoSuchBeanDefinitionException`。

我们将在这里讨论下导致这个问题的可能的原因以及可用的解决方案。

### 2. Cause: No qualifying bean of type […] found for dependency

导致这个异常的最常见的原因是企图注入一个未被定义的 bean。例如－在 BeanA 中注入 BeanB：
	@Component
	public class BeanA {
	
	    @Autowired
	    private BeanB dependency;
	    ...
	}

但如果 BeanB 没有在 Spring 的上下文中定义依赖关系，bootstrap 进程会终止并抛出 `NoSuchBeanDefinitionException` 异常：

	org.springframework.beans.factory.NoSuchBeanDefinitionException: 
    No qualifying bean of type [org.baeldung.packageB.BeanB] found for dependency: 
    expected at least 1 bean which qualifies as autowire candidate for this dependency. 
    Dependency annotations: {@org.springframework.beans.factory.annotation.Autowired(required=true)}

Spring 已经明确指出：“至少需要一个 bean 作为 autowire 依赖注入”

一个原因 BeanB 可能不在上下文中，需要 bean 在 classpath 扫描时自动加载，并且被成功注解为其中的一个 bean (@Component, @Repository, @Service, @Controller, etc)，那么很可能 BeanB 所在的包没有被 Spring 扫描到：

	package org.baeldung.packageB;
	@Component
	public class BeanB { ...}
	While the classpath scanning may be configured as follows:
	
	@Configuration
	@ComponentScan("org.baeldung.packageA")
	public class ContextWithJavaConfig {
	    ...
	}

如果 bean 所在的目录没有配置扫描，那么 BeanB 也就不会定义在当前的 Spring 上下文中。

### 3. Cause: No qualifying bean of type […] is defined

另外一种情况就是上下文中存在重复的 bean 定义，不唯一。例如，假如有一个接口 `IBeanB` 被两个 bean (`BeanB1`和`BeanB2`) 实现：

	@Component
	public class BeanB1 implements IBeanB {
	    //
	}
	@Component
	public class BeanB2 implements IBeanB {
	    //
	}

当 BeanA 依赖注入这个接口时，Spring 不知道到底注入哪个实现：

	@Component
	public class BeanA {
	
	    @Autowired
	    private IBeanB dependency;
	    ...
	}

结果是 `BeanFactory` 再次抛出了异常：

	Caused by: org.springframework.beans.factory.NoUniqueBeanDefinitionException: 
	No qualifying bean of type [org.baeldung.packageB.IBeanB] is defined: 
	expected single matching bean but found 2: beanB1,beanB2
	Similarly, Spring clearly indicates the reason for the wiring failure: “expected single matching bean but found 2″.

但是注意，这次抛出的异常不是 `NoSuchBeanDefinitionException`，而是它的子类 `NoUniqueBeanDefinitionException`。这个新的异常在 Spring 3.2.1 有介绍，具体的原因就是在上下文中存在重复的 bean 定义。

如果不做指定，就会报如下的异常：

	Caused by: org.springframework.beans.factory.NoSuchBeanDefinitionException: 
	No qualifying bean of type [org.baeldung.packageB.IBeanB] is defined: 
	expected single matching bean but found 2: beanB1,beanB2
	One solution to this problem is to use the @Qualifier annotation to specify exactly the name of the bean we want to wire:

-

	@Component
	public class BeanA {
	
	    @Autowired
	    @Qualifier("beanB2")
	    private IBeanB dependency;
	    ...
	}

通过指定 `Qualifier` 具体的注入 bean，Spring 将能决定使用哪个实现类来注入。

### 4. Cause: No Bean Named […] is defined

当 Spring 的上下文中不存在指定名称的 bean 时同样会抛出 `NoSuchBeanDefinitionException` 异常：

	@Component
	public class BeanA implements InitializingBean {
	
	    @Autowired
	    private ApplicationContext context;
	
	    @Override
	    public void afterPropertiesSet() {
	        context.getBean("someBeanName");
	    }
	}

在这个例子中，不存在 `someBeanName` 名称定义的 bean 将会导致下面的异常： 

	Caused by: org.springframework.beans.factory.NoSuchBeanDefinitionException: 
	No bean named 'someBeanName' is defined
	Again, Spring clearly and concisely indicates the reason for the failure: “No bean named X is defined“.

### 5. Cause: Proxied Beans

当上下文中一个 bean 使用 JDK 的动态代理机制代理时，那么这个代理类不需要扩展目标 bean （然而它将实现相同的接口）

正因为如此，如果一个接口被注入，它将被正确接入。然而如果一个 bean 被实际类注入，Spring  将找不到匹配的类的 bean 定义，由于代理类实际上不扩展该类。

一个很常见的代理是 Spring 的事务支持，即被 `@Transactional` 注解的 bean。

例如，如果 ServiceA 注入 ServiceB，两个服务都有事务，通过类定义注入将无法工作：

	@Service
	@Transactional
	public class ServiceA implements IServiceA{
	
	    @Autowired
	    private ServiceB serviceB;
	    ...
	}

	@Service
	@Transactional
	public class ServiceB implements IServiceB{
	    ...
	}

同样的两个服务，这次通过接口注入就 OK：

	@Service
	@Transactional
	public class ServiceA implements IServiceA{
	
	    @Autowired
	    private IServiceB serviceB;
	    ...
	}

	@Service
	@Transactional
	public class ServiceB implements IServiceB{
	    ...
	}

### 6. 结论

本文讨论了几种可能导致 `NoSuchBeanDefinitionException` 的情况，重点是如何在实践中解决这些异常。
