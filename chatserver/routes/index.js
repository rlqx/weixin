let express = require('express');
let router = express.Router();
let sqlQuery = require('../modules/mysql')

router.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');//的允许所有域名的端口请求（跨域解决）
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    res.header("Access-Control-Max-Age", "2592000")
    next();
})
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

//搜索用户
router.get('/api/search', async (req, res) => {
    let search_info = req.query.key
    let sqlStr = "select * from user where uid = ? or username = ?"
    let result = await sqlQuery(sqlStr,[search_info,search_info])
    res.json(result)
})

//添加好友
router.post('/api/add_friend',async (req,res)=>{
    let selfuid = req.body.self_uid
    let frienduid = req.body.friend_uid
    if (selfuid === frienduid) {
        res.send('err')
        return
    }
    let sqlStr = "select * from friend where selfuid = ? and frienduid = ?"
    let result = await  sqlQuery(sqlStr,[selfuid,frienduid])

    if (result.length >0){
        if (result[0].isagree ===0){
            // 已经发送请求
            res.send('repeat')
        }else {
            //已经是好友
            res.send('added')
        }
    }else {
        //直接发送请求并且修改数据库数据
        res.send('success')
        let sqlStr = "insert into friend (selfuid, frienduid, isagree) value (?, ?, ?)"
        let result = sqlQuery(sqlStr,[selfuid,frienduid,0])
    }
})

//登录
router.post('/api/login', async (req, res) => {
    let userid = req.body.user.userid
    let password = req.body.user.password
    let sqlStr = "select * from user where uid = ?"
    let result1 = await sqlQuery(sqlStr, [userid])
    let result = result1[0]
    if (result1.length > 0) {
        if (result.password === password) {
            res.json({
                user: result
            })
        } else {
            res.send('err')
        }
    } else {
        res.send('err')
    }
})

//注册
router.post('/api/registered', async (req, res) => {
    let userid = req.body.user.userid
    let password = req.body.user.password
    let username = req.body.user.username
    let sqlStr = "select * from user where uid = ?"
    let result = await sqlQuery(sqlStr, [userid])
    if (result.length > 0) {
        res.json('repeat')
    } else {
        let sqlStr1 = "insert into user (uid, password,username) value (?, ?, ?)"
        let result1 = await sqlQuery(sqlStr1, [userid, password, username])
        res.json('success')
    }
})

module.exports = router;
