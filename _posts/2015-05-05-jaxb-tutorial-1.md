---
layout: post
category: Java
title: JAXB使用教程一:简介与基本用法
tags: ['JAXB', '使用', '教程']
author: 唐 治
description: JAXB（Java Architecture for XML Binding简称JAXB）允许Java开发人员将Java类映射为XML表示方式。在本文中，我们将介绍jaxb的基本用法。后续文章中会介绍更复杂的一些用法。

---

## 一、简介

JAXB（Java Architecture for XML Binding简称JAXB）允许Java开发人员将Java类映射为XML表示方式。JAXB提供两种主要特性：将一个Java对象序列化为XML，以及反向操作，将XML解析成Java对象。换句话说，JAXB允许以XML格式存储和读取数据，而不需要程序的类结构实现特定的读取XML和保存XML的代码！

JAXB 已经是 Java SE平台的一部分，Java EE平台API之一，也是Java Web服务开发包(JWSDP)的一部分。

JAXB在Java SE平台上，对应版本分别为：

* Java SE 8: JAXB 2.2.8

* Java SE 7: JAXB 2.2.3 (JSR 222, maintenance release 2)

* Java SE 6: JAXB 2.0 (JSR 222)

## 二、JAXB和Dom/SAX/JDOM/Dom4J对比

其实，JAXB不能直接拿来和Dom/SAX/Dom4j进行比较。他们的设计理念不同。后者提供的API都是解析XML的底层API，而前者设计的目的是将XML文件中的元素及属性和JAVA对象建立绑定关系，可以自动相互转换。

JAXB没有提供解析XML的新方法，它是调用后者(Dom/SAX/JDOM/Dom4J)来解析XML的。（JAXB默认是调用SAX来实现XML解析的）

如果，你仅仅是想把XML的内容转换成Java对象，那么JAXB比起后者更容易实现，它可以让你少些一些代码。特别是，当XML的结构非常复杂时，他的代码量比后者要少很多。

当然，他们之间的取舍，主要还是以你的使用目的所决定。


 *另外，关于DOM和SAX的更多信息，可以看看我的另一篇博文:[javax.xml.parsers使用简介及源码探究:DOM与SAX](javax-xml-parsers.html)*

---

下面，我们就来看看，如何在xml文件和java对象间，使用JAXB进行转换。

## 三、编组(marshal)

将Java对象，转换为Xml文件，我们称之为编组(marshal).

转换代码很简单：

	public static void main( String[] args )
    {
        try
        {

            /* 初始化java对象 */
            Person person = new Person();
            person.setFirstName("net");
            person.setLastName("blogways");
            person.setCity("NanJing");
            person.setPostalCode(210000);
            person.setBirthday(LocalDate.of(2013, 10, 11));

            /* 初始化 jaxb marshaler */
            JAXBContext jaxbContext = JAXBContext.newInstance( Person.class );
            Marshaller jaxbMarshaller = jaxbContext.createMarshaller();

            /* 设置为格式化输出 */
            jaxbMarshaller.setProperty( Marshaller.JAXB_FORMATTED_OUTPUT, true );

            /* 将java对象 编组 为xml (输出到文件或标准输出) */
            jaxbMarshaller.marshal( person, new File( "person.xml" ) );
            jaxbMarshaller.marshal( person, System.out );
        }
        catch( JAXBException e )
        {
            e.printStackTrace();
        }

    }
        
而在`Person.java`中，你只需要通过注释，就可以告诉程序，要转换为什么格式的Xml文件。

比如, **Person.java：**

    package net.blogways.jaxb.example.model;

    import java.time.LocalDate;

    import javax.xml.bind.annotation.XmlRootElement;

    @XmlRootElement( name = "Person" )
    public class Person {
        private String firstName;
        private String lastName;
        private Integer postalCode;
        private String city;
        private LocalDate birthday;
        
        public String getFirstName() {
            return firstName;
        }
        
        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }
        
        public String getLastName() {
            return lastName;
        }
        
        public void setLastName(String lastName) {
            this.lastName = lastName;
        }
        
        public Integer getPostalCode() {
            return postalCode;
        }

        public void setPostalCode(Integer postalCode) {
            this.postalCode = postalCode;
        }

        public String getCity() {
            return city;
        }

        public void setCity(String city) {
            this.city = city;
        }

        public LocalDate getBirthday() {
            return birthday;
        }

        public void setBirthday(LocalDate birthday) {
            this.birthday = birthday;
        }
        
    }

    
