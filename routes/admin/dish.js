/**
 * 菜品相关路由
 */
const express = require('express');
const pool = require('../../pool');
const multer = require('multer');
const fs = require('fs');

var router = express.Router();
var upload = multer({
    dest: 'tmp/'    //指定客户端上传的文件临时储存路径
})


/**
 * 
 * API  GET /admin/dish
 * 获取所有的菜品(按类别进行分类)
 * 返回数据:
 * [
 *  {cid:1,cname:'肉类',dishList:[{},{},{}]},
 *  {cid:2,cname:'肉类',dishList:[{},{},{}]}
 * ]
 * */

router.get('/', (req, res) => {
    //查询所有的菜品类别
    var sql = 'SELECT cid,cname FROM xfn_category';

    pool.query(sql, (err, result) => {
        if (err) throw err;
        //循环遍历每个菜品类型,查询该类别下有哪些菜品
        var categoryList = result;//菜品类别数组
        var count = 0;
        for (let c of categoryList) {
            pool.query('SELECT * FROM xfn_dish WHERE categoryId=? ORDER BY did DESC', [c.cid], (err, result) => {
                if (err) throw err;
                c.dishLish = result;
                //必须保证所有的类别下的菜品都查询完成才能发发送响应消息--这些查询都是异步执行的
                //解决办法
                count++;
                if (count == categoryList.length) {
                    res.send(categoryList);
                }
            })
        }

    })
})


/**
 * POST   /admin/dish/image
 * 请求参数：
 * 接收客户端上传的菜品照片，保存在服务器上，返回该图片的服务器上的随机文件名
 * */
router.post('/image', upload.single('dishImg'), (req, res) => {
    console.log(req.file);  //客户端上传的文件
    console.log(req.body);  //客户端随同图片提交的文字数据
    //把客户端上传的文件从临时目录移到永久的图片路径下
    var tmpFile = req.file.path;
    var suffix = req.file.originalname.substring
        (req.file.originalname.lastIndexOf('.'));
    console.log(suffix);
    var newFile = randFileName(suffix);//目标文件名

    fs.rename(tmpFile, 'img/dish/' + newFile, () => {
        res.send({ code: 200, msg: 'upload succ', fileName: newFile })//把临时文件转移
    })
})

//生成一个随机文件名
//参数: suffix表示要生成的文件名中的后缀
function randFileName(str) {
    var time = new Date().getTime();
    var num = Math.floor(Math.random() * (10000 - 1000) + 1000);//4位随机数
    return time + '-' + num + str;
}




/**
* POST  /admin/dish/
* 请求参数：{title:'xx' ,imgUrl:'...jpg' ,price:xx ,detail:'',categoryId:xx}
* 添加一个新的菜品
* 输出信息：
*  {code:200,msg:'dish added succ',dishId:46}
* */
router.post('/', (req, res) => {
    pool.query('INSERT INTO xfn_dish SET ?', req.body, (err, result) => {
        if (err) throw err;
        res.send({ code: 200, msg: 'dish added succ', dishId: result.insertId });
    })
})



/**
 * DELETE /admin/dish/:did
 * 根据指定的菜品编号删除该菜品
 * 输出数据：
 *     {code:200 ,msg:'dish deleted succ'}
 *     {code:400 ,msg:'dish not exists'}
*/




/**
 * PUT /admin/dish
 * 请求参数：{did:xx , title:'xx' ,imgUrl:'...jpg',price:xx ,      detail:'xx' ,categoryId:''}
 */





module.exports = router;

