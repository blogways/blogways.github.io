---
layout: post
title: Spring MVC 全局错误处理
category: ['Spring']
tags: ['Spring']
author: 景阳
email: jingyang@asiainfo.com
description: Spring MVC 全局错误处理
---

## 一、默认情况：DefaultHandlerExceptionResolver
DefaultHandlerExceptionResolver 是 DispatcherServlet **默认**的错误处理类，它会把 Spring MVC 抛出的标准异常对应一个状态码写入到 response 中，并返回默认的错误页面。

如果应用是一个 RESTful API 或者需要自定义错误，可以实现 HandlerExceptionResolver 或者使用 ExceptionHandler 注解等方法。

默认状态下 Spring MVC 异常和状态码的对应关系表：
![exception.png](/images/jyjsjd/exception.png)

## 二、自定义情况

### 1、自定义错误页面
可以在 web.xml 中自定义错误状态码对应的错误页面：

```xml
<error-page>
    <error-code>404</error-code>
    <location>/WEB-INF/jsp/errors/404.jsp</location>
  </error-page>
```

实际上 `error-code` 也可以是具体的异常类：

```xml
<error-page>
    <error-code>java.lang.NullPointerException</error-code>
    <location>/WEB-INF/jsp/errors/error.jsp</location>
  </error-page>
```

### 2、自定义错误处理
Spring MVC 的文档里给出了多个自定义错误处理的方法，我在这里总结为以下几种。

#### （1）实现 HandlerExceptionResolver 接口
HandlerExceptionResolver 接口可以处理所有 Controller `映射`（mapping）或`执行`（execution）时抛出的异常。

* 实现HandlerExceptionResolver 接口，实现 `resolveException` 方法，并返回一个 `ModelAndView`。方法中的参数 `Exception`，就是要处理的异常，可以在方法体中判断异常的类型，采取不同的措施。

* SimpleMappingExceptionResolver 是一个 HandlerExceptionResolver 的实现类，它可以把 Exception 和 View 一一对应，对不同的异常返回不同的页面。它的内部存放了一个 **Properties**，存储对应关系。


#### （2）@ExceptionHandler注解
ExceptionHandler 给 RESTful API 提供了错误处理方法。它的 `Value` 属性可以被设置为一个或一组异常类型——即方法体要处理的异常。

它可以被用在 @Controller 或 @ControllerAdvice 注解的类的方法上，当用在@Controller 方法上时，它会处理这个 Controller 中抛出的异常。

```java
@Controller 
public class SimpleController {

@ExceptionHandler(IOException.class) 
public ResponseEntity<String> handleIOException(IOException ex) {
    // prepare responseEntity
    return responseEntity; 
  }
}
```

#### （3）@ControllerAdvice @RestControllerAdvice
使用 @ControllerAdvice 注解的类可以包含 @ExceptionHandler、@InitBinder 或 @ModelAttribute 注解的方法，它可以被 Spring MVC 自动发现和注册，可以处理所有 Controller 中用 @RequestMapping 的方法。

它也可以被限定只处理某些特定 Controller 的异常：

```java
// 限定为 @RestController 注解的方法
@ControllerAdvice(annotations = RestController.class) 
public class AnnotationAdvice {}

// 限定为指定包中的 Controller 
@ControllerAdvice("org.example.controllers") 
public class BasePackageAdvice {}

// 限定为指定的类
@ControllerAdvice(assignableTypes = {ControllerInterface.class, AbstractController.class}) 
public class AssignableTypesAdvice {}
```
