---
layout: post
category: Node.js
title: meteor入门学习笔记二：一个基础的例子
tags: ['meteor','javascript', '入门', '学习笔记']
author: 唐 治
description: Meteor是一个Javascript应用框架。可以轻松构建高品质的实时Web应用程序或移动端App。
---
{% raw %}
这几天在学习Meteor，当前版本为:`1.2.1`。学习的主要资料来自官网，笔记如下.

## 一、创建一个应用

在这里，我们将要创建一个简单的应用，管理一个任务清单。这样就可以和其他人一起使用这个任务清单，进行合作了。

为了创建这个应用，需要打开终端，输入命令：

```sh
meteor create simple-todos
```

这个命令会创建一个名为`simple-todos`的目录，目录里面有Meteor应用所需要的一些文件，列表如下：

```
simple-todos.js     #一个被服务器和客户端都使用的javascript文件
simple-todos.html   #一个html文件，里面定义了页面视图模版
simple-todos.css    #一个css文件，定义了应用的式样
.meteor             #一个隐藏目录，里面有meteor运行需要的文件
```

运行这个应用，可以输入命令：

```sh
cd simple-todos
meteor
```

好了，打开你的浏览器，然后输入`http://localhost:3000`。

如果你修改了simple-todos.html，你会发现几秒后，浏览器上打开的页面内容也会自动发生相应的变化。这就是Meteor所谓的“代码热部署”。

## 二、使用模版来定义页面视图

好了，我们继续制作我们的任务清单程序。

### 2.1 修改代码
我们用下面的代码替代之前Meteor默认生成的代码。

`simple-todos.html`的代码修改如下：

```html
<head>
  <title>Todo List</title>
</head>
 
<body>
  <div class="container">
    <header>
      <h1>Todo List</h1>
    </header>
 
    <ul>  
      {{#each tasks}}
        {{> task}}
      {{/each}}
    </ul>
  </div>
</body>
 
<template name="task">
  <li>{{text}}</li>
</template>
```

`simple-todos.js`的代码修改如下：

```javascript
if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    tasks: [
      { text: "This is task 1" },
      { text: "This is task 2" },
      { text: "This is task 3" }
    ]
  });
}
```

替换完上面的代码，静待几秒，浏览器中展现的内容就会发生变化，类似如下：

>
> # Todo List
> 
> * This is task 1
> * This is task 2
> * This is task 3
>

挺有意思的，不是吗？好吧，让我们看看它们是怎么工作的。

### 2.2 Meteor使用HTML文件来定义模版

Meteor解析你的应用目录下的所有HTML文件。识别出三个顶级标签:`<head>`、`<body>`和`<template>`。

其中,`<head>`标签和`<body>`标签里的内容都会被发送到客户端页面中，对应的标签下面去。

而`<template>`标签里面的内容，会被编译成Meteor模版。Meteor模版或者被HTML中的`{{>templateName}}`引用，或者被JavaScript程序中的`Template.templateName`所引用。

### 2.3 给模版添加逻辑和数据

Meteor使用Spacebars来编译HTML文件中的代码。Spacebars用双括号将语句括起来，比如：`{{#each}}`和`{{#if}}`。使用这种方式给模版添加逻辑和数据。

我们可以借用`helpers`从JavsScript代码中把数据传给模版。在上面的代码中，我们在`Template.body`上定义了一个名为`tasks`的帮助器(helper)。它返回的是一个数组。在HTML的body标签内，我们可以使用`{{#each}}`来遍历整个数组，插入一个`task`模版来显示数组中的每个值。在`#each`语句块内，我们可以使用`{{text}}`来显示数组中每项的`text`属性值。

关于模版的更多内容：https://github.com/meteor/meteor/blob/devel/packages/spacebars/README.md

### 2.4 添加CSS

这个应用不添加额外的css式样，也可以正常运行，但是为了更加美观，我们给这个应用添加一些CSS式样。

`simple-todos.css`文件内容修改如下：

