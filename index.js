/**
 * 小肥牛扫码点餐项目-API子系统
 * 
 */
console.log('准备启动API服务器...')
console.log(new Date().toLocaleString());
// const PORT=5050;
const PORT = 8090;
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const categoryRouter = require('./routes/admin/category');
const adminRouter = require('./routes/admin/admin');
const dishRouter = require('./routes/admin/dish');
const settingsRouter=require('./routes/admin/setting');
const tableRouter=require('./routes/admin/table');


//创建HTTP应用服务器
var app = express();
app.listen(PORT, () => {
    console.log('API服务器启动成功,监听端口:' + PORT + ' ...');
})

//使用中间件
app.use(cors());
//app.use(bodyParser.urlencoded({}))
//把application/x-www-form-urlencoded格式的请求主体数据解析出来放入req.body属性
app.use(bodyParser.json());
//把application/json

//挂载路由器
app.use('/admin/category', categoryRouter);
app.use('/admin', adminRouter);
app.use('/admin/dish', dishRouter);
app.use('/admin/settings',settingsRouter);
app.use('/admin/table',tableRouter);