---
layout: post
category: Sencha
title: 构建基于 Sencha Touch MVC 的 web 应用
tags: ['Sencha Touch', 'Mobile Web', 'Html5']
author: Jacky
email: shenyj5@asiainfo-linkage.com
image:
description: ST2 提供了一个强大的应用程序架构 MVC，专为构建跨平台的 web 应用程序而优化，通过命名空间和文件夹将整个项目按功能划分为几个模块（数据模型 models、视图 views、控制器 controllers、存储器 stores、配置文件 profiles）。使得整个项目代码看上去更直观，容易维护。
---

##构建基于 Sencha Touch MVC 的 web 应用
###MVC 程序结构解析
就算以前有 EXT 的编程经验，刚接触 ST MVC 的时候，你可能会被一个个文件夹跟一堆堆的 js 搞得头昏脑涨，建一个视图需要几个文件，每个文件该如何创建，相互之间如何调用。所以开始实践之前有必要来了解下 MVC 的整个程序结构。

一个应用程序其实就是Models，Views，Controllers，Stores和Profiles的集合，只不过附加了一些特殊的元素，例如程序的图标或者加载图片等等。

![ST 应用程序架构](/images/st-3.png)

	Model：在应用程序中代表了一个对象类型，简单理解便是数据模型。
	View：利用Sencha Touch内部组件，负责向用户显示数据，简单解释便是视图。
	Controller：处理应用程序的交互，监听事件并作出响应，简单理解就是控制器。
	Store：负责将数据加载到我们的应用程序当中。
	Profile：为的是在尽可能多的通用代码下，为手机和平板电脑定制UI。简单理解就是配置文件，如果是手机应该加载怎样的UI，平板电脑则加载什么样的UI。

通常我们在Sencha Touch的应用程序中都会这样编写application：

	Ext.application({
	    name: 'MyApp',
	    models: ['User', 'Product', 'nested.Order'],
	    views: ['OrderList', 'OrderDetail', 'Main'],
	    controllers: ['Orders'],
	    launch: function() {
	        Ext.create('MyApp.view.Main');
	    }
	});


那么我们就对以上代码进行简单分析：

name：便是我们定义的命名空间，我们的所有代码都在该空间下编写，类似Java中的顶级包名。在上面的代码中，我们我们知道，在view文件夹下有Main.js文件，就等价于该文件的存在路径为MyApp.view.Main。

我们通过models,views和controllers来加载相应目录下的文件。

Controllers

controller是程序的中心，它把程序的各部分有机的结合在一起，并统一运行控制，使我们的程序正常运行。比如，view中存放的仅仅是页面布局等代码，关于页面逻辑处理的代码几乎都存放在controller中了，实现逻辑代码的统一管理。

A simple example

接下来的例子展示给我们如何快速的定义控制器。在这里我们使用两个比较常用的控制器配置项：refs和control。通过refs，我们可以轻松的在一个页面中找到任何的组件。在本例中，我们将匹配xtype为formpanel的组件，并将第一个匹配的作为loginForm，并在doLogin函数之后使用该属性。

第二件事情便是建立起一个control配置项。就像refs，它使用一个组件查询器来找到所有的formpanel。看看下面具体的代码再说吧：

	Ext.define('MyApp.controller.Sessions', {
	    extend: 'Ext.app.Controller', 
	    config: {
	        refs: {
	            loginForm: 'formpanel'
	        },
	        control: {
	            'formpanel button': {
	                tap: 'doLogin'
	            }
	        }
	    },
	 
	    doLogin: function() {
	        var form = this.getLoginForm(),
	            values = form.getValues(); 
	        MyApp.authenticate(values);
	    }
	});

doLogin函数本身是很简单的，因为在定义一个loginForm的refs的时候，控制器会自动为我们生成一个getLoginForm的函数，返回我们需要的那个formpanel。简单理解上面代码的作用便是：refs是我们声明的组件的引用，control中是我们对这些组件需要监听的事件以及触发的函数。refs是指向，control是控制。

Stores

Stores是Sencha Touch中特别重要的部分，并且大多数的窗体都会绑定数据的。简单来说，store其实就像是model的数据实体。例如List和DataView这些组件，渲染的都是store中的model的实体。因为model的实体被添加或者从store中移除时，都会触发这些组件所绑定的数据监听，达到更新或者其他操作的目的。

Device Profiles

我们知道，Sencha Touch程序会运行在不同设备上，这些设备有着不同的功能或者屏幕分辨率。例如一个用户界面可能比较适合于平板电脑，但是在手机中就显得不是那么合适了，反之亦然。然而我们在编写应用程序的时候，并不想为每一设备都单独写一个程序，那样太麻烦了，我们更倾向于写好的程序，本身能够在手机或者平板电脑中运行并根据设备进行不同的加载，显示不同的UI风格，这是我们便要用好profile文件了。profile文件只是简单的告诉程序，如何针对不同的设备进行不同的加载，我们通常在程序开始的时候便声明它：

	Ext.application({
	    name: 'MyApp',
	    profiles: ['Phone', 'Tablet'],
	    //as before
	});