```css
/* CSS declarations go here */
body {
  font-family: sans-serif;
  background-color: #315481;
  background-image: linear-gradient(to bottom, #315481, #918e82 100%);
  background-attachment: fixed;

  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  padding: 0;
  margin: 0;

  font-size: 14px;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  min-height: 100%;
  background: white;
}

header {
  background: #d2edf4;
  background-image: linear-gradient(to bottom, #d0edf5, #e1e5f0 100%);
  padding: 20px 15px 15px 15px;
  position: relative;
}

#login-buttons {
  display: block;
}

h1 {
  font-size: 1.5em;
  margin: 0;
  margin-bottom: 10px;
  display: inline-block;
  margin-right: 1em;
}

form {
  margin-top: 10px;
  margin-bottom: -10px;
  position: relative;
}

.new-task input {
  box-sizing: border-box;
  padding: 10px 0;
  background: transparent;
  border: none;
  width: 100%;
  padding-right: 80px;
  font-size: 1em;
}

.new-task input:focus{
  outline: 0;
}

ul {
  margin: 0;
  padding: 0;
  background: white;
}

.delete {
  float: right;
  font-weight: bold;
  background: none;
  font-size: 1em;
  border: none;
  position: relative;
}

li {
  position: relative;
  list-style: none;
  padding: 15px;
  border-bottom: #eee solid 1px;
}

li .text {
  margin-left: 10px;
}

li.checked {
  color: #888;
}

li.checked .text {
  text-decoration: line-through;
}

li.private {
  background: #eee;
  border-color: #ddd;
}

header .hide-completed {
  float: right;
}

.toggle-private {
  margin-left: 5px;
}

@media (max-width: 600px) {
  li {
    padding: 12px 15px;
  }

  .search {
    width: 150px;
    clear: both;
  }

  .new-task input {
    padding-bottom: 5px;
  }
}
```

## 三、使用集合来存储数据

集合是Meteor用来存储持久化数据的方法。其特殊之处在于，它既可被服务端访问，也可被客户端访问。这样就很容易做到，无需编写大量服务端代码就可以实现页面逻辑。他们也可以自动更新，所以由集合支持的页面视图组件可以自动显示最新数据。

在你的JavaScript代码里，通过调用`MyCollection = new Mongo.Collection("my-collection");`，可以很容易地创建一个新的集合。在服务器端，这行代码会设置一个名为`my-collection`的MongoDB集合；在客户端，这行代码会创建一个缓存，这个缓存和服务器端集合存在连接。后面，我们会了解的更多详情，现在就让我们假设整个数据库都存在于客户端。

下面我们修改JavaScript代码，从数据库集合中获取任务：

```javascript
Tasks = new Mongo.Collection("tasks");
 
if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    tasks: function () {
      return Tasks.find({});
    }
  });
}
```

使用上面代码后，静待几秒钟，等待Meteor“热部署”完成。我们会发现任务列表中的记录消失了，这是因为数据库集合是空的。我们需要向数据库集合中插入一些任务数据。


### 从服务器端数据库控制台插入任务数据

数据库集合里的数据被称为文档。下面，我们在服务器端使用数据库的控制台插入一些文档到任务集合中去。

打开一个新的终端页，进入应用所在目录，然后输入命令:

```sh
meteor mongo
```
当前控制台会连上应用的本地开发数据库，在数据库的交互模式下，输入命令：

```javascript
db.tasks.insert({ text: "Hello world!", createdAt: new Date() });
```

再看看浏览器，你将发现应用界面立刻显示出了新任务记录。你会发现我们在客户端和服务端之间并没有写什么连接代码，但是数据恰恰自动更新了。

在数据库控制台上，用相同的方法，再插入一些不同内容的任务记录。

下面，我们看看怎么给应用页面增加功能，不通过后端数据库控制台，直接通过前端页面增加任务记录。

## 四、通过页面添加任务

在这一环节，我们要提供一个输入框给用户，以便向任务清单中添加任务记录。

首先，我们在HTML里添加一个form。完整的simple-todos.html如下：

