---
layout: post
category: Apache
title: Apache Commons 系列简介 之 BeanUtils
tags: ['Apache Commons', 'BeanUtils']
author: 唐 治
email: tangzhi@asiainfo-linkage.com
description: 介绍Apache Commons 系列中的 BeanUtils 库

---


### 一、概述

大部分Java开发人员都会安装JavaBeans的命名规范为属性创建getter和setter方法，我们可以直接通过getXxx和setXxx方法直接进行调用。但是，也有一些场合我们必须动态访问java对象的属性，比如：

* 为和java对象模型进行交互，而创建的脚本语言（如：`Bean Scripting Framework`）
* 为处理WEB展示或者类似需求，而创建的模板语言(如：`JSP`和`Velocity`)
* 为JSP和XSP环境创建自定义tag库(如：`Apache Taglibs`、`Struts`和`Cocoon`)
* 对一些基于XML配置的资源的处理（如：`Ant`构建脚本，web应用部署配置文件，Tomcat的`server.xml`文件等等）

Java语言提供了反射(`Reflection`)和内省(`Introspection`[^1])API（见`java.lang.reflect`和`java.beans`这两个包说明），但这些API很难理解并加以应用。而BeanUtils库的目的，就是针对这些能力提供了易用的包装。

[^1]: Java程序可以在运行是加载Class，获取其构造方法的定义，并生成其对象实体、或对其fields设值、或唤起其methods。这种“透视Class”的能力（`the ability of the program to examine itself`），被称为`Introspection`

### 二、下载及源码

下载地址：

    http://commons.apache.org/proper/commons-beanutils/download_beanutils.cgi
    
源码获取：

    svn checkout http://svn.apache.org/repos/asf/commons/proper/beanutils/trunk/ commons-beanutils
    
Github镜像：

    https://github.com/apache/commons-beanutils
    
Maven依赖：

```
<dependency>
    <groupId>commons-beanutils</groupId>
    <artifactId>commons-beanutils</artifactId>
    <version>1.9.0</version>
</dependency>
```

### 三、使用说明

自从`1.7.0`版开始，BeanUtils发布三个jar包，供应用调用：

* `commons-beanutils.jar` 包含所有功能
* `commons-beanutils-core.jar` 包含除`Bean Collections`类外的所有功能
* `commons-beanutils-bean-collections.jar` 只包含`Bean Collections`类

应用可以根据需求，选择使用。

在运行时，`commons-beanutils`包依赖`commons-logging`包，另外，如果使用了下面几个类，则还需要依赖`commons-collections`包：
 
 * `org.apache.commons.beanutils.BeanMap`
 * `org.apache.commons.beanutils.BeanPredicate`
 * `org.apache.commons.beanutils.BeanPropertyValueChangeClosure`
 * `org.apache.commons.beanutils.BeanPropertyValueEqualsPredicate`
 * `org.apache.commons.beanutils.BeanToPropertyValueTransformer`
 
#### 3.1 标准JavaBeans

在介绍之前，我们先给一个对象的定义，后面的实例将结合这个对象给出。

```
public class Employee {
    public Address getAddress(String type);
    public void setAddress(String type, Address address);
    public Employee getSubordinate(int index);
    public void setSubordinate(int index, Employee subordinate);
    public String getFirstName();
    public void setFirstName(String firstName);
    public String getLastName();
    public void setLastName(String lastName);
}
```

#### 3.1.1 基本属性读写

首先，我们介绍`PropertyUtils`类，其作用：


* 可以很容易的读取或者设置简单的属性值
    
    所谓“简单”的属性，是指：属性只是一个简单的可被读写的值。这个属性的类型，可能是java语言原生类型（如:`int`或一个简单对象`java.lang.String`等），也可能是一个由程序或者类库定义的复杂的对象
    
    对其操作的API有：
    
    ```
    //读操作
    PropertyUtils.getSimpleProperty(Object, String)
    //写操作
    PropertyUtils.setSimpleProperty(Object, String, Object)
    ```
    
    例如：
    
    ```
    Employee employee = ...;
    String firstName = (String)
       PropertyUtils.getSimpleProperty(employee, "firstName");
    String lastName = (String)
       PropertyUtils.getSimpleProperty(employee, "lastName");
    ... manipulate the values ...
    PropertyUtils.setSimpleProperty(employee, "firstName", firstName);
    PropertyUtils.setSimpleProperty(employee, "lastName", lastName);
    ```
    
