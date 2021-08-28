---
layout: post 	
category: 杂记          
title: JavaLearning     
tags: 杂记     
author: 王子涵     
#image: /images/xxx.jpg    
email: 1845945170@qq.com  
description: 学习Java基础的一些简单笔记记录
---
Java基本语法<br>
============<br>
几点注意：<br>
---------<br>
•	大小写敏感：Java 是大小写敏感的，这就意味着标识符 Hello 与 hello 是不同的。<br>
•	类名：对于所有的类来说，类名的首字母应该大写。如果类名由若干单词组成，那么每个单词的首字母应该大写，例如 MyFirstJavaClass 。<br>
•	方法名：所有的方法名都应该以小写字母开头。如果方法名含有若干单词，则后面的每个单词首字母大写。<br>
•	源文件名：源文件名必须和类名相同。当保存文件的时候，你应该使用类名作为文件名保存（切记 Java 是大小写敏感的），文件名的后缀为 .java。（如果文件名和类名不相同则会导致编译错误）<br>
•	主方法入口：所有的 Java 程序由 public static void main(String[] args) 方法开始执行。<br>
##Java标识符<br>
<br>
##Java修饰符<br>
<br>
##Java变量<br>
<br>
##Java枚举，enum限制变量只能是设定好的值，可以减少代码中的bug<br>
<br>
##Java关键字：不能作为标识符名称<br>
<br> 
##Java注释<br>
<br>
##Java空行<br>
<br>
##Java继承<br>
<br>
##Java接口<br>
 <br>
#Java对象和类<br>
<br>
##类与对象的关系<br>
可以用狗类和不同的狗品种来类比类与对象<br>
狗的行为就是方法<br>
狗的资料就是属性<br>
##类的构造方法<br>
在创建一个对象的时候，至少要调用一个构造方法。构造方法的名称必须与类同名，一个类可以有多个构造方法<br>
创建对象<br>
创建对象需要以下三步：<br>
•	声明：声明一个对象，包括对象名称和对象类型。<br>
•	实例化：使用关键字 new 来创建一个对象。<br>
•	初始化：使用 new 创建对象时，会调用构造方法初始化对象。<br>
访问实例变量和方法<br>
实例：/* 实例化对象 */ <br>
Object referenceVariable = new Constructor(); <br>
/* 访问类中的变量 */ <br>
referenceVariable.variableName; <br>
/* 访问类中的方法 */ <br>
referenceVariable.methodName();	<br>
<br>
实例代码读懂<br>
源文件声明规则<br>
•	一个源文件中只能有一个 public 类<br>
•	一个源文件可以有多个非 public 类<br>
•	源文件的名称应该和 public 类的类名保持一致。例如：源文件中 public 类的类名是 Employee，那么源文件应该命名为Employee.java。<br>
•	如果一个类定义在某个包中，那么 package 语句应该在源文件的首行。<br>
•	如果源文件包含 import 语句，那么应该放在 package 语句和类定义之间。如果没有 package 语句，那么 import 语句应该在源文件中最前面。<br>
•	import 语句和 package 语句对源文件中定义的所有类都有效。在同一源文件中，不能给不同的类不同的包声明<br>
Java包的了解<br>
Import语句的了解<br>
简单例子的验证<br>
#Java基本数据类型<br>
<br>
##内置数据类型<br>
1.八个基本数据类型<br>
基本类型：byte 二进制位数：8<br>
包装类：java.lang.Byte<br>
最小值：Byte.MIN_VALUE=-128<br>
最大值：Byte.MAX_VALUE=127<br>
<br>
基本类型：short 二进制位数：16<br>
包装类：java.lang.Short<br>
最小值：Short.MIN_VALUE=-32768<br>
最大值：Short.MAX_VALUE=32767<br>
<br>
基本类型：int 二进制位数：32<br>
包装类：java.lang.Integer<br>
最小值：Integer.MIN_VALUE=-2147483648<br>
最大值：Integer.MAX_VALUE=2147483647<br>
<br>
基本类型：long 二进制位数：64<br>
包装类：java.lang.Long<br>
最小值：Long.MIN_VALUE=-9223372036854775808<br>
最大值：Long.MAX_VALUE=9223372036854775807<br>
<br>
基本类型：float 二进制位数：32<br>
包装类：java.lang.Float<br>
最小值：Float.MIN_VALUE=1.4E-45<br>
最大值：Float.MAX_VALUE=3.4028235E38<br>
<br>
基本类型：double 二进制位数：64<br>
包装类：java.lang.Double<br>
最小值：Double.MIN_VALUE=4.9E-324<br>
最大值：Double.MAX_VALUE=1.7976931348623157E308<br>
<br>
基本类型：char 二进制位数：16<br>
包装类：java.lang.Character<br>
最小值：Character.MIN_VALUE=0<br>
最大值：Character.MAX_VALUE=65535<br>
<br>
基本类型：boolean<br>
•	boolean数据类型表示一位的信息；<br>
•	只有两个取值：true 和 false；<br>
•	这种类型只作为一种标志来记录 true/false 情况；<br>
•	默认值是 false；<br>
•	例子：boolean one = true。<br>
 <br>
引用类型<br>
•	在Java中，引用类型的变量非常类似于C/C++的指针。引用类型指向一个对象，指向对象的变量是引用变量。这些变量在声明时被指定为一个特定的类型，比如 Employee、Puppy 等。变量一旦声明后，类型就不能被改变了。<br>
•	对象、数组都是引用数据类型。<br>
•	所有引用类型的默认值都是null。<br>
•	一个引用变量可以用来引用任何与之兼容的类型。<br>
•	例子：Site site = new Site("Runoob")。<br>
##Java常量<br>
Java 中使用 final 关键字来修饰常量，声明方式和变量类似<br>
byte、int、long、和short都可以用十进制、16进制以及8进制的方式来表示。<br>
当使用字面量的时候，前缀 0 表示 8 进制，而前缀 0x 代表 16 进制<br>
<br>
 <br>
