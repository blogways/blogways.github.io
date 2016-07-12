---
layout: post
category: Apache
title: Apache Commons 系列简介 之 Pool
tags: ['Apache Commons', 'Pool']
author: 唐 治
email: tangzhi@asiainfo-linkage.com
description: 介绍Apache Commons 系列中的 Pool 库

---


### 一、概述

`Apache Commons Pool`库提供了一整套用于实现对象池化的API，以及若干种各具特色的对象池实现。2.0版本，并非是对1.x的简单升级，而是一个完全重写的对象池的实现，显著的提升了性能和可伸缩性，并且包含可靠的实例跟踪和池监控。第二版要求JDK1.6+。


### 二、下载

官方下载页:

    http://commons.apache.org/proper/commons-pool/download_pool.cgi
    
源码：

    svn checkout http://svn.apache.org/repos/asf/commons/proper/pool/trunk commons-pool2
    
Maven工程依赖

    <dependency>
	    <groupId>org.apache.commons</groupId>
	    <artifactId>commons-pool2</artifactId>
	    <version>2.0</version>
	</dependency>
	
### 三、使用说明

#### 3.1 创建池化对象

创建池化对象很简单，只要实现`commons-pool`的`PooledObjectFactory`工厂接口就行了。

`PooledObjectFactory`是一个池化对象工厂接口，定义了生成对象、激活对象、钝化对象、销毁对象的方法，如下：

```
public interface PooledObjectFactory<T> {
    PooledObject<T> makeObject();
    void activateObject(PooledObject<T> obj);
    void passivateObject(PooledObject<T> obj);
    boolean validateObject(PooledObject<T> obj);
    void destroyObject(PooledObject<T> obj);
}
```
它创建并管理`PooledObject`。`PooledObject`包含了池化的对象实例，以及这些实例的池化属性，比如创建时间、最后使用时间等等。

如果需要使用`Commons-Pool`，那么你就需要提供一个`PooledObjectFactory`接口的具体实现。一个比较简单的办法就是，继承`BasePooledObjectFactory`这个抽象类。而继承这个抽象类，只需要实现两个方法:`create()`和`wrap(T obj)`。

实现`create()`方法很简单，而实现`wrap(T obj)`也有捷径，可以使用类`DefaultPooledObject `，代码可以参考如下：

```
@Override
public PooledObject<Foo> wrap(Foo foo) {
    return new DefaultPooledObject<Foo>(foo);
}
```

比如，一个完整的例子：

```
package test.test;

import org.apache.commons.pool2.BasePooledObjectFactory;
import org.apache.commons.pool2.PooledObject;
import org.apache.commons.pool2.impl.DefaultPooledObject;

public class StringBufferFactory extends BasePooledObjectFactory<StringBuffer> {

	@Override
	public StringBuffer create() throws Exception {
		return new StringBuffer();
	}

	@Override
	public PooledObject<StringBuffer> wrap(StringBuffer obj) {
		return new DefaultPooledObject<StringBuffer>(obj);
	}

}
```

有时候，单用对池内所有对象一视同仁的对象池，并不能解决问题。例如，有时需要通过key来获取不同的对象，这样，就有可能取出不合用的对象的麻烦。当然，可以通过为每一组参数相同的同类对象建立一个单独的对象池来解决这个问题。但是，如果使用普通的`ObjectPool`来实施这个计策的话，因为普通的`PooledObjectFactory`只能生产出大批设置完全一致的对象，就需要为每一组参数相同的对象编写一个单独的`PooledObjectFactory`，工作量相当可观。这种时候就可以使用`BaseKeyedPooledObjectFactory`来替代`BasePooledObjectFactory`.这个类，实现的是`KeyedPooledObjectFactory`接口，和`PooledObjectFactory`接口类似，只是在相关的方法中多了`Key`参数,定义如下：

```
public interface KeyedPoolableObjectFactory<K,V> {
    PooledObject<V> makeObject(K key);
    void activateObject(K key, PooledObject<V> obj);
    void passivateObject(K key, PooledObject<V> obj);
    boolean validateObject(K key, PooledObject<V> obj);
    void destroyObject(K key, PooledObject<V> obj);
}
```


#### 3.2 创建对象池

在`org.apache.commons.pool2.impl`中预设了三个可以直接使用的对象池：`GenericObjectPool`、`GenericKeyedObjectPool`和`SoftReferenceObjectPool`。

通常使用`GenericObjectPool`来创建对象池，如果是对象池是`Keyed`的，那么可以使用`GenericKeyedObjectPool`来创建对象池。这两个类都提供了丰富的配置选项。这两个对象池的特点是可以设置对象池中的对象特征，包括LIFO方式、最大空闲数、最小空闲数、是否有效性检查等等。两者的区别如前面所述，后者支持`Keyed`。

而`SoftReferenceObjectPool`对象池，它利用一个`java.util.ArrayList`对象来保存对象池里的对象。不过它并不在对象池里直接保存对象本身，而是保存它们的“软引用”（`Soft Reference`）。这种对象池的特色是：可以保存任意多个对象，不会有容量已满的情况发生;在对象池已空的时候，调用它的`borrowObject`方法，会自动返回新创建的实例;可以在初始化同时，在池内预先创建一定量的对象;当内存不足的时候，池中的对象可以被Java虚拟机回收。

举个例子:

```
new GenericObjectPool<StringBuffer>(new StringBufferFactory());
```

我们也可以使用`GenericObjectPoolConfig`来对上面创建的对象池进行一些参数配置，创建的Config参数，可以使用`setConfig`方法传给对象池，也可以在对象池的构造方法中作为参数传入。

举个例子：

```
GenericObjectPoolConfig conf = new GenericObjectPoolConfig();
conf.setMaxTotal(20);
conf.setMaxIdle(10);
...
GenericObjectPool<StringBuffer> pool = new GenericObjectPool<StringBuffer>(new StringBufferFactory(), conf);

```

#### 3.3 使用对象池

对象池使用起来很方便，简单一点就是使用`borrowObject`和`returnObject`两个方法，直接给参考代码吧：


```
StringBuffer buf = null;
try { 
    buf = pool.borrowObject();
    ...         
} catch(IOException e) { 
    throw e; 
} catch(Exception e) {
    throw new RuntimeException("Unable to borrow buffer from pool" + 
          e.toString());
} finally { 
    try {
        if(null != buf) {
            pool.returnObject(buf);
        }
    } catch(Exception e) {
        // ignored
    }
} 
```
