---
layout: post
category: Java
title: javax.xml.parsers使用简介及源码探究:DOM与SAX
tags: [ 'javax.xml.parsers', 'DocumentBuilder', 'DocumentBuilderFactory', 'SAXParser', 'SAXParserFactory', 'FactoryFinder', 'DOM', 'SAX', 'JAXP' ]
author: 唐 治
description: Java SE 平台提供的 XML 处理主要包括两个功能：JAXP（XML 处理，Java Architecture XML Processing）和 JAXB（XML 绑定，Java Architecture XML Binding）。JDK中`javax.xml.parsers`包下是SAX和DOM的实现。本文，我们将简单介绍该包的使用及部分源码探究。

---

## 一、简介

Java SE 平台提供的 XML 处理主要包括两个功能：JAXP（XML 处理，Java Architecture XML Processing）和 JAXB（XML 绑定，Java Architecture XML Binding）。

### 1.1 关于JAXB

JAXB 则是负责将 XML 文件和 Java 对象绑定，在新版 JDK 中，被大量的使用在 Web 服务技术中。

### 1.2 关于JAXP

JAXP 包括 SAX 框架 —— 遍历元素，做出处理；DOM 框架 —— 构造 XML 文件的树形表示；StAX 框架 —— 拖拽方式的解析；XSLT 框架 —— 将 XML 数据转换成其他格式。


* **SAX 框架（Simple API for XML）**

  SAX 全称 Simple API for XML，该框架使用了事件处理机制来处理 XML 文件。

* **DOM 框架（Document Object Model）**
  
  DOM 框架的全称是 Document Object Model。顾名思义，这个框架会建立一个对象模型。针对每个节点，以及节点之间的关系在内存中生成一个树形结构。这个特点与 SAX 框架截然相反。需要注意的是，DOM 框架提供的对象树模型与我们通常理解的 XML 文件结构树模型是有一定的区别的。

* **StAX 框架（Streaming API for XML）**

  SAX 框架的缺点是不能记录正在处理元素的上下文。但是优点是运行时占内存空间比较小，效率高。DOM 框架由于在处理 XML 时需要为其构造一棵树，所以特点正好相反。StAX 框架出现于 Java SE 6 中，它的设计目标就是要结合 SAX 框架和 DOM 框架的优点。既要求运行时效率，也要求保持元素的上下文状态。

* **XSLT 数据转换框架（The Extensible Stylesheet Language Transformations APIs）**

  一般来说 XML 文件格式被认为是一种很好的数据交换格式。于是 Java SE 6 SDK 基于以上介绍的三种 XML 处理机制，提供了一个 XML 转换框架。XSLT 框架负责进行转换 —— 包括将 XML 文件转换成其他形式如 HTML，和将其他形式的文件转换成 XML 文件。更进一步说，这个框架可以接受 DOM 作为其输入和输出；可以接受 SAX 解析器作为输入或者产生 SAX 事件作为输出；可以接受 I/O Stream 作为输入和输出；当然也支持用户自定义形式的输入和输出。

===

JDK中`javax.xml.parsers`包下是SAX和DOM的实现。下面，我们将简单介绍该包的使用。

## 二、对比(SAX与DOM)

1. DOM思想：将整个XML加载内存中，形成文档对象，所以对XML操作都对内存中文档对象进行。

2. SAX思想：一边解析，一边处理，一边释放内存资源。不允许在内存中保留大规模XML数据。

3. DOM和SAX的区别：
    * DOM：支持回写，会将整个XML载入内存，以树形结构方式存储；XML比较复杂的时候，或者当你需要随机处理文档中数据的时候不建议使用
    * SAX：相比DOM是一种更为轻量级的方案；无法在读取过程中修改XML数据

4. 解析速度： SAX > StAX > DOM


## 三、使用示例

### 3.1 staffs.xml

    <?xml version="1.0"?>
    <company>
        <staff>
            <firstname>yong</firstname>
            <lastname>mook kim</lastname>
            <nickname>mkyong</nickname>
            <salary>100000</salary>
        </staff>
        <staff>
            <firstname>low</firstname>
            <lastname>yin fong</lastname>
            <nickname>fong fong</nickname>
            <salary>200000</salary>
        </staff>
    </company>