* 针对带序列的属性，支持两种操作方式。

    所谓“带序列”的属性，是指：一组有序的对象集合，可以通过自然数下标单独访问。或者可以如同数组那样进行读写。如果，属性的类型是`java.util.List`也可以。
    
    * 一种方式：将下标使用方括号括起来，然后跟在属性名后，当做属性名使用。
    
        其API为：
    
        ```
        //读操作
        PropertyUtils.getIndexedProperty(Object, String)
        //取操作
        PropertyUtils.setIndexedProperty(Object, String, Object)
        ```
        
        例如：
        
        ```
        Employee employee = ...;
        int index = ...;
        String name = "subordinate[" + index + "]";
        Employee subordinate = (Employee)
        PropertyUtils.getIndexedProperty(employee, name);
        ```

    * 另外一种方式：将下标作为一个单独的参数使用。
    
        其API：
        
        ```
        PropertyUtils.getIndexedProperty(Object, String, int)
        PropertyUtils.setIndexedProperty(Object, String, int, Object)
        ```
        
        例如：
        
        ```
        Employee employee = ...;
        int index = ...;
        Employee subordinate = (Employee)
        PropertyUtils.getIndexedProperty(employee, "subordinate", index);
        ```

* 针对可以Maped的属性，支持两种操作方式，类似上面的带序列属性的读写操作。

    所谓“可以Maped”的属性值，是指属性类型为`java.util.Map`。可以通过String型的键，对其进行读写。
    
    * 一种方式：将键值用圆括号括起来，跟在属性名后面，当做属性名使用。
    
        其API：
        
        ```
        //读操作
        PropertyUtils.getMappedProperty(Object, String)
        //写操作
        PropertyUtils.setMappedProperty(Object, String, Object)
        ```
        
        例如：
        
        ```
        Employee employee = ...;
        Address address = ...;
        PropertyUtils.setMappedProperty(employee, "address(home)", address);
        ```
    
    
    * 另外一种方式：将键值作为一个单独的参数使用。
    
        其API：
        
        ```
        //读操作
        PropertyUtils.getMappedProperty(Object, String, String)
        //写操作
        PropertyUtils.setMappedProperty(Object, String, String, Object)
        ```

        例如：
        
        ```
        Employee employee = ...;
        Address address = ...;
        PropertyUtils.setMappedProperty(employee, "address", "home", address);
        ```

#### 3.1.2 嵌套属性读写

结合上面的例子，如果我们要访问雇员家庭地址中的城市信息，按常规编程方式，代码如下：

    String city = employee.getAddress("home").getCity();

要使用`PropertyUtils`来访问类似上面的多层属性，可以通过`.`符号将属性名串联起来作为访问路径。使用的API为：

```
PropertyUtils.getNestedProperty(Object, String)
PropertyUtils.setNestedProperty(Object, String, Object)
```

上面实例的等效代码为：

```
String city = (String) PropertyUtils.getNestedProperty(employee, "address(home).city");
```
    
**这里再给出一组更简单的常用的API：**

```
//读操作
PropertyUtils.getProperty(Object, String)
//写操作
PropertyUtils.setProperty(Object, String, Object)
```

使用举例：

```
Employee employee = ...;
String city = (String) PropertyUtils.getProperty(employee,
       "subordinate[3].address(home).city");
```

#### 3.2 动态 Beans

上面介绍的`PropertyUtils`类，可以轻松地对已经存在的JavaBean的属性进行访问。但是，有些场合，你需要通过动态计算出来的属性集，来确定一个JavaBean，而不必实际编写某个确定的JavaBean。

为此目的，BeanUtils提供`DynaBean`接口和与之相关的`DynaClass`接口。

我们看看代码，如何使用`DynaBean`来实现前面`Employee`类的功能：

```
DynaBean employee = ...; // 这里的代码，要根据你使用的具体的BynaBean实现来定了
String firstName = (String) employee.get("firstName");
Address homeAddress = (Address) employee.get("address", "home");
Object subordinate = employee.get("subordinate", 2);
```

由于`DynaBean`和`DynaClass`仅仅是接口，所以可以有不同的实现。可以根据不同的场景，开发不同的实现。下面我们来介绍几个`BeanUtils`内置的实现，你也可以根据你的具体需求，来定制自己的实现。

