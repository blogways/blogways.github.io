---
layout: post
category: JUnit
title: JUnit4 使用进阶五
tags: ['Junit4']
author: 唐 治
email: tangzhi@asiainfo-linkage.com
description: 在进阶二中，我们介绍了`@Rule`的两个用法，对异常进行检查和对超时时间的设定。其实，Rule还有很多用途，本文将做进一步介绍

---


在[进阶二]中，我们介绍了`@Rule`的两个用法，对异常进行检查和对超时时间的设定。其实，Rule还有很多用途，本文将做进一步介绍。


### Rule的应用

Rule将在框架的很多方面提供解决方案。下面一一举例：

1. **TemporaryFolder**

	`TemporaryFolder`作为Rule，可以运行在测试过程中创建临时文件或者临时目录，当测试结束后，框架会自动删除。
	
	见实例：
	
		  public static class HasTempFolder {
          @Rule
          public TemporaryFolder folder = new TemporaryFolder();
        
          @Test
          public void testUsingTempFolder() throws IOException {
            File createdFile = folder.newFile("myfile.txt");
            File createdFolder = folder.newFolder("subfolder");
            // ...
          }
        } 
        
	* `TemporaryFolder#newFolder(String... folderNames)`可以根据输入的参数创建目录。如果是多级目录，可以递归创建。
	* `TemporaryFolder#newFile()`可以创建一个随机名字的临时文件；
	* `TemporaryFolder##newFolder()` 可以创建一个随机名字的临时目录。
	
1. **ExternalResource**

	`ExternalResource`可以设置测试前后需要做的事情（比如：文件、socket、服务、数据库的连接与关闭）。这个我们在之前的[进阶二]中稍有提及。
	
	见实例：
	        
	    public static class UsesExternalResource {
          Server myServer = new Server();
          
          @Rule
          public ExternalResource resource = new ExternalResource() {
            @Override
            protected void before() throws Throwable {
              myServer.connect();
            };
            
            @Override
            protected void after() {
              myServer.disconnect();
            };
          };
          
          @Test
          public void testFoo() {
            new Client().run(myServer);
          }
        }
        
    * `ExternalResource#before`会在每个测试之前处理；`#after`会在每个测试之后处理；
	* 关于`ExternalResource`与`@Before`已经`@After`等标记步骤的执行顺序，我们会在本文后面部分介绍。
	

1. **ErrorCollector**

	`ErrorCollector`这个Rule，在出现一个错误后，还可以让测试继续进行下去。
	
	他提供三个方法：
	
		checkThat(final T value, Matcher<T> matcher)
		checkSucceeds(Callable<Object> callable)
		addError(Throwable error)
		
	前面两个是用来处理断言的，最后一个是添加错误至错误列表中。
	
	看下面例子：
	
        package mytest;
        
        import static org.hamcrest.CoreMatchers.is;
        import static org.junit.Assert.assertThat;
         
        import java.util.concurrent.Callable;
         
        import org.junit.Rule;
        import org.junit.Test;
        import org.junit.rules.ErrorCollector;
         
        public class JUnitCoreErrorControllerRuleTest {
         
          private final int multiplesOf2[] = { 0, 2, 4, 7, 8, 11, 12 };
         
          @Rule
          public ErrorCollector errorCollector = new ErrorCollector();
         
          /*
           * 下面这个测试，会报告两个failures。这一点和下面的checkSucceeds测试不同
           */
          @Test
          public void testMultiplesOf2() {
            int multiple = 0;
            for (int multipleOf2 : multiplesOf2) {
              // Will count the number of issues in this list
              // - 3*2 = 6 not 7, 5*2 = 10 not 11 : 2 Failures
              errorCollector.checkThat(2 * multiple, is(multipleOf2));
              multiple++;
            }
          }
         
          /*
           * 下面代码中有两个断言会失败，但每次运行JUnit框架只会报告一个。这一点和上面的checkThat测试不同，可以对比一下。
           */
          @Test
          public void testCallableMultiples() {
            errorCollector.checkSucceeds(new Callable<Object>() {
              public Object call() throws Exception {
                assertThat(2 * 2, is(5));
                assertThat(2 * 3, is(6));
                assertThat(2 * 4, is(8));
                assertThat(2 * 5, is(9));
                return null;
              }
            });
          }
         
          /*
           * 下面运行时，会报告2个错误
           */
          @Test
          public void testAddingAnError() {
            assertThat(2 * 2, is(4));
            errorCollector.addError(new Throwable("Error Collector added an error"));
            assertThat(2 * 3, is(6));
            errorCollector.addError(new Throwable(
                "Error Collector added a second error"));
          }
         
        }
        
    运行结果，类似下面：
    
    	Failed tests: 
    	
    	testCallableMultiples(mytest.JUnitCoreErrorControllerRuleTest): 
		Expected: is <5>
     		but: was <4>
  		
  		testMultiplesOf2(mytest.JUnitCoreErrorControllerRuleTest): 
		Expected: is <7>
     		but: was <6>
  		
  		testMultiplesOf2(mytest.JUnitCoreErrorControllerRuleTest): 
		Expected: is <11>
     		but: was <10>
     		
     	Tests in error: 
  		testAddingAnError(tangzhi.mytest.JUnitCoreErrorControllerRuleTest): Error Collector added an error
  
  		testAddingAnError(tangzhi.mytest.JUnitCoreErrorControllerRuleTest): Error Collector added a second error

	从这个例子，可以看出：
	
	* `ErrorCollector#checkThat` 会报告测试中的每一个failures
	* `ErrorCollector#checkSucceeds` 只会检查是否成功，如果不成功，只报告第一个导致不成功的failure
	* `ErrorCollector#addError` 是添加一个错误(error)。
	
