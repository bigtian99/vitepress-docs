# 常见问题及解决方案

## 1、 setSelectedIndex: 0 out of bounds

::: warning 解决方案

遇到这种情况一般是根目录没有`pom.xml`文件（maven），在项目根目录新建这个文件，或者idea直接打开对应的模块，根目录必须要这个文件，否则IDEA识别不到，Gradle项目也是新建对应的` build.gradle.kts`文件

 ::: 

## 2、Velocity could not be initialized!

::: warning 解决方案

推荐升级 IDEA 版本，因为IDEA 低版本有Velocity的日志功能，但是高版本已经移除了，优先支持` IDEA 高版本`

 ::: 
## 3、SQL预览提示 文件名或者扩展名太长

![输入图片说明](https://foruda.gitee.com/images/1710314119520653508/15788670_542693.png)

::: warning 解决方案

用户反馈在.idea/workspace.xml文件里keyToString下添加：`"dynamic.classpath": "true",`就可以解决

 ::: 
