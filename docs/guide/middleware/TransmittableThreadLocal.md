# TransmittableThreadLocal

> ​	前言
>
> 由于公司项目为了适应多租户的需求，故需要大改，在现有的项目中使用了大量的线程池异步操作，并且需要把数据对接到另一个项目，所以需要拿到租户和当前用户，租户和用户是储存在`请求头`中，所以提供了一个工具类获取，当一个请求进来后，使用异步对接的方式，那么本次请求就已经结束了，所以再使用工具类获取的值就为`null`了，针对这种情况梳理了两种解决方案。

##### 方案一：

人工手动的去修改，所以得花时间去梳理整个项目的异步操作，这个太繁琐了并且也没啥技术含量，个人认为解决问题是其次，主要要基于问题突破自己的认知，所以此方案pass掉。

##### 方案二：

就想到了可以使用`ThreadLocal`，但是 ThreadLocal只能在当前线程中使用，所以继续面向百度编程。

后面又找到`InheritableThreadLocal` 以下简称ttl，但是这个的局限是要每次创建新的线程才能使用，但是我们项目中使用的是线程池；

最后找到今日的主角 [TransmittableThreadLocal](https://github.com/alibaba/transmittable-thread-local)

## 应用场景

`ThreadLocal`的需求场景即`TransmittableThreadLocal`的潜在需求场景，如果你的业务需要『在使用线程池等会池化复用线程的执行组件情况下传递`ThreadLocal`值』则是`TransmittableThreadLocal`目标场景。

下面是几个典型场景例子。

1. 分布式跟踪系统 或 全链路压测（即链路打标）
2. 日志收集记录系统上下文
3. `Session`级`Cache`
4. 应用容器或上层框架跨应用代码给下层`SDK`传递信息

## 注意事项

`TransmittableThreadLocal`继承`InheritableThreadLocal`，使用方式也类似。相比`InheritableThreadLocal`，添加了

#### 1、`copy`方法

用于定制 **任务提交给线程池时** 的`ThreadLocal`值传递到 **任务执行时** 的拷贝行为，缺省是`简单的赋值`传递。

`注意`：如果传递的是一个对象（引用类型）且没有做深拷贝，如直接传递引用或是浅拷贝，那么

- 跨线程传递而不再有线程封闭，传递对象在多个线程之间是有共享的（通俗来说，就是已经把`引用类型`数据拷贝到了子线程中，然后再在main线程中修改引用类型数据，那么子线程会同步更新，因为只做了浅拷贝）；
- 与`InheritableThreadLocal.childValue`一样，使用者/业务逻辑要注意传递对象的线程安全。

#### 2、`protected`的`beforeExecute`/`afterExecute`方法

#### 3、避免上述问题应重写三个方法`copy`、`childValue`、`initialValue`

```java
    private static TransmittableThreadLocal<Map<String, Object>> CONTEXT = new TransmittableThreadLocal() {
        /**
         * 使用TransmittableThreadLocal需要重新copy、initialValue、childValue方法，因为两者都是直接返回参数的，而不是新建对象进行返回
         * 所以当执行异步线程后，main线程修改当前数据，子线程会同步更新
         * @param parentValue
         * @author bigtian
         * @since 6.0
         * @createTime 2022/6/29 11:28
         * @return Object
         */
        @Override
        public Object copy(Object parentValue) {
            if (parentValue instanceof Map) {
                return new LinkedHashMap<>((Map<String, Object>) parentValue);
            }
            //...自定义
            return null;
        }

        @Override
        protected Map<String, Object> childValue(Object parentValue) {
            if (parentValue instanceof Map) {
                return new LinkedHashMap<>((Map<String, Object>) parentValue);
            }
            //...自定义
            return null;
        }

        @Override
        protected Map<String, Object> initialValue() {
            return new LinkedHashMap<>();
        }
    };
```

## 具体使用

##### 一、一般使用异步基本都是配合线程池，以下以线程池为例

```java
   ExecutorService executorService = Executors.newFixedThreadPool(3);
        executorService=TtlExecutors.getTtlExecutorService(executorService);
```

> 1、线程池由ttl接管，后续就不需要使用`TtlRunnable`和`TtlCallable`，具体原因是因为底层`ExecutorTtlWrapper`中的 execute方法接管了；
>
> ```java
>   @Override
>     public void execute(@NonNull Runnable command) {
>         executor.execute(TtlRunnable.get(command, false, idempotent));
>     }
> ```
>
> 2、TtlRunnable中get方法
>
> ```java
>     @Nullable
>     public static TtlRunnable get(@Nullable Runnable runnable, boolean releaseTtlValueReferenceAfterRun, boolean idempotent) {
>         if (null == runnable) return null;
> 
>         if (runnable instanceof TtlEnhanced) {
>             // avoid redundant decoration, and ensure idempotency
>             if (idempotent) return (TtlRunnable) runnable;
>             else throw new IllegalStateException("Already TtlRunnable!");
>         }
>         return new TtlRunnable(runnable, releaseTtlValueReferenceAfterRun);
>     }
> ```
>
> 由此可见最终返回了TtlRunnable对象，也避免了我们要手动的将所有的Runnable改成TtlRunnable

##### 二、编写AOP切面，为每次请求封装请求头数据到ttl

```java
/**
 * @description: 为每次请求封装请求参数
 * @author: bigtian
 * @create: 2022-04-06 09:06
 */
@Aspect
@Component
@Slf4j
public class ConsoleExceptionParams {
    private final String expCheckPoint = "execution(* com.rest..*.*(..))";

    /**
     * 配置切点
     */
    @Pointcut(expCheckPoint)
    public void expCheckPoint() {

    }

    /**
     * 请求前
     *
     * @author bigtian
     * @createTime 2022/6/29 13:22
     * @since 6.0
     */
    @Before("expCheckPoint()")
    public void beforeRequest() {
        Dict headerParams = Dict.create()
                .set("tenantid", UserUtils.getTenantId())
                .set("staffPostCode", UserUtils.getStaffPostCode());
        ThreadLocalUtil.setData(headerParams);
    } 
}

```

> ​	编写工具类

```java
/**
 * @description:
 * @author: bigtian
 * @create: 2022-06-28 17:09
 * @since 6.0
 */
public class ThreadLocalUtil {
    private static TransmittableThreadLocal<Map<String, Object>> CONTEXT = new TransmittableThreadLocal() {
        /**
         * 使用TransmittableThreadLocal需要重新copy、childValue方法，因为两者都是直接返回参数的，而不是新建对象进行返回
         * 所以当执行异步线程后，main线程修改当前数据，子线程会同步更新
         * @param parentValue
         * @author bigtian
         * @since 6.0
         * @createTime 2022/6/29 11:28
         * @return Object
         */
        @Override
        public Object copy(Object parentValue) {
            if (parentValue instanceof Map) {
                return new LinkedHashMap<>((Map<String, Object>) parentValue);
            }
            return null;
        }

        @Override
        protected Map<String, Object> childValue(Object parentValue) {
            if (parentValue instanceof Map) {
                return new LinkedHashMap<>((Map<String, Object>) parentValue);
            }
            return null;
        }

        @Override
        protected Map<String, Object> initialValue() {
            return new LinkedHashMap<>();
        }
    };


    /**
     * 使用完之后必须调用此方法，否则可能会导致oom
     *
     * @author bigtian
     * @createTime 2022/6/28 17:12
     * @since 6.0
     */
    public static void remove() {
        CONTEXT.remove();
    }

    /**
     * 设置数据
     *
     * @param data
     * @author bigtian
     * @createTime 2022/6/28 17:12
     * @since 6.0
     */
    public static void setData(Map<String, Object> data) {
        CONTEXT.set(data);
    }

    /**
     * 获取数据
     *
     * @param key
     * @return Object
     * @author bigtian
     * @createTime 2022/6/28 17:11
     * @since 6.0
     */
    public static Object getValByKey(String key) {
        return CONTEXT.get().get(key);
    }

    /**
     * 获取所有的数据
     *
     * @return Map<String, Object>
     * @author bigtian
     * @createTime 2022/6/28 17:10
     * @since 6.0
     */
    public static Map<String, Object> getMap() {
        return CONTEXT.get();
    }

    /**
     * 获取租户
     *
     * @return String
     * @author bigtian
     * @createTime 2022/6/29 11:46
     * @since 6.0
     */
    public static String getTendatId() {
        return MapUtil.getStr(getMap(), "tenantid");
    }

    /**
     * 获取当前用户
     *
     * @return String
     * @author bigtian
     * @createTime 2022/6/29 11:46
     * @since 6.0
     */
    public static String getStaffPostCode() {
        return MapUtil.getStr(getMap(), "staffPostCode");
    }
}

```

##### 因为之前我们获取请求头里面的数据提供了一个工具类`UserUtils`，这个操作也避免了需要修改代码

```java
    /**
     * 获取当前登录人的租户
     *优先从请求头里面获取，获取不到则从ThreadLocalUtil获取
     * @return String 租户编码
     * @createTime 2022/5/16 10:35
     * @since 6.0
     */
    public static String getTenantId() {
        HttpServletRequest request = getRequest();
        String tenantid = Optional.ofNullable(request)
                .map(el -> el.getHeader("tenantid"))
                .orElseGet(() -> ThreadLocalUtil.getTendatId());
        return Optional.ofNullable(tenantid).orElseThrow(() -> new BusinessException("请求头中没有tenantid租户"));
    }

```

##### 最后要记得调用`ThreadLocalUtil`的remove方法

```java
//我们项目统一返回的是AjaxResult，调用移除方法，
//准确来说应该要在异步操作的finally块中释放，但是这种方法经过测试，也没问题，但是更加建议手动
public AjaxResult() {
        ThreadLocalUtil.remove();
}
```

###### 如有问题欢迎gitee留言，我会虚心学习