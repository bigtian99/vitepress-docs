# 微信小程序部分功能示例

## 1、微信登录

> 登录步骤：
>
> 1、调用微信平台开放能力获取用户信息
>
> 2、在获取用户信息的回调方法中获取用户登录凭证
>
> 2、拿到用户登录凭证请求后端，后端返回openid唯一标识（如果认证了微信开放平台，则unionid是在当前账户下所有应用（公总号、小程序、微信登录等）唯一编码）

> uniapp代码

```vue
<template>
	<view>
		<view class="" style="position: relative; bottom: -200px;">
			<tm-button openType="getUserInfo" @getUserInfo="login" icon="icon-weixin" icon-size="45" block width="80%">微信登录</tm-button>
		</view>
		<tm-message ref="toast"></tm-message>
	</view>
</template>

<script>
import rest from '@/commons/login/login.js';
export default {
	data() {
		return {
			show: false,
			user: {}
		};
	},
	methods: {
		 login(e) {
			let user = e.userInfo;
			let that = this;
			let code =  this.getWeChatCode().then(code => {
				rest.getOpenId(code).then(res => {
					user.openId = res.data;
					that.user = user;
					that.show = true;
					that.role('teac');
				});
			});
		},
//获取用户登录凭证
		getWeChatCode() {
			return new Promise((resolve, reject) => {
				uni.login({
					provider: 'weixin',
					success: res => {
						resolve(res.code);
					}
				});
			});
		}
	}
};
</script>

<style>
.logo {
	margin-top: 300rpx;
	/* margin-left: 60rpx; */
}
</style>

```

`获取openid地址，appid和secret换成自己小程序的`

```sh	
  https://api.weixin.qq.com/sns/jscode2session?appid=${club.bigtian.app-id}&secret=${club.bigtian.app-secret}&grant_type=authorization_code&js_code=
```

> java代码

```java
    /**
     * 获取openId
     *
     * @param code 微信获取openId开放能力code
     * @return String openId
     * @author bigtian
     * @createTime 2022/5/26 10:42
     * @since 6.0
     */
    public static String getOpenId(String code) {
        String resultStr = HttpUtil.get(customConfig.getOpenIdUrl() + code);
        JSONObject result = JSON.parseObject(resultStr);
        log.info("微信返回的数据：" + result);
        return result.getString("openid");
    }
```

## 2、订阅消息

#### 前置条件

> 1、创建消息推送模板

![image-20211019103331407](./assets/image-20211019103331407.png)

![image-20211019105149937](./assets/image-20211019105149937.png)

![image-20211019105308263](./assets/image-20211019105308263.png)

> 2、获取template_id和字段属性

![image-20211019111958260](./assets/image-20211019111958260.png)

#### API参数说明

#### 获取微信token API

##### 请求地址

```text
GET https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
```

##### 请求参数

