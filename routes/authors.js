var express = require('express');
var router = express.Router();
var fs = require("fs");

router.get('/:username', function(req, res, next) {
  let contents = fs.readFileSync("./data/author.json");
  let jsonContent = JSON.parse(contents);
  let target = req.params.username;
  if(!req.cookies.passKey) {
    let errorObj = {
      "message": "請先登入"
    };
    res.send(errorObj);
    return;
  }
  for(let i = 0; i < jsonContent.length; i++) {
    if(jsonContent[i].username == target) {
      let authorObj = {
        "uesrname": jsonContent[i].username,
        "name": jsonContent[i].name,
        "gender": jsonContent[i].gender,
        "address": jsonContent[i].address
      };
      res.send(authorObj);
      break;
    } else {
      if(i == jsonContent.length - 1) {
        let errorObj = {
          "message": "找不到該使用者帳號"
        };
        res.send(errorObj);
      }
    }
  }
});

router.patch('/:username', function(req, res, next) {
  let contents = fs.readFileSync("./data/author.json");
  let jsonContent = JSON.parse(contents);
  let target = req.params.username;
  let postObj = req.body;
  if(!req.cookies.passKey) {
    let errorObj = {
      "message": "請先登入"
    };
    res.send(errorObj);
    return;
  }
  for(let i = 0; i < jsonContent.length; i++) {
    if(jsonContent[i].username == target) {
      jsonContent[i].name = postObj.name;
      jsonContent[i].password = postObj.password;
      jsonContent[i].gender = postObj.gender;
      jsonContent[i].address = postObj.address;
      let authorObj = {
        "uesrname": jsonContent[i].username,
        "name": jsonContent[i].name,
        "gender": jsonContent[i].gender,
        "address": jsonContent[i].address
      };
      fs.writeFile('./data/author.json', JSON.stringify(jsonContent, null, 4), 'utf-8');
      res.send(authorObj);
      break;
    } else {
      if(i == jsonContent.length - 1) {
        let errorObj = {
          "message": "找不到該使用者帳號"
        };
        res.send(errorObj);
      }
    }
  }
});

module.exports = router;