#### 3.2.1 `BasicDynaBean`和`BasicDynaClass`

我们结合前面的`Employee`例子，来介绍`BasicDynaBean`和`BasicDynaClass`的使用步骤及实例代码如下：

1. 创建属性集
    
    ```
    DynaProperty[] props = new DynaProperty[]{
         new DynaProperty("address", java.util.Map.class),
         new DynaProperty("subordinate", Employee[].class),
         new DynaProperty("firstName", String.class),
         new DynaProperty("lastName",  String.class)
       };
    ```
2. 创建`BasicDynaClass`

    ```
    BasicDynaClass dynaClass = new BasicDynaClass("employee", null, props);
    ```
    这里`BasicDynaClass`构造方法接收的第二个参数是`null`，它内部会作为`BasicDynaBean.class`来处理。
    
    
3. 获取`DynaBean`实例并操作

    ```
    DynaBean employee = dynaClass.newInstance();
    employee.set("address", new HashMap());
    employee.set("subordinate", new Employee[0]);
    employee.set("firstName", "Fred");
    employee.set("lastName", "Flintstone");
    ```
    
    这里，`dynaClass.newInstance()`的返回值的类型为`DynaBean`而不是上文中设置的`BasicDynaBean`,这是因为，一般情况下，程序是不关心具体实现，而只需要根据`BynaBean`的接口进行访问就行了。
    
#### 3.2.2 `ResultSetDynaClass`（使用`DynaBeans`去包装`ResultSet`）

将一系列有关系的，但自身又不是JavaBean的数据集合，包装起来，是`DynaBean`API的一个最普遍的使用方式。这其中一个经典应用就是，使用`DynaBean`去包装，用`JDBC`执行一个`SELECT`语句返还的结果`java.sql.ResultSet`对象。

看下面的例子：

```
Connection conn = ...;
Statement stmt = conn.createStatement();
ResultSet rs = stmt.executeQuery
     ("select account_id, name from customers");
Iterator rows = (new ResultSetDynaClass(rs)).iterator();
while (rows.hasNext()) {
    DynaBean row = (DynaBean) rows.next();
    System.out.println("Account number is " +
                        row.get("account_id") +
                        " and name is " + row.get("name"));
}
rs.close();
stmt.close();
```

#### 3.2.3 `RowSetDynaClass`(将离线的`ResultSet`包装成`DynaBeans`)

尽管使用`ResultSetDynaClass`很方便，但是它要求查询的结果集在数据整个处理过程中一直保持`open`状态。然而，有时我们需要先将结果集关闭后，再去处理查询结果的内容。不过这种方式的缺点是，我们需要足够的内存存储查询结果，以及存储过程中所需的性能损耗。如果，你能接受这点，那就可以使用`RowSetDynaClass`.

看下面的例子：

```
Connection conn = ...;  // 从连接池获取连接
Statement stmt = conn.createStatement();
ResultSet rs = stmt.executeQuery("SELECT ...");
RowSetDynaClass rsdc = new RowSetDynaClass(rs);
rs.close();
stmt.close();
...;                    // 将连接放回连接池
List rows = rsdc.getRows();
...;                    // 处理记录
```

使用`RowSetDynaClass`有个额外的好处，由于`RowSetDynaClass`实现了`java.io.Serializable`，所以可以很容易的序列化和反序列化。这样，使用`RowSetDynaClass`就可以很容易地将SQL语句查询结果传输给远程的java端应用。

#### 3.2.4 `WrapDynaBean`和`WrapDynaClass`

如果，你习惯使用`DynaBeans`去通过`set`和`get`方法去对`DynaBeans`进行存取属性。而标准的JavaBean肯定不具备这样的方法。没关系，你可以使用`WrapDynaBean`让现有的标准JavaBean也可以变得这样更易访问。

看例子：

```
MyBean bean = ...;
DynaBean wrapper = new WrapDynaBean(bean);
String firstName = wrapper.get("firstName");
```

#### 3.2.5 `Lazy DynaBeans`

包含有下面几个类：

* LazyDynaBean 一个“懒”动态Bean
* LazyDynaMap 一个轻量级的可以转换为Map的DynaBean。
* LazyDynaList 一个可以存放`DynaBean`、`java.util.Map`或者`POJO`的"懒"列表
* LazyDynaClass `MutableDynaClass`接口的一个实现

