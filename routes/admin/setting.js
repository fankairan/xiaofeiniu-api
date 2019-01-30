/**
 * 全局设置
 */

const express=require('express');
const pool=require('../../pool');

var router=express.Router();

/**
 * GET  /admin/settings
 * 获取所有的全局设置信息
 * 返回数据：
 *  {appName:'xx' ,adminUrl:'xx',appUrl:'xx',...}
 * */
 
router.get('/',(req,res)=>{
    var sql='SELECT * FROM xfn_settings LIMIT 1';
    pool.query(sql,(err,result)=>{
        if(err) throw err;
        res.send(result[0]);
    })
})

/**
 * PUT  /admin/settings
 * 获取所有的全局设置信息
 * 返回数据：
 *  {appName:'xx' ,adminUrl:'xx',appUrl:'xx',...}
 * */
 
router.put('/',(req,res)=>{
    var sql='UPDATE xfn_settings SET ?';
    pool.query(sql,req.body,(err,result)=>{
        if(err) throw err;
        res.send({code:200,msg:'settings updated succ'});
    })
})

module.exports=router;