### 3.2 DOM的使用示例

DOM的使用，分为两步：

1. 将XML文件解析为Document对象
2. 对Document对象进行处理

**解析代码，主体如下：**

	public static void main(String[] args) throws Exception {
		
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();

		DocumentBuilder builder = factory.newDocumentBuilder();

		Document document = builder.parse(new InputSource(new FileInputStream("staffs.xml")));
		
		forEachNode(document);
	}
	
**其中，对Document对象的处理方法如下：**

	private static void forEachNode(Document doc) {
		NodeList nodeList =  doc.getDocumentElement().getChildNodes();
		
		for(int i=0; i<nodeList.getLength(); ++i) {
			Node staff = nodeList.item(i);
			if (staff instanceof Element) {
				NodeList props = staff.getChildNodes();
				
				for (int j=0; j<props.getLength(); ++j) {
					Node prop = props.item(j) ;
					if (prop instanceof Element) {
						String content = prop.getLastChild().getTextContent().trim();
						switch(prop.getNodeName()) {
						case "firstname": 
							System.out.println("firstname:"+content);
							break;
						case "lastname":
							System.out.println("lastname:"+content);
							break;
						case "nickname":
							System.out.println("nickname:"+content);
							break;
						case "salary":
							System.out.println("salary:"+content);
							break;
						}
					}
				}
				
				System.out.println();
			}
		}
	}

	
### 3.3 SAX的使用示例

SAX的使用，在于需要自定义一个`org.xml.sax.ContentHandler`处理器。

**解析的主体代码如下：**

	public static void main(String[] args) throws Exception {
		
		SAXParserFactory spf = SAXParserFactory.newInstance();
        spf.setNamespaceAware( true );
        
        XMLReader xmlReader = spf.newSAXParser().getXMLReader();
        
        xmlReader.setContentHandler(new StaffHandler());
        
        xmlReader.parse(new InputSource(new FileInputStream("staffs.xml")));
        
	}
	
**自定义的处理器 StaffHandler:**

    public class StaffHandler extends DefaultHandler {

        boolean bfname = false;
        boolean blname = false;
        boolean bnname = false;
        boolean bsalary = false;
     
        public void startElement (String uri, String localName,
                String qName, Attributes attributes) throws SAXException {

            System.out.println("Start Element :" + qName);
     
            if (qName.equalsIgnoreCase("FIRSTNAME")) {
                bfname = true;
            }
     
            if (qName.equalsIgnoreCase("LASTNAME")) {
                blname = true;
            }
     
            if (qName.equalsIgnoreCase("NICKNAME")) {
                bnname = true;
            }
     
            if (qName.equalsIgnoreCase("SALARY")) {
                bsalary = true;
            }
     
        }
     
        public void endElement(String uri, String localName,
            String qName) throws SAXException {
     
            System.out.println("End Element :" + qName);
     
        }
     
        public void characters(char ch[], int start, int length) throws SAXException {
     
            if (bfname) {
                System.out.println("First Name : " + new String(ch, start, length));
                bfname = false;
            }
     
            if (blname) {
                System.out.println("Last Name : " + new String(ch, start, length));
                blname = false;
            }
     
            if (bnname) {
                System.out.println("Nick Name : " + new String(ch, start, length));
                bnname = false;
            }
     
            if (bsalary) {
                System.out.println("Salary : " + new String(ch, start, length));
                bsalary = false;
            }
     
        }
        
    }

## 四、关于 SAXParserFactory 和 DocumentBuilderFactory

### 4.1 相似的代码，相同的设计模式

对比前面的代码，可以发现两者主体部分代码，十分相似，使用了相同的设计模式。

再看一下：

**DOM:**

    //获取工厂实例
    DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();

    //由工厂实例，获得DocumentBuilder
	DocumentBuilder builder = factory.newDocumentBuilder();

    //解析ing
	Document document = builder.parse(new InputSource(new FileInputStream("staffs.xml")));
		
