/**
 * 管理员相关路由
 */
const express = require('express');
const pool = require('../../pool');

var router = express.Router();

/**
 * API:  GET /admin/login
 * 请求数据: {aname:'xx', apwd:'xxx'} 
 * 返回数据:
 * {code: 200, msg: 'login succ'}
 * {code: 400, msg: 'aname or apwd err'}
 */
router.get('/login/:aname/:apwd', (req, res) => {
    var aname = req.params.aname;
    var apwd = req.params.apwd;
    console.log(aname, apwd);
    var sql = 'SELECT * FROM xfn_admin WHERE aname=? AND apwd=PASSWORD(?)';
    pool.query(sql, [aname, apwd], (err, result) => {
        if (err) throw err;
        console.log(result);
        if (result.length > 0) { //查询到一行数据,登陆成功
            res.send({ code: 200, msg: 'login succ' });
        } else { //没有查询到数据
            res.send({ code: 400, msg: 'aname or apwd err' });
        }
    });

})


/**
* API:  PATCH /admin/login
* 请求数据: {aname:'xx', oldPwd:'xxx',newPwd:'xxx'} 
* 返回数据:
* {code: 200, msg: 'modified succ'}
* {code: 400, msg: 'aname or apwd err'}
* {code: 401, msg: 'apwd not modified'}
*/
router.patch('/', (req, res) => {
    var data = req.body;
    //首先根据aname/oldPwd查询该用户是否存在
    //如果查询到了用户,在修改密码
    console.log(data);
    var sql = 'SELECT * FROM xfn_admin WHERE aname=? AND apwd=PASSWORD(?)';
    pool.query(sql, [data.aname, data.oldPwd], (err, result) => {
        if (err) throw err;
        console.log(result);
        if (result.length == 0) {
            res.send({ code: 400, msg: 'aname or apwd err' });
            return;
        }
        pool.query('UPDATE xfn_admin SET apwd=PASSWORD(?) WHERE aname=?', [data.newPwd, data.aname], (err, reult) => {
            if (err) throw err;
            console.log(result);
            if(result.changedRows>0){ //修改完成
                res.send({code:200,msg:'modified succ'});
            }else{ //新旧密码一样 未作修改
                res.send({code:401,msg:'pwd bot modified'});
            }
        })

    })
})

module.exports = router;
