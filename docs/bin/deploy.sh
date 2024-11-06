
#打成docker 镜像
echo '开始打包docker 镜像'
docker build -t vitepress-docs .
echo '打包完成'

rm -rf ../dist
#启动
echo '启动容器'
docker run -d  -p 89:80  --name vitepress-docs vitepress-docs
echo '启动完成'