在这里：

* @XmlRootElement 定义了根节点的名字

是不是很简单？！

另外，需要说明的是：

* 在`Person.java`中，你可以通过更多的[注释](#5)，来定义编组后的xml格式。
* 在一个复杂的项目中，XML文件结构可能很复杂。这时，不需要手工编写对应的Java类文件，我们可以通过工具从xml schema文件获得java类文件，甚至可以从xml文件中转换得到java类文件。这些我们在后续的文章中介绍。


## 四、反编组(Un-marshal)

将Xml文件的内容，转换为Java对象，我们称之为反编组(un-marshal).

反编组，也很简单。代码如下：

	public static void main(String[] args) {
		try
        {

            File file = new File( "list.xml" );
            JAXBContext jaxbContext = JAXBContext.newInstance( Persons.class );

            Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();
            
            Persons persons = (Persons)jaxbUnmarshaller.unmarshal( file );
            System.out.println( persons );

        }
        catch( JAXBException e )
        {
            e.printStackTrace();
        }
	}
	
转换的对应关系，都在Persons.java里面。这里为了示例更简单清晰，我们只加了一行注释`XmlRootElement`,代码如下：

    package net.blogways.jaxb.example.model;

    import java.util.List;

    import javax.xml.bind.annotation.XmlRootElement;

    @XmlRootElement( name = "Persons" )
    public class Persons {

        private List<Person> persons;

        public List<Person> getPersons() {
            return persons;
        }

        public void setPersons(List<Person> persons) {
            this.persons = persons;
        }
        
        @Override
        public String toString()
        {
            StringBuffer str = new StringBuffer();
            for( Person person : this.persons )
            {
                str.append( person.toString() );
                str.append("\n");
            }
            return str.toString();
        }
    }
    


list.xml内容如下：

    <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <Persons>
        <persons>
            <city>NanJing</city>
            <firstName>Li</firstName>
            <lastName>si</lastName>
            <postalCode>210000</postalCode>
        </persons>
        <persons>
            <city>NanJing</city>
            <firstName>zhang</firstName>
            <lastName>san</lastName>
            <postalCode>210000</postalCode>
        </persons>
    </Persons>



<a name="5"></a>

## 五、注释

在本文前面部分，为了简化示例。我们仅使用了JAXB中的`@XmlRootElement`注解来编组和反编组XML。

我们在下面列出了最重要的一些注解:

* `XmlAccessorOrder`: 本注解控制类里的字段和属性在XML中出现的顺序。更多信息请看: [https://docs.oracle.com/javase/8/docs/.../XmlAccessOrder.html](https://docs.oracle.com/javase/8/docs/api/javax/xml/bind/annotation/XmlAccessorOrder.html)
* `XmlAccessorType`: 表示一个元素是否可以被序列化。它可以和 `javax.xml.bind.annotation.XMLAccessType`一起使用。 更多信息请看: [https://docs.oracle.com/javase/8/docs/.../XmlAccessorType.html](https://docs.oracle.com/javase/8/docs/api/javax/xml/bind/annotation/XmlAccessorType.html)
* `XmlAnyAttribute`: 映射一个元素到通配符（wildcard ）属性的Map。更多信息请看[https://docs.oracle.com/javase/8/docs/.../XmlAnyAttribute.html](https://docs.oracle.com/javase/8/docs/api/javax/xml/bind/annotation/XmlAnyAttribute.html) .
* `XmlAnyElement`: 在没有映射被预定义时，作为反编组操作的一个缺省。 更多信息请看[https://docs.oracle.com/javase/8/docs/.../XmlAnyElement.html](https://docs.oracle.com/javase/8/docs/api/javax/xml/bind/annotation/XmlAnyElement.html)
* `XmlAttribute`: 本注解是最基础和最常使用的一个。它映射一个Java元素(property, attribute, field) 到一个XML节点属性. 本教程中多个例子中用到了它。 更多信息请看 [https://docs.oracle.com/javase/8/docs/.../XmlAttribute.html](https://docs.oracle.com/javase/8/docs/api/javax/xml/bind/annotation/XmlAttribute.html)
* `XmlElement`: 使用name映射一个Java元素到XML节点。 更多信息请看 [https://docs.oracle.com/javase/8/docs/.../XmlElement.html](https://docs.oracle.com/javase/8/docs/api/javax/xml/bind/annotation/XmlElement.html)
* `XmlElementRef`: 使用type (不同于上者, name被用来做映射)映射一个Java元素到一个XML节点 . 更多信息请看 [https://docs.oracle.com/javase/8/docs/.../XmlElementRef.html](https://docs.oracle.com/javase/8/docs/api/javax/xml/bind/annotation/XmlElementRef.html)
* `XmlElementRefs`: 标记一个指向XmlElement 和JAXBElement所注解的类。更多信息请看[https://docs.oracle.com/javase/8/docs/.../XmlElementRefs.html](https://docs.oracle.com/javase/8/docs/api/javax/xml/bind/annotation/XmlElementRefs.html)
* `XmlElements`: 这是一个包含多个XMLElement 注解的容器。更多信息请看[https://docs.oracle.com/javase/8/docs/.../XmlElements.html](https://docs.oracle.com/javase/8/docs/api/javax/xml/bind/annotation/XmlElements.html)
* `XmlElementWrapper`: 它生成一个围绕XML结构的包装器，旨在和集合一起使用，本教程中我们看到了有不同的方式来处理集合。更多信息请看[https://docs.oracle.com/javase/8/docs/.../XmlElementWrapper.html](https://docs.oracle.com/javase/8/docs/api/javax/xml/bind/annotation/XmlElementWrapper.html)
* `XmlEnum`: 提供emum到XML的映射。它和XmlEnumValue一起工作。更多信息请看[https://docs.oracle.com/javase/8/docs/.../XmlEnum.html](https://docs.oracle.com/javase/8/docs/api/javax/xml/bind/annotation/XmlEnum.html)
* `XmlEnumValue`:映射一个enum常量到一个XML元素。更多信息请看[https://docs.oracle.com/javase/8/docs/.../XmlEnumValue.html](https://docs.oracle.com/javase/8/docs/api/javax/xml/bind/annotation/XmlEnumValue.html)
* `XmlID`: 映射一个属性到XML id。更多信息请看 [https://docs.oracle.com/javase/8/docs/.../XmlID.html](https://docs.oracle.com/javase/8/docs/api/javax/xml/bind/annotation/XmlID.html)
* `XmlList`: 另一种在JAXB中处理list的方式。更多信息请看 [https://docs.oracle.com/javase/8/docs/.../XmlList.html](https://docs.oracle.com/javase/8/docs/api/javax/xml/bind/annotation/XmlList.html)
* `XmlMimeType`: 控制被注解的属性的表现形式。更多信息请看[https://docs.oracle.com/javase/8/docs/.../XmlMimeType.html](https://docs.oracle.com/javase/8/docs/api/javax/xml/bind/annotation/XmlMimeType.html)
* `XmlMixed`: 被注解的元素包含混合的内容。内容可以是文本或未知的（unknown）。更多信息请看[https://docs.oracle.com/javase/8/docs/.../XmlMixed.html](https://docs.oracle.com/javase/8/docs/api/javax/xml/bind/annotation/XmlMixed.html)
* `XmlRootElement`: 这可能是JAXB中使用最多的注解了。它用于映射一个类到XML元素。它基本上是每一个JAXB的入口点。更多信息请看[https://docs.oracle.com/javase/8/docs/.../XmlRootElement.html](https://docs.oracle.com/javase/8/docs/api/javax/xml/bind/annotation/XmlRootElement.html)
* `XmlSchema`: 映射一个package到XML命名空间。更多信息请看[https://docs.oracle.com/javase/8/docs/.../XmlSchema.html](https://docs.oracle.com/javase/8/docs/api/javax/xml/bind/annotation/XmlSchema.html)
* `XmlSchemaType`: 映射一个Java类型到一个内置的simple schema。更多信息请看[https://docs.oracle.com/javase/8/docs/.../XmlSchemaType.html](https://docs.oracle.com/javase/8/docs/api/javax/xml/bind/annotation/XmlSchemaType.html)
* `XmlSeeAlso`: 告诉JAXB在绑定被注解类时，去绑定其他类。这是必须的，因为Java很难列出一个类的所有子类，使用这种机制，你可以告诉JAXB在处理一个特定类的时候哪一个子类（或其他类）应该被绑定。更多信息请看 [https://docs.oracle.com/javase/8/docs/.../XmlSeeAlso.html](https://docs.oracle.com/javase/8/docs/api/javax/xml/bind/annotation/XmlSeeAlso.html)
* `XmlType`: 用于map一个类或enum到XML Schema中的一个type。更多信息请看[https://docs.oracle.com/javase/8/docs/.../XmlType.html](https://docs.oracle.com/javase/8/docs/api/javax/xml/bind/annotation/XmlType.html)
* `XmlValue`: 允许map一个类到一个包含simpleContent 的XML Schema复杂类型或一个XML Schema的简单类型。更多信息请看[https://docs.oracle.com/javase/8/docs/.../XmlValue.html](https://docs.oracle.com/javase/8/docs/api/javax/xml/bind/annotation/XmlValue.html)

这是一个很长的列表，但是并不是所有的JAXB的注解。要查看JAXB的所有注解的列表，请查看package 的 [summary](https://docs.oracle.com/javase/8/docs/api/javax/xml/bind/annotation/package-summary.html).


## 六、适配器(Adapters)

细心的读者，可能发现在前面编组的例子中，`birthday`是`LocalDate`类型，作为复杂类型，不能很好地被编组和反编组。这时需要一个适配器。

**DateAdapter.java:**

    package net.blogways.jaxb.example.adapter;

    import java.time.LocalDate;
    import javax.xml.bind.annotation.adapters.XmlAdapter;

    public class DateAdapter extends XmlAdapter<String, LocalDate>
    {

        public LocalDate unmarshal( String date ) throws Exception
        {
            return LocalDate.parse( date );
        }

        public String marshal( LocalDate date ) throws Exception
        {
            return date.toString();
        }

    }

修改Person.java，添加`@XmlJavaTypeAdapter`注释，如下:

	@XmlJavaTypeAdapter( DateAdapter.class )
	public void setBirthday(LocalDate birthday) {
		this.birthday = birthday;
	}
	
再次运行本文前面部分的编组程序，标准输出如下：

    <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <Person>
        <birthday>2013-10-11</birthday>
        <city>NanJing</city>
        <firstName>net</firstName>
        <lastName>blogways</lastName>
        <postalCode>210000</postalCode>
    </Person>

完美了，日期也可以显示出来了！

## 七、总结

好了，至此，你已经掌握了基本的JAXB的使用方法。可以编组、反编组、编写适配器，并且对相关注释也有了一个基本的了解，至少，你知道可以去哪查询都有哪些注释了。：）

后面，我们将会继续介绍关于JAXB的一些复杂的应用。比如：

* 介绍如何通过XML Schema文件来校验XML文件格式的正确与否
* 介绍JAXBContext.newInstance的逻辑
* 介绍对XML文件中名字空间的操作
* 介绍对XML文件中processing instruction的操作
* 介绍一些和JAXB有关的常见工具的使用

本文，所使用的示例完整代码，可以在本系列文章完结时提供。

## 八、参考文献

1. [http://zh.wikipedia.org/zh/JAXB](http://zh.wikipedia.org/zh/JAXB)
2. [http://en.wikipedia.org/wiki/Java_Architecture_for_XML_Binding](http://en.wikipedia.org/wiki/Java_Architecture_for_XML_Binding)
3. [http://stackoverflow.com/questions/7709928/jaxb-vs-dom-and-sax](http://stackoverflow.com/questions/7709928/jaxb-vs-dom-and-sax)
4. [http://stackoverflow.com/questions/607141/what-is-jaxb-and-why-would-i-use-it](http://stackoverflow.com/questions/607141/what-is-jaxb-and-why-would-i-use-it)
5. [http://www.javacodegeeks.com/2014/12/jaxb-tutorial-xml-binding.html](http://www.javacodegeeks.com/2014/12/jaxb-tutorial-xml-binding.html)
6. [http://www.javacodegeeks.com/zh-hans/2015/04/%E7%94%A8%E4%BA%8Ejava%E5%92%8Cxml%E7%BB%91%E5%AE%9A%E7%9A%84jaxb%E6%95%99%E7%A8%8B.html](http://www.javacodegeeks.com/zh-hans/2015/04/%E7%94%A8%E4%BA%8Ejava%E5%92%8Cxml%E7%BB%91%E5%AE%9A%E7%9A%84jaxb%E6%95%99%E7%A8%8B.html)