**SAX:**

    //获取工厂实例
	SAXParserFactory spf = SAXParserFactory.newInstance();
    spf.setNamespaceAware( true );
    
    //由工厂实例，获得XMLReader
    XMLReader xmlReader = spf.newSAXParser().getXMLReader();
        
    xmlReader.setContentHandler(...);
    
    //解析ing 
    xmlReader.parse(new InputSource(new FileInputStream("staffs.xml")));
        
在这里，我想探讨一下两者的工厂实例是如何获取的。

查了下jdk 1.8 源码。

### 4.2 两者工厂实例的相同实现

两者工厂实例，都是由`FactoryFinder.find`方法实现

**javax.xml.parsers.DocumentBuilderFactory:**

    public static DocumentBuilderFactory newInstance() {
        return FactoryFinder.find(
                /* The default property name according to the JAXP spec */
                DocumentBuilderFactory.class, // "javax.xml.parsers.DocumentBuilderFactory"
                /* The fallback implementation class name */
                "com.sun.org.apache.xerces.internal.jaxp.DocumentBuilderFactoryImpl");
    }

**javax.xml.parsers.SAXParserFactory:**

    public static SAXParserFactory newInstance() {
        return FactoryFinder.find(
                /* The default property name according to the JAXP spec */
                SAXParserFactory.class,
                /* The fallback implementation class name */
                "com.sun.org.apache.xerces.internal.jaxp.SAXParserFactoryImpl");
    }

### 4.3 FactoryFinder.find 的逻辑

继续阅读源码，获知`FactoryFinder.find`的逻辑包括两个部分：

1. 查找定位工厂类
2. 根据查到的工厂类，生成最终实例

如何查找定位工厂类？按下面顺序，使用找到的第一个：

1. 使用系统属性。对DocumentBuilderFactory而言，是`javax.xml.parsers.DocumentBuilderFactory`；对SAXParserFactory而言，是`javax.xml.parsers.SAXParserFactory`。所以，你可以在启动java时，使用`-Djavax.xml.parsers.DocumentBuilderFactory=...`来设置DocmentBuilder的工厂类，SAXParser类似。
2. 读取JRE目录下的属性文件 "lib/jaxp.properties"，其中属性名分别为`javax.xml.parsers.DocumentBuilderFactory`和`javax.xml.parsers.SAXParserFactory`。
3. 使用jar包的`Service Provider`机制，加载工厂类。也就是说，查找所有加载的jar包中`META-INF/services`目录下的配置文件，文件名分别为`javax.xml.parsers.DocumentBuilderFactory`和`javax.xml.parsers.SAXParserFactory`。文件的内容就是该jar包内提供的类实例。比如`xercesImple-2.x.x.jar`提供的`org.apache.xerces.jaxp.SAXParserFactoryImpl`.
4. 使用系统默认的工厂类。分别为：`com.sun.org.apache.xerces.internal.jaxp.DocumentBuilderFactoryImpl`和`com.sun.org.apache.xerces.internal.jaxp.SAXParserFactoryImpl`。


## 五、总结

好了，至此，你已经掌握了JDK中自带的DOM和SAX的基本使用方法了。

本文，所使用的示例代码，可以从[这里](/attachment/src-jaxp20150504.zip)获取。

## 八、参考文献

1. [https://www.ibm.com/developerworks/cn/java/j-lo-jse67/](https://www.ibm.com/developerworks/cn/java/j-lo-jse67/)
2. [http://www.cnblogs.com/evanliu/p/3665113.html](http://www.cnblogs.com/evanliu/p/3665113.html)
3. [http://www.mkyong.com/java/how-to-read-xml-file-in-java-sax-parser/](http://www.mkyong.com/java/how-to-read-xml-file-in-java-sax-parser/)
4. [http://www.javacodegeeks.com/2013/05/parsing-xml-using-dom-sax-and-stax-parser-in-java.html](http://www.javacodegeeks.com/2013/05/parsing-xml-using-dom-sax-and-stax-parser-in-java.html)