一旦我们像上面这段代码一样，声明了我们的profile文件，那么程序在加载的过程当中，就会去加载我们app/profile目录下的相应JS文件了。我们可以看看下面这段代码是如何定义一个平板电脑的配置文件的：

	Ext.define('MyApp.profile.Tablet', {
	    extend: 'Ext.app.Profile',
	    config: {
	        controllers: ['Groups'],
	        views: ['GroupAdmin'],
	        models: ['MyApp.model.Group']
	    }, 
	    isActive: function() {
	        return Ext.os.is.Tablet;
	    }
	});

只要Sencha Touch认为我们的应用程序是运行在平板电脑上的时候，isActive函数便会返回true。其实这个判断并不是很准确的，因为目前的平板电脑和手机并没有很明显的界限，所有Sencha Touch在进行判断的时候，只识别ipad，对于其他的平板电脑都会返回false的，也就是说除了ipad，其他的都看做是手机。不过你也可在isActive函数中进行细化，来实现你需要的功能。
我们在编写代码的时候，一定要注意，只能有一个true从profile文件中返回，否则的话程序只会识别第一个返回的true，其他的将不会被识别或者被忽略。这时我们应用程序会被设定在当前的配置文件下，并且可以被随时查看。

如果检测到我们当前的配置文件，定义了额外的models，views，controllers或者stores，这些都会被自动加载的。但是名字可不是随便写的，这些都是有一定关联的，看下面的例子：

	views: ['GroupAdmin'] will load app/view/tablet/GroupAdmin.js
	controllers: ['Groups'] will load app/controller/tablet/Groups.js
	models: ['MyApp.model.Group'] will load app/model/Group.js

如果没有完整的名字的话，该文件必须存放在相应目录下的tablet子目录下，例如所有的视图文件都必须存放在app/view/tablet目录下，但是如果指定了完整的路径的话，只要该文件存在于该路径下就OK了。

大多数情况下，我们只会在profile中定义一些额外的视图或者控制器，共享我们应用程序的数据。

Launch Process

我们可以为每一个应用程序定义一个launch函数，负责应用程序的加载，同时这里也是我们设定应用程序启动逻辑，创建主视图的最好位置。除了在该位置之外，我们还有两个地方可以设定我们程序的启动逻辑。首先是每一个控制器中，我们可以定义一个init函数，该函数会在launch函数之前被调用。另一个便是，如果我们使用了设备配置文件，那么每一个profile中都能定义launch函数，该函数会在控制器的init之后，launch之前被调用。

例如我们为设备定义了不同的profile文件，phone和tablet，并在一个平板电脑中运行我们的应用程序，那么启动顺序如下：

	1.控制器的init函数被调用。
	2.Profile中的launch函数会被调用。
	3.应用程序的launch函数会被调用。
	4.控制器中的launch函数会被调用。
    
当我们使用Profile文件的时候，通常会把启动的逻辑顺序放在Profile的launch中，因为我们会根据不同设备，建立不同的视图启动顺序。

##管理 MVC 的依赖项
ST2应用程序用来定义依赖项的地方主要有两个，application本身和应用程序内部类。本指南将给出一些关于应用程序如何放置和在哪里放置依赖项的建议。

####应用程序依赖项
当你创建一个MVC应用程序时，Ext.application会提供一个直观的方式来设置应用程序会用到的数据模型、视图、控制器、数据存储器和配置文件等，如下例所示：

	Ext.application({
	    name: 'MyApp',
	    views: ['Login'],
	    models: ['User'],
	    controllers: ['Users'],
	    stores: ['Products'],
	    profiles: ['Phone', 'Tablet']
	});

这5个配置项是用来加载应用程序常用文件（数据模型、视图、控制器、存储器、配置文件）的快捷方式。如上的配置意味着应用程序会自动加载下列文件：

	app/view/Login.js
	app/model/User.js
	app/controller/Users.js
	app/store/Products.js
	app/profile/Phone.js
	app/profile/Tablet.js

就加载文件而言，上面的例子跟下面的定义是等价的：

	Ext.require([
	    'MyApp.view.Login',
	    'MyApp.model.User',
	    'MyApp.controller.Users',
	    'MyApp.store.Products',
	    'MyApp.profile.Phone',
	    'MyApp.profile.Tablet'
	]);

在你需要加载更多的类文件情况下，这种配置方式就会更有用，它能避免你为每一个文件都拼写又臭又长的完整类名。除了把依赖文件加载进来之外，这几个配置还会做更多的事情：

	profiles 
	配置文件 – 实例化每一个Profle并判断哪一个当前可用。当前可用的那个profile中所有依赖项也将被加载
	
	controllers
	控制器 – 加载完成后实例化每一个控制器
	
	stores
	存储器 – 实例化每一个存储器，没有指定id的存储器会被指定一个默认id

这意味着，如果你要享受MVC带给你的便利，那么载你定义应用程序依赖项的时候，最好使用配置选项这种方式。

####配置文件指定的依赖项
当你使用设备配置的时候，可能会有一些类是仅在特定设备上使用的。例如，平板电脑版本的应用程序可能包含比手机版本更多的功能，这当然意味着要加载更多的类。每个Profile都可以在内部定义额外的依赖项。