```html
<head>
  <title>Todo List</title>
</head>
 
<body>
  <div class="container">
    <header>
      <h1>Todo List</h1>

      <form class="new-task">
        <input type="text" name="text" placeholder="Type to add new tasks" />
      </form>
    </header>
 
    <ul>
      {{#each tasks}}
        {{> task}}
      {{/each}}
    </ul>
  </div>
</body>
 
<template name="task">
  <li>{{text}}</li>
</template>
```

在Javascript代码中，我们需要增加对页面form的`submit`事件的监听方法。完整的simple-todos.js文件如下：

```javascript
Tasks = new Mongo.Collection("tasks");
 
if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    tasks: function () {
      return Tasks.find({});
    }
  });

  Template.body.events({
    "submit .new-task": function (event) {
      // Prevent default browser form submit
      event.preventDefault();
 
      // Get value from form element
      var text = event.target.text.value;
 
      // Insert a task into the collection
      Tasks.insert({
        text: text,
        createdAt: new Date() // current time
      });
 
      // Clear form
      event.target.text.value = "";
    }
  });
}
```

现在应用有了一个新的输入框。要添加任务记录，只需要在输入框输入内容，然后点击回车就好了。如果你另外打开一个浏览器窗口，并新窗口中打开应用，你会发现多个客户端上的任务记录是自动同步的！

###给模版绑定事件

给模版添加事件的方式如同helpers方法的使用：调用`Template.templateName.events(...)`，传入一个key-value字典类型参数。其中key描述监听的事件，其中value是事件句柄方法。

在上面的例子中，我们监听CSS选择器`.new-task`匹配的任意元素的`submit`事件。当用户在输入框内按下回车键时，将会触发这个事件，我们设置的事件方法就会被调用。

被调用的事件方法有一个输入参数`event`，这个参数包含了被触发的事件的一些信息。在这里，`event.target`是我们这个页面上的form元素，我们可以通过`event.target.text.value`来获取输入框中的输入值。你可以在浏览器的控制台，通过`console.log(event)`来查看`event`的各个属性。

最好，在这个事件方法的最后一行，我们清除了输入框中的内容，准备下一次输入。

###向集合中插入数据

在这个事件方法中，我们通过调用`Tasks.insert()`来向`tasks`集合中添加一条任务记录。我们不需要事先定义集合的结构，就可以向集合中的记录添加各种属性字段，比如：被创建的时间。




###排序查询结果

现在，所有新的任务记录都显示在页面的底部。这种体验不是太好，我们更希望先看到最新的任务。

我们可以利用`createdAt`字段来排序查询结果。所需做的，仅是给`find`方法添加一个排序选项。

```javascript
  // This code only runs on the client
  Template.body.helpers({
    tasks: function () {
      // Show newest tasks at the top
      return Tasks.find({}, {sort: {createdAt: -1}});
    }
  });
```

## 五、已处理与删除任务

前面，我们学习了怎么向集合中插入数据，下面学习如何更新及删除数据。

我们先给`task`模版增加两个页面元素：一个复选框和一个删除按钮。

替换simple-todos.html文件中的`task`模版，内容如下:

```html
<template name="task">
  <li class="{{#if checked}}checked{{/if}}">
    <button class="delete">&times;</button>
 
    <input type="checkbox" checked="{{checked}}" class="toggle-checked" />
 
    <span class="text">{{text}}</span>
  </li>
</template>
```

仅添加UI元素，页面发生了变化，但是新元素不能使用。我们需要添加相应的事件。

修改simple-todos.js文件，增加相关事件：

```javascript
Template.task.events({
    "click .toggle-checked": function () {
      // Set the checked property to the opposite of its current value
      Tasks.update(this._id, {
        $set: {checked: ! this.checked}
      });
    },
    "click .delete": function () {
      Tasks.remove(this._id);
    }
});
```

好了，静待Meteor“热部署”后，点击页面上的复选框或者删除按钮。看看效果吧！

### 在事件方法中获取数据

