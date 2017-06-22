var express = require('express');
var router = express.Router();
var fs = require("fs");

router.get('/', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', req.headers['host']);
  res.setHeader('Access-Control-Allow-Headers', req.headers['accept']);
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  let contents = fs.readFileSync("./data/author.json");
  let jsonContent = JSON.parse(contents);
  if(req.cookies.passKey) {
    for(let i = 0; i < jsonContent.length; i++) {
      if(jsonContent[i].username == req.cookies.passKey) {
        let authorObj = {
          "uesrname": jsonContent[i].username,
          "name": jsonContent[i].name,
          "gender": jsonContent[i].gender,
          "address": jsonContent[i].address
        };
        res.send(authorObj);
        break;
      } else {
        let errorObj = {
          "message": "Cookie使用者名稱錯誤"
        };
        res.send(errorObj);
        break;
      }
    }
  } else {
    let errorObj = {
      "message": "請先登入"
    };
    res.send(errorObj);
    return;
  }
});

router.post('/', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', req.headers['host']);
  res.setHeader('Access-Control-Allow-Headers', req.headers['accept']);
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  let postObj = req.body;
  let username = postObj.username;
  let password = postObj.password;
  let contents = fs.readFileSync("./data/author.json");
  let jsonContent = JSON.parse(contents);
  for(let i = 0; i < jsonContent.length; i++) {
    if(jsonContent[i].username == username && jsonContent[i].password == password) {
      let authorObj = {
        "uesrname": jsonContent[i].username,
        "name": jsonContent[i].name,
        "gender": jsonContent[i].gender,
        "address": jsonContent[i].address
      };
      res.cookie('passKey' , jsonContent[i].username).send(authorObj);
    } else if(jsonContent.length - 1 == i) {
        let errorObj = {
            "message": "帳號密碼錯誤"
        };
        res.send(errorObj);
    }
  }
});

router.put('/', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', req.headers['host']);
  res.setHeader('Access-Control-Allow-Headers', req.headers['accept']);
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  if(req.cookies.passKey){
    let successObj = {
      "message": "成功登出"
    };
    res.clearCookie('passKey').send(successObj);
  } else {
    let errorObj = {
        "message": "尚未登入"
    };
    res.send(errorObj);
  }

});

module.exports = router;