Ext.define('MyApp.profile.Tablet', {
    extend: 'Ext.app.Profile',
    config: {
        views: ['SpecialView'],
        controllers: ['Main'],
        models: ['MyApp.model.SuperUser']
    },
    isActive: function() {
        return Ext.os.is.Tablet;
    }
});

然后每个profile中定义的依赖项都会被加载，不管这个profile是否active，不过尽管都被加载，但应用程序不会去做类似实例化非active状态profile指定的控制器这样的无用功。

这听起来有点不合常规，为什么要下载那些不会用到的类文件呢？这么做的原因是产生一个可以在任何设备上运行的通用程序版本，然后检测哪一个profile应该被使用，接着从这个profile启动应用程序。与之相对的选择是为每个profile创建一个应用版本，然后启动一个微型加载器来检测哪个profile该被选择，然后去下载该profile需要的代码文件。

的确这种通用架构的程序会在每个设备上都下载一些根本用不到的代码文件，不过对于绝大多数应用程序来说，你多下载的这点文件影响实在是微乎其微。而对于比较庞大的应用程序来说，这个问题可能更值得注意，所以我们可能在2.0的后续版本对它进行处理。

####级联依赖

大一些应用通常会把数据模型、视图、控制器分别存储在不同子文件夹下，这样可以让整个项目看起来更清晰明了一些。对于视图来说尤其如此，大型应用拥有上百个独立的视图类并非天方夜谭，因此分文件夹存储几乎不可避免。

指定子文件夹中的依赖项只需要使用“.”来分割文件夹路径即可：

	Ext.application({
	    name: 'MyApp',
	    controllers: ['Users', 'nested.MyController'],
	    views: ['products.Show', 'products.Edit', 'user.Login']
	});

上例中将会加载下列5个文件

	app/controller/Users.js
	app/controller/nested/MyController.js
	app/view/products/Show.js
	app/view/products/Edit.js
	app/view/user/Login.js

我们可以混合使用两种方式来定义每个数据模型、视图、控制器、配置文件和存储器：快捷路径方式（符合mvc推荐原则的类只写最后的类名即可）和完整路径方式（自定义路径的类则写完整路径加类名）。

####外部依赖项

我们可以通过指定想要加载的完整类名方式来定义应用程序之外的类作为依赖项。这种情况最常见的用途就是在多个应用之间共享认证逻辑。我们可能会有好几个应用程序都要到同一个用户数据库进行验证并实现登录，这时我们当然希望它们能够共享用户登录的代码。比较容易的方式就是在应用程序文件夹之外创建一个单独的文件夹然后把其中的内容作为依赖项添加到应用程序中去。

我们假定共享的登录代码包含一个login控制器，一个用户model和一个login表单视图。我们要在应用程序中把它们全部用上：

	Ext.Loader.setPath({
	    'Auth': 'Auth'
	});
	
	Ext.application({
	    views: ['Auth.view.LoginForm', 'Welcome'],
	    controllers: ['Auth.controller.Sessions', 'Main'],
	    models: ['Auth.model.User']
	});

上述代码将加载以下的文件：

	Auth/view/LoginForm.js
	Auth/controller/Sessions.js
	Auth/model/User.js
	app/view/Welcome.js
	app/controller/Main.js

前面三个文件加载自应用程序外部，后两个则来自应用程序内部。同样我们可以混合调用内外部依赖项。

想要启用外部依赖项加载，我们只需告诉Loader到哪里可以找到这些文件即可，Ext.Loader.setPath就是干这个的。上例中我们告诉Loader所有以Auth命名空间中的文件都可以到Auth这个文件夹中找到。这样我们就能把应用程序文件夹之外的通用验证代码都拽进来了，其他的事情由ST框架来处理。

依赖项应该放在哪里

决定在哪里声明依赖项的一个基本原则就是保证你的类文件完整的内部包含。例如，你有一个视图A包含了几个其他的视图，你就应该在这个A视图内部声明它的依赖项，而不是在application中：

	Ext.define('MyApp.view.Main', {
	    extend: 'Ext.Container',
	    requires: [
	        'MyApp.view.Navigation',
	        'MyApp.view.MainList'
	    ],
	    config: {
	        items: [
	            {
	                xtype: 'navigation'
	            },
	            {
	                xtype: 'mainlist'
	            }
	        ]
	    }
	});

App.js中这么写：

	Ext.application({
	    views: ['Main']
	});

这才是依赖项的最佳声明方式。两个原因：1、确保app.js干净；2、让你知道主程序依赖MyApp.view.Main就已经足够。不好的方式就是下面这样把视图都罗列在app.js里：

	Ext.application({
	    views: ['Main', 'Navigation', 'MainList']
	});

换种方式来描述这个问题，app.js只需要包含最顶级的视图即可。你在应用程序内部通过Ext.create('MyApp.view.SomeView')来创建的视图就可以视作顶级视图。其他那些仅仅被作为某些视图内部子视图的（比如例子中的MyApp.view.Navigation和MyApp.view.MainList）就不应该出现在app.js里面。