| 属性       | 类型   | 默认值 | 必填 | 说明                                                         |
| :--------- | :----- | :----- | :--- | :----------------------------------------------------------- |
| grant_type | string |        | 是   | 填写 client_credential                                       |
| appid      | string |        | 是   | 小程序唯一凭证，即 AppID，可在「[微信公众平台](https://mp.weixin.qq.com/) - 设置 - 开发设置」页中获得。（需要已经成为开发者，且帐号没有异常状态） |
| secret     | string |        | 是   | 小程序唯一凭证密钥，即 AppSecret，获取方式同 appid           |

##### 返回值

##### Object

返回的 JSON 数据包

| 属性         | 类型   | 说明                                           |
| :----------- | :----- | :--------------------------------------------- |
| access_token | string | 获取到的凭证                                   |
| expires_in   | number | 凭证有效时间，单位：秒。目前是7200秒之内的值。 |
| errcode      | number | 错误码                                         |
| errmsg       | string | 错误信息                                       |

**errcode 的合法值**

| 值    | 说明                                                         | 最低版本 |
| :---- | :----------------------------------------------------------- | :------- |
| -1    | 系统繁忙，此时请开发者稍候再试                               |          |
| 0     | 请求成功                                                     |          |
| 40001 | AppSecret 错误或者 AppSecret 不属于这个小程序，请开发者确认 AppSecret 的正确性 |          |
| 40002 | 请确保 grant_type 字段值为 client_credential                 |          |
| 40013 | 不合法的 AppID，请开发者检查 AppID 的正确性，避免异常字符，注意大小写 |          |

##### 返回数据示例

正常返回

```json
{"access_token":"ACCESS_TOKEN","expires_in":7200}
```

错误时返回

```json
{"errcode":40013,"errmsg":"invalid appid"}
```

##### 订阅消息发送API

##### 请求地址

```text
POST https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=ACCESS_TOKEN
```

##### 请求参数

| 属性                                  | 类型   | 默认值 | 必填 | 说明                                                         |
| :------------------------------------ | :----- | :----- | :--- | :----------------------------------------------------------- |
| access_token / cloudbase_access_token | string |        | 是   | [接口调用凭证](https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/access-token/auth.getAccessToken.html) |
| touser                                | string |        | 是   | 接收者（用户）的 openid                                      |
| template_id                           | string |        | 是   | 所需下发的订阅模板id                                         |
| page                                  | string |        | 否   | 点击模板卡片后的跳转页面，仅限本小程序内的页面。支持带参数,（示例index?foo=bar）。该字段不填则模板无跳转。 |
| data                                  | Object |        | 是   | 模板内容，格式形如 { "key1": { "value": any }, "key2": { "value": any } } |
| miniprogram_state                     | string |        | 否   | 跳转小程序类型：developer为开发版；trial为体验版；formal为正式版；默认为正式版 |
| lang                                  | string |        | 否   | 进入小程序查看”的语言类型，支持zh_CN(简体中文)、en_US(英文)、zh_HK(繁体中文)、zh_TW(繁体中文)，默认为zh_CN |

##### 返回值

##### Object

返回的 JSON 数据包

| 属性    | 类型   | 说明     |
| :------ | :----- | :------- |
| errcode | number | 错误码   |
| errmsg  | string | 错误信息 |

**errcode 的合法值**

| 值    | 说明                                                         | 最低版本 |
| :---- | :----------------------------------------------------------- | :------- |
| 40003 | touser字段openid为空或者不正确                               |          |
| 40037 | 订阅模板id为空不正确                                         |          |
| 43101 | 用户拒绝接受消息，如果用户之前曾经订阅过，则表示用户取消了订阅关系 |          |
| 47003 | 模板参数不准确，可能为空或者不满足规则，errmsg会提示具体是哪个字段出错 |          |
| 41030 | page路径不正确，需要保证在现网版本小程序中存在，与app.json保持一致 |          |

##### 接口限制

次数限制：开通支付能力的是3kw/日，没开通的是1kw/日。

##### 请求示例

```json
{
  "touser": "OPENID",
  "template_id": "TEMPLATE_ID",
  "page": "index",
  "miniprogram_state":"developer",
  "lang":"zh_CN",
  "data": {
      "number01": {
          "value": "339208499"
      },
      "date01": {
          "value": "2015年01月05日"
      },
      "site01": {
          "value": "TIT创意园"
      } ,
      "site02": {
          "value": "广州市新港中路397号"
      }
  }
}
```

##### 订阅消息参数值内容限制说明

| 参数类别              | 参数说明 | 参数值限制                                                   | 说明                                                         |
| :-------------------- | :------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| thing.DATA            | 事物     | 20个以内字符                                                 | 可汉字、数字、字母或符号组合                                 |
| number.DATA           | 数字     | 32位以内数字                                                 | 只能数字，可带小数                                           |
| letter.DATA           | 字母     | 32位以内字母                                                 | 只能字母                                                     |
| symbol.DATA           | 符号     | 5位以内符号                                                  | 只能符号                                                     |
| character_string.DATA | 字符串   | 32位以内数字、字母或符号                                     | 可数字、字母或符号组合                                       |
| time.DATA             | 时间     | 24小时制时间格式（支持+年月日），支持填时间段，两个时间点之间用“~”符号连接 | 例如：15:01，或：2019年10月1日 15:01                         |
| date.DATA             | 日期     | 年月日格式（支持+24小时制时间），支持填时间段，两个时间点之间用“~”符号连接 | 例如：2019年10月1日，或：2019年10月1日 15:01                 |
| amount.DATA           | 金额     | 1个币种符号+10位以内纯数字，可带小数，结尾可带“元”           | 可带小数                                                     |
| phone_number.DATA     | 电话     | 17位以内，数字、符号                                         | 电话号码，例：+86-0766-66888866                              |
| car_number.DATA       | 车牌     | 8位以内，第一位与最后一位可为汉字，其余为字母或数字          | 车牌号码：粤A8Z888挂                                         |
| name.DATA             | 姓名     | 10个以内纯汉字或20个以内纯字母或符号                         | 中文名10个汉字内；纯英文名20个字母内；中文和字母混合按中文名算，10个字内 |
| phrase.DATA           | 汉字     | 5个以内汉字                                                  | 5个以内纯汉字，例如：配送中                                  |

符号表示除中文、英文、数字外的常见符号，不能带有换行等控制字符。 时间格式支持HH:MM:SS或者HH:MM。 日期包含年月日，为y年m月d日，y年m月、m月d日格式，或者用‘-’、‘/’、‘.’符号连接，如2018-01-01，2018/01/01，2018.01.01，2018-01，01-01。 每个模板参数都会以类型为前缀，例如第一个数字模板参数为number01.DATA，第二个为number02.DATA

例如，模板的内容为

```text
姓名: {{name01.DATA}}
金额: {{amount01.DATA}}
行程: {{thing01.DATA}}
日期: {{date01.DATA}}
```

则对应的json为

```text
{
  "touser": "OPENID",
  "template_id": "TEMPLATE_ID",
  "page": "index",
  "data": {
      "name01": {
          "value": "某某"
      },
      "amount01": {
          "value": "￥100"
      },
      "thing01": {
          "value": "广州至北京"
      } ,
      "date01": {
          "value": "2018-01-01"
      }
  }
}
```

### 🌰代码示例

#### uniapp代码示例

```js
subscribe(){
			uni.requestSubscribeMessage({
        //模板id
			  tmplIds: ['XH3vvlMnCGs88_mlGvk0HsbTsRnaLhxlqIboB2KVnA8'],
			  success (res) {
				  console.log(res);
			  }
			})
		}
```

> 效果图：（用户必须点击允许，才能发送成功，每次点击只管一次，除非点击“总是保持以上选择，不在询问”）

<img src="./assets/1601634625153_.pic_hd.jpg" alt="1601634625153_.pic_hd" style="zoom: 25%;" />

<img src="./assets/1611634625478_.pic_hd.jpg" alt="1611634625478_.pic_hd" style="zoom:25%;" />

##### 🌰java代码示例

```java
 public static String getToken() {
          String appId="小程序AppId";
        String secret="小程序secret";
        String url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="+appId+"&secret="+secret;
        String body = HttpRequest.get(url).execute().body();
        String token = JSON.parseObject(body).getString("access_token");
        return token;
    }

public void sendMsg(){
     HashMap<String, Object> map = new HashMap<>();
        HashMap<String, Object> dataMap = new HashMap<>();
        //openid
        map.put("touser","openid");
        //模板id
        map.put("template_id","模板id");
        dataMap.put("character_string2",new WeChatMessageTemplate("12312"));
        dataMap.put("character_string1",new WeChatMessageTemplate("231321"));
        map.put("data",dataMap);
        String body = HttpRequest.post("https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token="+getToken())
                .body(JSON.toJSONString(map))
                .execute()
                .body();
  //发送成功{"errcode":0,"errmsg":"ok","msgid":2097683633284153344}
 //发送失败{"errcode":43101,"errmsg":"user refuse to accept the msg rid: 616e6385-74ba0201-4a349921"}报错原因用户没有同意收取订阅信息

        System.out.println(body);
}
```

## 3、微信支付

> 准备工作：
>
> 1、首先要去微信支付认证 [微信支付](https://pay.weixin.qq.com/index.php/core/home/login?return_url=%2F)
>
> 2、申请API证书、设置APIv2/3秘钥（证书需下载）

![image-20220706100323839](./assets/image-20220706100323839.png)



> uniapp代码

```vue
<template>
	<view >
	<button class="login-btn" @click="pay">微信支付</button>
	</view>
</template>

<script>
export default {
	data() {
		return {

		};
	},
	onLoad() {},
	methods: {

		pay() {
			var orderData = {
				productName: '商品名称',
				money: 3,
				orderNo: 'NOTL23423423423',
				openId: 'ox2zt4qQac6YSuUYQS_Z7BkHaLXg'
			};
			uni.request({
				url: 'https://www.bigtian.club/weChat/pay',
				method: 'POST',
				data: orderData,
				success({ data }) {
					uni.requestPayment({
						provider: 'wxpay',
						...data.data,
						success: function(res) {
							console.log('success:' + JSON.stringify(res));
						},
						fail: function(err) {
							console.log('fail:' + JSON.stringify(err));
						}
					});
				}
			});
		}
	}
};
</script>

<style>

</style>

```



> java代码

```java

/**
 * @program: dining_room
 * @description: 微信扫码验证
 * @author: BigTian
 * @create: 2020-08-27 11:14
 */
@RestController
@RequestMapping("/weChat")
@Slf4j
public class WeChatController {
    @Autowired
    private CustomConfig customConfig;

    /**
     * 支付通知回调
     *
     * @param data
     * @throws IOException
     * @throws GeneralSecurityException
     */
    @PostMapping("/payCallback")
    public void payCallback(@RequestBody Map data) throws IOException, GeneralSecurityException {

        JSONObject jsonObject = JSON.parseObject(JSON.toJSONString(data.get("resource")));
      //56F987911F7F3785B698C6C0154D6B48:APIv3密钥 
        AesUtil aesUtil = new AesUtil("56F987911F7F3785B698C6C0154D6B48".getBytes(StandardCharsets.UTF_8));
        String str = aesUtil.decryptToString(jsonObject.getString("associated_data").getBytes(StandardCharsets.UTF_8), jsonObject.getString("nonce").getBytes(StandardCharsets.UTF_8), jsonObject.getString("ciphertext"));
       log.info(str)
    }


    @RequestMapping(value = "/pay")
    @ApiOperation(value = "微信支付签名")
    public AjaxResult pay(HttpServletRequest req, @RequestBody ProductInfoVO vo) throws Exception {
        String ip = IpUtil.getIpAddr(req);
        log.info("客户端请求ip:{}", ip);
        String nonceStr = UUID.randomUUID().toString().replace("-", "");
        String data = getData();
        String token = getToken("POST", nonceStr, HttpUrl.parse(customConfig.getPayUrl()), data);
        //获取prepayId
        String result = HttpRequest.post(customConfig.getPayUrl())
                .header("Content-Type", "application/json")
                .header("Authorization", token)
                .body(data)
                .execute()
                .body();
        Map<Object, Object> mapInfo = new HashMap<>();
        String time = System.currentTimeMillis() + "";
        mapInfo.put("timeStamp", time);
        mapInfo.put("nonceStr", nonceStr);
        log.info("微信支付签名返回结果:{}", result);
        String prepayId = JSON.parseObject(result).getString("prepay_id");
        String paySign = getPaySign(nonceStr, prepayId, time);
        mapInfo.put("paySign", paySign);
        mapInfo.put("package", "prepay_id=" + prepayId);
        mapInfo.put("signType", "RSA");
        AjaxResult ajaxResult = AjaxResult.success("");
        ajaxResult.setData(mapInfo);
        String params = JSON.toJSONString(ajaxResult);
        //添加记录
        log.info("校验参数:{}", params);
        return ajaxResult;

    }

     /**
     * 生成支付数据
     * @author bigtian
     * @since 6.0
     * @createTime 2022/7/6 11:23
     * @return  String
     */
    String getData() {
        HashMap<String, Object> params = new HashMap<>();
        //商户号
        params.put("mchid", customConfig.getMchId());
        //订单号
        params.put("out_trade_no", cn.hutool.core.lang.UUID.randomUUID().toString().replace("-", ""));
        params.put("appid", customConfig.getAppId());
        //商品描述
        params.put("description", "早点");
        //回调地址
        params.put("notify_url", "https://www.bigtian.club/weChat/payCallback");
        HashMap<String, Object> amount = new HashMap<>();
        //金额 1=0.01
        amount.put("total", 1);
        //CNY=人民币，只支持CNY
        amount.put("currency", "CNY");
        params.put("amount", amount);
        HashMap<String, Object> payer = new HashMap<>();
        //付款用户
        payer.put("openid", "ox2zt4qQac6YSuUYQS_Z7BkHaLXg");
        params.put("payer", payer);
        return JSON.toJSONString(params);
    }

    @ApiOperation(value = "生成微信签名")
    public String getPaySign(String nonceStr, String prepayId, String time) {
        StringBuilder builder = new StringBuilder();
        builder.append(customConfig.getAppId() + "\n");
        builder.append(time + "\n");
        builder.append(nonceStr + "\n");
        builder.append("prepay_id=" + prepayId + "\n");
        String sign = sign(builder.toString().getBytes(StandardCharsets.UTF_8));
        return sign;
    }

 
    String getToken(String method, String nonceStr, HttpUrl url, String body) throws Exception {
        long timestamp = System.currentTimeMillis() / 1000;
        String message = buildMessage(method, url, timestamp, nonceStr, body);
        String signature = sign(message.getBytes("utf-8"));
        String token = "WECHATPAY2-SHA256-RSA2048 mchid=\"" + customConfig.getMchId() + "\","
                + "nonce_str=\"" + nonceStr + "\","
                + "timestamp=\"" + timestamp + "\","
                + "serial_no=\"" + customConfig.getSerialNo() + "\","
                + "signature=\"" + signature + "\"";
        return token;
    }

    /**
     * SHA256withRSA加密
     *
     * @param message
     * @return
     */
    String sign(byte[] message) {
        Signature sign = null;
        try {
            sign = Signature.getInstance("SHA256withRSA");
            String absolutePath = ResourceUtils.getFile("cert/apiclient_key.pem").getCanonicalPath();
            sign.initSign(getPrivateKey(absolutePath));
            sign.update(message);
            return Base64.getEncoder().encodeToString(sign.sign());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    String buildMessage(String method, HttpUrl url, long timestamp, String nonceStr, String body) {
        String canonicalUrl = url.encodedPath();
        if (url.encodedQuery() != null) {
            canonicalUrl += "?" + url.encodedQuery();
        }
        return method + "\n"
                + canonicalUrl + "\n"
                + timestamp + "\n"
                + nonceStr + "\n"
                + body + "\n";
    }

    /**
     * 获取私钥。
     *
     * @param filename 私钥文件路径  (required)
     * @return 私钥对象
     */
    public static PrivateKey getPrivateKey(String filename) throws IOException {
        String content = new String(Files.readAllBytes(Paths.get(filename)), "utf-8");
        try {
            String privateKey = content.replace("-----BEGIN PRIVATE KEY-----", "")
                    .replace("-----END PRIVATE KEY-----", "")
                    .replaceAll("\\s+", "");

            KeyFactory kf = KeyFactory.getInstance("RSA");
            return kf.generatePrivate(
                    new PKCS8EncodedKeySpec(Base64.getDecoder().decode(privateKey)));
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("当前Java环境不支持RSA", e);
        } catch (InvalidKeySpecException e) {
            throw new RuntimeException("无效的密钥格式");
        }
    }

    /**
     * 退款
     */
    @RequestMapping("/backMoney")
    public AjaxResult backMoney() throws Exception {
      String backMoneyUrl = customConfig.getBackMoneyUrl();
        Map<String, Object> data = new HashMap<>();
        //商户订单号
        data.put("out_trade_no", "BGIT121775l201201318");
        //商户退款单号
        data.put("out_refund_no", "TKBGIT121775l201201318");
        Map<String, Object> amount = new HashMap<>();
        //退款金额
        amount.put("refund", 1);
        //原订单金额
        amount.put("total", 1);
        //退款币种	目前只支持人民币：CNY。
        amount.put("currency", "CNY");
        data.put("amount", amount);
        String nonceStr = UUID.randomUUID().toString().replace("-", "");
        String body = JSON.toJSONString(data);
        String token = getToken("POST", nonceStr, HttpUrl.parse(backMoneyUrl), body);
        String result = HttpRequest.post(backMoneyUrl)
                .header("Content-Type", "application/json")
                .header("Authorization", token)
                .body(body)
                .execute().body();
        log.info(result);
        return AjaxResult.success("");
    }

    /**
     * 查询退款
     *
     * @return
     * @throws Exception
     */
    @RequestMapping("/queryBackMoney")
    public AjaxResult queryBackMoney() throws Exception {
           String nonceStr = UUID.randomUUID().toString().replace("-", "");
        String url = customConfig.getBackMoneyUrl() + "/TKBGIT121775l201201318";
        Map<String, Object> data = new HashMap<>();
        //退款编码
        data.put("out_refund_no", "TKBGIT121775l201201318");
        String token = getToken("GET", nonceStr, HttpUrl.parse(url), "");
        String result = HttpRequest.get(url)
                .header("Authorization", token)
                .execute()
                .body();
        log.info(result);
        return null;
    }

    /**
     * 加密
     *
     * @return
     */
    public static String signature(String nonceStr, String orderStr) throws Exception {
        String strA = "";
        SortedMap<String, Object> map = new TreeMap<>();
        map.put("mch_appid", "wx2ca4d18a3ce31a36");
        map.put("mchid", "1602317152");
        map.put("nonce_str", nonceStr);
        map.put("partner_trade_no", orderStr);
        map.put("openid", "ox2zt4qQac6YSuUYQS_Z7BkHaLXg");
        map.put("check_name", "FORCE_CHECK");
        map.put("amount", 1);
        map.put("desc", "理赔");
        map.put("re_user_name", "代xx");
        for (Map.Entry<String, Object> entry : map.entrySet()) {
            if (StrUtil.isNotBlank(strA)) {
                strA += "&";
            }
            strA += entry.getKey() + "=" + entry.getValue();
        }
        strA += "&key=0442cb8043784947b63642320c9f8334";
        System.out.println(SecureUtil.md5(strA).toUpperCase());

        return SecureUtil.md5(strA).toUpperCase();
    }

}

```

```java

/**
 * @program: spring-boot-uniapp
 * @description: 回调解密
 * @author: bigtian
 * @create: 2022-07-06 11:03
 * @since 4.9.0
 */
public class AesUtil {
    private static final String TRANSFORMATION = "AES/GCM/NoPadding";

    private static final int KEY_LENGTH_BYTE = 32;
    private static final int TAG_LENGTH_BIT = 128;

    private final byte[] aesKey;

    public AesUtil(byte[] key) {
        if (key.length != KEY_LENGTH_BYTE) {
            throw new IllegalArgumentException("无效的ApiV3Key，长度必须为32个字节");
        }
        this.aesKey = key;
    }

    public String decryptToString(byte[] associatedData, byte[] nonce, String ciphertext)
            throws GeneralSecurityException {
        try {
            SecretKeySpec key = new SecretKeySpec(aesKey, "AES");
            GCMParameterSpec spec = new GCMParameterSpec(TAG_LENGTH_BIT, nonce);

            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            cipher.init(Cipher.DECRYPT_MODE, key, spec);
            cipher.updateAAD(associatedData);
            return new String(cipher.doFinal(Base64.getDecoder().decode(ciphertext)), StandardCharsets.UTF_8);

        } catch (NoSuchAlgorithmException | NoSuchPaddingException e) {
            throw new IllegalStateException(e);
        } catch (InvalidKeyException | InvalidAlgorithmParameterException e) {
            throw new IllegalArgumentException(e);
        }
    }
}

```

> ​	配置文件

```yaml
club:
  bigtian:
    #    回调地址
    notify-url: https://api.bigtian.club
    #    付款方式
    trade-type: JSAPI
    # 支付接口(v3版本)
    pay-url: https://api.mch.weixin.qq.com/v3/pay/transactions/jsapi
    #     微信小程序id
    app-id: 
    #    商户id（微信支付个人信息中的登录账号）
    mch-id: 
    #    证书序列号
    serial-no: 
    #      退款url
    back-money-url: https://api.mch.weixin.qq.com/v3/refund/domestic/refundsaccess_token=

```

## 4、发送微信公众号消息

> 前言
>
> 由于微信小程序改版之后，开发者不能主动推送消息给用户，所以可以让用户关注公众号，进行消息推送
>
> [公众号测试申请地址](https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login)

#### 1、复制测试号相关配置

![image-20220712135738168](./assets/image-20220712135738168.png)

#### 2、关注测试公众号

`微信号就是openid`

![image-20220712135810953](./assets/image-20220712135810953.png)

#### 3、定义消息模板

![image-20220712135859014](./assets/image-20220712135859014.png)

###### 格式如下

![image-20220712140045183](./assets/image-20220712140045183.png)

#### 4、Java代码编写

###### 演示项目以spring boot为准

##### 	1、配置yml

```yaml
club:
  bigtian:
    #微信公众号appId
    public-app-id: 
    #    微信公众号secret
    public-secret: 
    #    获取用户信息
    user-info-url: https://api.weixin.qq.com/cgi-bin/user/info?access_token={}&openid={}&lang=zh_CN
    #    获取微信token
    wechat-token-url: https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${club.bigtian.public-app-id}&secret=${club.bigtian.public-secret}
    #    发送公众号模板消息
    template-url: https://api.weixin.qq.com/cgi-bin/message/template/send?access_token={}

```

##### 2、获取公众号token

```java
    /**
     * 获取微信token
     */
    public String getWeChatToken() {
        String token = (String) redisTemplate.opsForValue().get(RedisConstant.WECHAT_TOKEN);
        if (StrUtil.isEmpty(token)) {
            JSONObject result = JSON.parseObject(HttpUtil.get(customConfig.getWechatTokenUrl()));
            token = result.getString("access_token");
            redisTemplate.opsForValue().set(RedisConstant.WECHAT_TOKEN, token, result.getLong("expires_in")-10L, TimeUnit.SECONDS);
        }
        log.info("微信token:{}", token);
        return token;
    }
```

##### 3、编写数据实体

```java
@Data
public class TemplateInfo {
    //发送人
    private String touser;
    //模板id
    private String template_id;

    //自定义参数
    private Map data;

    public static Map item(String text, String color) {
        return Dict.create()
                .set("value",text) //实际的值
                .set("color",color); //字体颜色
    }
}
```

##### 4、发送公众号消息

```java
 	/**
     * 发送公众号模板消息
     *
     * @param accessToken 第二步获取的Tken
     */
    public void sendTemplateMessage(String accessToken) {
        String url = StrUtil.format(customConfig.getTemplateUrl(), accessToken);
        TemplateInfo info = new TemplateInfo();
        info.setTouser("oMWWI5mIDD3dkKfX2-3henRRJ8kg");
        info.setTemplate_id("ms-GMzRs14h9qrJ8KzsuYK9gACOU-W1COCXSxVBRrao");
        Map<String, Object> data = new HashMap<>();
        data.put("account", TemplateInfo.item("时间淡忘一切", "#173177"));
        data.put("loginTime", TemplateInfo.item("2021-11-30 15:32:34", "#173177"));
        data.put("remark", TemplateInfo.item("感谢使用，请注意账号安全", "#173177"));
        info.setData(data);
        String result = HttpUtil.post(url, JSON.toJSONString(info));
        log.info("返回数据:", result);
    }
```

