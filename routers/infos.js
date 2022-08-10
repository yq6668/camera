const express = require('express');
const fs = require('fs');
// const multer = require('multer')
var router = express.Router();


// // 设置随机名字
// var fullName = ''

// // 思路
// // 上传内容并储存——1.设置存储的地方——2.设置存储时的名字{1.获取原来名字的后缀，2.再重新命名}
// var headerConfig = multer.diskStorage({
//     // destination目的地
//     destination: 'views/icon',
//     // fliename 文件名 后面跟函数,函数有三个参数
//     // file为当前上传的图片 
//     filename: function (req, file, callback) {
//         // 先获取原来图片的后缀名
//         //  1.选找到图片的名字,并进行分割
//         var nameArray = file.originalname.split('.')
//         // 长度是从1开始的 索引是从0开始的
//         // [1,2,3,4]长度4 -1 [nameArray.length - 1]索引
//         var type = nameArray[nameArray.length - 1]

//         // 新的名字 = 随机数组.照片类型
//         var imageName = Math.floor(Math.random() * 10000000000000000000) + nameArray[0] + '.' + type;
//         fullName = imageName

//         // 设置回调的内容,参数1：错误信息，参数2：图片新的名字
//         callback(null, imageName)

//     }
// })
// var upload = multer({
//     storage: headerConfig
// })

// //上传图片
// router.post('/subimg', upload.single('file'), (req, res) => {
//     res.status(200).json({
//         code: 0,
//         msg: '成功'
//     })
// })

router.post('/subimg', (req, res) => {
    let data = req.body.src
    var path = 'views/icon/' + Date.now() + '.png';//从app.js级开始找--在我的项目工程里是这样的
    var base64 = data.replace(/^data:image\/\w+;base64,/, "");//去掉图片base64码前面部分
    var dataBuffer = Buffer.from(base64, 'base64'); //把base64码转成buffer对象，
    console.log('dataBuffer是否是Buffer对象：' + Buffer.isBuffer(dataBuffer));
    fs.writeFile(path, dataBuffer, function (err) {//用fs写入文件
        if (err) {
            console.log(err);
            res.status(200).json({
                code: 1,
                msg: '失败'
            })
        } else {
            console.log('写入成功！');
            res.status(200).json({
                code: 0,
                msg: '成功'
            })
        }
    })
})

module.exports = router