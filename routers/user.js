const express = require('express');
var router = express.Router();
const User = require('../dbs/user')

//验证码
var svgCaptcha = require('svg-captcha');

//生成验证码svg
router.post("/getcode", (req, res) => {
  var captcha = svgCaptcha.create({
    // 翻转颜色  
    inverse: false,
    // 字体大小  
    fontSize: 36,
    // 噪声线条数  
    noise: 2,
    // 宽度  
    width: 78,
    // 高度  
    height: 38,
  });
  // 保存到session,忽略大小写  
  req.session.code = captcha.text.toLowerCase();
  res.setHeader('Content-Type', 'image/svg+xml');
  // res.write(String(captcha.data));
  // res.end()
  res.status(200).json({
    status: "ok",
    msg: String(captcha.data)
  });
})

//登录请求
router.post('/account', (req, res) => {
  const {
    password,
    username,
    type,
    captcha
  } = req.body;
  if (req.session.code === captcha.toLowerCase()) {
    User.find({
      username,
      password
    }).then((user) => {
      if (user.length === 1) {
        let date = Date.now();
        let rund = Math.ceil(Math.random() * 100000)
        req.session.user = {
          id: date + '' + rund,
          username: user[0].username,
          current: user[0].current
        }
        User.findOneAndUpdate({
          username,
          password,
        }, {
          $set: {
            sessionId: date + '' + rund
          }
        }).then(() => {
          res.send({
            status: 'ok',
            type,
            currentAuthority: user.current,
          });
        })
      } else {
        res.send({
          status: 'error',
          type,
          currentAuthority: 'guest',
        });
      }
    })
  } else {
    res.send({
      status: 'error2',
      type,
      currentAuthority: 'guest',
    });
  }
})

//获取用户登录信息
router.get('/currentUser', async (req, res) => {
  if (!req.session.user) {
    res.status(401).send({
      data: {
        isLogin: false,
      },
      errorCode: '401',
      errorMessage: '请先登录！',
      success: true,
    });
    return;
  }
  let user = await User.find({
    sessionId: req.session.user.id
  })
  if (user.length == 0) {
    req.session.user = null;
    req.session.destroy();
    res.status(401).send({
      data: {
        isLogin: false,
      },
      errorCode: '401',
      errorMessage: '登录信息已过期！',
      success: true,
    });
    return;
  }
  let icon = "http://localhost:7000/blue.jpg"
  if (req.session.user.current === "admin") {
    icon = "http://localhost:7000/red.jpg"
  } else if (req.session.user.current === "pharmacy") {
    icon = "http://localhost:7000/green.jpg"
  }
  res.send({
    success: true,
    data: {
      name: req.session.user.username,
      avatar: icon,
      access: req.session.user.current,
    },
  });
})

//修改密码
router.post('/modify', (req, res) => {
  if (req.session.user) {
    if (req.session.code === req.body.captcha) {
      User.findOneAndUpdate({
        username: req.session.user.username,
        password: req.body.oldpassword
      }, {
        $set: {
          password: req.body.newpassword
        }
      }).then((e) => {
        if (e === null) {
          res.status(200).json({
            status: "error",
            msg: "原密码错误"
          });
        } else {
          res.status(200).json({
            status: "ok",
            msg: "修改密码成功"
          });
        }
      }, (err) => {
        res.status(200).json({
          status: "error2",
          msg: err.message
        });
      })
    } else {
      res.status(200).json({
        status: "error3",
        msg: "验证码错误"
      });
    }
  }
})

//退出登录
router.post("/outlogin", (req, res) => {
  req.session.user = null;
  req.session.destroy();
  res.status(200).json({
    code: 0,
    msg: '退出成功'
  });
});

//新增人员和修改
router.post('/addpeople', async (req, res) => {
  const {
    _id,
    type,
    ...msg
  } = req.body
  if (req.session.user && req.session.user.current == "admin") {
    if (type == "add") {
      const med = await User.find({
        username: req.body.username
      })
      if (med.length) {
        res.status(200).json({
          code: -1,
          msg: '账号名称已经存在'
        })
        return
      }
      const newUser = new User(msg)
      newUser.save().then((id, err) => {
        if (err) {
          res.status(200).json({
            code: -1,
            msg: '添加失败'
          })
          return
        }
        res.status(200).json({
          code: 0,
          msg: '添加成功'
        })
      })
    } else if (type == "change") {
      User.findByIdAndUpdate(_id, {
        $set: {
          username: msg.username,
          current: msg.current,
          department: msg.department
        }
      }, {
        new: true
      }).then((msg) => {
        res.status(200).json({
          code: 0,
          msg: '修改成功'
        })
      }, (err) => {
        res.status(200).json({
          code: -1,
          msg: '修改失败'
        })
      })
    }
  } else {
    res.status(200).json({
      code: -1,
      msg: '添加失败'
    })
  }
})

//获取非管理员的用户列表
router.post('/getpeople', (req, res) => {
  if (req.session.user && req.session.user.current == "admin") {
    User.find({
      current: {
        $in: ['doctor', 'pharmacy']
      }
    }).then((data) => {
      res.status(200).json({
        code: 0,
        msg: data
      })
    })
  } else {
    res.status(200).json({
      code: -1,
      msg: '获取失败'
    })
  }
})

//删除非管理员的用户
router.post('/deletepeople', (req, res) => {
  if (req.session.user && req.session.user.current == "admin") {
    User.deleteOne({
      _id: req.body.id
    }).then(() => {
      res.status(200).json({
        code: 0,
        msg: '删除成功'
      })
    })
  } else {
    res.status(200).json({
      code: -1,
      msg: '获取失败'
    })
  }
})

module.exports = router