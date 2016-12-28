---
layout: post
title: Django入门
category: Python
tags: ['Python', 'Django']
author: 景阳
image: /images/jyjsjd/Django_logo.png
email: jingyang@asiainfo.com
description: 介绍如何用Django搭建一个简单网站
---

## 一、概述
![Django_logo.png](/images/jyjsjd/Django_logo.png)

[Django](https://www.djangoproject.com/)是一个开放源代码的Web应用框架，由Python写成，本身是专门用作开发新闻管理系统的。采用了MVC的软件设计模式，即模型M，视图V和控制器C。

Django框架的核心包括：一个面向对象的*映射器*，用作数据模型（以Python类的形式定义）和关系性数据库间的媒介；一个基于正则表达式的*URL分发器*；一个用于处理请求的*视图系统*；以及一个*模板系统*。

## 二、环境要求
从 [Python](https://www.python.org/) 官网下载安装适合机器系统的版本，Python >= 2.7。
用 Python 的 pip 命令安装 Django：

```$ pip install Django==1.10.4```

安装完成之后运行命令查看是否安装成功：

![Django_version.png](/images/jyjsjd/Django_version.png)


## 三、一个实例
### (1) 新建项目
用*django-admin*命令新建一个项目：

```$ django-admin startproject mysite```

会得到如下的目录结构：

    mysite/
        manage.py
        mysite/
            __init__.py
            settings.py
            urls.py
            wsgi.py


* manage.py：是一个命令行工具，它允许你用多种方式和 Django 项目交互。
* mysite/settings.y：包含项目的基本设置，如数据库，静态文件目录等。
* mysite/urls.py：项目的 URL 的分发器。
* mysite/wsgi.py：WSGI 服务器入口。

运行命令启动项目：

```$ python manage.py runserver```

打开浏览器输入：

```http://localhost:8000```

查看项目是否正确创建，如果项目创建成功，能看到成功页面：

![startpage.png](/images/jyjsjd/startpage.png)

### (2) 新建 app
进入 *mysite* 目录，运行命令：

```$ python manage.py startapp polls```

在*mysite*项目下会生成一个目录*polls*，我们所有的代码都是基于这个 app。
我们再往文件夹里加一些文件夹，最终目录结构如下：

    polls/
        __init__.py
        admin.py
        apps.py
        migrations/
            __init__.py
        static/
        templates/
            admin/
            polls/
        models.py
        tests.py
        urls.py
        views.py

* admin.py：修改 admin 页面。
* apps.py：注册 app，如这里的*polls*。
* static/：静态文件目录，如 css，JavaScript 文件。
* templates/：模板文件目录。
* models.py：所有数据模型。
* test.py：测试文件。
* urls.py：URL分发器。
* views.py：包含所有的视图。

运行命令，创建管理员用户：

``$ python manage.py createsuperuser``

根据提示一步步创建。


### (3) 数据模型
Django 支持大部分主流数据库，为简单起见在这里使用 *sqlite*。

*polls*中的数据模型都定义在 polls/models.py中。这里定义了两个数据模型，Question 和 Choice：

    class Question(models.Model):
        question_text = models.CharField(max_length=200)
        pub_date = models.DateTimeField('date published')

        def was_published_recently(self):
            now = timezone.now()
            return now - datetime.timedelta(days=1) <= self.pub_date <= now

        def __str__(self):
            return self.question_text

    class Choice(models.Model):
        question = models.ForeignKey(Question, on_delete=models.CASCADE)
        choice_text = models.CharField(max_length=200)
        votes = models.IntegerField(default=0)

        def __str__(self):
            return self.choice_text

在 mysite/settings.py 中注册项目：

    INSTALLED_APPS = [
        'polls.apps.PollsConfig', # 注册polls
        'django.contrib.admin',
        'django.contrib.auth',
        'django.contrib.contenttypes',
        'django.contrib.sessions',
        'django.contrib.messages',
        'django.contrib.staticfiles',
    ]

数据库迁移：

```$ python manage.py makemigrations polls```

根据数据模型在数据库中创建表：

```$ python manage.py sqlmigrate polls 0001```

保存项目之后在浏览器中打开```http://localhost:8000/admin/```，首先输入管理员的用户名密码，然后就进入了后台管理页面：

![Admin_page.png](/images/jyjsjd/Admin_page.png)

可以看到 Django 自动为我们生成了一个管理页面，它能对定义的数据模型进行 *CRUD* 的操作，并且提供了一些*权限控制*的功能，非常方便。

### (4) 自定义视图
视图定义在 views.py 中，可以基于方法或者类。下面定义了一个简单的视图，它会返回全部问题的列表：

    class IndexView(generic.ListView):
        template_name = 'polls/index.html'
        context_object_name = 'latest_question_list'

        def get_queryset(self):
            return Question.objects.order_by('-pub_date')[:5]

在模板目录 templates 中的 polls，添加模板文件 index.html：

 ![index_page.png](/images/jyjsjd/index_page.png)

### (5) URL分发
Django的URL分发基于正则表达式，访问这些页面时会去 templates 目录中去找相应的 template，这些定义在 urls.py中：

    urlpatterns = [
        url(r'^$', views.IndexView.as_view(), name='index'),
    ]

上面定义了当 URL 中什么都没写的时候，直接访问 index 页面。

### (6) 自定义样式
可以在 static 目录中存放 css、JavaScript 或者图片文件。在 template 首部使用：

 ![load_command.png](/images/jyjsjd/load_command.png)

就可以引用这些文件。
如在 static 目录中添加文件 style.css，增加下面的样式：

    li a {
        color: green;
    }

在 index.html 中引入这个样式：

![load_example.png](/images/jyjsjd/load_example.png)

index 页面下的所有超链接都会变成绿色：

![Django_style.png](/images/jyjsjd/Django_style.png)
