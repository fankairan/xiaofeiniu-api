/**
 * 菜品类别相关的路由
 */

//创建路由器
const express = require('express');
const pool = require('../../pool');

var router = express.Router();


/**
 * API:  GET/admin/category
 * 含义 客户端获取所有的菜品类别,按编号升序排列
 * 返回值形如：
 *     [{cid:1,cname:'..'},{...}]
 */
router.get('/', (req, res) => {
    var sql = "SELECT * FROM xfn_category ORDER BY cid";
    pool.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
})

/**
* API:  DELETE/admin/category/:cid
* 含义 客户端获取所有的菜品类别,按编号升序排列
* 返回值形如：
*     {cid:200,msg:'1 category deleted'},
*     {cid:400,msg:'0 category deleted'}
*/
router.delete('/:cid', (req, res) => {
    var cid = req.params.cid;
    //注意：删除菜品类别之前必须先把属于该类别的菜品的类别编号设置为NULL
    pool.query('UPDATE xfn_dish SET categoryId=NULL WHERE categoryId=?', [cid], (err, result) => {
        if (err) throw err;
        //至此指定类别的菜品已经修改完毕
        var sql = 'DELETE FROM xfn_category WHERE cid=?';
        pool.query(sql, [cid], (err, result) => {
            if (err) throw err;
            //获取DELETE语句在数据库中影响的行数
            if (result.affectedRows > 0) {
                res.send({ code: 200, msg: '1 category deleted' });
            } else {
                res.send({ code: 400, msg: '0 catagory deleted' });
            }
        })

    })



})

/**
* API: POST/admin/category
* 请求参数{cname:'xxx'}
* 含义 客户端获取所有的菜品类别,按编号升序排列
* 返回值形如：
*     {cid:200,msg:'1 category added',cid:x}
*/
router.post('/', (req, res) => {
    var data = req.body;  //形如{cname: 'xxx'}
    var sql = 'INSERT INTO xfn_category SET ?';

    pool.query(sql, data, (err, result) => {  //注意此处SQL语句的简写
        if (err) throw err;
        res.send({ code: 200, msg: '添加类别成功！', cid:result.insertId });
    })

})

/**
* API: PUT/admin/category
* 请求参数{cid:xx,cname:'xxx'}
* 含义:根据菜品类别编号修改类别
* 返回值形如：
*     {cid:200,msg:'1 category modified'}
*     {cid:400,msg:'0 category modified'}
*     {cid:401,msg:'0 category modified,no modification'}
*/
router.put('/', (req, res) => {
    var data = req.body;   //请求数据{cid:xx, cname:'xx'}
    //TODO:  此处可以对数据进行验证
    var sql = 'UPDATE xfn_category SET ? WHERE cid=?';
    pool.query(sql, [data, data.cid], (err, result) => {
        if (err) throw err;
        console.log(result);
        if (result.changedRows > 0) { //实际更新了一行
            res.send({ code: 200, msg: '修改菜品成功！' })
        } else if (result.affectedRows == 0) {
            res.send({ code: 400, msg: '类别不存在！' });
        } else if (result.changedRows == 0 && result.affectedRows == 1) {
            res.send({ code: 401, msg: '类别相同' });
        }
    })
})



module.exports = router;