在事件方法中，`this`指向当前这个任务对象。在数据库集合中，每个插入的文档都有一个唯一值`_id`字段，可以使用这个字段找到每个文档。我们可以使用`this.id`来获取当前任务记录的`_id`字段。一旦有了`_id`，那么我们就可以使用`update`或者`remove`方法来修改对应的任务记录了。

### 更新

集合的`update`方法有两个参数。第一个参数，是选择器，可以筛选出集合的子集；第二个参数是个更新参数，列出匹配的结果都做如何修改。

在上面这个例子中，选择器就是任务的`_id`字段值；更新参数使用`$set`去切换`checked`字段的值，来代表当前任务记录是否处理完成。

### 删除

集合的`remove`方法只有一个参数——选择器，它决定了集合中的哪项记录被删除。

###使用对象的属性(或者使用helpers)去添加/删除页面式样

你如果标记某些任务已经完成，你会发现被标记处理完成的任务都有一条删除线。这个效果由下面代码实现：

```html
<li class="{{#if checked}}checked{{/if}}">
```

如果任务的`checked`属性为`true`，那么`checked`式样类，就要加到这个`li`元素上。使用这个类，我们可以让完成处理的任务项很容易识别出来。

## 六、发布应用

现在，我们已经有了一个可以工作的任务清单应用了。我们可以把他分享给朋友们。Meteor很容易地支持把应用发布到网络上，让网络上的其他人使用。

进入你的应用所在目录，输入：

```sh
meteor deploy my_app_name.meteor.com
```

一旦你回答完所有交互问题，并上传成功。你就可以通过访问`http://my_app_name.meteor.com`，来在互联网上使用你的应用了。

## 七、在Android或iOS上运行你的应用

> 目前，Meteor不支持在Windows上创建移动端应用。如果，你是在Windows上使用Meteor，请跳过本节。
> 

此处省去若干内容，有待日后另起篇章记录。


## 八、使用Session变量去存储临时的UI状态

在这里，我们要给应用增加一个客户端筛选功能，以便用户可以点击一个复选框去查看待处理的任务。我们学着在客户端使用`Session`变量去存储临时变化的状态。

首先，我们需要在页面模版中增加一个复选框，simple-todos.html页面中`body`模版的代码如下：

```html
<body>
  <div class="container">
    <header>
      <h1>Todo List</h1>

      <label class="hide-completed">
        <input type="checkbox" checked="{{hideCompleted}}" />
        Hide Completed Tasks
      </label>

      <form class="new-task">
        <input type="text" name="text" placeholder="Type to add new tasks" />
      </form>
    </header>
 
    <ul>
      {{#each tasks}}
        {{> task}}
      {{/each}}
    </ul>
  </div>
</body>
```

接着，我们需要添加一个事件处理方法，在复选框的状态发生变化时，去更新`Session`变量。`Session`是一个非常好的可以存放临时UI状态的地方。如同集合一样，可以在helpers方法中被调用。

修改simple-todos.js文件中的`Template.body.events(...)`，修改后内容如下：

```javascript
Template.body.events({
    "submit .new-task": function (event) {
      // Prevent default browser form submit
      event.preventDefault();
 
      // Get value from form element
      var text = event.target.text.value;
 
      // Insert a task into the collection
      Tasks.insert({
        text: text,
        createdAt: new Date() // current time
      });
 
      // Clear form
      event.target.text.value = "";
    },

    "change .hide-completed input": function (event) {
      Session.set("hideCompleted", event.target.checked);
    }
});
```

现在，我们需要修改`Template.body.helpers`。下面这段代码增加了一个新的`if`语句块，去实现当复选框被选中时对任务清单的过滤；增加了一个新的方法，去获取Session变量中记录的复选框状态。

修改simple-todos.js文件中的`Template.body.helpers(...)`，修改为：

```javascript
Template.body.helpers({
    tasks: function () {
      if (Session.get("hideCompleted")) {
        // If hide completed is checked, filter tasks
        return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
      } else {
        // Otherwise, return all of the tasks
        return Tasks.find({}, {sort: {createdAt: -1}});
      }
    },
    hideCompleted: function () {
      return Session.get("hideCompleted");
    }
});
```

