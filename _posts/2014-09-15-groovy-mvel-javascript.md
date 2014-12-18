---
layout: post
category: java dynamic
title: java 动态脚本之groovy、mvel and javascript
tags: ['java动态脚本', 'groovy', 'mvel', 'javascript']
author: 汤仕忠
email: tangsz@asiainfo.com
#image:
description: 从javaSE6开始，JSR 223中规范了在Java虚拟机上运行的脚本语言与Java程序之间的交互方式，目前Java虚拟机支持比较多的脚本语言，比较流行的有JavaScript、Scala、JRuby、Jython和Groovy等，另外基于java开源的动态表达式语言也很多，如：MVEL、ognl、JUEL，还有国人开发的Aviator、JSEL，本章对最近研究的groovy、mvel以及java中动态调用各动态脚本性能比较。

---

##一、groovy

###. groovy介绍
Groovy 是 用于Java虚拟机的一种敏捷的动态语言，它是一种成熟的面向对象编程语言，既可以用于面向对象编程，又可以用作纯粹的脚本语言。使用该种语言不必编写过多的代码，同时又具有闭包和动态语言中的其他特性。

Groovy是JVM的一个替代语言（替代是指可以用 Groovy 在Java平台上进行 Java 编程），使用方式基本与使用 Java代码的方式相同，该语言特别适合与Spring的动态语言支持一起使用，设计时充分考虑了Java集成，这使 Groovy 与 Java 代码的互操作很容易。（注意：不是指Groovy替代java，而是指Groovy和java很好的结合编程。

###. groovy语法

