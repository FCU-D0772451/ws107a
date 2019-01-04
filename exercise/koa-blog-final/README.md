# Koa-Blog

## Start server.


```
$ npm install
$ mongodb  //開啟mongodb server
$ node app.js
```


* 網址:https://blackfloat.com/
## 已完成功能
* 登入
* 註冊
* 文章修改
* 搜尋使用者
* 編輯文章
* 刪除文章
* 發表文章
* 類別顯示
* 聊天室
* 新增大頭貼
* 新增好友
* 搜尋

## 問題
* socket.io 新版的 koa無法使用，只能使用^1.7.4
* Socket.io多人聊天問題
1. 在一個io.on('connection')之中 如果換使用者 socket.on(value) value值無法改變
2. io.on除了把頁面重開或是關掉 不然都不會取消連線
3. 在切換使用者時，出現bug。