现在如果你选中复选框，那么任务清单中只显示没有完成的任务了！

### Session是客户端的一个响应式数据存储

截止目前，我们已经把所有数据都存储到集合中去了，当数据库集合中的数据发生变化，前端页面也会自动更新。这是因为Mongo的集合是Meteor公认的响应式数据源，这意味着，一旦其中的数据发生变化，Meteor就知道了。Session也同样如此，但它不和服务器端通讯，这点与集合不同。因此，Session非常适合存放UI的一些临时状态，比如上例中的复选框。如同集合，当Session变量发生变化后，我们无需编写太多的编码。仅需要在帮助器（helper)方法里调用`Session.get(...)`就足够了。

### 更多：显示待处理任务总数

现在我们写了一个查询，可以筛选待处理的任务，我们也可以使用同样的查询，去显示待处理任务的总数。在JavaScript文件中增加一个方法，修改HTML一行代码就可以实现了。

在simple-todos.js中修改`Template.body.helpers(...)`，增加一个`incompleteCount`方法，修改后的如下：

```javascript
Template.body.helpers({
    tasks: function () {
      if (Session.get("hideCompleted")) {
        // If hide completed is checked, filter tasks
        return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
      } else {
        // Otherwise, return all of the tasks
        return Tasks.find({}, {sort: {createdAt: -1}});
      }
    },
    hideCompleted: function () {
      return Session.get("hideCompleted");
    },
    incompleteCount: function () {
      return Tasks.find({checked: {$ne: true}}).count();
    }
});
```

修改simple-todos.html文件，显示待处理记录总数:

```html
<h1>Todo List ({{incompleteCount}})</h1>
```

## 九、添加账号管理功能

Meteor自带一个账号系统，以及下拉式登录页面。可以让你的应用在几分钟内添加多用户功能。

为了可以使用账号系统以及相关的UI，我们需要添加相关的包。在你的应用所在目录，执行下面命令：

```sh
meteor add accounts-ui accounts-password
```

上述命令运行完后，原先的meteor服务会自动更新部署。我们继续下面操作。

在HTML文件中，复选框的正下方，添加一个用户登录代码，代码片段如下：

```html
<header>
      <h1>Todo List ({{incompleteCount}})</h1>

      <label class="hide-completed">
        <input type="checkbox" checked="{{hideCompleted}}" />
        Hide Completed Tasks
      </label>

      {{> loginButtons}}

      <form class="new-task">
        <input type="text" name="text" placeholder="Type to add new tasks" />
      </form>
</header>
```

默认的登录界面是使用邮箱及密码登录，我们修改JavaScript文件，增加下面的代码来配置登录界面，使用用户名代替邮箱登录。

```javascript
Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});
```

现在，使用者可以创建账号登录你的应用了！只是登录登出并没有什么效果。让我们增加两个功能：

1. 只对登陆用户显示新任务输入框；
2. 显示我们创建的每个任务

为此，我们需要在`task`集合中增加两个新的字段：

1. `owner` - 创建此任务的账号的`_id`；
2. `username` - 创建此任务的账号的`username`。我们直接把`username`保存在任务对象中，以便在显示任务时，无需每次都去关联账号信息查询用户名。

首先，我们在`submit .new-task`事件处理方法中，增加一些代码去保存新增的字段，修改的代码片段如下：

```javascript
Tasks.insert({
  text: text,
  createdAt: new Date(),            // current time
  owner: Meteor.userId(),           // _id of logged in user
  username: Meteor.user().username  // username of logged in user
});
```

接着，修改HTML文件，增加一个`#if`判断语句，仅当账号登录后才显示任务添加框。simple-todos.html中相关代码片段如下：

```html
{{#if currentUser}}
  <form class="new-task">
    <input type="text" name="text" placeholder="Type to add new tasks" />
  </form>
{{/if}}
```

最后，在每个任务信息的左边增加一个Spacebars语句去显示用户名(`username`)字段。

```html
<span class="text"><strong>{{username}}</strong> - {{text}}</span>
```

好了，大功告成了！

