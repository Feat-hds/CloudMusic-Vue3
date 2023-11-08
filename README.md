## 项目介绍

基于 vue3 配合elementui组建实现的网页网易云音乐前端，

（移动端页面处于开发中）

后端使用的是 

- [网易云音乐api](https://github.com/Binaryify/NeteaseCloudMusicApi)

主要完成的功能包括

- 音乐播放器相关功能：包括音乐播放，进度条跳转，歌词滚动和显示、歌词进度跳转
- 首页内容：包括轮播图、推荐歌单、歌曲、mv、电台等
- 搜索功能：包括歌曲mv等搜索功能、搜索记录、热搜排行、分页等
- 收藏、点赞、权限判定等
- 评论显示
- 用户、歌曲、歌单等信息详情展示
- 用户登录，包括账号密码、二维码、短信登录方式（推荐使用二维码登录）
- 私人电台

## 开发环境

- windows
- node v18.17.1

## 安装启动

该项目后端api依赖

[网易云音乐api](https://github.com/Binaryify/NeteaseCloudMusicApi)

首先进入网易云api目录下打开命令行，输入以下命令

```
node app.js
```

保持网易云api服务打开的情况下

然后打开新的命令行进入项目根目录，输入以下命令

```
npm install --registry=https://registry.npm.taobao.org
```

依赖安装完成后，输入

```
npm run serve
```

编译完成后访问

```
http://localhost:8080 
```

进行访问

（建议使用chrome内核浏览器理论）

## 技术栈

- ###### vue3

- ###### vuex 

- ###### vue-router 

- ###### element-plus 

- ###### axios

