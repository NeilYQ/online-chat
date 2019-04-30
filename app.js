/**
 * 
 * @authors ${ Neil-YQ } 
 * @email ${ 360842060@qq.com }
 * @date    2019-04-29 21:19:17
 * @version $Id$
 */

var app = require("express")(),
    http= require("http").Server(app),
    io  = require("socket.io")(http)
;
// 在线用户
var onlineUser = {},
    onlineCount = 0
;
io.on("connection", function(socket){
  // 监听新用户加入
  socket.on("login", function(obj){
    socket.name = obj.userid;
    // 检查用户在线列表
    if(!onlineUser.hasOwnProperty(obj.userid)){
      onlineUser[obj.userid] = obj.username;
      // 在线人数+1
      onlineCount++;
    }
    // 广播消息
    io.emit("login", {
      onlineUser: onlineUser,
      onlineCount: onlineCount,
      user: obj
    });
    console.log(onlineUser,onlineCount);
  });
  // 监听用户退出
  socket.on("disconnect", function(){
    // 将退出的用户在在线列表删除
    if(onlineUser.hasOwnProperty(socket.name)){
      // 退出用户信息
      var obj = {
        userid: socket.name,
        username: onlineUser[socket.name]
      };
      // 删除
      delete onlineUser[socket.name];
      // 在线人数-1
      onlineCount--;
      // 广播消息
      io.emit("logout", {
        onlineUser: onlineUser,
        onlineCount: onlineCount,
        logoutUser: obj
      });
      console.log(onlineUser,onlineCount);  
    }
  });
  // 监听用户发布的聊天内容
  socket.on("message", function(obj){
    // 向所有客户端推广发布的消息
    io.emit("message", obj);
  });
});

http.listen(8080, function() {
  console.log("listening on *:8080");
});