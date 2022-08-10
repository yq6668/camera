const express = require("express");
// const mongoose = require("mongoose");
const bodyParser = require('body-parser')
const expressSession = require('express-session');
// const User = require('./dbs/user')
const app = express();

//自定义路由模块
var infos = require('./routers/infos.js');
// var user = require('./routers/user.js');



app.use('/', express.static('views/img'));
app.use('/views', express.static('views'));
app.use(expressSession({
  secret: 'password',
  resave: false,
  saveUninitialized: false,
}));

//post中间件
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));
// parse application/json
app.use(bodyParser.json());

app.all('/*', (req, res, next) => {
  if (req.headers.origin == 'http://127.0.0.1:3000') {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Max-Age", 3600)
    next();
  }
});

// mongoose.connect("mongodb://localhost:27017/medicalCommunity", {
//   useNewUrlParser: true
// });
// var db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", function () {
//   console.log("连接成功");
// });


// app.all('/*', (req, res, next) => {
//   let list = ['/user/getcode', '/user/currentUser', '/user/account', '/user/outlogin', '/infos/searchmedicine', '/infos/getnews']
//   if (list.includes(req.url) || req.url.includes('/infos/getmedicines') || req.url.includes('/infos/getonenews')) {
//     next()
//   } else if (req.session.user) {
//     User.find({
//       sessionId: req.session.user.id
//     }).then((list) => {
//       if (list.length === 0) {
//         res.status(200).json({
//           code: -1,
//           msg: '账号信息超时，请刷新后重试！'
//         })
//       } else {
//         next()
//       }
//     })
//   } else {
//     next()
//   }
// });

//注册路由
app.use('/infos', infos);

app.listen(7000, function () {
  console.log('express-server is listening 7000.....');
});