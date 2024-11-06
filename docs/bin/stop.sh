#停
echo '停止容器'
docker stop vitepress-docs
#删除容器中的
echo '删除容器中的容器'
docker rm vitepress-docs

cnpm i && npm run docs:build