1. **Verifier**

	如果，你想在每个测试之后，甚至是在`@After`之后，想检查些什么，就可以使用`Verifier`这个Rule.

	看例子：
	
        private static String sequence;
        
        public static class UsesVerifier {
          @Rule
          public Verifier collector = new Verifier() {
              @Override
              protected void verify() {
                  sequence += " verify ";
              }
          };
        
          @Test
          public void example() {
              sequence += "test";
          }
          
          @Test
          public void example2() {
              sequence += "test2";
          }
          
          @After
          public void after() {
        	  sequence += " after";
          }
        }
        
        @Test
        public void verifierRunsAfterTest() {
          sequence = "";
          assertThat(testResult(UsesVerifier.class), isSuccessful());
          assertEquals("test after verify test2 after verify ", sequence);
        }
        
    从上面例子可以看出:`Verifier#verify`针对每个测试都会运行一次，并且运行在`@After`步骤之后。
    
    需要说明：如果某测试出现失败(fail)，那么这个测试之后就不会做`verify`,这一点，可以结合下面的例子看出。

1. **TestWatcher**

	对测试的每个步骤进行监控。
	
	看例子：
	
        package tangzhi.mytest;
        
        import static org.junit.Assert.*;  
        import static org.hamcrest.CoreMatchers.*;
        
        import org.junit.After;
        import org.junit.Rule;
        import org.junit.Test;
        import org.junit.rules.TestRule;
        import org.junit.rules.TestWatcher;
        import org.junit.rules.Verifier;
        import org.junit.runner.Description;
        import org.junit.runners.model.Statement;
        
        public class WatchmanTest {
        	private static String watchedLog;
        
        	  @Rule
        	  public TestRule watchman = new TestWatcher() {
        	    @Override
        	    public Statement apply(Statement base, Description description) {
        	    	Statement s = super.apply(base, description);
        	    	watchedLog="";
        	    	System.out.println("watch apply.");
        	    	return s;
        	    }
        
        	    @Override
        	    protected void succeeded(Description description) {
        	    	watchedLog += description.getDisplayName() + " " + "success!";
        	    	System.out.println("watch succeed:"+watchedLog);
        	    	
        	    }
        
        	    @Override
        	    protected void failed(Throwable e, Description description) {
        	    	watchedLog += description.getDisplayName() + " " + e.getClass().getSimpleName();
        	    	System.out.println("watch failed:"+watchedLog);
        	    	
        	    }
        
        	    @Override
        	    protected void starting(Description description) {
        	      super.starting(description);
        	      System.out.println("watch starting.");
        	    }
        
        	    @Override
        	    protected void finished(Description description) {
        	      super.finished(description);
        	      System.out.println("watch finished.");
        	    }
        	  };
        	  
        	  @Rule
              public Verifier collector = new Verifier() {
                  @Override
                  protected void verify() {
                	  System.out.println("@Verify:"+watchedLog);
                  }
        	  };
        
        	  @Test
        	  public void fails() {
        		  System.out.println("in fails");
        		  assertThat("ssss", is("sss"));
        	  }
        
        	  @Test
        	  public void succeeds() {
        		  System.out.println("in succeeds");
        	  }
        	  
        	  @After
        	  public void after() {
        		  System.out.println("@After");
        	  }
        }

	运行后，日志如下：
	
        watch apply.
        watch starting.
        in succeeds
        @After
        watch succeed:succeeds(tangzhi.mytest.WatchmanTest) success!
        watch finished.
        @Verify:succeeds(tangzhi.mytest.WatchmanTest) success!
        watch apply.
        watch starting.
        in fails
        @After
        watch failed:fails(tangzhi.mytest.WatchmanTest) AssertionError
        watch finished.

1. **TestName**
	
	`TestName`可以获取当前测试方法的名字。
	
	看例子：
	
        public class NameRuleTest {
          @Rule
          public TestName name = new TestName();
          
          @Test
          public void testA() {
            assertEquals("testA", name.getMethodName());
          }
          
          @Test
          public void testB() {
            assertEquals("testB", name.getMethodName());
          }
        }
        
    如果，是在参数化测试(Parameterized)中，使用了`@Parameters`，那么其`name`属性定义的方法名也将会被`TestName#getMethodName`获取。
    
1. **Timeout**

	这个我们在前面介绍过，可以设置某个测试类，所有测试方法的超时时间。详见[进阶二]。
	
1. **ExpectedException**

	这个也在[进阶二]中有介绍。
	
1. **ClassRule**

	注释`@ClassRule`是类级别的，而不是方法级别的。
	
	见下面例子：
	
		@RunWith(Suite.class)
        @SuiteClasses({A.class, B.class, C.class})
        public class UsesExternalResource {
          public static Server myServer= new Server();
        
          @ClassRule
          public static ExternalResource resource= new ExternalResource() {
            @Override
            protected void before() throws Throwable {
              myServer.connect();
            };
        
            @Override
            protected void after() {
              myServer.disconnect();
            };
          };
        }
	
	在Suite所打包的几个类测试前后，会执行一遍`ClassRule`。

 1. **RuleChain**
 
 	见例子：
 	
		public static class UseRuleChain {
            @Rule
            public TestRule chain= RuleChain
                                   .outerRule(new LoggingRule("outer rule")
                                   .around(new LoggingRule("middle rule")
                                   .around(new LoggingRule("inner rule");
        
            @Test
            public void example() {
                assertTrue(true);
            }
        }
 
 	执行后，日志如下：
 	
 	    starting outer rule
        starting middle rule
        starting inner rule
        finished inner rule
        finished middle rule
        finished outer rule

[进阶二]: junit-usage-2.html