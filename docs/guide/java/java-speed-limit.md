
:::tip 提示
突发奇想，想要在 Java 中实现一个速度限制器，限制方法的下载速度，于是就有了这篇文章。
:::


##### 1、编写计算延时时间类

```java

public class SpeedLimiter {

    /** 速度上限(KB/s), 0=不限速 */
    private int maxRate = 1024;
    private long getMaxRateBytes(){
        return this.maxRate * 1024;
    }
    private long getLessCountBytes() {
        long lcb = getMaxRateBytes() / 10;
        if (lcb < 10240) lcb = 10240;
        return lcb;
        //return 1024l * 20;
    }
    public SpeedLimiter(int maxRate) {
        this.setMaxRate(maxRate);
    }
    public synchronized void setMaxRate(int maxRate){
        this.maxRate = Math.max(maxRate, 0);
    }
    private long totalBytes = 0;
    private long tmpCountBytes = 0;
    private final long lastTime = System.currentTimeMillis();
    /**
     * @author Ethan
     * @date 2022-11-18
     * @param len       send bytes
     * @description 计算线程延时
     * sendTime(Ms) = nowTime - lastTime;
     * workTime(Ms) = (totalBytes*1000)/(maxRate*1024)
     * delayTime(Ms) = workTime-sendTime
     **/
    public synchronized void delayNextBytes(int len) {
        totalBytes += len;
        tmpCountBytes += len;
        //未达到指定字节数跳过...
        if (tmpCountBytes < getLessCountBytes()) {
            return;
        }
        long sendTime =  System.currentTimeMillis() - lastTime;
        long workTime = (totalBytes * 1000) / getMaxRateBytes();
        long delayTime = workTime - sendTime;
        if (delayTime > 0) {
            try {
                Thread.sleep(delayTime);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            tmpCountBytes = 0;
        }
    }
}
```

##### 2、编写测试demo

```java

import cn.hutool.core.io.IoUtil;
import cn.hutool.core.lang.Assert;
import org.apache.commons.io.IOUtils;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.nio.file.Files;

@RestController
@RequestMapping(value = "/api/v1/download")
public class DownloadController {

    //设置一个本地文件用于下载测试, 大小约几百MB
    final String localFile = "/Users/daijunxiong/Desktop/sxmj.apk";

    /**
     * @author Ethan
     * @date 2022-11-18
     * @description 普通下载测试, 不限速!
     **/
    @GetMapping("getFile")
    public void getFile(HttpServletResponse response) {
        File file = this.getLocalFile(response, localFile);
        if (file == null || !file.exists()) {
            return;
        }
        InputStream is = null;
        OutputStream out = null;
        try {
            is = new FileInputStream(file);
            out = response.getOutputStream();
            IOUtils.copyLarge(is, out);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            IOUtils.closeQuietly(is);
            IOUtils.closeQuietly(out);
        }
    }

    /**
     * @author Ethan
     * @date 2022-11-18
     * @description 限速下载测试, xxx KB/s
     **/
    @GetMapping("limit")
    public void limit(
            @RequestParam(value = "speed", defaultValue = "500", required = false) int speed,
            HttpServletResponse response
    ) {
        File file = this.getLocalFile(response, localFile);
        if (file == null || !file.exists()) {
            return;
        }
        BufferedInputStream bis = null;
        OutputStream out = null;

        try {
            bis = new BufferedInputStream(Files.newInputStream(file.toPath()));
            out = response.getOutputStream();
            byte[] buffer = new byte[1024];
            int length;
            SpeedLimiter speedLimiter = new SpeedLimiter(speed);
            while ((length = bis.read(buffer)) != -1) {
                out.write(buffer, 0, length);
                speedLimiter.delayNextBytes(length);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            IOUtils.closeQuietly(bis);
            IOUtils.closeQuietly(out);
        }
    }

    private File getLocalFile(HttpServletResponse response, String fullPath) {
        File file = new File(fullPath);
        Assert.isTrue(file.exists(), "文件不存在");
        String fileName = file.getName();
        response.setHeader("Content-Length", String.valueOf(file.length()));
        response.setHeader("Content-Type", "application/x-zip-compressed");
        response.setHeader("Content-Disposition", "attachment; filename=" + fileName);
        return file;
    }


}
```

