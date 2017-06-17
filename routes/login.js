var express = require('express');
var router = express.Router();
var fs = require("fs");

router.post('/', function(req, res, next) {
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
