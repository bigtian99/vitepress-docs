# 基于nginx:1.20镜像
FROM m.daocloud.io/docker.io/library/nginx:1.20
# 将dist文件中的内容复制到 /usr/share/nginx/html/ 这个目录下面
COPY docs/.vitepress/dist/ /usr/share/nginx/html/dist/
# 用本地的 nginx.conf 配置来替换nginx镜像里的默认配置
COPY docs/bin/nginx.conf /etc/nginx/nginx.conf

