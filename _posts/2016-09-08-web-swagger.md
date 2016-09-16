---
layout: post
title: Swagger介绍及应用实例
category: ['web前端']
tags: ['API', 'Web']
author: 赵家君
email: zhaojj5@asiainfo.com
description: 本文主要介绍Swagger ui与SpringMVC的整合使用
---

|  |  *目 录* |
| --- | --- |
| 1 | [Swagger介绍](#1st) |
| 2 | [Swagger UI与SpringMVC的整合](#2nd) |
| 3 | [应用实例](#3nd) |
| 4 | [注意事项](#end) |

<a id="1st"></a>

## 一、Swagger介绍
	
> Swagger API框架用于管理项目中API接口，属当前最流行的API接口管理工具。Swagger是一个开源框架(Web框架)，是一个规范和完整的框架，用于生成、描述、调用和可视化RESTful风格的Web服务，方便的管理项目中API接口，功能强大，UI界面漂亮，并且支持在线测试等。
> 
> 后端通过提供一套标准的RESTful API，让网站、移动端和第三方系统都可以基于API进行数据交互和对接，极大的提高系统的开发效率，也使得前后端分离架构成为可能。

<a id="2nd"></a>
## 二、Swagger UI与SpringMVC的整合

### 1.从github([https://github.com/wordnik/swagger-ui](https://github.com/wordnik/swagger-ui))上下载Swagger-UI

![20160908img01](/images/zhaojiajun/20160908img01.jpg)

> 修改dist目录下index.html文件，将url修改为应用服务url 

![20160908img07](/images/zhaojiajun/20160908img07.jpg)

> 把该项目dist目录的内容拷贝到项目的webapp的目录下，修改dist目录的名称(也可以不修改)，如改为“swagger”。

![20160908img02](/images/zhaojiajun/20160908img02.jpg)

### 2.与SpringMVC整合搭建

> Maven引入swagger所需的包，SpringMVC的配置这里不做说明。

	<dependency>
        <groupId>org.codehaus.jackson</groupId>
        <artifactId>jackson-mapper-asl</artifactId>
        <version>1.9.13</version>
    </dependency>
    <dependency>
	    <groupId>org.codehaus.jackson</groupId>
	    <artifactId>jackson-core-asl</artifactId>
	    <version>1.9.13</version>
	</dependency>
    <dependency>
		<groupId>com.mangofactory</groupId>
		<artifactId>swagger-springmvc</artifactId>
		<version>1.0.2</version>
	</dependency>

> SpringMVC通过注解说明API接口的功能描述、参数含义以及校验等

    package home.action;
    
    import home.model.CrmCar;
    import home.service.CrmCarService;
    
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.stereotype.Controller;
    import org.springframework.web.bind.annotation.PathVariable;
    import org.springframework.web.bind.annotation.RequestMapping;
    import org.springframework.web.bind.annotation.RequestMethod;
    import org.springframework.web.bind.annotation.ResponseBody;
    import org.springframework.web.servlet.ModelAndView;
    
    import base.action.BaseAction;
    import base.exception.BusinessException;
    
    import com.wordnik.swagger.annotations.ApiOperation;
    import com.wordnik.swagger.annotations.ApiParam;
    
    @Controller
    @RequestMapping("/crmCar/*")  // 父request请求url
    public class CrmCarAction extends BaseAction {
	
		@Autowired
	    private CrmCarService crmCarService; 
	
		@ApiOperation(value = "车辆信息", notes = "根据ID获取车辆对象信息,返回页面对象")  
		@RequestMapping(value = "view/{carId}", method = RequestMethod.GET)
	    public ModelAndView getCrmCarView(@ApiParam(value = "填写车辆ID",allowableValues = "range[1,5]",required = true) @PathVariable("carId") int carId){   
			ModelAndView mav = new ModelAndView("index"); 
			CrmCar crmCar = crmCarService.getCrmCar(carId);
	        mav.addObject("crmCar", crmCar); 
	        return mav; 
	    }
		
		@ApiOperation(value = "车辆信息 GET", notes = "根据ID获取车辆对象信息,返回JSON格式")  
		@ResponseBody
		@RequestMapping(value = "get/{carId}", method = RequestMethod.GET)
	    public CrmCar getCrmCarGet(@ApiParam(value = "填写车辆ID",allowableValues = "range[1,5]",required = true) @PathVariable("carId") int carId){   
			CrmCar crmCar = crmCarService.getCrmCar(carId);
	        return crmCar;
	    }
		
		@ApiOperation(value = "车辆信息 POST", notes = "根据ID获取车辆对象信息,返回JSON格式")  
		@ResponseBody
		@RequestMapping(value = "post/{carId}", method = RequestMethod.POST)
	    public CrmCar getCrmCarPost(@ApiParam(value = "填写车辆ID",allowableValues = "range[1,5]",required = true) @PathVariable("carId") int carId){   
			CrmCar crmCar = crmCarService.getCrmCar(carId);
	        return crmCar;
	    }
    }

#### API相关注解参数说明如下：
 
    @ApiOperation(value = "接口名称", notes = "接口功能详细说明")  
    @RequestMapping(value = "接口请求URL", method = "接口请求方式get/post")
    @ApiParam(value = "参数名称",allowableValues = "参数约束",required = "是否必须参数")
    @PathVariable("绑定参数")
    @ResponseBody注解一般在异步获取数据时使用，在springMVC框架时，使用@RequestMapping后，返回值通常解析为跳转路径，加上@ResponseBody后返回结果不会被解析为跳转路径，而是直接写入HTTP response body中。比如异步获取json数据，加上@ResponseBody后，会直接返回json数据。

#### SpringSwagger的配置有两种方式，本文以第二种方式实现案例

#### （1）自定义配置类 ####

	package common;

    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.Configuration;
    
    import com.mangofactory.swagger.configuration.SpringSwaggerConfig;
    import com.mangofactory.swagger.models.dto.ApiInfo;
    import com.mangofactory.swagger.plugin.EnableSwagger;
    import com.mangofactory.swagger.plugin.SwaggerSpringMvcPlugin;
    
    @Configuration
    @EnableSwagger
    public class MySwaggerConfig
    {
	    private SpringSwaggerConfig springSwaggerConfig;
	
	    /**
	     * Required to autowire SpringSwaggerConfig
	     */
	    @Autowired
	    public void setSpringSwaggerConfig(SpringSwaggerConfig springSwaggerConfig)
	    {
	        this.springSwaggerConfig = springSwaggerConfig;
	    }
	
	    /**
	     * Every SwaggerSpringMvcPlugin bean is picked up by the swagger-mvc
	     * framework - allowing for multiple swagger groups i.e. same code base
	     * multiple swagger resource listings.
	     */
	    @Bean
	    public SwaggerSpringMvcPlugin customImplementation()
	    {
	        return new SwaggerSpringMvcPlugin(this.springSwaggerConfig).apiInfo(apiInfo()).includePatterns(
	                ".*?");
	    }

	    private ApiInfo apiInfo()
	    {
	        ApiInfo apiInfo = new ApiInfo(
	                "My Apps API Title", 
	                "My Apps API Description",
	                "My Apps API terms of service", 
	                "My Apps API Contact Email", 
	                "My Apps API Licence Type",
	                "My Apps API License URL");
	        return apiInfo;
	    }
    }

#### 在 spring 配置文件中添加 ####

    <bean class="common.MySwaggerConfig" />

#### （2）自己不写配置类，直接使用默认的实现类，在Spring的配置文件中配置 ####

    <mvc:annotation-driven/>
    <!-- Required so swagger-springmvc can access spring‘s RequestMappingHandlerMapping  --> 
    <bean class="com.mangofactory.swagger.configuration.SpringSwaggerConfig" /> 

<a id="3nd"></a>

### 3.启动服务，如果swagger ui是单独的工程，需要保证swagger ui和web 应用服务在同一个容器中，否则不能显示，具体原因在后面说明。###

![20160908img06](/images/zhaojiajun/20160908img06.jpg)

### 4.查看web应用服务的API并进行测试 ###

#### （1）接口列表 ####

![20160908img08](/images/zhaojiajun/20160908img08.jpg)

#### （2）接口说明及测试 ####

![20160908img09](/images/zhaojiajun/20160908img09.jpg)

#### （3）测试结果 ####

![20160908img10](/images/zhaojiajun/20160908img10.jpg)

![20160908img11](/images/zhaojiajun/20160908img11.jpg)

<a id="end"></a>

### 4.注意事项 ###

> （1）swagger ui读取应用服务的接口描述是通过JSON方式传输，所以存在跨域问题，这就是上面提到需要放到同一个容器的原因。当然，不是说不能跨域就不能分离swagger ui，可以通过nginx代理URL，将swagger和应用服务保持在同一个域名下即可。
> 
> （2）swagger ui是纯静态的，可以不必放到服务容器中使用，可以使用nginx配置站点访问，后续再做讲解说明。

## 结束语 ##

> 本文主要就swagger ui和springmvc整合做了说明，除此swagger ui之外还有其他应用，
> Swagger是一组开源项目，其中主要要项目如下：
> 
> Swagger-tools:提供各种与Swagger进行集成和交互的工具。例如模式检验、Swagger 1.2文档转换成Swagger 2.0文档等功能。
> 
> Swagger-core: 用于Java/Scala的的Swagger实现。与JAX-RS(Jersey、Resteasy、CXF...)、Servlets和Play框架进行集成。
> 
> Swagger-js: 用于JavaScript的Swagger实现。
> 
> Swagger-node-express: Swagger模块，用于node.js的Express web应用框架。
> 
> Swagger-ui：一个无依赖的HTML、JS和CSS集合，可以为Swagger兼容API动态生成优雅文档。
> 
> 可请各位一起研究探讨，谢谢！