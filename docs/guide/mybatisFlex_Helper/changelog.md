# 更新日志

## 1.4.7.1-RELEASE

- 【修复】sql 预览icon丢失

## 1.4.7-RELEASE

- 【新增】自定义类型映射
- 【新增】支持大部分 mybatis-flex.config 配置
- 【新增】自定义 model 父类
- 【新增】数据源，租户，乐观锁代码生成适配
- 【优化】支持在 service 实现中直接使用 query()、 queryChain()、updateChain()方法的 SQL 预览
- 【优化】支持单元测试预览 SQL

## 1.4.6-RELEASE

- 【新增】对kotlin APT支持
- 【新增】对没有from方法的代码片段进行弱提示
- 【新增】支持mybatis-flex.config的genPath
- 【优化】支持变量SQL预览
- 【优化】表备注换行导致代码生成之后报错

## 1.4.5-RELEASE

- 【新增】代码生成支持Active Record
- 【优化】插件设置界面优化
- 【优化】支持更多方式的SQL预览
- 【修复】SQL预览图标在import也会显示

## 1.4.4-RELEASE

- 【新增】mybatis-flex.config 配置提示
- 【新增】自动生成 APT 文件（解决 mvn clean 之后无法编译）
- 【新增】Lombok链式调用注解@Accessors
- 【新增】SQL 预览（只支持QueryWrapper）
- 【优化】生成代码后自动生成 APT 文件
- 【优化】mybatis-flex.config icon 调整
- 【优化】多模块开发过滤掉没有用的父级项目
- 【优化】生成代码之后自动编译

## 1.4.3-RELEASE

- 【新增】支持 APT 提示（java/Kotlin）
- 【新增】路径自动匹配（需要在设置里面配置，会匹配以配置结束的包名，java和resources下面不能有一样的、否则会覆盖）
- 【新增】增加逻辑删除配置
- 【优化】支持 IDEA2020.2往上版本
- 【优化】提供严格模式切换，支持生成单个文件
- 【优化】清理部分过时 API
- 【优化】优化 APT 编译
- 【修复】修复项目没有 TableDef 会导致IDEA 自身提示没有
