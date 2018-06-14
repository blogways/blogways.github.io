---
layout: post
title: Esper复杂事件处理引擎 - 入门简介
category: ['杂记']
tags: ['esper', 'cep']
author: 万洲
email: wanzhou@asiainfo.com
description: CEP，是一种实时事件处理并从大量事件数据流中挖掘复杂模式的技术，全称为Complex Event Processing，即复杂事件处理。Esper是CEP的一个开源实现，它是一个Java开发的事件流处理和复杂事件处理引擎。该引擎可应用于网络入侵探测，SLA监测，RFID读取，航空运输调控，金融方面(风险管理，欺诈探测)等领域。它的特点是能够快速开发出复杂的实时计算策略，并且有着高吞吐量以及低延迟的特点，特别适合大量数据的实时计算。
---

|  |  *目 录* |
| --- | --- |
| 1 | [Esper简介](#link1) |
| 2 | [事件类型](#link2) |
| 3 | [处理模型](#link3) |
| 4 | [未完待续...](#link4) |

<a id="link1"></a>
<style>
.red { color: red; }
.blue { color: blue; }
</style>

<a id='link1'></a>

## 一、Esper简介
将`Espser`之前，首先要讲`CEP`，是一种实时事件处理并从大量事件数据流中挖掘复杂模式的技术，全称为Complex Event Processing，即复杂事件处理。`CEP`是一种标准，`Esper`只是对这个标准的一种开源实现。

听起来好像很复杂，实际上就是基于事件流进行数据处理，把要分析的数据抽象成事件，然后将数据发送到`CEP`引擎，引擎就会根据事件的输入和最初注册的处理模型，得到事件处理结果。

`CEP`的一个重要特点就是他是一个<i class='red'>内存计算</i>工具和<i class='red'>类SQL</i>语句。

有朋友可能会想到目前很流行的一个实时计算框架——`Storm`，但这两个完全不是一类东西。`Esper`的特点在于它的复杂处理逻辑可以用类SQL语句（EPL）开发，而`Storm`的特点在于***并行计算***和***快速恢复***，但是计算逻辑是需要自己用代码实现的。

前面说了，`Esper`，是`CEP`的一个开源实现，它是一个Java的事件流处理和复杂事件处理的引擎（.NET为NEsper）。

`Esper`引擎可应用于如下等领域：

* 网络入侵探测
* SLA监测
* RFID读取
* 航空运输调控
* 金融方面(风险管理，欺诈探测)等

其特点是能够快速开发出复杂的实时计算策略，并且有着高吞吐量以及低延迟的特点，特别适合<i class='red'>大量数据的实时计算</i>。

<i class='red'>**注意**：</i>

* 后续所有测试例子中的`Java Bean`都没有写出`getter`，`setter`，`toString`，如有需要请自行添加。

### 1.1 EPL 简述
`EPL`，即Event Proess Language，`CEP`的类SQL语句，可以理解为处理模型的定义与描述。

这是运行在`CEP`引擎中的特殊语句，之所以叫他类SQL，是因为它和SQL确实很像，除了`select`，`insert`，`delete`，`update`，而且也有`avg`，`count`等函数。所以对于会SQL的人来说，他的语法结构大致还是能猜出一二的。

工作模式有点类似于一个数据库的 <i class='red'>**倒置**</i>，它允许应用程序存储查询并让数据通过，而不是存储数据并在存储的数据上运行查询语句（应用程序存储查询，并让数据运行通过）。当匹配查询的条件时，响应逻辑触发。

数据库是先存储数据，通过编译解析SQL，完成已存储数据的查询，Esper则是先编译EPL语句，形成一个过滤（或处理）层（或者网），实时过来的数据，通过这个过滤层完成有效事件的筛选或形成有效事件。


如：

	select * from Apple
	select avg(price) from Apple.win:length_batch(3)

测试代码如下所示：

	/**
	 * Created by wanzhou on 16/8/1.
	 */
	import com.espertech.esper.client.*;
	
	class Apple
	{
	  private int id;
	  private int price;
	}
	
	class AppleListener implements UpdateListener
	{
	
	  public void update(EventBean[] newEvents, EventBean[] oldEvents)
	  {
	    if (newEvents != null)
	    {
	//      Double avg = (Double) newEvents[0].get("avg(price)");
	//      System.out.println("Apple's average price is " + avg);
	      for (int i = 0; i < newEvents.length; i++) {
	        System.out.println(newEvents[i].getUnderlying());
	      }
	    }
	  }
	
	}
	
	public class AverageTest {
	  public static void main(String[] args) throws InterruptedException {
	    EPServiceProvider epService = EPServiceProviderManager.getDefaultProvider();
	
	    EPAdministrator admin = epService.getEPAdministrator();
	
	    EPRuntime runtime = epService.getEPRuntime();
	
	    String product = Apple.class.getName();
	    String epl = "select avg(price) from " + product + ".win:length_batch(2)";
		// String epl = "select * from Apple.win:length_batch(2)";
	
	    EPStatement state = admin.createEPL(epl);
	    state.addListener(new AppleListener());
	
	
	    Apple apple1 = new Apple();
	    apple1.setId(1);
	    apple1.setPrice(5);
	    runtime.sendEvent(apple1);
	
	    Apple apple2 = new Apple();
	    apple2.setId(2);
	    apple2.setPrice(2);
	    runtime.sendEvent(apple2);
	
	    Apple apple3 = new Apple();
	    apple3.setId(3);
	    apple3.setPrice(5);
	    runtime.sendEvent(apple3);
	
	    Apple apple4 = new Apple();
	    apple4.setId(4);
	    apple4.setPrice(6);
	    runtime.sendEvent(apple4);
	
	    Apple apple5 = new Apple();
	    apple5.setId(5);
	    apple5.setPrice(7);
	    runtime.sendEvent(apple5);
	  }
	}

### 1.2 事件类型
`Esper` 对处理的数据结构有明确的要求，能处理的数据结构：

* POJO ( java.lang.Object )
* java.util.Map
* Object[]
* XML

特点：

* 支持nested、indexed、mapped属性（嵌套没有层数限制）
* 需要告知引擎类型元数据，包括嵌套的数据。
* 能改变属性顺序，或抽取部分属性到一个新的事件。
* Object、Map 和 Object[] 类型支持超类( Supertype )

### 1.3 事件属性
| ***类型***|  ***说明*** | ***语法*** | ***实例***|
| --- | --- | --- | --- |
| Simple | 只包含单个值得属性 | name | price |
| Indexed | 索引 | name[index] | price[0] |
| Mapped | map属性 | name['key'] | apple('price') |
| nested | 属性嵌套 | name.nestedname | apple.price|

组合上述所有的属性，如：

	person.address(‘home’).street[0]
	
* 事件属性示例
		
		public class MyEventType {
		String myMapKey;
		int myIndexValue;
		int myInnerIndexValue;
		Map<String, InnerType> innerTypesMap; // mapped property
		InnerType[] innerTypesArray; // indexed property
		}
		public class InnerType {
		String name;
		int[] ids;
		}
		
		select innerTypesMap('somekey').ids[1],
		// innerTypesMap(myMapKey).getIds(myIndexValue),
		innerTypesArray[1].ids[2],
		// innerTypesArray(myIndexValue).getIds(myInnerIndexValue)
		from MyEventType

### 1.4 动态事件属性
| ***类型*** | ***语法*** |
| --- | --- |
| Dynamic Simple | name? |
| Dynamic Indexed | name[index]? |
| Dynamic Mapped | name('key')? |
| Dynamic Nested | name?.nestedname |

	select timestamp? from OrderEvent

	select detail?.driection from OrderEvent
	
`OrderEvent` 拥有多个接口类，其中某个或某些有`timestamp`属性，则其动态属性
	
	select timestamp? from OrderEvent

如果动态属性是嵌套属性，则
	
	select detail?.driection from OrderEvent
等价于
	
	select detail?.direction? from OrderEvent

* 示例

	动态属性返回值总是 `java.lang.Object` 类型，在事件进程运行时，动态属性不存在，则返回 `null`。

	如：事件`OrderEvent`拥有一个`item`属性，通过动态属性指定一个查询来取得`Service`或`Product`的价格，如：

		select item.price? from OrderEvent


	如果`OrderEvent` 拥有多个接口类，其中某个或某些有`timestamp`属性，则其动态属性：

		select timestamp? from OrderEvent


	如果动态属性是嵌套属性，则动态属性下的所有嵌套属性都为动态属性：

		select detail?.driection from OrderEvent
	等价于

		select detail?.direction? from OrderEvent

* 测试代码

		class OrderEvent {
		  Object item;
		}
		
		class Serivce {
		  String name;
		  int price;
		}
		
		class Product {
		  String name;
		  int price;
		  String info;
		}
		
		class DynamicListener implements UpdateListener
		{
		
		  public void update(EventBean[] newEvents, EventBean[] oldEvents)
		  {
		    if (newEvents != null)
		    {
		//      Double avg = (Double) newEvents[0].get("item.price?");
		//      System.out.println("Apple's average price is " + avg);
		      for (int i = 0; i < newEvents.length; i++) {
		        System.out.println(newEvents[i].getUnderlying());
		      }
		    }
		  }
		
		}
		
		public class DynamicProps {
		  public static void main(String[] args) throws InterruptedException {
		    EPServiceProvider epService = EPServiceProviderManager.getDefaultProvider();
		
		    EPAdministrator admin = epService.getEPAdministrator();
		
		    String epl = "select item.info? from OrderEvent";
		
		    EPStatement state = admin.createEPL(epl);
		    state.addListener(new AppleListener());
		
		    EPRuntime runtime = epService.getEPRuntime();
		
		    Product product = new Product();
		    product.setName("pdt1");
		    product.setPrice(5);
		    product.setInfo("Product Info.");
		
		    OrderEvent oe1 = new OrderEvent();
		    oe1.setItem(product);
		    runtime.sendEvent(oe1);
		
		    Serivce svr = new Serivce();
		    svr.setName("svr");
		    svr.setPrice(10);
		
		    OrderEvent oe2 = new OrderEvent();
		    oe2.setItem(svr);
		    runtime.sendEvent(oe2);
		  }
		}
		
<a id='link2'></a>

## 二、事件类型

### 2.1 POJO（`java.lang.Object`）

对于POJO，`Esper`要求对每一个私有属性要有`getter`方法。`Esper`允许不必按照`JavaBean`规定的格式，但是`getter`方法是必须的。又或者可以在配置文件中配置可访问的方法来代替`getter`。

	public class Person  
	{  
	    String name;  
	    int age;  
	    public String getName()  
	    {  
	        return name;  
	    }  
	    public int getAge()  
	    {  
	        return age;  
	    }  
	} 

`Esper`对POJO的支持基本上就是上面所说的，另外他还支持实现了多个接口类或者抽象类的POJO，使用方法和普通的POJO没什么区别，这里就不列举了。

当`Person`的name属性为test时，得到对应的age,所有children和address.

	select age,children,address from Person where name="test" 
当Person的name属性为test时，得到对应的第二个孩子,家里的电话和家庭住址在哪条路上  

	select children[1], phones('home'), address.road from Person where name="test”
	public Child getChildren(int index) { // 返回对应下标的children信息
		return children.get(index);
	}

当`Person`的name属性为test时，更新家里的电话  

	update Person set phones('home') = 123456789 where name="test" 
	public void setPhones(String name, Integer number) {  
	   phones.put(name, number); // 用于 phones 属性的更新
	} 

* PojoPersonTest 测试示例：

		class PojoPerson implements Serializable {
		  String pname;
		  int age;
		  List<Child> children;
		  Map<String, Integer> phones;
		  Address address;
		
		  public String getPname() {
		    return pname;
		  }
		
		  public void setPname(String pname) {
		    this.pname = pname;
		  }
		
		  public int getAge() {
		    return age;
		  }
		
		  public void setAge(int age) {
		    this.age = age;
		  }
		
		  public List<Child> getChildren() {
		    return children;
		  }
		
		  public Child getChildren(int index) {
		    return children.get(index);
		  }
		
		  public void setChildren(List<Child> children) {
		    this.children = children;
		  }
		
		  public Map<String, Integer> getPhones() {
		    return phones;
		  }
		
		  public void setPhones(Map<String, Integer> phones) {
		    this.phones = phones;
		  }
		
		  public void setPhones(String name, Integer number) {
		    System.out.println("=======");
		    phones.put(name, number);
		  }
		
		  public Address getAddress() {
		    return address;
		  }
		
		  public void setAddress(Address address) {
		    this.address = address;
		  }
		
		  @Override
		  public String toString() {
		    return "PojoPerson{" +
		        "name='" + pname + '\'' +
		        ", age=" + age +
		        ", children=" + children +
		        ", phones=" + phones +
		        ", address=" + address +
		        '}';
		  }
		}
		
		class Child
		{
		  String cname;
		  int gender;
		
		  public String getCname() {
		    return cname;
		  }
		
		  public void setCname(String cname) {
		    this.cname = cname;
		  }
		
		  public int getGender() {
		    return gender;
		  }
		
		  @Override
		  public String toString() {
		    return "Child{" +
		        "name='" + cname + '\'' +
		        ", gender=" + gender +
		        '}';
		  }
		
		  public void setGender(int gender) {
		    this.gender = gender;
		  }
		}
		
		class Address
		{
		  String road;
		  String street;
		  int houseNo;
		
		  public String getRoad() {
		    return road;
		  }
		
		  public void setRoad(String road) {
		    this.road = road;
		  }
		
		  public String getStreet() {
		    return street;
		  }
		
		  public void setStreet(String street) {
		    this.street = street;
		  }
		
		  public int getHouseNo() {
		    return houseNo;
		  }
		
		  public void setHouseNo(int houseNo) {
		    this.houseNo = houseNo;
		  }
		
		  @Override
		  public String toString() {
		    return "Address{" +
		        "road='" + road + '\'' +
		        ", street='" + street + '\'' +
		        ", houseNo=" + houseNo +
		        '}';
		  }
		}
		
		
		public class PojoPersonTest {
		  public static void main(String[] args) {
		
		    EPServiceProvider epService = EPServiceProviderManager.getDefaultProvider();
		    EPAdministrator admin = epService.getEPAdministrator();
		    EPRuntime runtime = epService.getEPRuntime();
		
		    String qry1 = "select age,children,address from PojoPerson where pname = \"张三\"";
		    String qry2 = "select children[1], phones('home'), address.road from PojoPerson where pname=\"李四\"";
		    String qry = "select * from PojoPerson";
		
		    EPStatement state1 = admin.createEPL(qry1);
		    state1.addListener(new UpdateListener() {
		      public void update(EventBean[] newEvents, EventBean[] oldEvents) {
		        if (null != newEvents) {
		          System.out.print("qry1=====  ");
		          System.out.println(newEvents[0].getUnderlying());
		        }
		      }
		    });
		
		    EPStatement state2 = admin.createEPL(qry2);
		    state2.addListener(new UpdateListener() {
		      public void update(EventBean[] newEvents, EventBean[] oldEvents) {
		        if (null != newEvents) {
		          System.out.print("qry2+++++  ");
		          System.out.println(newEvents[0].getUnderlying());
		        }
		      }
		    });
		
		
		    EPStatement state = admin.createEPL(qry);
		    state.addListener(new UpdateListener() {
		      public void update(EventBean[] newEvents, EventBean[] oldEvents) {
		        if (null != newEvents) {
		          System.out.print("qry----  ");
		          for (int i = 0; i < newEvents.length; i++) {
		            System.out.println(newEvents[i].getUnderlying());
		          }
		        }
		      }
		    });
		
		    PojoPerson pp1 = new PojoPerson();
		    Address a1 = new Address();
		    a1.setHouseNo(100);
		    a1.setRoad("Address 1");
		    a1.setStreet("Street 1");
		    pp1.setAddress(a1);
		    pp1.setPname("张三");
		    pp1.setAge(30);
		    Map<String, Integer> p1 = new HashMap<String, Integer>();
		    p1.put("home", 1333333333);
		    p1.put("work", 1333333334);
		    pp1.setPhones(p1);
		    List<Child> lc1 = new ArrayList<Child>();
		    Child ch1 = new Child();
		    ch1.setCname("张四");
		    ch1.setGender(1);
		    lc1.add(ch1);
		    pp1.setChildren(lc1);
		    runtime.sendEvent(pp1);
		
		    PojoPerson pp2 = new PojoPerson();
		    Address a2 = new Address();
		    a2.setHouseNo(100);
		    a2.setRoad("Address 1");
		    a2.setStreet("Street 1");
		    pp2.setAddress(a2);
		    pp2.setPname("李四");
		    pp2.setAge(30);
		    Map<String, Integer> p2 = new HashMap<String, Integer>();
		    p2.put("home", 1444444444);
		    p2.put("work", 1444444445);
		    pp2.setPhones(p2);
		    List<Child> lc2 = new ArrayList<Child>();
		    Child ch21 = new Child();
		    ch21.setCname("李五");
		    ch21.setGender(1);
		    lc2.add(ch21);
		    Child ch22 = new Child();
		    ch22.setCname("李六");
		    ch22.setGender(0);
		    lc2.add(ch22);
		    pp2.setChildren(lc2);
		    runtime.sendEvent(pp2);
		
		    PojoPerson pp3 = new PojoPerson();
		    Address a3 = new Address();
		    a3.setHouseNo(100);
		    a3.setRoad("Address 1");
		    a3.setStreet("Street 1");
		    pp3.setAddress(a3);
		    pp3.setPname("test");
		    pp3.setAge(30);
		    Map<String, Integer> p3 = new HashMap<String, Integer>();
		    p3.put("home", 1555555555);
		    p3.put("work", 1555555556);
		    pp3.setPhones(p3);
		    List<Child> lc3 = new ArrayList<Child>();
		    Child ch31 = new Child();
		    ch31.setCname("王六");
		    ch31.setGender(1);
		    lc3.add(ch31);
		    pp3.setChildren(lc3);
		
		    runtime.sendEvent(pp3);
		  }
		}
	
* UpdateTest 测试代码

		public class UpdateTest {
		  public static void main(String[] args) {
		
		    EPServiceProvider epService = EPServiceProviderManager.getDefaultProvider();
		    EPAdministrator admin = epService.getEPAdministrator();
		    EPRuntime runtime = epService.getEPRuntime();
		
		    String ctr = "create window UPerson.win:keepall() as Person";
		    String update = "on Person as p1 update UPerson as p2 set p2.age = 40 where p2.name = 'test'";
		//    String update = "update Person set age = 40 where name = 'test'";
		    String qry = "select * from Person";
		
		
		    admin.createEPL(ctr);
		    admin.createEPL("insert into UPerson select * from Person");
		    EPStatement state3 = admin.createEPL(update);
		    state3.addListener(new UpdateListener() {
		      public void update(EventBean[] newEvents, EventBean[] oldEvents) {
		        if (null != newEvents) {
		          System.out.print("update==>  ");
		          for (int i = 0; i < newEvents.length; i++) {
		            System.out.println(newEvents[i].getUnderlying());
		          }
		        }
		      }
		    });
		
		    EPStatement state = admin.createEPL(qry);
		    state.addListener(new UpdateListener() {
		      public void update(EventBean[] newEvents, EventBean[] oldEvents) {
		        if (null != newEvents) {
		          System.out.print("qry==>  ");
		          for (int i = 0; i < newEvents.length; i++) {
		            System.out.println(newEvents[i].getUnderlying());
		          }
		        }
		      }
		    });
		
		    Person p1 = new Person();
		    p1.setName("test");
		    p1.setAge(22);
		    runtime.sendEvent(p1);
		
		    Person p2 = new Person();
		    p2.setName("test2");
		    p2.setAge(23);
		    runtime.sendEvent(p2);
			
		  }
		}
		
### 2.2 `java.util.Map`
`Esper`支持原生`Java Map`结构的事件。相对于POJO来说，`Map`的结构更利于事件类型的热加载，毕竟不是`class`，所以不需要重启JVM。

所以如果系统对重启比较敏感，建议使用Map来定义事件的结构。`Map`的结构很简单，主要分为事件定义名和事件属性列表。

通过 `sendEvent(Map map, String eventTypeName)` 方法发送事件。

对于`Map`，`Esper`只支持增量更新，也就是说只能增加`Map`中的属性定义，而不能修改或者删除某个属性。

实际上属性增多并不影响其处理性能，所以没有删除在我看来也没什么。至于修改，也只能是先注销再注册了。

* 定义

		// Person定义  
		Map<String,Object> person = new HashMap<String,Object>();  
		person.put("name", String.class);  
		person.put("age", int.class);  
		person.put("children", List.class);  
		person.put("phones", Map.class);  
		          
		// 注册Person到Esper  
		admin.getConfiguration().addEventType("PersonEvent", person);
		
		select name, age, phones from PersonEvent.win:time(1 min) where age = 20 
		
* `java.util.Map`发送

		Map<String, Object> p1 = new HashMap<String, Object>();
		p1.put("name", "test");
		p1.put("age", 20);
		List<Person> child = new ArrayList<Person>();
		p1.put("children", child);
		
		Map<String, Object> phones = new HashMap<String, Object>();
		phones.put("home", "051088744796");
		phones.put("self", "15051818371");
		p1.put("phones", phones);
		
		epService.getEPRuntime().sendEvent(p1, "PersonEvent");
		
		select name, age, phones from PersonEvent.win:time(1 min) where age = 20 

		{name=test, phones={self=15051818371, home=051088744796}, age=20}



* PersonMap 示例

		class Person implements Serializable
		{
		  String name;
		  int age;
		
		  public String getName() {
		    return name;
		  }
		
		  public void setName(String name) {
		    this.name = name;
		  }
		
		  public int getAge() {
		    return age;
		  }
		
		  public void setAge(int age) {
		    this.age = age;
		  }
		
		  @Override
		  public String toString() {
		    return "Person{" +
		        "name='" + name + '\'' +
		        ", age=" + age +
		        '}';
		  }
		}
		
		class PersonMapListener implements UpdateListener
		{
		
		  public void update(EventBean[] newEvents, EventBean[] oldEvents)
		  {
		    if (newEvents != null)
		    {
		      for (int i = 0; i < newEvents.length; i++) {
		        System.out.println(newEvents[i].getUnderlying());
		      }
		    }
		  }
		
		}
		
		public class PersonMap {
		  public static void main(String[] args) throws InterruptedException {
		    EPServiceProvider epService = EPServiceProviderManager.getDefaultProvider();
		
		    EPAdministrator admin = epService.getEPAdministrator();
		
		    // Person 定义
		    Map<String, Object> person = new HashMap<String, Object>();
		    person.put("name", String.class);
		    person.put("age", int.class);
		    person.put("children", List.class);
		    person.put("phones", Map.class);
		
		    // 注册Person到Esper
		    admin.getConfiguration().addEventType("PersonEvent", person);
		
		    String epl = "select name, age, phones from PersonEvent.win:time(1 min) where age = 20";
		    EPStatement state = admin.createEPL(epl);
		    state.addListener(new PersonMapListener());
		
		    EPRuntime runtime = epService.getEPRuntime();
		
		    Map<String, Object> p1 = new HashMap<String, Object>();
		    p1.put("name", "test");
		    p1.put("age", 20);
		
		    List<Person> child = new ArrayList<Person>();
		    Person pc1 = new Person();
		    pc1.setName("Child1");
		    pc1.setAge(20);
		    child.add(pc1);
		    p1.put("children", child);
		
		    Map<String, Object> phones = new HashMap<String, Object>();
		    phones.put("home", "051088744796");
		    phones.put("self", "15051818371");
		    p1.put("phones", phones);
		
		    runtime.sendEvent(p1, "PersonEvent");
		
		    // 新增一个gender属性
		//    person.put("gender", int.class);
		//    admin.getConfiguration().updateMapEventType("PersonEvent", person);
		  }
		}
		
#### 2.2.1 `java.util.Map`超类(Supertype)
	epService.getEPAdministrator().getConfiguration().addEventType(
		"AccountUpdate", accountUpdateDef, new String[] {"BaseUpdate"}
	);

当继承之后，对超类进行`select`时，不管是子类、或超类事件到达，都会进行查询输出。

	select * from BaseUpdate

每个Map 事件可以有多个超类！

#### 2.2.2 Map 嵌套
	Map<String, Object> updatedFieldDef = new HashMap<String, Object>();
	updatedFieldDef.put("name", String.class);
	updatedFieldDef.put("addressLine1", String.class);
	updatedFieldDef.put("history", UpdateHistory.class);
	epService.getEPAdministrator().getConfiguration().
	addEventType("UpdatedFieldType", updatedFieldDef);
	
	Map<String, Object> accountUpdateDef = new HashMap<String, Object>();
	accountUpdateDef.put("accountId", long.class);
	accountUpdateDef.put("fields", "UpdatedFieldType");	
	// the latter can also be:  accountUpdateDef.put("fields", updatedFieldDef);
	
	epService.getEPAdministrator().getConfiguration().
	addEventType("AccountUpdate", accountUpdateDef);

	Map<String, Object> updatedField = new HashMap<String, Object>();
	updatedField.put("name", "Joe Doe");
	updatedField.put("addressLine1", "40 Popular Street");
	updatedField.put("history", new UpdateHistory());
	
	Map<String, Object> accountUpdate = new HashMap<String, Object>();
	accountUpdate.put("accountId", 10009901);
	accountUpdate.put("fields", updatedField);
	
	epService.getEPRuntime().sendEvent(accountUpdate, "AccountUpdate");
	
	
	select accountId, fields.name, fields.addressLine1, fields.history.lastUpdate
	from AccountUpdate

#### 2.2.3 Map 数组
	Map<String, Object> sale = new HashMap<String, Object>();
	sale.put("userids", int[].class);
	sale.put("salesPersons", SalesPerson[].class);
	sale.put("items", "OrderItem[]");	 // The property type is the name itself appended by []
	
	epService.getEPAdministrator().getConfiguration().
	    addEventType("SaleEvent", sale);
	
查询语句：

	select userids[0], salesPersons[1].name, 
	items[1], items[1].price.amount from SaleEvent

### 2.3 Object Array
`Object` 数组跟`Map`类似，只是定义的方式有些区别，同时也只支持增量更新。

	String[] propertyNames = {"carId", "direction"};   // order is important
	Object[] propertyTypes = {String.class, int.class};  // type order matches name order

	epService.getEPAdministrator().getConfiguration().
	  addEventType("CarLocUpdateEvent", propertyNames, propertyTypes);

	epRuntime.sendEvent(new Object[]{carId, direction}, “CarLocUpdateEvent”);

* 查询语句：

		select carId from CarLocUpdateEvent .win:time(1 min) where direction = 1
* 增量更新：

		admin.getConfiguration().updateObjectArrayEventType("Person", new String[] { "gender" }, new Object[] { int.class });

* ObjectArray 实例：

		class CommonUpdateListener implements UpdateListener {
		
		  public void update(EventBean[] newEvents, EventBean[] oldEvents) {
		    if (null != newEvents) {
		      System.out.print("common update method:  ");
		      for (int i = 0; i < newEvents.length; i++) {
		        System.out.println(newEvents[i].getUnderlying());
		      }
		    }
		  }
		}
		
		public class ObjectArray {
		
		  /**
		   * @param args
		   */
		  public static void main(String[] args)
		  {
		    EPServiceProvider epService = EPServiceProviderManager.getDefaultProvider();
		    EPAdministrator admin = epService.getEPAdministrator();
		    EPRuntime runtime = epService.getEPRuntime();
		
		    // Address定义
		    String[] addressPropNames = { "road", "street", "houseNo" };
		    Object[] addressPropTypes = { String.class, String.class, int.class };
		
		    // Child定义
		    String[] childPropNames = { "name", "age" };
		    Object[] childPropTypes = { String.class, int.class };
		
		    // Person定义
		    String[] personPropNames = { "name", "age", "children", "phones", "address" };
		    Object[] personPropTypes = { String.class, int.class, "Child[]", Map.class, "Address" };
		
		    // 注册Address到Esper
		    admin.getConfiguration().addEventType("Address", addressPropNames, addressPropTypes);
		    // 注册Child到Esper
		    admin.getConfiguration().addEventType("Child", childPropNames, childPropTypes);
		    // 注册Person到Esper
		    admin.getConfiguration().addEventType("Person", personPropNames, personPropTypes);
		
		    // 新增一个gender属性
		    admin.getConfiguration().updateObjectArrayEventType("Person", new String[] { "gender" }, new Object[] { int.class });
		
		    /** 输出结果：
		     * Person props: [name, age, children, phones, address, gender]
		     */
		    EventType event = admin.getConfiguration().getEventType("Person");
		    System.out.println("Person props: " + Arrays.asList(event.getPropertyNames()));
		
		    String epl = "select name, age, phones, address.road, address.street, address.houseNo, children[0].name from Person";
		    EPStatement state = admin.createEPL(epl);
		    state.addListener(new CommonUpdateListener());
		
		    Object[] addr = {"road1", "street1", 1};
		    Object[][] child = {{"child", 10}};
		
		    Map<String, Object> phones = new HashMap<String, Object>();
		    phones.put("home", "051088744796");
		    phones.put("self", "15051818371");
		
		    Object[] person = {"person", 30, child, phones, addr};
		
		    runtime.sendEvent(person, "Person");
		  }
		}
		
#### 2.3.1 Object Array 超类（Supertype）
`Object[]` 可以在引擎初始化、或运行时通过administrator接口，定义一个超类。

超类必须也是`Object[]` 事件，且所有的属性会对子类可见，同名属性将会被覆盖。定义于超类上的EPL查询语法，子类亦会触发。

定义：

	create objectarray schema SuperType (p0 String)
	create objectarray schema SubType (p1 String, p2 String) inherits SuperType

发送：

	epRuntime.sendEvent(new Object[] {"p0_value", "p1_value"}, "SubType");
	epRuntime.sendEvent(new Object[] {"p0_value"}, "SuperType");

#### 2.3.2 Object Array（嵌套属性）
	String[] propertyNamesUpdField = {"name", "addressLine1", "history"};
	Object[] propertyTypesUpdField = {String.class, String.class, UpdateHistory.class};
	epService.getEPAdministrator().getConfiguration().
	addEventType("UpdatedFieldType", propertyNamesUpdField, propertyTypesUpdField);
	
	String[] propertyNamesAccountUpdate = {"accountId", "fields"};
	Object[] propertyTypesAccountUpdate = {long.class, "UpdatedFieldType"};
	epService.getEPAdministrator().getConfiguration().
	addEventType("AccountUpdate", propertyNamesAccountUpdate, propertyTypesAccountUpdate);
	
	Object[] updatedField = {"Joe Doe", "40 Popular Street", new UpdateHistory()};
	Object[] accountUpdate = {10009901, updatedField};
	epService.getEPRuntime().sendEvent(accountUpdate, "AccountUpdate");
	
	select accountId, fields.name, fields.addressLine1, fields.history.lastUpdate
	from AccountUpdate

#### 2.3.3 Object Array（一对多属性）
	String[] propertyNames = {"userids", "salesPersons", "items"};
	Object[] propertyTypes = {int[].class, SalesPerson[].class, "OrderItem[]");
	
	epService.getEPAdministrator().getConfiguration().addEventType("SaleEvent", propertyNames, propertyTypes);

查询语句：

	select userids[0], salesPersons[1].name, 
		items[1], items[1].price.amount from SaleEvent

### 2.4 XML

* ParseXmlSchema 示例

		class ParseXMLListener implements UpdateListener
		{
		
		  public void update(EventBean[] newEvents, EventBean[] oldEvents)
		  {
		    if (newEvents != null)
		    {
		      for (int i = 0; i < newEvents.length; i++) {
		        System.out.println(newEvents[i].getUnderlying());
		      }
		    }
		  }
		
		}
		
		public class ParseXmlSchema {
		  public static void main(String[] args) throws InterruptedException, IOException, ParserConfigurationException, SAXException {
		    String xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
		        "<Sensor xmlns=\"SensorSchema\">" +
		        "  <ID>urn:epc:1:4.16.36</ID>" +
		        "  <Observation Command=\"READ_PALLET_TAGS_ONLY\">" +
		        "    <ID>00000001</ID>" +
		        "    <Tag>" +
		        "      <ID>urn:epc:1:2.24.400</ID>" +
		        "    </Tag>" +
		        "    <Tag>" +
		        "      <ID>urn:epc:1:2.24.401</ID>" +
		        "    </Tag>" +
		        "  </Observation>" +
		        "</Sensor>";
		    URL schemaURL = ParseXmlSchema.class.getResource("sensor.xsd");
		    EPServiceProvider epService = EPServiceProviderManager.getDefaultProvider();
		
		    EPAdministrator admin = epService.getEPAdministrator();
		    epService = EPServiceProviderManager.getDefaultProvider();
		    ConfigurationEventTypeXMLDOM sensorcfg = new ConfigurationEventTypeXMLDOM();
		    sensorcfg.setRootElementName("Sensor");
		    sensorcfg.setSchemaResource(schemaURL.toString());
		    epService.getEPAdministrator().getConfiguration()
		        .addEventType("SensorEvent", sensorcfg);
		
		    String epl = "select ID, Observation.Command, Observation.ID, Observation.Tag[0].ID, Observation.Tag[1].ID from SensorEvent";
		    EPStatement state = admin.createEPL(epl);
		    state.addListener(new ParseXMLListener());
		
		    InputSource source = new InputSource(new StringReader(xml));
		    DocumentBuilderFactory builderFactory = DocumentBuilderFactory.newInstance();
		    builderFactory.setNamespaceAware(true);
		    Document doc = builderFactory.newDocumentBuilder().parse(source);
		
		    epService.getEPRuntime().sendEvent(doc);
		  }
		}
		
* 对应的`schema`文件

		<?xml version="1.0" encoding="UTF-8"?>
		<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
		
		  <xs:element name="Sensor">
		    <xs:complexType>
		      <xs:sequence>
		        <xs:element name="ID" type="xs:string"/>
		        <xs:element ref="Observation" />
		      </xs:sequence>
		    </xs:complexType>
		  </xs:element>
		
		  <xs:element name="Observation">
		    <xs:complexType>
		      <xs:sequence>
		        <xs:element name="ID" type="xs:string"/>
		        <xs:element ref="Tag" maxOccurs="unbounded" />
		      </xs:sequence>
		      <xs:attribute name="Command" type="xs:string" use="required" />
		    </xs:complexType>
		  </xs:element>
		
		  <xs:element name="Tag">
		    <xs:complexType>
		      <xs:sequence>
		        <xs:element name="ID" type="xs:string"/>
		      </xs:sequence>
		    </xs:complexType>
		  </xs:element>
		</xs:schema>

### 2.5 事件类型对比
![](/images/esper/compare.png)

<a id='link3'></a>

## 三、处理模型
`Esper` 进程模型是连续不间断的：根据`event stream`、`views`、`filters`和`output rates`的语句选择范围，

`UpdaterListener`是Esper提供的一个接口，用于监听某个EPL在引擎中的运行情况，即事件进入并产生结果后会通知`UpdateListener`。

	package com.espertech.esper.client;  
	  
	import com.espertech.esper.client.EventBean;  
	  
	public interface UpdateListener  
	{  
	    public void update(EventBean[] newEvents, EventBean[] oldEvents);  
	} 

`Esper`是怎么处理事件的，即`Esper`的进程模型。

一个update方法，其中包括两个EventBean数组。EventBean中有一个最常用的get方法，是用来得到EPL中某个字段的值。

	select name from User  
	//假设newEvents长度为一  

`newEvents[0].get("name")`能得到进入的User事件的name属性值。
  
	select count(*) from User.win:time(5 sec)  
	//假设newEvents长度为一  

`newEvents[0].get("count(*))`能得到5秒内进入引擎的User事件数量有多少。

### 3.1 Insert And Remove Stream

* `IR Stream`

	![](/images/esper/irstream.png)

	从此图可以看出，随着时间推移，每个进入到引擎的`W`事件都是`newEvents`，即`Insert Stream`。`W`后括号里的值为属性值，可忽略。


	`Insert`表示事件进入引擎，`Remove Stream`表示移出引擎，对应于`UpdateListener`中的 `newEvents` 和 `oldEvents`。

		select * from Withdrawal

	每当引擎处理一个 `Withdrawal` 或 `Withdrawal` 子类型的事件时，会触发对应所有的 `update listener`，并将该事件传递给每个 `EPL` 语句的监听器。

* `Window Length`

	队列窗口(length window)告知引擎只保留最新的 `N` 个事件，如：

		select * from Withdrawal.win:length(5)

	开放了一个大小为 5 的空间，可同时存放 5 个事件。

	引擎将所有接收到的事件，让入到一个长度为 5 的空间中，当空间满了之后，最老的事件将会置换出队列，新到的事件即为`newEvent`，置换出去的即为`oldEvent`。

	![](/images/esper/irstream-win-length.png)

	实际上这个EPL触发监听器都只能看到`newEvents`，看不到`oldEvents`。如果想看到`oldEvents`，EPL要改写一下：

		select irstream * from Withdrawal.win:length(5)

	默认情况下，Esper认为你只想让`newEvents`触发监听器，即`istream`(insert stream)。如果想让`oldEvents`触发监听器，那么为`rstream`(remove stream)。如果两个都想，那么为`irstream`。当然这个默认情况是可以配置的，以后会说到这个问题。

	当只用`rstream`时，过期的`oldEvents`是放松到`newEvents`中的。
	
### 3.2 Filter And Where-causes
EPL有两种过滤事件的方式：

* 过滤事件进入view（可以把view理解为一个窗口），即Filter。
* 让事件都进入view，但不触发UpdateListener，即Where子句。

<i class='red'>**Filter：**</i>
	
	select * from Withdrawal(amount>=200).win:length(5)

所有`Withdrawal`事件中，只有`amount`属性值 `>= 200`的才可以进入 `win:length`，且`win:length`大小为 5.

![](/images/esper/irstream-filter-where.png)

<i class='red'>**Where-causes：**</i>

	select * from Withdrawal.win:length(5) where amount >= 200

所有`Withdrawal`事件中，都可以进入 `win:length`，且`win:length`大小为 5，只有`amount`属性 `>= 200` 的才可以触发 `UpdateListener`。

![](/images/esper/irstream-where.png)


### 3.3 Time Windows
* Time Windows
 
	Time Window 是基于过去系统时间上的，一个移动的指定时间间隔的窗口，Time Window 能够限制一次查询中事件的个数，类似于length window。

	例如，要查询所有过去4秒的account中，amount大于1000的withdrawal的平均值，

		select account, avg(amount)
		from Withdrawal.win:time(4 sec)
		group by account
		having amount > 1000
	
		select * from Withdrawal.win:time(4 sec)

	![](/images/esper/time-window.png)

	1. t+4 秒，W1到达并进入window，引擎将之反馈给 update listeners
	2. t+5 秒，W2到达并进入window，引擎将之反馈给 update listeners
	3. t+6.5 秒，W3到达并进入window，引擎将之反馈给 update listeners
	4. t+8 秒，W1离开time window，引擎将之作为一个old event 告知update listeners

* Time Batch

	Time Batch视图缓存事件，并在每个指定的时间间隔更新时释放它们，可以理解为批、批处理。length batch也类似。

	例如，

		select * from Withdrawal.win:time_batch(4 sec)

	上述EPL语句可以理解为通过时间分批查询，每一批为4秒钟。

	![](/images/esper/time-batch.png)
	

	1. 在 t + 1秒，W1 到达并进入batch，不触发调用 update listeners
	1. 在 t + 3秒，W2 到达并进入batch，不触发调用 update listeners
	1. 在 t + 4秒，引擎处理batch事件，并开始一个新的batch，引擎触发W1和W2给update listeners
	1. 在 t + 6.5秒，W3 引擎处理batch事件，并开始一个新的batch，引擎触发W1和W2给update listeners
	1. 在 t + 8秒，引擎处理batch事件，并开始一个新的batch，引擎触发W3给update listeners,并将W1和W2作为old data（前一个batch）发给update listeners

	收集1秒钟之内到达的Withdrawal事件，并在1秒钟结束之后，将之作为new events（insert stream）发送给引擎的每个listener，将上1秒的作为old events（remove stream）发送给每个listener

		select account, amount from Withdrawal.win:time_batch(1 sec)
		
	1秒内所有Withdrawal时间的amount属性和

		select sum(amount) as mysum from Withdrawal.win:time_batch(1 sec)

### 3.4 分组聚合

* IStream

	当聚合属性值发生改变的时候，聚合事件语句，能够通过聚合函数传递(post)remove steam（即聚合函数值也能作为触发update listener的条件）。

		select count(*) as mycount from Withdrawal having count(*) = 2
	当接收到 2 个Withdrawal事件时，输出。

		select istream count(*) as mycount form Withdrawal having count(*) = 2

	`istream` 或 `rstream`关键字能被用来指定传递（post） `new events` 或 `old events` 给`update listeners`。上述语句，表示当且仅当第二个`Withdrawal`事件到达时，引擎才会调用`listener`；若`istream`改为`rstream`，则仅当第三个`Withdrawal`事件到达时，引擎才会调用`listener`。

* IR Stream

	监听器有两个参数 newEvents 和 oldEvents，newEvents 表示通常的计算结果，oldEvents 可以理解为上一次计算结果。默认情况下，newEvents 有值，oldEvnets 为null。

		select rstream * from Withdrawal
	上述结果会将上一次的计算结果放入到 newEvents，而不是 oldEvents，且无法获取当前计算结果！

		select irstream * from Withdrawal
	会将当前计算结果放入 newEvents，上次计算结果放入到 oldEvents。

		select istream * from Withdrawal
		select * from Withdrawal
	会将当前计算结果放入newEvents，且无法得到上次计算结果，默认设置。
	
* Aggregate and Group

	不聚合、不分组

		select * from Withdrawal.win:time_batch(1 sec)
	只有聚合，没有分组
	
		select sum(amount)
		from Withdrawal.win:time_batch(1 sec)
	非聚合属性、聚合属性，当不分组
	
		select account, sum(amount)
		from Withdrawlal.win:time_batch(1 sec)
	查询语句中的聚合属性、所有非聚合属性，都被group by语句列出。

		select account, sum(amount)
		from Withdrawal.win:time_batch(1 sec)
		group by account
	查询 非聚合属性和聚合属性，仅用group by分组了部分属性。

		select account, accountName, sum(amount) 
		from Withdrawal.win:time_batch(1 sec) 
		group by account

<a id='link4'></a>

### 未完待续...