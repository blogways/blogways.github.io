---
layout: post
title: Spring中Bean的一生
category: ['Spring']
tags: ['Spring']
author: 景阳
email: jyjsjd@hotmail.com
description: Spring中Bean的一生
---

![bean.png](/images/jyjsjd/bean.png)

### 一、Bean 实例化策略——BeanWrapper
容器通过策略模式决定以何种方式实例化 Bean，通常通过*反射*或*CGLIB*。实例化策略模式的接口是 `InstantiationStrategy`。

* SimpleInstantiationStrategy：通过反射实例化对象，但**不支持***方法注入式*的对象实例化。
* CglibSubclassingInstantiationStrategy：以 CGLIB 动态字节码方式实现实例化，并不是直接返回对象实例，而是对象的包装，返回 `BeanWrapper` 实例。

`BeanWrapper` 的实现类 `BeanWrapperImpl` 同时直接或间接地继承了 `PropertyEditorRegistry` 和 `TypeConverter`，可以用到 `CustomEditorConfigurer` 转换类型。

![beanwrapper.png](/images/jyjsjd/beanwrapper.png)

### 二、Aware 接口
当对象实例化完成并且相关属性和依赖设置完成之后，Spring 容器会检查当前实例对象是否实现了一系列 *Aware* 接口，并把 Aware 接口定义的依赖注入进去。

#### 1、BeanFactory
* BeanNameAware：将该对象实例的 bean 定义对应的 *BeanName* 设置到当前对象实例。
* BeanClassLoaderAware：将对应加载当前 bean 的 *ClassLoader* 注入到当前实例。
* BeanFactoryAware：BeanFactory 会将自身注入到当前对象。

#### 2、ApplicationContext
以下所有都会注入 *ApplicationContext* 容器本身：
* ResourceLoaderAware
* ApplicationEventPublisherware
* MessageSourceAware
* ApplicationContextAware

### 三、BeanPostProcessor
BeanPostProcessor 存在于对象*实例化*阶段。接口定义了两个方法，分别在不同的时机执行：

```java
public interface BeanPostProcessor {
  // 前置处理
	Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException;
  // 后置处理
	Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException;
}
```

前文所述的 ApplicationContext 的 *Aware 接口*实际上就是利用了 BeanPostProcessor 的方式进行处理。

ApplicationContext 中对象实例化过程走到 BeanPostProcessor 前置处理时，容器会检测注册的 `ApplicationContextAwareProcessor` （实现了 BeanPostProcessor），调用 `postProcessBeforeInitialization`，检查并设置 Aware 相关依赖。

### 四、InitializingBean和init-method
* InitializingBean 是容器使用的对象生命周期标识接口：

  ```java
  public interface InitializingBean { 
    void afterPropertiesSet() throws Exception; 
  }
  ```

  它的作用在于，在对象实例化过程中调用 BeanPostProcessor 的前置处理之后，会检测对象是否实现了 InitializingBean，如果是，则会进一步调用 `afterPropertiesSet` 方法，调整对象状态。

* init-method 是对象的自定义初始化操作，可以以任意命名。 

### 五、DisposableBean和destroy-method
DisposableBean、destroy-method 和 InitializingBean、init-method 相对应，给对象提供了执行自定义销毁逻辑的功能。

在对象调用完成之后，容器会检查 **singleton**对象是否实现了 DisposableBean 接口或定义了 destroy-method，如果是，则为对象注册一个用于对象销毁的*回调*。
