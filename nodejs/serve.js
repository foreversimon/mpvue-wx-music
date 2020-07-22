const app = require('express')()
const mysql = require('mysql')
const fetch = require('node-fetch')
const bodyParser =require('body-parser')
const WXBizDataCrypt = require('./WXBizDataCrypt')
const crypto = require('crypto') // 使用sha1加密
const jwt = require('jsonwebtoken')
// const session = require('express-session')
// const cookieParser = require('cookie-parser')

app.set("view engine","ejs")
app.use(bodyParser.urlencoded({ extended: false }))
// app.use(cookieParser())
// app.use(session({
//   secret: 'helloWorld',
//   name: 'user',
//   cookie: {maxAge: 1000 * 60 * 10},
//   resave: false,
//   saveUninitialized: true
// }))

var appId = 'wx08bb3bb0a9b5b7a0'

// 允许跨域
app.all('*', function(req, res, next) {  
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "X-Requested-With") 
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS")  
  res.header("X-Powered-By",' 3.2.1')  
  res.header("Content-Type", "application/json;charset=utf-8")
  next()
})

// get请求
app.get('/', (request, response) => {
  connection.query('SELECT * from song', function (err, result) {
    if (err) {
      response.send('err')
    }
    response.json(result)
  })
})

// 请求登陆 返回token
app.post('/user', (request, response) => {
  let code = request.body.code// 前端获取值
  let encryptedData = request.body.encryptedData// 前端获取值
  let iv = request.body.iv// 前端获取值
  let signature = request.body.signature// 前端获取值
  let rawData = request.body.rawData// 前端获取值
  http.get(`https://api.weixin.qq.com/sns/jscode2session?appid=wx08bb3bb0a9b5b7a0&secret=57363c40bf60a2d65add3ff99ba26c3c&js_code=` + code + `&grant_type=authorization_code`)
    .then((res) => {
      let sessionKey = res.session_key// 请求api获得的
      let pc = new WXBizDataCrypt(appId, sessionKey)
      let data = pc.decryptData(encryptedData, iv)
      let openId = data.openId
      if (data.watermark.appid == appId) {
        let signature2 = rawData + sessionKey
        if (signature == crypto.createHash('sha1').update(signature2).digest('hex')) {
          let content = {
            code,
            sessionKey,
            openId
          }
          let secret = 'abc'
          let token = jwt.sign(content, secret, {
            expiresIn: 60 * 60 * 1
          })
          connection.query('SELECT * from userinfo where openid="'+openId+'"', (err, result) => {
            if (err) {
              console.log(err)
            }
            if (result == 0) {
              connection.query('INSERT into userinfo(openid,token) values("'+openId+'","'+token+'")', (err, result) => {
                if (err) {
                  console.log(err)
                }
                response.send({
                  'msg': '登陆成功',
                  'token': token
                })
              })
            } else {
              connection.query('UPDATE userinfo set token="'+token+'" where openid="'+openId+'"', (err, result) => {
                if (err) {
                  console.log(err)
                }
                response.send({
                  'msg': '修改成功',
                  'token': token
                })
              })
            }
          })
        } else {
          response.send('err')
        }
      }
    })
})

// post请求 验证token时效性
app.post('/test', (request, response) => {
  let ntoken = request.headers.ntoken
  console.log(ntoken)
  if (ntoken) {
    jwt.verify(ntoken, 'abc', function (err, decoded) {
      let nowDate = (Date.now() / 1000)
      setDate = decoded.exp
      if (nowDate > setDate) {
        response.send({
          'code': '0',
          'msg': 'token已过期'
        })
      } else {
        response.send({
          'code': '1',
          'msg': 'token未过期'
        })
      }
    })
  }
})

// post请求 处理用户歌单信息
app.post('/song', (request, response) => {
  let ntoken = request.headers.ntoken
  if (ntoken) {
    jwt.verify(ntoken, 'abc', function (err, decoded) {
      let openid = decoded.openId
      connection.query('SELECT * from userinfo where openid="' + openid + '"', (err, result) => {
        if(result == 0){
          console.log('err')
        } else {
          connection.query('SELECT * from song_sheet where openid="' + openid + '"', (err, result) => {
            var dataString = JSON.stringify(result)
            var data = JSON.parse(dataString)
            console.log(data)
            response.send(data)
          })
        }
      })
    })
  }
})

// post请求 添加听过的歌曲
app.post('/upSong', (request, response) => {
  let ntoken = request.headers.ntoken
  let { name, love, singer } = request.body
  if (ntoken) {
    jwt.verify(ntoken, 'abc', function (err, decoded) {
      let openid = decoded.openId
      let songSheet1 = []
      let songSheet2 = []
      
      connection.query('SELECT * from song_sheet where openid="'+openid+'" && name="'+name+'"', (err, result) => {
        if (result == 0) {
          connection.query('INSERT into song_sheet(openid,name,singer,love) values("'+openid+'","'+name+'","'+singer+'","'+love+'")', (err, result) => {
            connection.query('SELECT * from song_sheet where openid="'+openid+'"', (err, result) => {
              songSheet1 = result
              console.log('abc='+result)
              console.log('成功添加')
              response.send(songSheet1)
            })
          })
        } else {
          let reslove = result[0].love
          let dataString = JSON.stringify(result)
          let data = JSON.parse(dataString)
          let id = data[0].id
          let times = data[0].listenTimes
          console.log('reslove='+reslove)
          if (love == reslove) {
            times++
          }
          console.log(id)
          connection.query('UPDATE song_sheet set love="'+love+'", listenTimes='+times+' where id='+id, (err, result) => {
            console.log('成功修改love字段')
            connection.query('SELECT * from song_sheet where openid="'+openid+'"', (err, result) => {
              songSheet2 = result
              console.log(songSheet2)
              response.send(songSheet2)
            })
          })
        }
      })
    })
  }
})

// post请求 处理删除听过歌曲
app.post('/del', (request, response) => {
  let ntoken = request.headers.ntoken
  let name = request.body.name
  if (ntoken) {
    jwt.verify(ntoken, 'abc', function (err, decoded) {
      let nowDate = Date.now() / 1000
      let openid = decoded.openId
      if (nowDate < decoded.exp) {
        connection.query('delete from song_sheet where openid="'+openid+'" && name="'+name+'"', (err, result) => {
          console.log('删除成功')
          connection.query('select * from song_sheet where openid="'+openid+'"', (err, result) => {
            console.log(result+"-----"+err)
            response.send(result)
          })
        })
      }
    })
  }
})

//监听8888端口
var Server = app.listen(8888, function () {

})
console.log('Server running at http://127.0.0.1:8888/')

// 数据库连接
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'test',
  port: 3308,
  password: '123456',
  database: 'test'
})
connection.connect()

class ajax {
  get (url) {
    return new Promise((resolve, reject) => {
      fetch(url, {
        methods: 'GET'
      })
        .then((res) => {
          return res.json()
        })
        .then((data) => {
          return resolve(data)
        })
        .catch((err) => {
          return reject(err)
        })
    })
  }
}
var http = new ajax()