### 自动账号UI

如果应用添加了`accounts-ui`包，想增加一个下拉式登录窗口，只需使用`{{> loginButtons}}`语句来调用`loginButtons`模版。这个模版会自动判断支持哪些登录方式及显示相关的控制。在这个例子中，我们仅开启了账号密码(`accounts-password`)登录方式，所以下拉窗口中只有密码字段。如果你想做更多的尝试，你可以添加`accounts-facebook`包，来给你的应用开启Facebook账号登录功能，这样，Facebook的案例就会自动出现在下拉界面中了。

想尝试就执行下面的命令:

```sh
meteor add accounts-facebook
```

### 关于登录用户的更多信息

在HTML中，我们可以使用内置的帮助器(helper)`{{currentUser}}`去检查账号是否登录，及获取账号相关信息。比如：`{{currentUser.username}}`可以显示登录账号的用户名。

在JavaScript代码中，可以使用`Meteor.userId()`获取当前账号的`_id`，使用`Meteor.user()`获取整个账号信息。

## 十、使用`methods`方法实现安全控制

在这之前，应用的每个账号都能编辑数据库中的信息。这对一个内部小应用或者实例而言，可能没有什么问题。但任何一个实时应用都需要对它的数据进行权限控制。在Meteor中，最好的办法就是定义`methods`方法，代替客户端直接调用`insert`、`update`和`remove`方法。它将检查账号是否有权限进行当前操作，有权限则以客户端名义修改数据库中数据。

### 移除`insecure`包

每个新创建的Meteor工程都会默认添加`insecure`包。这个包容许用户从客户端修改数据库数据。

使用下面命令可以删除这个包：

```sh
meteor remove insecure
```

移除这个包后，再使用应用，你将发现输入框和按钮不再正常工作了。这是因为客户端所有数据库权限都被终止了。我们需要使用`methods`重写应用的部分功能。

### 定义methods

首先，我们需要定义一些方法.我们需要为在客户端执行的每个数据库操作定义一个方法。这些方法被定义在即被服务端执行，也被客户端执行的代码中。

修改simple-todos.js，增加以下代码片段：

```javascript
Meteor.methods({
  addTask: function (text) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
 
    Tasks.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  deleteTask: function (taskId) {
    Tasks.remove(taskId);
  },
  setChecked: function (taskId, setChecked) {
    Tasks.update(taskId, { $set: { checked: setChecked} });
  }
});
```

好了，方法都定义好了。我们把之前对集合操作的代码都用这些方法替换。

修改后的完整的simple-todos.js文件内容如下:

```javascript
Tasks = new Mongo.Collection("tasks");
 
if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    tasks: function () {
      if (Session.get("hideCompleted")) {
        // If hide completed is checked, filter tasks
        return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
      } else {
        // Otherwise, return all of the tasks
        return Tasks.find({}, {sort: {createdAt: -1}});
      }
    },
    hideCompleted: function () {
      return Session.get("hideCompleted");
    },
    incompleteCount: function () {
      return Tasks.find({checked: {$ne: true}}).count();
    }
  });

  Template.body.events({
    "submit .new-task": function (event) {
      // Prevent default browser form submit
      event.preventDefault();
 
      // Get value from form element
      var text = event.target.text.value;
 
      // Insert a task into the collection
      Meteor.call("addTask", text);
 
      // Clear form
      event.target.text.value = "";
    },

    "change .hide-completed input": function (event) {
      Session.set("hideCompleted", event.target.checked);
    }
  });

  Template.task.events({
    "click .toggle-checked": function () {
      // Set the checked property to the opposite of its current value
      Meteor.call("setChecked", this._id, ! this.checked);
    },
    "click .delete": function () {
      Meteor.call("deleteTask", this._id);
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

Meteor.methods({
  addTask: function (text) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
 
    Tasks.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  deleteTask: function (taskId) {
    Tasks.remove(taskId);
  },
  setChecked: function (taskId, setChecked) {
    Tasks.update(taskId, { $set: { checked: setChecked} });
  }
});
```