`Lazy DynaBeans`具备下面的特性：
* 可以通过`set(name, value)`方法自动添加属性
* `List`或`Array`的序列不够时，可以自动增长
* 自动实例化，在调用`setter/getter`方法中，会根据上下文进行实例化，创建对应的`Bean`、`List`或者`Map`等实例。

简单举例如下：

1. `LazyDynaBean`
    
    ```
    DynaBean dynaBean = new LazyDynaBean();

    dynaBean.set("foo", "bar");                   // simple

    dynaBean.set("customer", "title", "Mr");      // mapped
    dynaBean.set("customer", "surname", "Smith"); // mapped

    dynaBean.set("address", 0, addressLine1);     // indexed
    dynaBean.set("address", 1, addressLine2);     // indexed
    dynaBean.set("address", 2, addressLine3);     // indexed
    ```
   
1. `LazyDynaMap`

    如果你想将动态Bean转换为Map，可以这样：
    
    ```
    DynaBean dynaBean = new LazyDynaMap();        // create DynaBean

    dynaBean.set("foo", "bar");                   // simple
    dynaBean.set("customer", "title", "Mr");      // mapped
    dynaBean.set("address", 0, addressLine1);     // indexed

    Map myMap = dynaBean.getMap()                 // retrieve the Map
    ```
    
    如果你想将Map转换为动态Bean，可以这样：
    
    ```
    Map myMap = ....                             // exisitng Map
    DynaBean dynaBean = new LazyDynaMap(myMap);  // wrap Map in DynaBean
    dynaBean.set("foo", "bar");                  // set properties
    ```

1. `LazyDynaList`
    
    * 你可以将任意一个`java.util.Map[]`数值放到`LazyDynaList`里面去：
    
    ```
    TreeMap[] myArray = .... // your Map[]
    List lazyList = new LazyDynaList(myArray);
    ```
    
    * `get(index)`方法将自动增长list的序列：
    
    ```
    DynaBean newElement = (DynaBean)lazyList.get(lazyList.size());
    newElement.put("someProperty", "someValue");
    ```
    
    * 操作结束后，可以再转换为map:
    
    ```
    TreeMap[] myArray = (TreeMap[])lazyList.toArray());
    ```
    
    * 你也可以创建空的列表，指定其中元素的类，`LazyDynaList`可以根据指定的类自动填充元素：
    
    ```
    List lazyList = new LazyDynaList(TreeMap.class);
    List lazyList = new LazyDynaList(MyPojo.class);
    List lazyList = new LazyDynaList(MyDynaBean.class);
    
    DynaClass dynaClass = new LazyDynaMap(new HashMap());
    List lazyList = new LazyDynaList(dynaClass);
    
    DynaClass dynaClass = (new WrapDynaBean(myPojo)).getDynaClass();
    List lazyList = new LazyDynaList(dynaClass);
    
    DynaClass dynaClass = new BasicDynaClass(properties);
    List lazyList = new LazyDynaList(dynaClass);
    ```
    
    上面之所以使用`DynaClass`来替代普通的`Class`，是因为有些DynaBean的实现没有默认的空参数的构造方法，而`DynaClass`提供了`DynaClass.newInstance()`方法。
    
    * 当然，也可以使用`setElementType(Class)`或者`setElementDynaClass(DynaClass)`方法来设置元素类型，然后使用普通的`java.util.List`接口提供的方法(比如:`set/add/addAll`)来填充元素:
    
    ```
    // Create a new LazyDynaList (100 element capacity)
    LazyDynaList lazyList = new LazyDynaList(100);

    // Either Set the element type...
    lazyList.setElementType(TreeMap.class);

    // ...or the element DynaClass...
    lazyList.setElementDynaClass(new MyCustomDynaClass());

    // Populate from a collection
    lazyList.addAll(myCollection);
    ```
        
