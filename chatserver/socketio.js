let socketio = {}
let sqlQuery = require('./modules/mysql')
let a

function getSocket(server) {
    socketio = require('socket.io')
    socketio.io = socketio(server)
    io = socketio.io
    io.on('connection', function (socket) {

        console.log(socket.id + "建立连接");
        //接收登录事件
        socket.on('login', async data => {
            //先判断是否已有人登录
            let sqlStr = "select * from user where isonline=? and uid=?"
            let result = await sqlQuery(sqlStr, ['true', data.uid])
            if (result.length > 0) {
                socket.to(result[0].socketid).emit('logout', {content: "此账号已在别处登录"})
            }


            //修改数据库信息
            let sqlStr1 = "update user set socketid=?,isonline=? where uid=?"
            let result1 = await sqlQuery(sqlStr1, [socket.id, 'true', data.uid])
            socket.emit('login', {
                state: 'ok',
                content: "登录成功"
            })


            //发送好友列表
            let sqlStr2 = "select * from `user` where uid in " +
                "(select distinct frienduid from `friend` where selfuid = ? and isagree = ?)"
            let result2 = await sqlQuery(sqlStr2, [data.uid, 1])
            socket.emit('users', Array.from(result2))


            //查询未接收的消息
            let sqlStr3 = 'select * from chat where isread = ? and `to` = ?'
            let result3 = await sqlQuery(sqlStr3, ['false', data.uid])
            socket.emit('unreadMsg', Array.from(result3))


            //查询未接受的好友请求
            let sqlStr4 = "select * from friend where isagree = ? and frienduid= ?"
            let result4 = await sqlQuery(sqlStr4,[0,data.uid])
            socket.emit('unaccept', Array.from(result4))


            // 查看信息后修改未读信息的状态
            let sqlStr5 = 'update chat set isread = ? where `to` = ?'
            let result5 = await sqlQuery(sqlStr5, ['true', data.uid])


            //查询群信息
            let sqlStr6 = 'select * from user where isgroup = ?'
            let result6 = await sqlQuery(sqlStr6, ['true'])
            socket.emit('group', Array.from(result6))
            Array.from(result6).forEach((item, index) => {
                socket.join(item.socketid)
            })
        })


        //监听断开连接
        socket.on('disconnect', async function () {
            //修改数据库信息
            let sqlStr = "update user set socketid=?,isonline=? where socketid=?"
            let result = await sqlQuery(sqlStr, [null, null, socket.id])
            console.log(socket.id + "断开连接")
        })


        //监听发送信息
        socket.on('sendMsg', async function (msg) {
            let sqlStr = "select * from user where uid = ? and isonline = ?"
            let result = await sqlQuery(sqlStr, [msg.to, 'true'])
            if (result.length > 0) {


                //如果此人在线，那么直接发送消息
                let toid = result[0].socketid
                socket.to(toid).emit('accept', msg)


                //将聊天记录存放到数据库
                let sqlStr1 = "insert into chat (`from`, `to`, content, `time`, isread, headerimg) value (?, ?, ?, ?, ?, ?)"
                let arr1 = [msg.from, msg.to, msg.content, msg.time, 'true', msg.headerimg]
                await sqlQuery(sqlStr1, arr1)
            } else {


                //将未读消息存放到数据库
                let sqlStr1 = "insert into chat (`from`, `to`, content, `time`, isread, headerimg) value (?, ?, ?, ?, ?, ?)"
                let arr1 = [msg.from, msg.to, msg.content, msg.time, 'false', msg.headerimg]
                await sqlQuery(sqlStr1, arr1)
            }
        })

        //监听请求添加好友
        socket.on('add_friend', async data => {
            let self = data.fromuse
            let friend_uid = data.touid
            let sqlStr = "select * from user where uid = ? and isonline = ?"
            let result = await sqlQuery(sqlStr, [friend_uid, 'true'])
            if (result.length > 0) {
                console.log(a++)
                //如果此人在线，那么直接发送消息
                let toid = result[0].socketid
                socket.to(toid).emit('readded', self)
            }
        })


        //监听同意添加好友
        socket.on('cfm_add', async data => {
            console.log(data)
            let self_uid = data.self_user.uid
            let add_uid = data.add_user.uid
            let sqlStr = "update friend set isagree = ? where selfuid =? and frienduid = ?"
            let result = await sqlQuery(sqlStr,[1,add_uid,self_uid])
            let sqlStr1 = "insert into friend (selfuid, frienduid, isagree) value (?, ?, ?)"
            let result1 = await sqlQuery(sqlStr1,[self_uid,add_uid,1])
        })
    })
}

socketio.getSocket = getSocket
module.exports = socketio