好了，我们的输入框和按钮又可以正常工作了！稍微总结一下本章节收获：

1. 当我们向数据库插入任务时，我们可以做一些安全性校验，比如：用户是否登录；创建时间、用户名等字段是否正确。使用者无法假冒任何人。
2. 当任务被私有化时，我们可以在`setChecked`和`deleteTask`方法中增加一些逻辑校验。（后文会介绍）
3. 客户端代码与数据库逻辑更加分离了。我们提炼一些方法可以在各处被调用，而不再是大量逻辑都放在页面的事件处理方法里了。

### Optimistic UI

那么我们为什么要同时定义我们的方法在客户端和服务器端？我们这样做是为了实现一个我们称之为“optimistic UI"的特效。

当我们在客户端使用`Meteor.call`调用一个方法时，Meteor会同时做两件事：

1. 客户端发送请求至服务器端，在一个安全的环境下去运行这个方法，如同AJAX请求一样工作；
2. 试图预测服务器端正常的处理结果，而在客户端模仿这个方法运行。

这就意味着，一个新创建的任务，还未从服务器端接收反馈结果，就立刻出现在页面上了。

如果服务端返回的结果和客户端模拟的结果一致，那么不再做任何处理；不一致，那么UI将按照服务端返回结果进行修正。

利用Meteor的方法（methods）和optimistic UI，我们可以鱼与熊掌兼得——服务端代码安全与无延迟交互！

## 十一、利用发布与订阅来过滤数据

我们已经把应用的所有敏感代码都移到了Methods里了，我们还需要了解一些Meteor其他的安全知识。截止目前，我们的工作都是基于假设整个数据库都在客户端的基础上的，这意味着，如果调用`Tasks.find()`，我们将从集合中查询所有数据。如果应用的使用者想存储一些隐私数据，这个机制就不合适了。我们需要一个方案去控制哪些数据可以发送到客户端数据库。

如同`insecure`包一样，Meteor新创建的每个新应用都会自带一个`autopublish`包。

我们删除这个包，看看发生了什么：

```sh
meteor remove autopublish
```

当应用刷新后，任务清单就空了。没有了这个包，我们需要显示地列出需要服务器端发送哪些数据到客户端。Meteor中实现这个功能的函数是`Meteor.publish`和`Meteor.subscrib`.

在simple-todos.js文件中增加以下代码片段:

```javascript
if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish("tasks", function () {
    return Tasks.find();
  });
}

if (Meteor.isClient) {
  // This code only runs on the client
  Meteor.subscribe("tasks");
}
```

等待代码”热部署“后，页面的任务清单又出现了。

服务器端通过调用`Meteor.publish`方法，注册了一个名为`"tasks"`的发布。在客户端，使用这个发布名调用`Meteor.subscribe`方法，这个客户端就订阅了所有来自发布发布的数据，在这个例子中，就所有的任务清单。

为了真实地展示发布/订阅模式的强大之处，我们来实现一个功能，容许账号去标记任务为”私人的”，以便不被其他账号看见。

### 实现私人任务

首先，我们给任务记录增加一个名为"private"的属性，给用户提供一个按钮，去标记任务是否是私人的。这个按钮只显示给任务的所有者，并且将显示任务当前所处的状态。

另外，我们还要给任务记录增加一个式样类，用来标记这个任务是否为私人的。

simple-todos.html中task模版修改后的代码如下：

```html
<template name="task">
  <li class="{{#if checked}}checked{{/if}}  {{#if private}}private{{/if}}">
    <button class="delete">&times;</button>
 
    <input type="checkbox" checked="{{checked}}" class="toggle-checked" />

    {{#if isOwner}}
      <button class="toggle-private">
        {{#if private}}
          Private
        {{else}}
          Public
        {{/if}}
      </button>
    {{/if}}
 
    <span class="text"><strong>{{username}}</strong> - {{text}}</span>
  </li>
</template>
```

结合页面所做的修改，我们需要同时修改三处JavaScript代码：