1. `LazyDynaClass`
    
    `LazyDynaClass`继承于`BasicDynaClass`,实现了`MutableDynaClass`接口。我们在使用`LazyDynaBean`时，有时不需要关系其内部结构，这样就不需要操作`DynaClass`，但有时，我们需要强制其内部成员结构，这样就需要设置`DynaClass`。做这种强制内部结构的操作，有两种方式：
    
    * 我们可以先创建`LazyDynaClass`，设置结构，然后再生成`LazyDynaBean`:
    
    ```
    MutableDynaClass dynaClass = new LazyDynaClass();    // create DynaClass

    dynaClass.add("amount", java.lang.Integer.class);    // add property
    dynaClass.add("orders", OrderBean[].class);          // add indexed property
    dynaClass.add("orders", java.util.TreeMapp.class);   // add mapped property

    DynaBean dynaBean = new LazyDynaBean(dynaClass);     // Create DynaBean with associated DynaClass
    ```
    
    * 我们也可以先生成`LazyDynaBean`,再获取`DynaClass`设置结构：
    
    ```
    DynaBean dynaBean = new LazyDynaBean();              // Create LazyDynaBean
    MutableDynaClass dynaClass =
              (MutableDynaClass)dynaBean.getDynaClass();  // get DynaClass

    dynaClass.add("amount", java.lang.Integer.class);    // add property
    dynaClass.add("myBeans", myPackage.MyBean[].class);  // add 'array' indexed property
    dynaClass.add("myMap", java.util.TreeMapp.class);    // add mapped property
    ```

#### 3.3 数据类型转换

BeanUtils包提供了一系列API和设计模式来解决数据类型转换问题。

看下面的例子：

```
HttpServletRequest request = ...; 
MyBean bean = ...; 

BeanUtils.populate(bean, request.getParameterMap()); 
```

`BeanUtils`是依赖`ConvertUtils`提供的方法进行数据转换的，`ConvertUtils`不推荐直接使用，因为以后的版本中可能会被废弃。

你也可以定制自己的转换器，方法很简单，两个步骤：

* 实现`Converter`接口，在其中的`convert`方法中实现你的转换规则
* 使用`ConvertUtils.register()`方法注册你自己的转换器

举一个简单的例子：

```
public class Person{ 
    private Date birthday; 
    public Date getBirthday() {  
        return birthday;  
	}  
	public void setBirthday(Date birthday) {  
	    this.birthday = birthday;  
	}  
    
    ...
}

//
DateConverter dc = new DateConverter(); 
dc.setPattern("yyyy-mm-dd");
ConvertUtils.register(dc, java.util.Date.class); 

//
Person person = new Person();
String bd = "2014-01-15";
BeanUtils.setProperty(person, "birthday", bd);
```

在上面的例子中，如果不定制转换器，那么生日的属性设置会报错。

#### 3.4 集合

与`Apache Commons Collections`包配合，去实现一些对集合的操作。比如：

* 根据集合中bean的某个属性值，对集合中得bean进行排序
    
    看代码：
    
    ```
    Collections.sort(peopleCollection, new BeanComparator("firstName"));
    ```
    上面代码，会根据bean中`firstName`属性对集合`peopleCollection`进行排序。
    
    
    ```
    Collections.sort(peopleCollection, new BeanComparator("firstName", new ReverseComparator(new ComparableComparator())));
    ```
    上面代码是做逆序。
    
* 修改集合中Bean的某属性值
    
    看代码：
    
    ```
    // create the closure
    BeanPropertyValueChangeClosure closure =
         new BeanPropertyValueChangeClosure( "activeEmployee", Boolean.TRUE );

    // update the Collection
    CollectionUtils.forAllDo( peopleCollection, closure );
    ```
    上面代码，会将集合`peopleCollection`内所有bean的属性`activeEmployee`都设置为`Boolean.TRUE`.
    
* 通过Bean中某属性值是否相等来对集合进行过滤
    
    看代码：
    
    ```
    // create the predicate
    BeanPropertyValueEqualsPredicate predicate =
         new BeanPropertyValueEqualsPredicate( "activeEmployee", Boolean.FALSE );

    // filter the Collection
    CollectionUtils.filter( peopleCollection, predicate );
    ```
    上面代码，会将集合`peopleCollection`中属性`activeEmployee`不为false的bean都删除。
    
* 通过Bean的属性路径来获取数据

    看代码：
    
    ```
    // create the transformer
    BeanToPropertyValueTransformer transformer = new BeanToPropertyValueTransformer( "person.address.city" );

    // transform the Collection
    Collection peoplesCities = CollectionUtils.collect( peopleCollection, transformer );
    ```
    上面代码，会将集合`peopleCollection`中所有bean的`person.address.city`属性值都收集到集合`peoplesCities`中去。
