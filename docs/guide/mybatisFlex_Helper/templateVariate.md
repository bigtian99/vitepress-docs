# 模板变量释义

## 

|              变量名               |             释义             |            备注            |
|:------------------------------:|:--------------------------:| :------------------------: |
|    config.controllerPackage    |      controller 生成包名       |                            |
|    config.interfacePackage     |       service 接口生成包名       |                            |
|         interfaceName          |        service 文件名         |                            |
|      config.modelPackage.      |          实体类生成包名           |                            |
|           modelName            |            实体类名            |                            |
|         qualifiedName          |         统一返回对象全路径          |                            |
|         config.swagger         |        开启 swagger支持        |                            |
|        config.swagger3         |        开启 swagger支持        |                            |
|         table.comment          |            表备注             |                            |
|             author             |             作者             |                            |
|             since              |             版本             |                            |
|          requestPath           |            请求地址            |                            |
|         controllerName         |        controller类名        |                            |
|       interfaceVariable        |        service 变量名         |                            |
|        table.columnList        |           表字段列表            |                            |
|        column.fieldName        |          java 字段名          |                            |
|         column.comment         |           表字段备注            |                            |
|         column.notNull         |          表字段是否为空           |                            |
|          resultClass           |           统一返回类            |                            |
|       config.genericity        |            是否泛型            |                            |
|       column.primaryKey        |            是否主键            |                            |
|       config.methodName        |          统一返回的方法名          |                            |
|      config.mapperPackage      |        mapper生成包路径         |                            |
|       config.implPackage       |       service实现生成包路径       |                            |
|          config.cache          |         是否开启缓存方法生成         |                            |
|           mapperName           |          mapper类名          |                            |
|          config.data           |          @Data注解           |                            |
|      config.activeRecord       |          是否开启ar模式          |                            |
|   config.allArgsConstructor    |   @AllArgsConstructor注解    |                            |
|    config.noArgsConstructor    |    @NoArgsConstructor注解    |                            |
| config.requiredArgsConstructor | @RequiredArgsConstructor注解 |                            |
|         config.builder         |         @Builder注解         |                            |
|        config.accessors        |        @Accessors注解        |                            |
|        importClassList         |         实体需要导入的类集合         |          字段类型          |
|       config.dataSource        |           数据源配置            |                            |
|         table.onInsert         |          实体类插入监听           |                            |
|         table.onUpdate         |          实体类修改监听           |                            |
|          table.onSet           |          实体类set监听          |                            |
|         config.idType          |           ID生成类型           |                            |
|          column.name           |            表字段名            |                            |
|       column.logicDelete       |           是否逻辑删除           |                            |
|         column.tenant          |             租户             |                            |
|         column.version         |            乐观锁             |                            |
|       column.insertValue       |        数据插入时，字段默认值         | 如：createTime默认当前时间 |
|       column.updateValue       |        数据修改时，字段默认值         | 如：updateTime默认当前时间 |
|        column.fieldType        |          java字段类型          |                            |
|          column.type           |           jdbc类型           |                            |
|          table.schema          |           数据库名称            |                            |
|           createTime           |           代码生成时间           |                            |