var express = require('express');
var router = express.Router();
var fs = require("fs");

router.get('/', function(req, res, next) {
  let contents = fs.readFileSync("./data/posts.json");
  let jsonContent = JSON.parse(contents);
  res.send(jsonContent);
});

router.post('/', function(req, res, next) {
  let contents = fs.readFileSync("./data/posts.json");
  let jsonContent = JSON.parse(contents);
  let postObj = req.body;
  let date = new Date();
  /*var storageObj = {
    "id": 1,
    "title": postObj[0].title,
    "content": postObj[0].content,
    "created_at": date.toISOString(),
    "updated_at": date.toISOString(),
    "author": {
      "username": 'yuer',
      "name": 'Yuer Lee',
      "gender": 'm',
      "address": '南投縣埔里鎮大學路1號'
    },
    "tags": ['至理名言', '短文集']
  };*/
});

router.get('/:id', function(req, res, next) {
  let contents = fs.readFileSync("./data/posts.json");
  let jsonContent = JSON.parse(contents);
  let target = req.params.id;
  for(let i = 0; i < jsonContent.length; i++) {
    if(jsonContent[i].id == target) {
      res.send(jsonContent[i]);
      break;
    } else {
      if(i == jsonContent.length - 1) {
        let errorObj = {
          "message": "post not found"
        }
        res.send(errorObj);
      }
    }
  }
});

//update
router.patch('/:id', function(req, res, next) {
  let contents = fs.readFileSync("./data/posts.json");
  let jsonContent = JSON.parse(contents);
  let target = req.params.id;
  let postObj = req.body;
  if(req.cookies.passKey == 'minecola') {
    for(let i = 0; i < jsonContent.length; i++) {
      if(jsonContent[i].id == target) {
        let date = new Date();
        jsonContent[i].title = postObj.title;
        jsonContent[i].content = postObj.content;
        jsonContent[i].tags = postObj.tags;
        jsonContent[i].updated_at = date.toISOString();
        fs.writeFile('./data/posts_test.json', JSON.stringify(jsonContent), 'utf-8');
        res.send(jsonContent[i]);
        break;
      } else {
        if(i == jsonContent.length - 1) {
          let errorObj = {
            "message": "post not found"
          }
          res.send(errorObj);
        }
      }
    }
  } else {
    let errorObj = {
        "message": "尚未登入"
    };
    res.send(errorObj);
  }
});

module.exports = router;