groovy语法和java语法类似，具体请参阅[http://beta.groovy-lang.org/docs/groovy-2.3.1/html/documentation/](http://beta.groovy-lang.org/docs/groovy-2.3.1/html/documentation/ "官方文档")，这里不做介绍。


###. java中使用groovy

Java中调用Groovy情况：

1、Eval

Eval很容易的通过me方法执行一段逻辑，但是Eval不支持多行逻辑，并且没有对执行的script脚本缓存，效率非常低。
	
	System.out.println("Eval begin:" + new SimpleDateFormat("yyyy-MM-dd HH:mm:ss:SSS").
    				format(new Date()));
    for (int i = 0; i < 1000; i++) {
    	Eval.xy(i, i + 1, "x*y");
    }
    System.out.println("Eval end:" + new SimpleDateFormat("yyyy-MM-dd HH:mm:ss:SSS").
                    format(new Date()));

	输出：
		Eval begin:2014-09-17 14:36:43:218
		Eval end:  2014-09-17 14:36:52:203



2、GroovyShell:

GroovyShell支持简单脚本及Groovy文件的解析执行， GroovyShell支持script脚本的缓存，执行效率相对Eval高多了（下面例子100000次循环比Eval1000次循环还快），但要注意GroovyShell中shell.parse解析脚本程序不能放在大循环中或被频繁的调用，否则会大大降低性能，并且还有PermGen space异常风险。


	System.out.println("GroovyShell begin:" + new SimpleDateFormat("yyyy-MM-dd HH:mm:ss:SSS").format(new Date()));
           
    Binding binding = new Binding();
    GroovyShell shell = new GroovyShell(binding);    
    Script  script = shell.parse("def mul(x, y) { return x * y }\n mul(x1, y1)");  
    for (int i = 0; i < 100000; i++) {               
        binding.setProperty("x1", i);
        binding.setProperty("y1", i + 1);
        script.run();
    }
    System.out.println("GroovyShell end:" + new SimpleDateFormat("yyyy-MM-dd HH:mm:ss:SSS").format(new Date()));

	输出：
		GroovyShell begin:2014-09-17 15:50:04:945
		GroovyShell end:2014-09-17 15:50:06:389


3、GroovyClassLoader:适用于复杂逻辑的整个groovy文件，这里引入了Groovy2.0新增的静态编译，效率有进一步提升。

	System.out.println("GroovyClassLoader begin " + new SimpleDateFormat("yyyy-MM-dd HH:mm:ss:SSS").format(new Date()));
            
    GroovyClassLoader loader = new GroovyClassLoader();
    Class groovyClass = loader.parseClass(new File("src/extendTest/Test.groovy"));
   
    GroovyObject object = (GroovyObject) groovyClass.newInstance();
    for (int i = 0; i < 100000; i++) {  
        object.invokeMethod("num", new int[]{i, i + 1});
    }
    
    System.out.println("GroovyClassLoader end" + new SimpleDateFormat("yyyy-MM-dd HH:mm:ss:SSS").format(new Date()));

	输出：
		GroovyClassLoader begin 2014-09-17 16:23:06:156
		GroovyClassLoader end   2014-09-17 16:23:06:411

4、GroovyScriptEngine：GroovyScriptEngine类似GroovyShell，但存在互关联的多个脚本时，使用GroovyScriptEngine会更好些，但是GroovyScriptEngine效率也不理想。

	System.out.println("SimpleScript begin:"+ new SimpleDateFormat("yyyy-MM-dd HH:mm:ss:SSS").format(new Date()));
    for (int i = 0; i < 100000; i++) {
        binding1.setVariable("x", i);
        binding1.setVariable("y", i + 1);
        engine.run("src/extendTest/SimpleScript.groovy", binding1);
    }
    System.out.println("SimpleScript end:"+ new SimpleDateFormat("yyyy-MM-dd HH:mm:ss:SSS").format(new Date()));
	
	输出：
		SimpleScript begin:2014-09-17 18:48:48:506
		SimpleScript end:2014-09-17 18:49:13:796

5、Bean Scripting Framework：Bean Scripting Framework是一组Java Classes提供了在Java应用程序内对脚本语言的支持，通过脚本语言可以访问java的对象和方法，Groovy的BSF引擎是继承org.codehaus.groovy.bsf.GroovyEngine，其效率也达不到GroovyClassLoader效率，这里不做实例分析。

6、JSR 223是Java 6提供的一种从Java内部执行脚本编写语言的方便、标准的方式，并提供从脚本内部访问Java 资源和类的功能。

	System.out.println("JSR 223 begin:"+ new SimpleDateFormat("yyyy-MM-dd HH:mm:ss:SSS").format(new Date()));

	ScriptEngineManager factory = new ScriptEngineManager();
    ScriptEngine engine1 = factory.getEngineByName("groovy");
    String testScript = "def num(int[] a) {return  a[0] * a[1]}";  
    engine1.eval(testScript);  
    Invocable inv = (Invocable) engine1; 
    for (int i = 0; i < 100000; i++) {
        inv.invokeFunction("num",  new int[]{i, i + 1});  
    }
    
    System.out.println("JSR 223 end:"+ new SimpleDateFormat("yyyy-MM-dd HH:mm:ss:SSS").format(new Date()));

	输出：

		JSR 223 begin:2014-09-17 18:55:10:665
		JSR 223 end:2014-09-17 18:55:10:716

以上一个简单的乘法运算测试发现JSR 223的效率比GroovyClassLoader要高。怀疑是不是GroovyClassLoader加载Groovy文件及编译文件耗时比较长，将开始打印日志移至for循环上面一行，同时将JSR 223测试代码打印日志也移至for循环上面一行，测试后发现JSR 223效率任然高于GroovyClassLoader，于是将JSR 223测试程序改读取Groovy文件，并使用Groovy静态编译，效率降低，稍高于GroovyClassLoader方式（GroovyClassLoader不读取文件方式高于GroovyClassLoader读取文件，稍低于JSR 223不读取文件方式）：
	
	ScriptEngineManager factory = new ScriptEngineManager();
    ScriptEngine engine1 = factory.getEngineByName("groovy");
    //String testScript = "def num(int[] a) {return  a[0] * a[1]}";  
    engine1.eval(new FileReader("D:/workspace/extendTest/src/extendTest/Test.groovy"));
    //engine1.eval(testScript);  
    Invocable inv = (Invocable) engine1; 
    System.out.println("JSR 223 begin:"+ new SimpleDateFormat("yyyy-MM-dd HH:mm:ss:SSS").format(new Date()));
    for (int i = 0; i < 100000; i++) {
        inv.invokeFunction("num",  new int[]{i, i + 1});  
    }
    
    System.out.println("JSR 223 end:"+ new SimpleDateFormat("yyyy-MM-dd HH:mm:ss:SSS").format(new Date()));

	输出：
		JSR 223 begin:2014-09-17 18:49:13:847
		JSR 223 end:2014-09-17 18:49:13:969


注：虽然JSR 223调用方式性能大大提升，但是其性能与java相比还相差很多，以上简单的乘法运算，用java实现，100000次循环仅仅需5毫秒，所以对于实时性要求很高的功能，Groovy并不合适。


##二、MVEL

###. MVEL介绍

MVEL为 MVFLEX Expression Language（MVFLEX表达式语言）的缩写，它是一种动态/静态的可嵌入的表达式语言和为Java平台提供Runtime（运行时）的语言。最初是作为一个应用程序框架实用程序的语言开始，该项目现已发展完全独立。MVEL通常用于执行用户（程序员）通过配置XML文件或注释等定义的基本逻辑。它也可以用来解析简单的JavaBean表达式。Runtime（运行时）允许MVEL表达式通过解释执行或者预编译生成字节码后执行。


###. MVEL语法

MVEL语法具体请参阅 [http://mvel.codehaus.org/Language+Guide+for+2.0](http://mvel.codehaus.org/Language+Guide+for+2.0 "MVEL")，这里不做介绍。

###. java中使用MVEL

Java中调用MVEL情况：

1、解释执行

	System.out.println("interpreted begin:"+ new SimpleDateFormat("yyyy-MM-dd HH:mm:ss:SSS").format(new Date()));
        
    Map<String, Object> params = new HashMap<String, Object>();  
      
    for (int i = 0; i < 100000; i++) {
        params.put("x", i);  
        params.put("y", i + 1);  
        MVEL.eval("x*y", params);  
    }
    System.out.println("interpreted end:"+ new SimpleDateFormat("yyyy-MM-dd HH:mm:ss:SSS").format(new Date()));

	输出：
		
		interpreted  begin:2014-09-18 10:54:01:162
		interpreted  end:2014-09-18 10:54:01:879

2、编译后执行（加快执行）

	System.out.println("compiled begin:"+ new SimpleDateFormat("yyyy-MM-dd HH:mm:ss:SSS").format(new Date()));
	
	ExpressionCompiler compiler = new ExpressionCompiler("x * y");  
	CompiledExpression exp = compiler.compile();  
	Map<String, Object> params1 = new HashMap<String, Object>();  
	          
	for (int i = 0; i < 100000; i++) {
	    params.put("x", i);  
	    params.put("y", i + 1);  
	    MVEL.executeExpression(exp, params);  
	   
	}
	System.out.println("compiled end:"+ new SimpleDateFormat("yyyy-MM-dd HH:mm:ss:SSS").format(new Date()));

	输出：
		
		compiled begin:2014-09-18 10:57:50:471
		compiled end:2014-09-18 10:57:50:632


以上执行结果看出，编译后执行效率明显高于解释执行。


##三、Groovy、MVEL、javascript 调用性能分析

1、java中调用javascript测试：

	ScriptEngineManager manager = new ScriptEngineManager();
    ScriptEngine engine = manager.getEngineByName("javascript"); 

    String str = "function num (x,y) { return x*y }";   
    try {
        engine.eval(str);
    } catch (ScriptException e) {
        e.printStackTrace();
    }   
    Invocable invoke = (Invocable) engine;
    System.out.println("javascript begin:"+ new SimpleDateFormat("yyyy-MM-dd HH:mm:ss:SSS").format(new Date()));
    
    try {
        for (int i = 0; i < 100000; i++) {
            invoke.invokeFunction("num", i, i + 1);
        }
    } catch (ScriptException e) {
        e.printStackTrace();
    } catch (NoSuchMethodException e) {
        e.printStackTrace();
    }
    System.out.println("javascript end:"+ new SimpleDateFormat("yyyy-MM-dd HH:mm:ss:SSS").format(new Date())); 

	输出：
		
		javascript begin:2014-09-18 11:28:11:661
		javascript end:2014-09-18 11:28:16:348


2、性能分析

从以上对Java中调用Groovy、MVEL、javascript实现的一个简单的乘法运算100000次循环的结果来看：

	Groovy JSR 223调用方式：51毫秒
	MVEL编译后执行：161毫秒
    javascript调用：4秒多


MVEL官网给出性能报告显示MVEL性能高于Groovy，不知道其什么数据测试场景，看官网报告测试的Groovy版本是1.5.7，低于本文测试的Groovy2.0版，从Groovy1.6开始才开始引入Cache功能，并且到了2.0才加入静态编译，所以MVEL官网的测试报告我觉得已经不能够正确说明Groovy的实际性能，至少从本文例子中看出Groovy2.0性能是明显优于MVEL2.2的。


##四、总结

动态语言给我们实际编程中带来很多方便，比如常用的规则引擎，然而性能与功能不能同时得到满足，从本文测试中看出无论是Groovy还是MVEL都是实现动态逻辑配置的不错选择，但是遇到高实时性需求时，可能两者就不是特别适合，因为两者的性能与Java本身相比还是有数倍的差距。