##自动化类型转换<br>
整型、实型（常量）、字符型数据可以混合运算。运算中，不同类型的数据先转化为同一类型，然后进行运算。从低级到高级转换。<br>
数据类型转换必须满足如下规则：<br>
•	1. 不能对boolean类型进行类型转换。<br>
•	2. 不能把对象类型转换成不相关类的对象。<br>
•	3. 在把容量大的类型转换为容量小的类型时必须使用强制类型转换。<br>
•	4. 转换过程中可能导致溢出或损失精度<br>
5. 浮点数到整数的转换是通过舍弃小数得到，而不是四舍五入<br>
###自动类型转换<br>
必须满足转换前的数据类型的位数要低于转换后的数据类型，例如: short数据类型的位数为16位，就可以自动转换位数为32的int类型，同样float数据类型的位数为32，可以自动转换为64位的double类型<br><br>
###强制类型转换<br>
•	1. 条件是转换的数据类型必须是兼容的。<br>
•	2. 格式：(type)value type是要强制类型转换后的数据类型 实例<br>
###隐含强制类型转换<br>
1 整数的默认类型是 int。	<br>
2. 小数默认是 double 类型浮点型，在定义 float 类型时必须在数字后面跟上 F 或者 f<br>
实例的运行<br>
#Java变量类型<br>
Java语言支持的变量类型有：<br>
•	类变量：独立于方法之外的变量，用 static 修饰。<br>
•	实例变量：独立于方法之外的变量，不过没有 static 修饰。<br>
•	局部变量：类的方法中的变量。<br>
##局部变量<br>
•	局部变量声明在方法、构造方法或者语句块中；<br>
•	局部变量在方法、构造方法、或者语句块被执行的时候创建，当它们执行完成后，变量将会被销毁；<br>
•	访问修饰符不能用于局部变量；<br>
•	局部变量只在声明它的方法、构造方法或者语句块中可见；<br>
•	局部变量是在栈上分配的。<br>
•	局部变量没有默认值，所以局部变量被声明后，必须经过初始化，才可以使用。<br>
##实例变量<br>
实例变量声明在一个类中，但在方法、构造方法和语句块之外；<br>
当一个对象被实例化之后，每个实例变量的值就跟着确定；<br>
实例变量在对象创建的时候创建，在对象被销毁的时候销毁；<br>
实例变量的值应该至少被一个方法、构造方法或者语句块引用，使得外部能够通过这些方式获取实例变量信息；<br>
实例变量可以声明在使用前或者使用后；<br>
访问修饰符可以修饰实例变量；<br>
实例变量对于类中的方法、构造方法或者语句块是可见的。一般情况下应该把实例变量设为私有。通过使用访问修饰符可以使实例变量对子类可见；<br>
实例变量具有默认值。数值型变量的默认值是0，布尔型变量的默认值是false，引用类型变量的默认值是null。变量的值可以在声明时指定，也可以在构造方法中指定；<br>
实例变量可以直接通过变量名访问。但在静态方法以及其他类中，就应该使用完全限定名：ObejectReference.VariableName。<br>
##类变量（静态变量）<br>
类变量也称为静态变量，在类中以 static 关键字声明，但必须在方法之外。<br>
无论一个类创建了多少个对象，类只拥有类变量的一份拷贝。<br>
静态变量除了被声明为常量外很少使用，静态变量是指声明为 public/private，final 和 static 类型的变量。静态变量初始化后不可改变。<br>
静态变量储存在静态存储区。经常被声明为常量，很少单独使用 static 声明变量。<br>
静态变量在第一次被访问时创建，在程序结束时销毁。<br>
与实例变量具有相似的可见性。但为了对类的使用者可见，大多数静态变量声明为 public 类型。<br>
默认值和实例变量相似。数值型变量默认值是 0，布尔型默认值是 false，引用类型默认值是 null。变量的值可以在声明的时候指定，也可以在构造方法中指定。此外，静态变量还可以在静态语句块中初始化。<br>
静态变量可以通过：ClassName.VariableName的方式访问。<br>
类变量被声明为 public static final 类型时，类变量名称一般建议使用大写字母。如果静态变量不是 public 和 final 类型，其命名方式与实例变量以及局部变量的命名方式一致。<br>
实例的运行。<br>
#Java修饰符<br>
访问修饰符<br>
非访问修饰符<br>
访问控制修饰符<br>
Java中，可以使用访问控制符来保护对类、变量、方法和构造方法的访问。Java 支持 4 种不同的访问权限。<br>
•	default (即默认，什么也不写）: 在同一包内可见，不使用任何修饰符。使用对象：类、接口、变量、方法。<br>
•	private: 在同一类内可见。使用对象：变量、方法。注意：不能修饰类（外部类）<br>
•	public : 对所有类可见。使用对象：类、接口、变量、方法<br>
•	protected: 对同一包内的类和所有子类可见。使用对象：变量、方法。注意：不能修饰类（外部类）。<br>
 <br>
##默认访问修饰符-不使用任何关键字<br>
使用默认访问修饰符声明的变量和方法，对同一个包内的类是可见的。接口里的变量都隐式声明为 public static final,而接口里的方法默认情况下访问权限为 public。<br>
如下例所示，变量和方法的声明可以不使用任何修饰符。<br>
实例<br>
String version = "1.5.1";<br>
boolean processOrder() {<br>
   return true;<br>
}<br>
##私有访问修饰符-private<br>
私有访问修饰符是最严格的访问级别，所以被声明为 private 的方法、变量和构造方法只能被所属类访问，并且类和接口不能声明为 private。<br>
声明为私有访问类型的变量只能通过类中公共的 getter 方法被外部类访问。<br>
Private 访问修饰符的使用主要用来隐藏类的实现细节和保护类的数据。<br>
##公有访问修饰符-public<br>
被声明为 public 的类、方法、构造方法和接口能够被任何其他类访问。<br>
如果几个相互访问的 public 类分布在不同的包中，则需要导入相应 public 类所在的包。由于类的继承性，类所有的公有方法和变量都能被其子类继承。<br>
Java 程序的 main() 方法必须设置成公有的，否则，Java 解释器将不能运行该类<br>
##受保护的访问修饰符-protected<br>
protected 需要从以下两个点来分析说明：<br>
•	子类与基类在同一包中：被声明为 protected 的变量、方法和构造器能被同一个包中的任何其他类访问；<br>
•	子类与基类不在同一包中：那么在子类中，子类实例可以访问其从基类继承而来的 protected 方法，而不能访问基类实例的protected方法。<br>
protected 可以修饰数据成员，构造方法，方法成员，不能修饰类（内部类除外）。<br>
接口及接口的成员变量和成员方法不能声明为 protected。 <br>
 <br>
子类能访问 protected 修饰符声明的方法和变量，这样就能保护不相关的类使用这些方法和变量。<br>
下面的父类使用了 protected 访问修饰符，子类重写了父类的 openSpeaker() 方法。<br>
class AudioPlayer {<br>
 protected boolean openSpeaker(Speaker sp) { <br>
// 实现细节 <br>
} } <br>
class StreamingAudioPlayer extends AudioPlayer {<br>
 protected boolean openSpeaker(Speaker sp) {<br>
 // 实现细节 } }<br>
如果把 openSpeaker() 方法声明为 private，那么除了 AudioPlayer 之外的类将不能访问该方法。<br>
如果把 openSpeaker() 声明为 public，那么所有的类都能够访问该方法。<br>
如果我们只想让该方法对其所在类的子类可见，则将该方法声明为 protected。<br>
protected 是最难理解的一种 Java 类成员访问权限修饰词，更多详细内容请查看Java protected 关键字详解。<br>
##访问控制和继承<br>
请注意以下方法继承的规则：<br>
•	父类中声明为 public 的方法在子类中也必须为 public。<br>
•	父类中声明为 protected 的方法在子类中要么声明为 protected，要么声明为 public，不能声明为 private。<br>
•	父类中声明为 private 的方法，不能够被继承<br>
###非访问修饰符<br>
为了实现一些其他的功能，Java 也提供了许多非访问修饰符。<br>
static 修饰符，用来修饰类方法和类变量。<br>
final 修饰符，用来修饰类、方法和变量，final 修饰的类不能够被继承，修饰的方法不能被继承类重新定义，修饰的变量为常量，是不可修改的。<br>
abstract 修饰符，用来创建抽象类和抽象方法。<br>
synchronized 和 volatile 修饰符，主要用于线程的编程。<br>
static 修饰符<br>
##•静态变量：<br>
static 关键字用来声明独立于对象的静态变量，无论一个类实例化多少对象，它的静态变量只有一份拷贝。 静态变量也被称为类变量。局部变量不能被声明为 static 变量。<br>
##•静态方法：<br>
static 关键字用来声明独立于对象的静态方法。静态方法不能使用类的非静态变量。静态方法从参数列表得到数据，然后计算这些数据。<br>
对类变量和方法的访问可以直接使用类名.方法名 和 类名.方法名 的方式访问。<br>
final 修饰符<br>
final 变量：<br>
final 表示"最后的、最终的"含义，变量一旦赋值后，不能被重新赋值。被 final 修饰的实例变量必须显式指定初始值。<br>
final 修饰符通常和 static 修饰符一起使用来创建类常量。<br>
final 方法<br>
父类中的 final 方法可以被子类继承，但是不能被子类重写。<br>
声明 final 方法的主要目的是防止该方法的内容被修改。<br>
final 类<br>
final 类不能被继承，没有类能够继承 final 类的任何特性<br>
abstract 修饰符<br>
抽象类：<br>
抽象类不能用来实例化对象，声明抽象类的唯一目的是为了将来对该类进行扩充。<br>
一个类不能同时被 abstract 和 final 修饰。如果一个类包含抽象方法，那么该类一定要声明为抽象类，否则将出现编译错误。<br>
抽象类可以包含抽象方法和非抽象方法。<br>
抽象方法<br>
抽象方法是一种没有任何实现的方法，该方法的的具体实现由子类提供。（即抽象类中的抽象方法只有名称并没有实现方法，实现方法在子类中定义）<br>
抽象方法不能被声明成 final 和 static。<br>
任何继承抽象类的子类必须实现父类的所有抽象方法，除非该子类也是抽象类。<br>
如果一个类包含若干个抽象方法，那么该类必须声明为抽象类。抽象类可以不包含抽象方法。<br>
抽象方法的声明以分号结尾，例如：public abstract sample();。<br>
synchronized 修饰符<br>
synchronized 关键字声明的方法同一时间只能被一个线程访问。synchronized 修饰符可以应用于四个访问修饰符<br>
transient 修饰符<br>
序列化的对象包含被 transient 修饰的实例变量时，java 虚拟机(JVM)跳过该特定的变量。<br>
该修饰符包含在定义变量的语句中，用来预处理类和变量的数据类型。<br>
volatile 修饰符<br>
volatile 修饰的成员变量在每次被线程访问时，都强制从共享内存中重新读取该成员变量的值。而且，当成员变量发生变化时，会强制线程将变化值回写到共享内存。这样在任何时刻，两个不同的线程总是看到某个成员变量的同一个值。<br>
一个 volatile 对象引用可能是 null。<br>
通常情况下，在一个线程调用 run() 方法（在 Runnable 开启的线程），在另一个线程调用 stop() 方法。 如果 第一行 中缓冲区的 active 值被使用，那么在 第二行 的 active 值为 false 时循环不会停止。<br>
但是以上代码中我们使用了 volatile 修饰 active，所以该循环会停止<br>
<br>
学会了StringBuilder.append()方法，添加功能<br>
#Java运算符<br>
•	算术运算符<br>
•	关系运算符<br>
•	位运算符<br>
•	逻辑运算符<br>
•	赋值运算符<br>
•	其他运算符<br>
##算术运算符<br>
算术运算符用在数学表达式中，它们的作用和在数学中的作用一样。下表列出了所有的算术运算符。<br>
表格中的实例假设整数变量A的值为10，变量B的值为20：<br>
操作符	描述										例子<br>
  +		加法 - 相加运算符两侧的值				A + B 等于 30<br>
  -		减法 - 左操作数减去右操作数				A – B 等于 -10<br>
  *		乘法 - 相乘操作符两侧的值				A * B等于200<br>
  /		除法 - 左操作数除以右操作数				B / A等于2<br>
  ％	取余 - 左操作数除以右操作数的余数		B%A等于0<br>
  ++	自增: 操作数的值增加1					B++ 或 ++B 等于 21 <br>
  --	自减: 操作数的值减少1					B-- 或 --B 等于 19 <br>
自增自减（++/--）、前缀自增自减、后缀自增自减了解、区别及应用。<br>
<br>
##关系运算符<br>
 <br>
##位运算符<br>
<br>
 <br>
##逻辑运算符<br>
 <br>
短路逻辑运算符<br>
<br>
##赋值运算符<br>
 <br>
##条件运算符（?:）<br>

##instanceof 运算符<br>

Java运算符优先级<br>
 <br>
#Java循环语句<br>

##While循环<br>
##do …….while 循环语句<br>
##for 循环<br>
##for(初始化; 布尔表达式; 更新) { //代码语句 }<br>
•	最先执行初始化步骤。可以声明一种类型，但可初始化一个或多个循环控制变量，也可以是空语句。<br>
•	然后，检测布尔表达式的值。如果为 true，循环体被执行。如果为false，循环终止，开始执行循环体后面的语句。<br>
•	执行一次循环后，更新循环控制变量。<br>
•	再次检测布尔表达式。循环执行上面的过程。<br>
##Java增强for循环<br>
Java 增强 for 循环语法格式如下:<br>
<br>
for(声明语句 : 表达式)<br>
{<br>
   //代码句子<br>
}<br>
声明语句：声明新的局部变量，该变量的类型必须和数组元素的类型匹配。其作用域限定在循环语句块，其值与此时数组元素的值相等。<br>
表达式：表达式是要访问的数组名，或者是返回值为数组的方法。<br>
break关键字<br>
continue关键字<br>
Java条件语句<br>
If-else语句<br>
Java switch case 语句<br>
switch case 语句语法格式如下：<br>
<br>
switch(expression){<br>
    case value :<br>
       //语句<br>
       break; //可选<br>
    case value :<br>
       //语句<br>
       break; //可选<br>
    //你可以有任意数量的case语句<br>
    default : //可选<br>
       //语句<br>
}<br>
switch case 语句有如下规则：<br>
•	switch 语句中的变量类型可以是： byte、short、int 或者 char。从 Java SE 7 开始，switch 支持字符串 String 类型了，同时 case 标签必须为字符串常量或字面量。<br>
•	switch 语句可以拥有多个 case 语句。每个 case 后面跟一个要比较的值和冒号。<br>
•	case 语句中的值的数据类型必须与变量的数据类型相同，而且只能是常量或者字面常量。<br>
•	当变量的值与 case 语句的值相等时，那么 case 语句之后的语句开始执行，直到 break 语句出现才会跳出 switch 语句。<br>
•	当遇到 break 语句时，switch 语句终止。程序跳转到 switch 语句后面的语句执行。case 语句不必须要包含 break 语句。如果没有 break 语句出现，程序会继续执行下一条 case 语句，直到出现 break 语句。<br>
•	switch 语句可以包含一个 default 分支，该分支一般是 switch 语句的最后一个分支（可以在任何位置，但建议在最后一个）。default 在没有 case 语句的值和变量值相等的时候执行。default 分支不需要 break 语句。<br>
switch case 执行时，一定会先进行匹配，匹配成功返回当前 case 的值，再根据是否有 break，判断是否继续输出，或是跳出判断。<br>
如果 case 语句块中没有 break 语句时，JVM 并不会顺序输出每一个 case 对应的返回值，而是继续匹配，匹配不成功则返回默认 case。<br>
如果 case 语句块中没有 break 语句时，匹配成功后，从当前 case 开始，后续所有 case 的值都会输出。<br>
#Java Number&Math类<br>
一般地，当需要使用数字的时候，我们通常使用内置数据类型，如：byte、int、long、double 等。<br>
实例<br>
int a = 5000; float b = 13.65f; byte c = 0x4a;<br>
然而，在实际开发过程中，我们经常会遇到需要使用对象，而不是内置数据类型的情形。为了解决这个问题，Java 语言为每一个内置数据类型提供了对应的包装类。<br>
所有的包装类（Integer、Long、Byte、Double、Float、Short）都是抽象类 Number 的子类<br>
 <br>
 <br>
这种由编译器特别支持的包装称为装箱，所以当内置数据类型被当作对象使用的时候，编译器会把内置类型装箱为包装类。相似的，编译器也可以把一个对象拆箱为内置类型。Number 类属于 java.lang 包<br>
##Java Math 类<br>
Java 的 Math 包含了用于执行基本数学运算的属性和方法，如初等指数、对数、平方根和三角函数。<br>
Math 的方法都被定义为 static 形式，通过 Math 类可以在主函数中直接调用。<br>
序号	方法与描述<br>
下面的表中列出的是 Number & Math 类常用的一些方法：<br>
1	xxxValue()<br>
将 Number 对象转换为xxx数据类型的值并返回。<br>
2	compareTo()<br>
将number对象与参数比较。<br>
3	equals()<br>
判断number对象是否与参数相等。<br>
4	valueOf()<br>
返回一个 Number 对象指定的内置数据类型<br>
5	toString()<br>
以字符串形式返回值。<br>
6	parseInt()<br>
将字符串解析为int类型。<br>
7	abs()<br>
返回参数的绝对值。<br>
8	ceil()<br>
返回大于等于( >= )给定参数的的最小整数，类型为双精度浮点型。<br>
9	floor()<br>
返回小于等于（<=）给定参数的最大整数 。<br>
10	rint()<br>
返回与参数最接近的整数。返回类型为double。<br>
11	round()<br>
它表示四舍五入，算法为 Math.floor(x+0.5)，即将原来的数字加上 0.5 后再向下取整，所以，Math.round(11.5) 的结果为12，Math.round(-11.5) 的结果为-11。<br>
12	min()<br>
返回两个参数中的最小值。<br>
13	max()<br>
返回两个参数中的最大值。<br>
14	exp()<br>
返回自然数底数e的参数次方。<br>
15	log()<br>
返回参数的自然数底数的对数值。<br>
16	pow()<br>
返回第一个参数的第二个参数次方。<br>
17	sqrt()<br>
求参数的算术平方根。<br>
18	sin()<br>
求指定double类型参数的正弦值。<br>
19	cos()<br>
求指定double类型参数的余弦值。<br>
20	tan()<br>
求指定double类型参数的正切值。<br>
21	asin()<br>
求指定double类型参数的反正弦值。<br>
22	acos()<br>
求指定double类型参数的反余弦值。<br>
23	atan()<br>
求指定double类型参数的反正切值。<br>
24	atan2()<br>
将笛卡尔坐标转换为极坐标，并返回极坐标的角度值。<br>
25	toDegrees()<br>
将参数转化为角度。<br>
26	toRadians()<br>
将角度转换为弧度。<br>
27	random()<br>
返回一个随机数。<br>
 <br>
#Java Character类<br>
Character 类用于对单个字符进行操作。<br>
Character 类在对象中包装一个基本类型char的值<br>
 <br>
下面是Character类的方法：<br>
1	isLetter()<br>
是否是一个字母<br>
2	isDigit()<br>
是否是一个数字字符<br>
3	isWhitespace()<br>
是否是一个空白字符<br>
4	isUpperCase()<br>
是否是大写字母<br>
5	isLowerCase()<br>
是否是小写字母<br>
6	toUpperCase()<br>
指定字母的大写形式<br>
7	toLowerCase()<br>
指定字母的小写形式<br>
8	toString()<br>
返回字符的字符串形式，字符串的长度仅为1<br>
#Java String类<br>
创建字符串<br>
字符串长度（.length方法）<br>
连接字符串<br>
	“+” or “.concat”<br>
创建格式化字符串<br>
我们知道输出格式化数字可以使用 printf() 和 format() 方法。<br>
String 类使用静态方法 format() 返回一个String 对象而不是 PrintStream 对象。<br>
String 类的静态方法 format() 能用来创建可复用的格式化字符串，而不仅仅是用于一次打印输出<br>
String方法<br>
1	char charAt(int index)<br>
返回指定索引处的 char 值。<br>
2	int compareTo(Object o)<br>
把这个字符串和另一个对象比较。<br>
3	int compareTo(String anotherString)<br>
按字典顺序比较两个字符串。<br>
4	int compareToIgnoreCase(String str)<br>
按字典顺序比较两个字符串，不考虑大小写。<br>
5	String concat(String str)<br>
将指定字符串连接到此字符串的结尾。<br>
6	boolean contentEquals(StringBuffer sb)<br>
当且仅当字符串与指定的StringBuffer有相同顺序的字符时候返回真。<br>
7	static String copyValueOf(char[] data)<br>
返回指定数组中表示该字符序列的 String。<br>
8	static String copyValueOf(char[] data, int offset, int count)<br>
返回指定数组中表示该字符序列的 String。<br>
9	boolean endsWith(String suffix)<br>
测试此字符串是否以指定的后缀结束。<br>
10	boolean equals(Object anObject)<br>
将此字符串与指定的对象比较。<br>
11	boolean equalsIgnoreCase(String anotherString)<br>
将此 String 与另一个 String 比较，不考虑大小写。<br>
12	byte[] getBytes()<br>
 使用平台的默认字符集将此 String 编码为 byte 序列，并将结果存储到一个新的 byte 数组中。<br>
13	byte[] getBytes(String charsetName)<br>
使用指定的字符集将此 String 编码为 byte 序列，并将结果存储到一个新的 byte 数组中。<br>
14	void getChars(int srcBegin, int srcEnd, char[] dst, int dstBegin)<br>
将字符从此字符串复制到目标字符数组。<br>
15	int hashCode()<br>
返回此字符串的哈希码。<br>
16	int indexOf(int ch)<br>
返回指定字符在此字符串中第一次出现处的索引。<br>
17	int indexOf(int ch, int fromIndex)<br>
返回在此字符串中第一次出现指定字符处的索引，从指定的索引开始搜索。<br>
18	int indexOf(String str)<br>
 返回指定子字符串在此字符串中第一次出现处的索引。<br>
19	int indexOf(String str, int fromIndex)<br>
返回指定子字符串在此字符串中第一次出现处的索引，从指定的索引开始。<br>
20	String intern()<br>
 返回字符串对象的规范化表示形式。<br>
21	int lastIndexOf(int ch)<br>
 返回指定字符在此字符串中最后一次出现处的索引。<br>
22	int lastIndexOf(int ch, int fromIndex)<br>
返回指定字符在此字符串中最后一次出现处的索引，从指定的索引处开始进行反向搜索。<br>
23	int lastIndexOf(String str)<br>
返回指定子字符串在此字符串中最右边出现处的索引。<br>
24	int lastIndexOf(String str, int fromIndex)<br>
 返回指定子字符串在此字符串中最后一次出现处的索引，从指定的索引开始反向搜索。<br>
25	int length()<br>
返回此字符串的长度。<br>
26	boolean matches(String regex)<br>
告知此字符串是否匹配给定的正则表达式。<br>
27	boolean regionMatches(boolean ignoreCase, int toffset, String other, int ooffset, int len)<br>
测试两个字符串区域是否相等。<br>
28	boolean regionMatches(int toffset, String other, int ooffset, int len)<br>
测试两个字符串区域是否相等。<br>
29	String replace(char oldChar, char newChar)<br>
返回一个新的字符串，它是通过用 newChar 替换此字符串中出现的所有 oldChar 得到的。<br>
30	String replaceAll(String regex, String replacement)<br>
使用给定的 replacement 替换此字符串所有匹配给定的正则表达式的子字符串。<br>
31	String replaceFirst(String regex, String replacement)<br>
 使用给定的 replacement 替换此字符串匹配给定的正则表达式的第一个子字符串。<br>
32	String[] split(String regex)<br>
根据给定正则表达式的匹配拆分此字符串。<br>
33	String[] split(String regex, int limit)<br>
根据匹配给定的正则表达式来拆分此字符串。<br>
34	boolean startsWith(String prefix)<br>
测试此字符串是否以指定的前缀开始。<br>
35	boolean startsWith(String prefix, int toffset)<br>
测试此字符串从指定索引开始的子字符串是否以指定前缀开始。<br>
36	CharSequence subSequence(int beginIndex, int endIndex)<br>
 返回一个新的字符序列，它是此序列的一个子序列。<br>
37	String substring(int beginIndex)<br>
返回一个新的字符串，它是此字符串的一个子字符串。<br>
38	String substring(int beginIndex, int endIndex)<br>
返回一个新字符串，它是此字符串的一个子字符串。<br>
39	char[] toCharArray()<br>
将此字符串转换为一个新的字符数组。<br>
40	String toLowerCase()<br>
使用默认语言环境的规则将此 String 中的所有字符都转换为小写。<br>
41	String toLowerCase(Locale locale)<br>
 使用给定 Locale 的规则将此 String 中的所有字符都转换为小写。<br>
42	String toString()<br>
 返回此对象本身（它已经是一个字符串！）。<br>
43	String toUpperCase()<br>
使用默认语言环境的规则将此 String 中的所有字符都转换为大写。<br>
44	String toUpperCase(Locale locale)<br>
使用给定 Locale 的规则将此 String 中的所有字符都转换为大写。<br>
45	String trim()<br>
返回字符串的副本，忽略前导空白和尾部空白。<br>
46	static String valueOf(primitive data type x)<br>
返回给定data type类型x参数的字符串表示形式。<br>
47	contains(CharSequence chars)<br>
判断是否包含指定的字符系列。<br>
48	isEmpty()<br>
判断字符串是否为空。<br>
#Java StringBuffer&StringBuilder Class<br>
当对字符串进行修改的时候，需要使用 StringBuffer 和 StringBuilder 类。<br>
和 String 类不同的是，StringBuffer 和 StringBuilder 类的对象能够被多次的修改，并且不产生新的未使用对象。<br>
 <br>
在使用 StringBuffer 类时，每次都会对 StringBuffer 对象本身进行操作，而不是生成新的对象，所以如果需要对字符串进行修改推荐使用 StringBuffer。<br>
StringBuilder 类在 Java 5 中被提出，它和 StringBuffer 之间的最大不同在于 StringBuilder 的方法不是线程安全的（不能同步访问）。<br>
由于 StringBuilder 相较于 StringBuffer 有速度优势，所以多数情况下建议使用 StringBuilder 类。<br>
 <br>
以下是 StringBuffer 类支持的主要方法：<br>
1	public StringBuffer append(String s)<br>
将指定的字符串追加到此字符序列。<br>
2	public StringBuffer reverse()<br>
 将此字符序列用其反转形式取代。<br>
3	public delete(int start, int end)<br>
移除此序列的子字符串中的字符。<br>
4	public insert(int offset, int i)<br>
将 int 参数的字符串表示形式插入此序列中。<br>
5	insert(int offset, String str)<br>
将 str 参数的字符串插入此序列中。<br>
6	replace(int start, int end, String str)<br>
使用给定 String 中的字符替换此序列的子字符串中的字符。<br>
以下列表列出了 StringBuffer 类的其他常用方法：<br>
1	int capacity()<br>
返回当前容量。<br>
2	char charAt(int index)<br>
返回此序列中指定索引处的 char 值。<br>
3	void ensureCapacity(int minimumCapacity)<br>
确保容量至少等于指定的最小值。<br>
4	void getChars(int srcBegin, int srcEnd, char[] dst, int dstBegin)<br>
将字符从此序列复制到目标字符数组 dst。<br>
5	int indexOf(String str)<br>
返回第一次出现的指定子字符串在该字符串中的索引。<br>
6	int indexOf(String str, int fromIndex)<br>
从指定的索引处开始，返回第一次出现的指定子字符串在该字符串中的索引。<br>
7	int lastIndexOf(String str)<br>
返回最右边出现的指定子字符串在此字符串中的索引。<br>
8	int lastIndexOf(String str, int fromIndex)<br>
返回 String 对象中子字符串最后出现的位置。<br>
9	int length()<br>
 返回长度（字符数）。<br>
10	void setCharAt(int index, char ch)<br>
将给定索引处的字符设置为 ch。<br>
11	void setLength(int newLength)<br>
设置字符序列的长度。<br>
12	CharSequence subSequence(int start, int end)<br>
返回一个新的字符序列，该字符序列是此序列的子序列。<br>
13	String substring(int start)<br>
返回一个新的 String，它包含此字符序列当前所包含的字符子序列。<br>
14	String substring(int start, int end)<br>
返回一个新的 String，它包含此序列当前所包含的字符子序列。<br>
15	String toString()<br>
返回此序列中数据的字符串表示形式。<br>
#Java数组<br>
声明数组变量<br>
创建数组<br>
处理数组（循环或for each）<br>
for each循环<br>
JDK 1.5 引进了一种新的循环类型，被称为 For-Each 循环或者加强型循环，它能在不使用下标的情况下遍历数组。<br>
语法格式如下：<br>
for(type element: array)<br>
{<br>
System.out.println(element);<br>
}<br>
数组作为函数的参数<br>
数组作为函数的返回值<br>
多维数组<br>
多维数组的动态初始化<br>
直接按维分配或者从最高维分别为每一维分配空间<br>
多维数组的引用（数组名[][]…维度）<br>
##Arrays 类<br>
java.util.Arrays 类能方便地操作数组，它提供的所有方法都是静态的。<br>
具有以下功能：<br>
•	给数组赋值：通过 fill 方法。<br>
•	对数组排序：通过 sort 方法,按升序。<br>
•	比较数组：通过 equals 方法比较数组中元素值是否相等。<br>
•	查找数组元素：通过 binarySearch 方法能对排序好的数组进行二分查找法操作。<br>
Arrays类的方法<br>
 <br>
Java日期时间<br>
Date类的方法<br>
1	boolean after(Date date)<br>
若当调用此方法的Date对象在指定日期之后返回true,否则返回false。<br>
2	boolean before(Date date)<br>
若当调用此方法的Date对象在指定日期之前返回true,否则返回false。<br>
3	Object clone( )<br>
返回此对象的副本。<br>
4	int compareTo(Date date)<br>
比较当调用此方法的Date对象和指定日期。两者相等时候返回0。调用对象在指定日期之前则返回负数。调用对象在指定日期之后则返回正数。<br>
5	int compareTo(Object obj)<br>
若obj是Date类型则操作等同于compareTo(Date) 。否则它抛出ClassCastException。<br>
6	boolean equals(Object date)<br>
当调用此方法的Date对象和指定日期相等时候返回true,否则返回false。<br>
7	long getTime( )<br>
返回自 1970 年 1 月 1 日 00:00:00 GMT 以来此 Date 对象表示的毫秒数。<br>
8	int hashCode( )<br>
 返回此对象的哈希码值。<br>
9	void setTime(long time)<br>
 <br>
用自1970年1月1日00:00:00 GMT以后time毫秒数设置时间和日期。<br>
10	String toString( )<br>
把此 Date 对象转换为以下形式的 String： dow mon dd hh:mm:ss zzz yyyy 其中： dow 是一周中的某一天 (Sun, Mon, Tue, Wed, Thu, Fri, Sat)。<br>
<br>
toString()方法打印当前的日期和时间<br>
日期的比较有after，before，equals方法比较和getTime方法获取日期来比较以及compareTo方法<br>
SimpleDateFormat 是一个以语言环境敏感的方式来格式化和分析日期的类。SimpleDateFormat 允许你选择任何用户自定义日期时间格式来运行。<br>
SimpleDateFormat ft = new SimpleDateFormat ("yyyy-MM-dd hh:mm:ss");<br>
这一行代码确立了转换的格式，其中 yyyy 是完整的公元年，MM 是月份，dd 是日期，HH:mm:ss 是时、分、秒。<br>
注意:有的格式大写，有的格式小写，例如 MM 是月份，mm 是分；HH 是 24 小时制，而 hh 是 12 小时制。<br>
<br>
日期和时间的格式化编码<br>
 <br>
 <br>
如果需要重复提供日期，那么，可以利用一个格式化字符串指出要被格式化的参数的索引。索引必须紧跟在%后面，而且必须以$结束<br>
或者，可以使用 < 标志。它表明先前被格式化的参数要被再次使用。<br>
<br>
<br>
解析字符串转化为时间<br>
SimpleDateFormat 类有一些附加的方法，特别是parse()，它试图按照给定的SimpleDateFormat 对象的格式化存储来解析字符串<br>
Java休眠<br>
Sleep()方法<br>
	使当前线程进入停滞（注意不是停止）状态，让出CPU的使用，目的是不让当前线程独自霸占进程获得的cpu资源，留点时间给其他的线程使用。<br>
<br>
时间测量<br>
<br>
#Calendar类<br>
getInstance()方法创建对象<br>
创建对象时若不设定日期参数，默认是当前日期<br>
 <br>
Calendar类对对象信息的设置<br>
Set设置<br>
如：<br>
Calendar c1 = Calendar.getInstance();<br>
调用：<br>
public final void set(int year,int month,int date)<br>
c1.set(2009, 6, 12);//把Calendar对象c1的年月日分别设这为：2009、6、12<br>
利用字段类型设置<br>
如果只设定某个字段，例如日期的值，则可以使用如下set方法：<br>
public void set(int field,int value)<br>
把 c1对象代表的日期设置为10号，其它所有的数值会被重新计算<br>
c1.set(Calendar.DATE,10);<br>
把c1对象代表的年份设置为2008年，其他的所有数值会被重新计算<br>
c1.set(Calendar.YEAR,2008);<br>
其他字段属性set的意义以此类推<br>
Add设置<br>
Calendar c1 = Calendar.getInstance();<br>
把c1对象的日期加上10，也就是c1也就表示为10天后的日期，其它所有的数值会被重新计算<br>
c1.add(Calendar.DATE, 10);<br>
把c1对象的日期减去10，也就是c1也就表示为10天前的日期，其它所有的数值会被重新计算<br>
c1.add(Calendar.DATE, -10);<br>
其他字段属性的add的意义以此类推<br>
<br>
Calendar类对象信息的获得（get（）方法）<br>
<br>
GregorianCalendar类<br>
Calendar类实现了公历日历，GregorianCalendar是Calendar类的一个具体实现。<br>
Calendar 的getInstance（）方法返回一个默认用当前的语言环境和时区初始化的GregorianCalendar对象。GregorianCalendar定义了两个字段：AD和BC。这是代表公历定义的两个时代。<br>
GregorianCalendar类对象的构造方法<br>
1	GregorianCalendar()<br>
在具有默认语言环境的默认时区内使用当前时间构造一个默认的 GregorianCalendar。<br>
2	GregorianCalendar(int year, int month, int date)<br>
在具有默认语言环境的默认时区内构造一个带有给定日期设置的 GregorianCalendar<br>
3	GregorianCalendar(int year, int month, int date, int hour, int minute)<br>
为具有默认语言环境的默认时区构造一个具有给定日期和时间设置的 GregorianCalendar。<br>
4	GregorianCalendar(int year, int month, int date, int hour, int minute, int second)<br>
  为具有默认语言环境的默认时区构造一个具有给定日期和时间设置的 GregorianCalendar。<br>
5	GregorianCalendar(Locale aLocale)<br>
在具有给定语言环境的默认时区内构造一个基于当前时间的 GregorianCalendar。<br>
6	GregorianCalendar(TimeZone zone)<br>
在具有默认语言环境的给定时区内构造一个基于当前时间的 GregorianCalendar。<br>
7	GregorianCalendar(TimeZone zone, Locale aLocale)<br>
 在具有给定语言环境的给定时区内构造一个基于当前时间的 GregorianCalendar。<br>
GregorianCalendar类提供的一些方法<br>
1	void add(int field, int amount)<br>
根据日历规则，将指定的（有符号的）时间量添加到给定的日历字段中。<br>
2	protected void computeFields()<br>
转换UTC毫秒值为时间域值<br>
3	protected void computeTime()<br>
覆盖Calendar ，转换时间域值为UTC毫秒值<br>
4	boolean equals(Object obj)<br>
比较此 GregorianCalendar 与指定的 Object。<br>
5	int get(int field)<br>
获取指定字段的时间值<br>
6	int getActualMaximum(int field)<br>
返回当前日期，给定字段的最大值<br>
7	int getActualMinimum(int field)<br>
返回当前日期，给定字段的最小值<br>
8	int getGreatestMinimum(int field)<br>
 返回此 GregorianCalendar 实例给定日历字段的最高的最小值。<br>
9	Date getGregorianChange()<br>
获得格里高利历的更改日期。<br>
10	int getLeastMaximum(int field)<br>
返回此 GregorianCalendar 实例给定日历字段的最低的最大值<br>
11	int getMaximum(int field)<br>
返回此 GregorianCalendar 实例的给定日历字段的最大值。<br>
12	Date getTime()<br>
获取日历当前时间。<br>
13	long getTimeInMillis()<br>
获取用长整型表示的日历的当前时间<br>
14	TimeZone getTimeZone()<br>
获取时区。<br>
15	int getMinimum(int field)<br>
返回给定字段的最小值。<br>
16	int hashCode()<br>
重写hashCode.<br>
17	boolean isLeapYear(int year)<br>
确定给定的年份是否为闰年。<br>
18	void roll(int field, boolean up)<br>
在给定的时间字段上添加或减去（上/下）单个时间单元，不更改更大的字段。<br>
19	void set(int field, int value)<br>
用给定的值设置时间字段。<br>
20	void set(int year, int month, int date)<br>
设置年、月、日的值。<br>
21	void set(int year, int month, int date, int hour, int minute)<br>
设置年、月、日、小时、分钟的值。<br>
22	void set(int year, int month, int date, int hour, int minute, int second)<br>
设置年、月、日、小时、分钟、秒的值。<br>
23	void setGregorianChange(Date date)<br>
设置 GregorianCalendar 的更改日期。<br>
24	void setTime(Date date)<br>
用给定的日期设置Calendar的当前时间。<br>
25	void setTimeInMillis(long millis)<br>
用给定的long型毫秒数设置Calendar的当前时间。<br>
26	void setTimeZone(TimeZone value)<br>
用给定时区值设置当前时区。<br>
27	String toString()<br>
返回代表日历的字符串。<br>
<br>
#Java正则表达式<br>
下表列出了一些正则表达式的实例及描述：<br>
正则表达式	描述<br>
this is text	匹配字符串 "this is text"<br>
this\s+is\s+text	注意字符串中的 \s+。<br>
匹配单词 "this" 后面的 \s+ 可以匹配多个空格，之后匹配 is 字符串，再之后 \s+ 匹配多个空格然后再跟上 text 字符串。<br>
可以匹配这个实例：this is text<br>
^\d+(\.\d+)?	^ 定义了以什么开始<br>
\d+ 匹配一个或多个数字<br>
? 设置括号内的选项是可选的<br>
\. 匹配 "."<br>
可以匹配的实例："5", "1.5" 和 "2.21"。<br>
Java 正则表达式和 Perl 的是最为相似的。<br>
java.util.regex 包主要包括以下三个类：<br>
•	Pattern 类：<br>
pattern 对象是一个正则表达式的编译表示。Pattern 类没有公共构造方法。要创建一个 Pattern 对象，你必须首先调用其公共静态编译方法，它返回一个 Pattern 对象。该方法接受一个正则表达式作为它的第一个参数。<br>
•	Matcher 类：<br>
Matcher 对象是对输入字符串进行解释和匹配操作的引擎。与Pattern 类一样，Matcher 也没有公共构造方法。你需要调用 Pattern 对象的 matcher 方法来获得一个 Matcher 对象。<br>
•	PatternSyntaxException：<br>
PatternSyntaxException 是一个非强制异常类，它表示一个正则表达式模式中的语法错误。<br>
<br>
捕获组<br>
可以通过调用 matcher 对象的 groupCount 方法来查看表达式有多少个分组。groupCount 方法返回一个 int 值，表示matcher对象当前有多个捕获组。<br>
还有一个特殊的组（group(0)），它总是代表整个表达式。该组不包括在 groupCount 的返回值中<br>
<br>
正则表达式语法<br>
在其他语言中，\\ 表示：我想要在正则表达式中插入一个普通的（字面上的）反斜杠，请不要给它任何特殊的意义。<br>
在 Java 中，\\ 表示：我要插入一个正则表达式的反斜线，所以其后的字符具有特殊的意义。<br>
所以，在其他的语言中（如 Perl），一个反斜杠 \ 就足以具有转义的作用，而在 Java 中正则表达式中则需要有两个反斜杠才能被解析为其他语言中的转义作用。也可以简单的理解在 Java 的正则表达式中，两个 \\ 代表其他语言中的一个 \，这也就是为什么表示一位数字的正则表达式是 \\d，而表示一个普通的反斜杠是 \\。<br>
 <br>
 <br>
 <br>
 <br>
Matcher类的方法<br>
索引方法<br>
索引方法提供了有用的索引值，精确表明输入字符串中在哪能找到匹配：<br>
序号	方法及说明<br>
1	public int start()<br>
返回以前匹配的初始索引。<br>
2	public int start(int group)<br>
 返回在以前的匹配操作期间，由给定组所捕获的子序列的初始索引<br>
3	public int end()<br>
返回最后匹配字符之后的偏移量。<br>
4	public int end(int group)<br>
返回在以前的匹配操作期间，由给定组所捕获子序列的最后字符之后的偏移量。<br>
查找方法<br>
查找方法用来检查输入字符串并返回一个布尔值，表示是否找到该模式：<br>
序号	方法及说明<br>
1	public boolean lookingAt()<br>
 尝试将从区域开头开始的输入序列与该模式匹配。<br>
2	public boolean find()<br>
尝试查找与该模式匹配的输入序列的下一个子序列。<br>
3	public boolean find(int start）<br>
重置此匹配器，然后尝试查找匹配该模式、从指定索引开始的输入序列的下一个子序列。<br>
4	public boolean matches()<br>
尝试将整个区域与模式匹配。<br>
替换方法<br>
替换方法是替换输入字符串里文本的方法：<br>
序号	方法及说明<br>
1	public Matcher appendReplacement(StringBuffer sb, String replacement)<br>
实现非终端添加和替换步骤。<br>
2	public StringBuffer appendTail(StringBuffer sb)<br>
实现终端添加和替换步骤。<br>
3	public String replaceAll(String replacement)<br>
 替换模式与给定替换字符串相匹配的输入序列的每个子序列。<br>
4	public String replaceFirst(String replacement)<br>
 替换模式与给定替换字符串匹配的输入序列的第一个子序列。<br>
5	public static String quoteReplacement(String s)<br>
返回指定字符串的字面替换字符串。这个方法返回一个字符串，就像传递给Matcher类的appendReplacement 方法一个字面字符串一样工作。<br>
<br>
start和end方法<br>
matches和lookingAt方法<br>
replaceFirst和replaceAll方法<br>
appendReplacement 和 appendTail 方法<br>
<br>
PatternSyntaxException 类的方法<br>
PatternSyntaxException 是一个非强制异常类，它指示一个正则表达式模式中的语法错误。<br>
PatternSyntaxException 类提供了下面的方法来帮助我们查看发生了什么错误。<br>
序号	方法及说明<br>
1	public String getDescription()<br>
获取错误的描述。<br>
2	public int getIndex()<br>
 获取错误的索引。<br>
3	public String getPattern()<br>
获取错误的正则表达式模式。<br>
4	public String getMessage()<br>
返回多行字符串，包含语法错误及其索引的描述、错误的正则表达式模式和模式中错误索引的可视化指示<br>
<br>
#Java方法<br>
方法的定义<br>
 <br>
方法的优势<br>
1. 使程序变得更简短而清晰。<br>
2. 有利于程序维护。<br>
3. 可以提高程序开发的效率。<br>
4. 提高了代码的重用性。<br>
方法的命名<br>
1.方法的名字的第一个单词应以小写字母作为开头，后面的单词则用大写字母开头写，不使用连接符。例如：addPerson。<br>
2.下划线可能出现在 JUnit 测试方法名称中用以分隔名称的逻辑组件<br>
方法的调用<br>
当方法返回一个值的时候，方法调用通常被当做一个值。例如：<br>
int larger = max(30, 40);<br>
如果方法返回值是void，方法调用一定是一条语句。例如，方法println返回void。下面的调用是个语句：<br>
System.out.println("欢迎访问菜鸟教程！");<br>
<br>
##void关键字<br>
通过值传递参数<br>
方法的重载（创建另一个相同名字不同参数的方法）<br>
变量作用域<br>
命令行参数的使用<br>
构造方法<br>
可变参数<br>
finalize()方法<br>
Java 允许定义这样的方法，它在对象被垃圾收集器析构(回收)之前调用，这个方法叫做 finalize( )，它用来清除回收对象。<br>
实例的验证<br>
当创建对象时，系统会自动调用构造方法<br>
1.	没有自定义构造方法时，系统会调用默认构造方法<br>
2.	构造方法可以重载，不同的构造方法名字相同，参数列表不同，参数列表是其识别的依据、标志，类似不同人可能有相同的名字，但有不同的身份证号。<br>
3.	当自定义构造方法时，系统依据传入的参数类型、数量，自动匹配构造方法初始化对象<br>
#Java 流(Stream)、文件(File)和IO<br>
读取控制台输入（System.in）<br>
读取控制台多字符输入（read）<br>
读取控制台字符串输入（readline）<br>
<br>
控制台输出<br>
	write()方法<br>
读写文件<br>
<br>
<br>
##FileInputStream<br>
该流用于从文件读取数据，它的对象可以用关键字 new 来创建。<br>
有多种构造方法可用来创建对象。<br>
可以使用字符串类型的文件名来创建一个输入流对象来读取文件：<br>
InputStream f = new FileInputStream("C:/java/hello");<br>
也可以使用一个文件对象来创建一个输入流对象来读取文件。我们首先得使用 File() 方法来创建一个文件对象：<br>
File f = new File("C:/java/hello"); <br>
InputStream in = new FileInputStream(f);<br>
创建了InputStream对象，就可以使用下面的方法来读取流或者进行其他的流操作。<br>
序号	方法及描述<br>
1	public void close() throws IOException{}<br>
关闭此文件输入流并释放与此流有关的所有系统资源。抛出IOException异常。<br>
2	protected void finalize()throws IOException {}<br>
这个方法清除与该文件的连接。确保在不再引用文件输入流时调用其 close 方法。抛出IOException异常。<br>
3	public int read(int r)throws IOException{}<br>
这个方法从 InputStream 对象读取指定字节的数据。返回为整数值。返回下一字节数据，如果已经到结尾则返回-1。<br>
4	public int read(byte[] r) throws IOException{}<br>
这个方法从输入流读取r.length长度的字节。返回读取的字节数。如果是文件结尾则返回-1。<br>
5	public int available() throws IOException{}<br>
返回下一次对此输入流调用的方法可以不受阻塞地从此输入流读取的字节数。返回一个整数值。<br>
除了 InputStream 外，还有一些其他的输入流，更多的细节参考下面链接：<br>
•	ByteArrayInputStream<br>
•	DataInputStream<br>
________________________________________<br>
##FileOutputStream<br>
该类用来创建一个文件并向文件中写数据。<br>
如果该流在打开文件进行输出前，目标文件不存在，那么该流会创建该文件。<br>
有两个构造方法可以用来创建 FileOutputStream 对象。<br>
使用字符串类型的文件名来创建一个输出流对象：<br>
OutputStream f = new FileOutputStream("C:/java/hello")<br>
也可以使用一个文件对象来创建一个输出流来写文件。我们首先得使用File()方法来创建一个文件对象：<br>
File f = new File("C:/java/hello"); OutputStream fOut = new FileOutputStream(f);<br>
创建OutputStream 对象完成后，就可以使用下面的方法来写入流或者进行其他的流操作。<br>
序号	方法及描述<br>
1	public void close() throws IOException{}<br>
关闭此文件输入流并释放与此流有关的所有系统资源。抛出IOException异常。<br>
2	protected void finalize()throws IOException {}<br>
这个方法清除与该文件的连接。确保在不再引用文件输入流时调用其 close 方法。抛出IOException异常。<br>
3	public void write(int w)throws IOException{}<br>
这个方法把指定的字节写到输出流中。<br>
4	public void write(byte[] w)<br>
把指定数组中w.length长度的字节写到OutputStream中。<br>
除了OutputStream外，还有一些其他的输出流，更多的细节参考下面链接：<br>
•	ByteArrayOutputStream<br>
•	DataOutputStream<br>
实例验证<br>
<br>
文件和I/O<br>
还有一些关于文件和I/O的类，我们也需要知道：<br>
•	File Class(类)<br>
•	FileReader Class(类)<br>
•	FileWriter Class(类)<br>
<br>
java中的目录<br>
创建目录<br>
读取目录<br>
删除目录或文件<br>
<br>
Java Scanner类<br>
next() 与 nextLine() 区别<br>
next():<br>
•	1、一定要读取到有效字符后才可以结束输入。<br>
•	2、对输入有效字符之前遇到的空白，next() 方法会自动将其去掉。<br>
•	3、只有输入有效字符后才将其后面输入的空白作为分隔符或者结束符。<br>
•	next() 不能得到带有空格的字符串。<br>
nextLine()：<br>
•	1、以Enter为结束符,也就是说 nextLine()方法返回的是输入回车之前的所有字符。<br>
•	2、可以获得空白。<br>
如果要输入 int 或 float 类型的数据，在 Scanner 类中也有支持，但是在输入之前最好先使用 hasNextXxx() 方法进行验证，再使用 nextXxx() 来读取：<br>
<br>
#Java异常处理<br>
Exception 类的层次<br>
所有的异常类是从 java.lang.Exception 类继承的子类。<br>
Exception 类是 Throwable 类的子类。除了Exception类外，Throwable还有一个子类Error 。<br>
Java 程序通常不捕获错误。错误一般发生在严重故障时，它们在Java程序处理的范畴之外。<br>
Error 用来指示运行时环境发生的错误。<br>
例如，JVM 内存溢出。一般地，程序不会从错误中恢复。<br>
异常类有两个主要的子类：IOException 类和 RuntimeException 类。<br>
 <br>
Java 内置异常类<br>
Java 语言定义了一些异常类在 java.lang 标准包中。<br>
标准运行时异常类的子类是最常见的异常类。由于 java.lang 包是默认加载到所有的 Java 程序的，所以大部分从运行时异常类继承而来的异常都可以直接使用。<br>
Java 根据各个类库也定义了一些其他的异常，下面的表中列出了 Java 的非检查性异常。<br>
异常	描述<br>
ArithmeticException	当出现异常的运算条件时，抛出此异常。例如，一个整数"除以零"时，抛出此类的一个实例。<br>
ArrayIndexOutOfBoundsException	用非法索引访问数组时抛出的异常。如果索引为负或大于等于数组大小，则该索引为非法索引。<br>
ArrayStoreException	试图将错误类型的对象存储到一个对象数组时抛出的异常。<br>
ClassCastException	当试图将对象强制转换为不是实例的子类时，抛出该异常。<br>
IllegalArgumentException	抛出的异常表明向方法传递了一个不合法或不正确的参数。<br>
IllegalMonitorStateException	抛出的异常表明某一线程已经试图等待对象的监视器，或者试图通知其他正在等待对象的监视器而本身没有指定监视器的线程。<br>
IllegalStateException	在非法或不适当的时间调用方法时产生的信号。换句话说，即 Java 环境或 Java 应用程序没有处于请求操作所要求的适当状态下。<br>
IllegalThreadStateException	线程没有处于请求操作所要求的适当状态时抛出的异常。<br>
IndexOutOfBoundsException	指示某排序索引（例如对数组、字符串或向量的排序）超出范围时抛出。<br>
NegativeArraySizeException	如果应用程序试图创建大小为负的数组，则抛出该异常。<br>
NullPointerException	当应用程序试图在需要对象的地方使用 null 时，抛出该异常<br>
NumberFormatException	当应用程序试图将字符串转换成一种数值类型，但该字符串不能转换为适当格式时，抛出该异常。<br>
SecurityException	由安全管理器抛出的异常，指示存在安全侵犯。<br>
StringIndexOutOfBoundsException	此异常由 String 方法抛出，指示索引或者为负，或者超出字符串的大小。<br>
UnsupportedOperationException	当不支持请求的操作时，抛出该异常。<br>
下面的表中列出了 Java 定义在 java.lang 包中的检查性异常类。<br>
异常	描述<br>
ClassNotFoundException	应用程序试图加载类时，找不到相应的类，抛出该异常。<br>
CloneNotSupportedException	当调用 Object 类中的 clone 方法克隆对象，但该对象的类无法实现 Cloneable 接口时，抛出该异常。<br>
IllegalAccessException	拒绝访问一个类的时候，抛出该异常。<br>
InstantiationException	当试图使用 Class 类中的 newInstance 方法创建一个类的实例，而指定的类对象因为是一个接口或是一个抽象类而无法实例化时，抛出该异常。<br>
InterruptedException	一个线程被另一个线程中断，抛出该异常。<br>
NoSuchFieldException	请求的变量不存在<br>
NoSuchMethodException	请求的方法不存在<br>
________________________________________<br>
异常方法<br>
下面的列表是 Throwable 类的主要方法:<br>
序号	方法及说明<br>
1	public String getMessage()<br>
返回关于发生的异常的详细信息。这个消息在Throwable 类的构造函数中初始化了。<br>
2	public Throwable getCause()<br>
返回一个Throwable 对象代表异常原因。<br>
3	public String toString()<br>
使用getMessage()的结果返回类的串级名字。<br>
4	public void printStackTrace()<br>
打印toString()结果和栈层次到System.err，即错误输出流。<br>
5	public StackTraceElement [] getStackTrace()<br>
返回一个包含堆栈层次的数组。下标为0的元素代表栈顶，最后一个元素代表方法调用堆栈的栈底。<br>
6	public Throwable fillInStackTrace()<br>
用当前的调用栈层次填充Throwable 对象栈层次，添加到栈层次任何先前信息中。<br>
<br>
捕获异常<br>
使用 try 和 catch 关键字可以捕获异常。try/catch 代码块放在异常可能发生的地方。<br>
try/catch代码块中的代码称为保护代码，使用 try/catch 的语法如下：<br>
try<br>
{<br>
   // 程序代码<br>
}catch(ExceptionName e1)<br>
{<br>
   //Catch 块<br>
}<br>
Catch 语句包含要捕获异常类型的声明。当保护代码块中发生一个异常时，try 后面的 catch 块就会被检查。<br>
如果发生的异常包含在 catch 块中，异常会被传递到该 catch 块，这和传递一个参数到方法是一样。<br>
实例验证<br>
<br>
<br>
多重捕获块<br>
try后跟多个catch块<br>
<br>
throw&throws关键字<br>
如果一个方法没有捕获到一个检查性异常，那么该方法必须使用 throws 关键字来声明。throws 关键字放在方法签名的尾部。<br>
也可以使用 throw 关键字抛出一个异常，无论它是新实例化的还是刚捕获到的。<br>
一个方法可以声明抛出多个异常，多个异常之间用逗号隔开。<br>
finally关键字<br>
finally 关键字用来创建在 try 代码块后面执行的代码块。<br>
无论是否发生异常，finally 代码块中的代码总会被执行。<br>
在 finally 代码块中，可以运行清理类型等收尾善后性质的语句。<br>
finally 代码块出现在 catch 代码块最后，语法如下：<br>
try{<br>
  // 程序代码<br>
}catch(异常类型1 异常的变量名1){<br>
  // 程序代码<br>
}catch(异常类型2 异常的变量名2){<br>
  // 程序代码<br>
}finally{<br>
  // 程序代码<br>
}<br>
catch 不能独立于 try 存在。<br>
在 try/catch 后面添加 finally 块并非强制性要求的。<br>
try 代码后不能既没 catch 块也没 finally 块。<br>
try, catch, finally 块之间不能添加任何代码<br>
<br>
声明自定义异常<br>
在 Java 中你可以自定义异常。编写自己的异常类时需要记住下面的几点。<br>
所有异常都必须是 Throwable 的子类。<br>
如果希望写一个检查性异常类，则需要继承 Exception 类。<br>
如果你想写一个运行时异常类，那么需要继承 RuntimeException 类。<br>
通用异常<br>
JVM异常&程序级异常<br>
<br>
<br>
#Java继承<br>
不支持多继承，即一个子类继承多个父类。<br>
但支持多重继承（A继承B,C继承A……）和不同继承（A继承B,C继承B……）<br>
继承关键字extends（继承一个类）和implements（可以继承多接口）<br>
super&this关键字<br>
super关键字：我们可以通过super关键字来实现对父类成员的访问，用来引用当前对象的父类。<br>
this关键字：指向自己的引用。<br>
构造器<br>
子类是不继承父类的构造器（构造方法或者构造函数）的，它只是调用（隐式或显式）。如果父类的构造器带有参数，则必须在子类的构造器中显式地通过 super 关键字调用父类的构造器并配以适当的参数列表。<br>
如果父类构造器没有参数，则在子类的构造器中不需要使用 super 关键字调用父类构造器，系统会自动调用父类的无参构造器。<br>
<br>
##Java重写与重载<br>
重写（Override）<br>
即外壳不变，核心重写！<br>
方法的重写规则<br>
•	参数列表与被重写方法的参数列表必须完全相同。<br>
•	返回类型与被重写方法的返回类型可以不相同，但是必须是父类返回值的派生类（java5 及更早版本返回类型要一样，java7 及更高版本可以不同）。<br>
•	访问权限不能比父类中被重写的方法的访问权限更低。例如：如果父类的一个方法被声明为 public，那么在子类中重写该方法就不能声明为 protected。<br>
•	父类的成员方法只能被它的子类重写。<br>
•	声明为 final 的方法不能被重写。<br>
•	声明为 static 的方法不能被重写，但是能够被再次声明。<br>
•	子类和父类在同一个包中，那么子类可以重写父类所有方法，除了声明为 private 和 final 的方法。<br>
•	子类和父类不在同一个包中，那么子类只能够重写父类的声明为 public 和 protected 的非 final 方法。<br>
•	重写的方法能够抛出任何非强制异常，无论被重写的方法是否抛出异常。但是，重写的方法不能抛出新的强制性异常，或者比被重写方法声明的更广泛的强制性异常，反之则可以。<br>
•	构造方法不能被重写。<br>
•	如果不能继承一个类，则不能重写该类的方法<br>
super关键字<br>
<br>
重载（Overload）<br>
	重载(overloading) 是在一个类里面，方法名字相同，而参数不同。返回类型可以相同也可以不同。<br>
每个重载的方法（或者构造函数）都必须有一个独一无二的参数类型列表。<br>
最常用的地方就是构造器的重载。<br>
重载规则:<br>
•	被重载的方法必须改变参数列表(参数个数或类型不一样)；<br>
•	被重载的方法可以改变返回类型；<br>
•	被重载的方法可以改变访问修饰符；<br>
•	被重载的方法可以声明新的或更广的检查异常；<br>
•	方法能够在同一个类中或者在一个子类中被重载。<br>
•	无法以返回值类型作为重载函数的区分标准。<br>
###重写与重载之间的区别<br>
区别点	重载方法	重写方法<br>
参数列表	必须修改	一定不能修改<br>
返回类型	可以修改	一定不能修改<br>
异常	可以修改	可以减少或删除，一定不能抛出新的或者更广的异常<br>
访问	可以修改	一定不能做更严格的限制（可以降低限制）<br>
方法的重写(Overriding)和重载(Overloading)是java多态性的不同表现，重写是父类与子类之间多态性的一种表现，重载可以理解成多态的具体表现形式。<br>
•	(1)方法重载是一个类中定义了多个方法名相同,而他们的参数的数量不同或数量相同而类型和次序不同,则称为方法的重载(Overloading)。<br>
•	(2)方法重写是在子类存在方法与父类的方法的名字相同,而且参数的个数与类型一样,返回值也一样的方法,就称为重写(Overriding)。<br>
•	(3)方法重载是一个类的多态性表现,而方法重写是子类与父类的一种多态性表现。<br>
 <br>
 <br>
<br>
<br>
<br>
#Java多态<br>
多态的优点<br>
1. 消除类型之间的耦合关系<br>
2. 可替换性<br>
3. 可扩充性<br>
4. 接口性<br>
5. 灵活性<br>
6. 简化性<br>
多态存在的三个必要条件<br>
继承<br>
重写<br>
父类引用指向子类对象：Parent p = new Child();<br>
 <br>
虚函数<br>
重写<br>
<br>
##多态的实现方式<br>
方式一：重写：<br>
这个内容已经在上一章节详细讲过，就不再阐述，详细可访问：Java 重写(Override)与重载(Overload)。<br>
方式二：接口<br>
•	1. 生活中的接口最具代表性的就是插座，例如一个三接头的插头都能接在三孔插座中，因为这个是每个国家都有各自规定的接口规则，有可能到国外就不行，那是因为国外自己定义的接口类型。<br>
•	2. java中的接口类似于生活中的接口，就是一些方法特征的集合，但没有方法的实现。具体可以看 java接口 这一章节的内容。<br>
方式三：抽象类和抽象方法<br>
<br>
#Java抽象类<br>
没有足够的信息来描绘一个具体的对象，这样的类就是抽象类。<br>
除了不能实例化对象，其他功能依然存在。<br>
继承抽象方法的子类必须重写该方法。否则，该子类也必须声明为抽象类。不然子类也无法实例化对象。<br>
抽象类总结规定<br>
•	1. 抽象类不能被实例化(初学者很容易犯的错)，如果被实例化，就会报错，编译无法通过。只有抽象类的非抽象子类可以创建对象。<br>
•	2. 抽象类中不一定包含抽象方法，但是有抽象方法的类必定是抽象类。<br>
•	3. 抽象类中的抽象方法只是声明，不包含方法体，就是不给出方法的具体实现也就是方法的具体功能。<br>
•	4. 构造方法，类方法（用 static 修饰的方法）不能声明为抽象方法。<br>
•	5. 抽象类的子类必须给出抽象类中的抽象方法的具体实现，除非该子类也是抽象类。<br>
#Java封装<br>
实现封装的步骤<br>
1.修改属性的可见性来限制对属性的访问（一般限制是private）<br>
2.对每个值属性提供对外的公共方法访问，也就是创建一对赋取值方法，用于对私有属性的访问。<br>
#Java接口<br>
接口与类相似点：<br>
•	一个接口可以有多个方法。<br>
•	接口文件保存在 .java 结尾的文件中，文件名使用接口名。<br>
•	接口的字节码文件保存在 .class 结尾的文件中。<br>
•	接口相应的字节码文件必须在与包名称相匹配的目录结构中。<br>
接口与类的区别：<br>
•	接口不能用于实例化对象。<br>
•	接口没有构造方法。<br>
•	接口中所有的方法必须是抽象方法，Java 8 之后 接口中可以使用 default 关键字修饰的非抽象方法。<br>
•	接口不能包含成员变量，除了 static 和 final 变量。<br>
•	接口不是被类继承了，而是要被类实现。<br>
•	接口支持多继承。<br>
接口特性<br>
•	接口中每一个方法也是隐式抽象的,接口中的方法会被隐式的指定为 public abstract（只能是 public abstract，其他修饰符都会报错）。<br>
•	接口中可以含有变量，但是接口中的变量会被隐式的指定为 public static final 变量（并且只能是 public，用 private 修饰会报编译错误）。<br>
•	接口中的方法是不能在接口中实现的，只能由实现接口的类来实现接口中的方法。<br>
抽象类和接口的区别<br>
•	1. 抽象类中的方法可以有方法体，就是能实现方法的具体功能，但是接口中的方法不行。<br>
•	2. 抽象类中的成员变量可以是各种类型的，而接口中的成员变量只能是 public static final 类型的。<br>
•	3. 接口中不能含有静态代码块以及静态方法(用 static 修饰的方法)，而抽象类是可以有静态代码块和静态方法。<br>
•	4. 一个类只能继承一个抽象类，而一个类却可以实现多个接口。<br>
接口的声明<br>
接口的声明语法格式如下：<br>
[可见度] interface 接口名称 [extends 其他的接口名] { // 声明变量 // 抽象方法 }<br>
Interface关键字用来声明一个接口。下面是接口声明的一个简单例子。<br>
接口有以下特性：<br>
•	接口是隐式抽象的，当声明一个接口的时候，不必使用abstract关键字。<br>
•	接口中每一个方法也是隐式抽象的，声明时同样不需要abstract关键字。<br>
•	接口中的方法都是公有的。<br>
接口的实现<br>
接口的继承（extends）<br>
接口的多继承（类的多继承不允许，但接口可以）<br>
标记接口<br>
简单形象的说就是给某个对象打个标（盖个戳），使对象拥有某个或某些特权<br>
#Java枚举（enum）<br>
内部类中使用<br>
迭代枚举元素<br>
switch中使用枚举类<br>
values(), ordinal() 和 valueOf() 方法<br>
enum 定义的枚举类默认继承了 java.lang.Enum 类，并实现了 java.lang.Seriablizable 和 java.lang.Comparable 两个接口。<br>
values(), ordinal() 和 valueOf() 方法位于 java.lang.Enum 类中：<br>
•	values() 返回枚举类中所有的值。<br>
•	ordinal()方法可以找到每个枚举常量的索引，就像数组索引一样。<br>
•	valueOf()方法返回指定字符串值的枚举常量。<br>
枚举类成员<br>
实例代码<br>
enum Color{<br>
    RED{<br>
        public String getColor(){//枚举对象实现抽象方法<br>
            return "红色";<br>
        }<br>
    },<br>
    GREEN{<br>
        public String getColor(){//枚举对象实现抽象方法<br>
            return "绿色";<br>
        }<br>
    },<br>
    BLUE{<br>
        public String getColor(){//枚举对象实现抽象方法<br>
            return "蓝色";<br>
        }<br>
    };<br>
    public abstract String getColor();//定义抽象方法<br>
}<br>
<br>
public class Test{<br>
    public static void main(String[] args) {<br>
        for (Color c:Color.values()){<br>
            System.out.print(c.getColor() + "、");<br>
        }<br>
    }<br>
}<br>
<br>
<br>
#Java包<br>
包的作用<br>
创建包<br>
import关键字<br>
包（package）的目录结构<br>
设置 CLASSPATH 系统变量<br>
用下面的命令显示当前的CLASSPATH变量：<br>
•	Windows 平台（DOS 命令行下）：C:\> set CLASSPATH<br>
•	UNIX 平台（Bourne shell 下）：# echo <br>CLASSPATH<br>
删除当前CLASSPATH变量内容：<br>
<br>
•	Windows 平台（DOS 命令行下）：C:\> set CLASSPATH=<br>
•	UNIX 平台（Bourne shell 下）：# unset CLASSPATH; export CLASSPATH<br>
设置CLASSPATH变量:<br>
•	Windows 平台（DOS 命令行下）： C:\> set CLASSPATH=C:\users\jack\java\classes<br>
•	UNIX 平台（Bourne shell 下）：# CLASSPATH=/home/jack/java/classes; export CLASSPATH<br>
#Java数据结构<br>
枚举（Enumeration）<br>
枚举（Enumeration）接口虽然它本身不属于数据结构,但它在其他数据结构的范畴里应用很广。 枚举（The Enumeration）接口定义了一种从数据结构中取回连续元素的方式。<br>
例如，枚举定义了一个叫nextElement 的方法，该方法用来得到一个包含多元素的数据结构的下一个元素。<br>
关于枚举接口的更多信息，请参见枚举（Enumeration）。<br>
________________________________________<br>
位集合（BitSet）<br>
位集合类实现了一组可以单独设置和清除的位或标志。<br>
该类在处理一组布尔值的时候非常有用，你只需要给每个值赋值一"位"，然后对位进行适当的设置或清除，就可以对布尔值进行操作了。<br>
关于该类的更多信息，请参见位集合（BitSet）。<br>
________________________________________<br>
向量（Vector）<br>
向量（Vector）类和传统数组非常相似，但是Vector的大小能根据需要动态的变化。<br>
和数组一样，Vector对象的元素也能通过索引访问。<br>
使用Vector类最主要的好处就是在创建对象的时候不必给对象指定大小，它的大小会根据需要动态的变化。<br>
关于该类的更多信息，请参见向量(Vector)<br>
________________________________________<br>
栈（Stack）<br>
栈（Stack）实现了一个后进先出（LIFO）的数据结构。<br>
你可以把栈理解为对象的垂直分布的栈，当你添加一个新元素时，就将新元素放在其他元素的顶部。<br>
当你从栈中取元素的时候，就从栈顶取一个元素。换句话说，最后进栈的元素最先被取出。<br>
关于该类的更多信息，请参见栈（Stack）。<br>
________________________________________<br>
字典（Dictionary）<br>
字典（Dictionary） 类是一个抽象类，它定义了键映射到值的数据结构。<br>
当你想要通过特定的键而不是整数索引来访问数据的时候，这时候应该使用Dictionary。<br>
由于Dictionary类是抽象类，所以它只提供了键映射到值的数据结构，而没有提供特定的实现。<br>
关于该类的更多信息，请参见字典（ Dictionary）。<br>
________________________________________<br>
哈希表（Hashtable）<br>
Hashtable类提供了一种在用户定义键结构的基础上来组织数据的手段。<br>
例如，在地址列表的哈希表中，你可以根据邮政编码作为键来存储和排序数据，而不是通过人名。<br>
哈希表键的具体含义完全取决于哈希表的使用情景和它包含的数据。<br>
关于该类的更多信息，请参见哈希表（HashTable）。<br>
________________________________________<br>
属性（Properties）<br>
Properties 继承于 Hashtable.Properties 类表示了一个持久的属性集.属性列表中每个键及其对应值都是一个字符串。<br>
Properties 类被许多Java类使用。例如，在获取环境变量时它就作为System.getProperties()方法的返回值。<br>
关于该类的更多信息，请参见属性（Properties）。<br>
<br>
<br>
#Java集合框架<br>
 <br>
从上面的集合框架图可以看到，Java 集合框架主要包括两种类型的容器，一种是集合（Collection），存储一个元素集合，另一种是图（Map），存储键/值对映射。Collection 接口又有 3 种子类型，List、Set 和 Queue，再下面是一些抽象类，最后是具体实现类，常用的有 ArrayList、LinkedList、HashSet、LinkedHashSet、HashMap、LinkedHashMap 等等。<br>
集合框架是一个用来代表和操纵集合的统一架构。所有的集合框架都包含如下内容：<br>
•	接口：是代表集合的抽象数据类型。例如 Collection、List、Set、Map 等。之所以定义多个接口，是为了以不同的方式操作集合对象<br>
•	实现（类）：是集合接口的具体实现。从本质上讲，它们是可重复使用的数据结构，例如：ArrayList、LinkedList、HashSet、HashMap。<br>
•	算法：是实现集合接口的对象里的方法执行的一些有用的计算，例如：搜索和排序。这些算法被称为多态，那是因为相同的方法可以在相似的接口上有着不同的实现。<br>
除了集合，该框架也定义了几个 Map 接口和类。Map 里存储的是键/值对。尽管 Map 不是集合，但是它们完全整合在集合中。<br>
 <br>
集合接口<br>
1	Collection 接口<br>
Collection 是最基本的集合接口，一个 Collection 代表一组 Object，即 Collection 的元素, Java不提供直接继承自Collection的类，只提供继承于的子接口(如List和set)。<br>
<br>
Collection 接口存储一组不唯一，无序的对象。<br>
<br>
2	List 接口<br>
List接口是一个有序的 Collection，使用此接口能够精确的控制每个元素插入的位置，能够通过索引(元素在List中位置，类似于数组的下标)来访问List中的元素，第一个元素的索引为 0，而且允许有相同的元素。<br>
<br>
List 接口存储一组不唯一，有序（插入顺序）的对象。<br>
<br>
3	Set<br>
Set 具有与 Collection 完全一样的接口，只是行为上不同，Set 不保存重复的元素。<br>
<br>
Set 接口存储一组唯一，无序的对象。<br>
<br>
4	SortedSet<br>
继承于Set保存有序的集合。<br>
5	Map<br>
Map 接口存储一组键值对象，提供key（键）到value（值）的映射。<br>
<br>
6	Map.Entry<br>
描述在一个Map中的一个元素（键/值对）。是一个 Map 的内部接口。<br>
7	SortedMap<br>
继承于 Map，使 Key 保持在升序排列。<br>
8	Enumeration<br>
这是一个传统的接口和定义的方法，通过它可以枚举（一次获得一个）对象集合中的元素。这个传统接口已被迭代器取代。<br>
<br>
set和list的区别<br>
•	1. Set 接口实例存储的是无序的，不重复的数据。List 接口实例存储的是有序的，可以重复的元素。<br>
•	2. Set检索效率低下，删除和插入效率高，插入和删除不会引起元素位置改变 <实现类有HashSet,TreeSet>。<br>
•	3. List和数组类似，可以动态增长，根据实际存储的数据的长度自动增长List的长度。查找元素效率高，插入删除效率低，因为会引起其他元素位置改变 <实现类有ArrayList,LinkedList,Vector> 。<br>
集合实现类（集合类）<br>
标准集合类汇总如下：<br>
1	AbstractCollection <br>
实现了大部分的集合接口。<br>
2	AbstractList <br>
继承于AbstractCollection 并且实现了大部分List接口。<br>
3	AbstractSequentialList <br>
继承于 AbstractList ，提供了对数据元素的链式访问而不是随机访问。<br>
4	LinkedList<br>
该类实现了List接口，允许有null（空）元素。主要用于创建链表数据结构，该类没有同步方法，如果多个线程同时访问一个List，则必须自己实现访问同步，解决方法就是在创建List时候构造一个同步的List。例如：<br>
List list=Collections.synchronizedList(newLinkedList(...));<br>
LinkedList 查找效率低。<br>
5	ArrayList<br>
该类也是实现了List的接口，实现了可变大小的数组，随机访问和遍历元素时，提供更好的性能。该类也是非同步的,在多线程的情况下不要使用。ArrayList 增长当前长度的50%，插入删除效率低。<br>
6	AbstractSet <br>
继承于AbstractCollection 并且实现了大部分Set接口。<br>
7	HashSet<br>
该类实现了Set接口，不允许出现重复元素，不保证集合中元素的顺序，允许包含值为null的元素，但最多只能一个。<br>
8	LinkedHashSet<br>
具有可预知迭代顺序的 Set 接口的哈希表和链接列表实现。<br>
9	TreeSet<br>
该类实现了Set接口，可以实现排序等功能。<br>
10	AbstractMap <br>
实现了大部分的Map接口。<br>
11	HashMap<br>
HashMap 是一个散列表，它存储的内容是键值对(key-value)映射。<br>
该类实现了Map接口，根据键的HashCode值存储数据，具有很快的访问速度，最多允许一条记录的键为null，不支持线程同步。<br>
12	TreeMap<br>
继承了AbstractMap，并且使用一颗树。<br>
13	WeakHashMap<br>
继承AbstractMap类，使用弱密钥的哈希表。<br>
14	LinkedHashMap<br>
继承于HashMap，使用元素的自然顺序对元素进行排序.<br>
15	IdentityHashMap<br>
继承AbstractMap类，比较文档时使用引用相等。<br>
<br>
<br>
在前面的教程中已经讨论通过java.util包中定义的类，如下所示：<br>
1	Vector<br>
该类和ArrayList非常相似，但是该类是同步的，可以用在多线程的情况，该类允许设置默认的增长长度，默认扩容方式为原来的2倍。<br>
2	Stack<br>
栈是Vector的一个子类，它实现了一个标准的后进先出的栈。<br>
3	Dictionary<br>
Dictionary 类是一个抽象类，用来存储键/值对，作用和Map类相似。<br>
4	Hashtable<br>
Hashtable 是 Dictionary(字典) 类的子类，位于 java.util 包中。<br>
5	Properties<br>
Properties 继承于 Hashtable，表示一个持久的属性集，属性列表中每个键及其对应值都是一个字符串。<br>
6	BitSet<br>
一个Bitset类创建一种特殊类型的数组来保存位值。BitSet中数组大小会随需要增加。<br>
集合算法<br>
<br>
如何使用迭代器<br>
<br>
如何使用比较器<br>
<br>
#Java ArrayList<br>
引入ArrayList<br>
import java.util.ArrayList; // 引入 ArrayList 类<br>
<br>
ArrayList<E> objectName =new ArrayList<>();　 // 初始化<br>
•	其中，E: 泛型数据类型，用于设置 objectName 的数据类型，只能为引用数据类型。<br>
•	objectName: 对象名。<br>
添加元素（add()方法）<br>
访问元素（get()方法）<br>
修改元素（set()方法）<br>
删除元素（remove()方法）<br>
计算大小（size()方法）<br>
迭代数组列表（for循环）<br>
其他的引用类型<br>
基本类型对应的包装类表如下：<br>
基本类型	引用类型<br>
boolean	Boolean<br>
byte	Byte<br>
short	Short<br>
int	Integer<br>
long	Long<br>
float	Float<br>
double	Double<br>
char	Character<br>
此外，BigInteger、BigDecimal 用于高精度的运算，BigInteger 支持任意精度的整数，也是引用类型，但它们没有相对应的基本类型。<br>
<br>
ArrayList排序<br>
<br>
##Java ArrayList方法<br>
方法	描述<br>
add()<br>
将元素插入到指定位置的 arraylist 中<br>
addAll()<br>
添加集合中的所有元素到 arraylist 中<br>
clear()<br>
删除 arraylist 中的所有元素<br>
clone()<br>
复制一份 arraylist<br>
contains()<br>
判断元素是否在 arraylist<br>
get()<br>
通过索引值获取 arraylist 中的元素<br>
indexOf()<br>
返回 arraylist 中元素的索引值<br>
removeAll()<br>
删除存在于指定集合中的 arraylist 里的所有元素<br>
remove()<br>
删除 arraylist 里的单个元素<br>
size()<br>
返回 arraylist 里元素数量<br>
isEmpty()<br>
判断 arraylist 是否为空<br>
subList()<br>
截取部分 arraylist 的元素<br>
set()<br>
替换 arraylist 中指定索引的元素<br>
sort()<br>
对 arraylist 元素进行排序<br>
toArray()<br>
将 arraylist 转换为数组<br>
toString()<br>
将 arraylist 转换为字符串<br>
ensureCapacity()<br>
设置指定容量大小的 arraylist<br>
lastIndexOf()<br>
返回指定元素在 arraylist 中最后一次出现的位置<br>
retainAll()<br>
保留 arraylist 中在指定集合中也存在的那些元素<br>
containsAll()<br>
查看 arraylist 是否包含指定集合中的所有元素<br>
trimToSize()<br>
将 arraylist 中的容量调整为数组中的元素个数<br>
removeRange()<br>
删除 arraylist 中指定索引之间存在的元素<br>
replaceAll()<br>
将给定的操作内容替换掉数组中每一个元素<br>
removeIf()<br>
删除所有满足特定条件的 arraylist 元素<br>
forEach()<br>
遍历 arraylist 中每一个元素并执行特定操作<br>
更多 API 方法可以查看：https://www.runoob.com/manual/jdk11api/java.base/java/util/ArrayList.html<br>
#Java LinkedList<br>
链表（Linked list）是一种常见的基础数据结构，是一种线性表，但是并不会按线性的顺序存储数据，而是在每一个节点里存到下一个节点的地址。<br>
链表可分为单向链表和双向链表。<br>
一个单向链表包含两个值: 当前节点的值和一个指向下一个节点的链接。<br>
 <br>
一个双向链表有三个整数值: 数值、向后的节点链接、向前的节点链接。<br>
 <br>
Java LinkedList（链表） 类似于 ArrayList，是一种常用的数据容器。<br>
与 ArrayList 相比，LinkedList 的增加和删除对操作效率更高，而查找和修改的操作效率较低。<br>
以下情况使用 ArrayList :<br>
•	频繁访问列表中的某一个元素。<br>
•	只需要在列表末尾进行添加和删除元素操作。<br>
以下情况使用 LinkedList :<br>
•	你需要通过循环迭代来访问列表中的某些元素。<br>
•	需要频繁的在列表开头、中间、末尾等位置进行添加和删除元素操作。<br>
LinkedList 继承了 AbstractSequentialList 类。<br>
LinkedList 实现了 Queue 接口，可作为队列使用。<br>
LinkedList 实现了 List 接口，可进行列表的相关操作。<br>
LinkedList 实现了 Deque 接口，可作为队列使用。<br>
LinkedList 实现了 Cloneable 接口，可实现克隆。<br>
LinkedList 实现了 java.io.Serializable 接口，即可支持序列化，能通过序列化去传输。<br>
<br>
迭代元素（for循环配合size()方法来迭代列表中的元素）<br>
常用方法<br>
方法	描述<br>
public boolean add(E e)	链表末尾添加元素，返回是否成功，成功为 true，失败为 false。<br>
public void add(int index, E element)	向指定位置插入元素。<br>
public boolean addAll(Collection c)	将一个集合的所有元素添加到链表后面，返回是否成功，<br>
成功为 true，失败为 false。<br>
public boolean addAll(int index, Collection c)	将一个集合的所有元素添加到链表的指定位置后面，<br>
返回是否成功，成功为 true，失败为 false。<br>
public void addFirst(E e)	元素添加到头部。<br>
public void addLast(E e)	元素添加到尾部。<br>
public boolean offer(E e)	向链表末尾添加元素，返回是否成功，<br>
成功为 true，失败为 false。<br>
public boolean offerFirst(E e)	头部插入元素，返回是否成功，<br>
成功为 true，失败为 false。<br>
public boolean offerLast(E e)	尾部插入元素，返回是否成功，<br>
成功为 true，失败为 false。<br>
public void clear()	清空链表。<br>
public E removeFirst()	删除并返回第一个元素。<br>
public E removeLast()	删除并返回最后一个元素。<br>
public boolean remove(Object o)	删除某一元素，返回是否成功，<br>
成功为 true，失败为 false。<br>
public E remove(int index)	删除指定位置的元素。<br>
public E poll()	删除并返回第一个元素。<br>
public E remove()	删除并返回第一个元素。<br>
public boolean contains(Object o)	判断是否含有某一元素。<br>
public E get(int index)	返回指定位置的元素。<br>
public E getFirst()	返回第一个元素。<br>
public E getLast()	返回最后一个元素。<br>
public int indexOf(Object o)	查找指定元素从前往后第一次出现的索引。<br>
public int lastIndexOf(Object o)	查找指定元素最后一次出现的索引。<br>
public E peek()	返回第一个元素。<br>
public E element()	返回第一个元素。<br>
public E peekFirst()	返回头部元素。<br>
public E peekLast()	返回尾部元素。<br>
public E set(int index, E element)	设置指定位置的元素。<br>
public Object clone()	克隆该列表。<br>
public Iterator descendingIterator()	返回倒序迭代器。<br>
public int size()	返回链表元素个数。<br>
public ListIterator listIterator(int index)	返回从指定位置开始到末尾的迭代器。<br>
public Object[] toArray()	返回一个由链表元素组成的数组。<br>
public T[] toArray(T[] a)	返回一个由链表元素转换类型而成的数组。<br>
更多 API 方法可以查看：https://www.runoob.com/manual/jdk11api/java.base/java/util/LinkedList.html<br>
#Java HashSet<br>
允许有null值，无序的，但不允许有重复元素。<br>
不是线程安全的<br>
实现了Set接口<br>
 <br>
HashSet 中的元素实际上是对象，一些常见的基本类型可以使用它的包装类。<br>
HashSet类的引入<br>
添加元素（add()方法）<br>
判断元素是否存在（contains()方法）<br>
删除元素（remove()方法）<br>
计算大小（size()方法）<br>
迭代HashSet（for each）<br>
<br>
#Java HashMap<br>
散列表，存储的内容是键值对(key-value)映射<br>
无序的<br>
实现了Map接口，不支持线程同步<br>
HashMap 继承于AbstractMap，实现了 Map、Cloneable、java.io.Serializable 接口。<br>
 <br>
HashMap 的 key 与 value 类型可以相同也可以不同，可以是字符串（String）类型的 key 和 value，也可以是整型（Integer）的 key 和字符串（String）类型的 value。<br>
引用同HashSet<br>
添加元素（put()方法）<br>
访问元素（get(key)方法）<br>
删除元素（remove(key)方法）<br>
计算大小（size()方法）<br>
迭代HashMap（for each）<br>
只想获取key，可以使用 keySet() 方法，然后可以通过 get(key) 获取对应的 value，如果你只想获取 value，可以使用 values() 方法<br>
<br>
HashMap的方法<br>
方法	描述<br>
clear()<br>
删除 hashMap 中的所有键/值对<br>
clone()<br>
复制一份 hashMap<br>
isEmpty()<br>
判断 hashMap 是否为空<br>
size()<br>
计算 hashMap 中键/值对的数量<br>
put()<br>
将键/值对添加到 hashMap 中<br>
putAll()<br>
将所有键/值对添加到 hashMap 中<br>
putIfAbsent()<br>
如果 hashMap 中不存在指定的键，则将指定的键/值对插入到 hashMap 中。<br>
remove()<br>
删除 hashMap 中指定键 key 的映射关系<br>
containsKey()<br>
检查 hashMap 中是否存在指定的 key 对应的映射关系。<br>
containsValue()<br>
检查 hashMap 中是否存在指定的 value 对应的映射关系。<br>
replace()<br>
替换 hashMap 中是指定的 key 对应的 value。<br>
replaceAll()<br>
将 hashMap 中的所有映射关系替换成给定的函数所执行的结果。<br>
get()<br>
获取指定 key 对应对 value<br>
getOrDefault()<br>
获取指定 key 对应对 value，如果找不到 key ，则返回设置的默认值<br>
forEach()<br>
对 hashMap 中的每个映射执行指定的操作。<br>
entrySet()<br>
返回 hashMap 中所有映射项的集合集合视图。<br>
keySet()<br>
返回 hashMap 中所有 key 组成的集合视图。<br>
values()<br>
返回 hashMap 中存在的所有 value 值。<br>
merge()<br>
添加键值对到 hashMap 中<br>
compute()<br>
对 hashMap 中指定 key 的值进行重新计算<br>
computeIfAbsent()<br>
对 hashMap 中指定 key 的值进行重新计算，如果不存在这个 key，则添加到 hasMap 中<br>
computeIfPresent()<br>
对 hashMap 中指定 key 的值进行重新计算，前提是该 key 存在于 hashMap 中。<br>
更多 API 方法可以查看：https://www.runoob.com/manual/jdk11api/java.base/java/util/HashMap.html<br>
<br>
#Java Iterator（迭代器）<br>
引用Iterator类，import java.util.Iterator;<br>
一种访问集合的方法<br>
获取迭代器（iterator()方法）<br>
循环集合元素<br>
删除元素（remove()方法）<br>
迭代器 it 的两个基本操作是 next 、hasNext 和 remove。<br>
调用 it.next() 会返回迭代器的下一个元素，并且更新迭代器的状态。<br>
调用 it.hasNext() 用于检测集合中是否还有元素。<br>
调用 it.remove() 将迭代器返回的元素删除。<br>
#Java Object类<br>
所有类的父类<br>
类的构造函数（Object() 构造一个新对象）<br>
类的方法<br>
1	protected Object clone()<br>
创建并返回一个对象的拷贝<br>
2	boolean equals(Object obj)<br>
比较两个对象是否相等<br>
3	protected void finalize()<br>
当 GC (垃圾回收器)确定不存在对该对象的有更多引用时，由对象的垃圾回收器调用此方法。<br>
4	Class<?> getClass()<br>
获取对象的运行时对象的类<br>
5	int hashCode()<br>
获取对象的 hash 值<br>
6	void notify()<br>
唤醒在该对象上等待的某个线程<br>
7	void notifyAll()<br>
唤醒在该对象上等待的所有线程<br>
8	String toString()<br>
返回对象的字符串表示形式<br>
9	void wait()<br>
让当前线程进入等待状态。直到其他线程调用此对象的 notify() 方法或 notifyAll() 方法。<br>
10	void wait(long timeout)<br>
让当前线程处于等待(阻塞)状态，直到其他线程调用此对象的 notify() 方法或 notifyAll() 方法，或者超过参数设置的timeout超时时间。<br>
11	void wait(long timeout, int nanos)<br>
与 wait(long timeout) 方法类似，多了一个 nanos 参数，这个参数表示额外时间（以纳秒为单位，范围是 0-999999）。 所以超时的时间还需要加上 nanos 纳秒。。<br>
<br>
MVC三层架构<br>
界面层（View）/控制层（controller）>>>业务逻辑层/服务层（service）>>>数据层（DAO）>>数据库（三层架构）<br>
MVC即 Model 模型、View 视图，及 Controller 控制器。<br>
MVC是 Model-View-Controller，严格说这三个加起来以后才是三层架构中的View层，也就是说，MVC把三层架构中的View层再度进行了分化<br>
 <br>
<br>