1. 增加一个名为`isOwner`的帮助器(helper)

	```javascript
	Template.task.helpers({
      isOwner: function () {
      	return this.owner === Meteor.userId();
      }
  	});
	```
	
2. 增加一个名为`setPrivate`的Meteor方法。
	
	```javascript
	setPrivate: function (taskId, setToPrivate) {
      var task = Tasks.findOne(taskId);
 
      // Make sure only the task owner can make a task private发布
      if (task.owner !== Meteor.userId()) {
        throw new Meteor.Error("not-authorized");
      }
 
      Tasks.update(taskId, { $set: { private: setToPrivate } });
  }
	```
	
3. 增加一个按钮点击事件方法。

	```javascript
	"click .toggle-private": function () {
      Meteor.call("setPrivate", this._id, ! this.private);
    }
	```

### 基于隐私状态有选择地发布任务

我们已经可以设置哪些任务是私人的了，我们继续完善我们的发布程序，只发送数据给有权限的用户浏览。

修改simple-todos.js中相关代码，相关代码片段如下：

```javascript
if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish("tasks", function () {
    return Tasks.find({
      $or: [
        { private: {$ne: true} },
        { owner: this.userId }
      ]
    });
  });
}
```

我们可以打开两个浏览器，使用不同的账号登录，来测试效果。

### 完善安全控制

为了完善我们的私人任务功能，我们需要给`deleteTask`和`setChecked`俩方法增加检查，以便任务的所有者可以删除或完成一个私人任务。

完整的simple-todos.js文件代码如下：

```javascript
Tasks = new Mongo.Collection("tasks");

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish("tasks", function () {
    return Tasks.find({
      $or: [
        { private: {$ne: true} },
        { owner: this.userId }
      ]
    });
  });
}
 
if (Meteor.isClient) {
  // This code only runs on the client
  Meteor.subscribe("tasks");

  Template.body.helpers({
    tasks: function () {
      if (Session.get("hideCompleted")) {
        // If hide completed is checked, filter tasks
        return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
      } else {
        // Otherwise, return all of the tasks
        return Tasks.find({}, {sort: {createdAt: -1}});
      }
    },
    hideCompleted: function () {
      return Session.get("hideCompleted");
    },
    incompleteCount: function () {
      return Tasks.find({checked: {$ne: true}}).count();
    }
  });

  Template.body.events({
    "submit .new-task": function (event) {
      // Prevent default browser form submit
      event.preventDefault();
 
      // Get value from form element
      var text = event.target.text.value;
 
      // Insert a task into the collection
      Meteor.call("addTask", text);
 
      // Clear form
      event.target.text.value = "";
    },

    "change .hide-completed input": function (event) {
      Session.set("hideCompleted", event.target.checked);
    }
  });

  Template.task.helpers({
    isOwner: function () {
      return this.owner === Meteor.userId();
    }
  });

  Template.task.events({
    "click .toggle-checked": function () {
      // Set the checked property to the opposite of its current value
      Meteor.call("setChecked", this._id, ! this.checked);
    },
    "click .delete": function () {
      Meteor.call("deleteTask", this._id);
    },
    "click .toggle-private": function () {
      Meteor.call("setPrivate", this._id, ! this.private);
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

Meteor.methods({
  addTask: function (text) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
 
    Tasks.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  deleteTask: function (taskId) {
    var task = Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }

    Tasks.remove(taskId);
  },
  setChecked: function (taskId, setChecked) {
    var task = Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can check it off
      throw new Meteor.Error("not-authorized");
    }

    Tasks.update(taskId, { $set: { checked: setChecked} });
  },
  setPrivate: function (taskId, setToPrivate) {
    var task = Tasks.findOne(taskId);
 
    // Make sure only the task owner can make a task private
    if (task.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
 
    Tasks.update(taskId, { $set: { private: setToPrivate } });
  }
});
```

> “注意现在任何人都可以删除公共任务，代码再做一些微调，就可以实现仅任务的所有者才能删除他们”

好了，我们完成了个人任务功能！现在我们的应用已经安全了，可以防止攻击者浏览或者修改他人的任务了！

{% endraw %}