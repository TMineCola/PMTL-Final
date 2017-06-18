var express = require('express');
var router = express.Router();
var fs = require("fs");

//一開始沒有多想, 寫完才發現很多地方可以用function處理... ex: 算文章最後的id, 驗證登入, 驗證cookie, 比對author ...
//pardon me please~ QQ 

//get full posts
router.get('/', function(req, res, next) {
  let contents = fs.readFileSync("./data/posts.json");
  let jsonContent = JSON.parse(contents);
  res.send(jsonContent);
});

//create a post with login status
router.post('/', function(req, res, next) {
  let contents = fs.readFileSync("./data/posts.json");
  let authorContents = fs.readFileSync("./data/author.json");
  let jsonContent = JSON.parse(contents);
  let jsonAuthorContent = JSON.parse(authorContents);
  let postObj = req.body;
  let postID = 0;
  if(!req.cookies.passKey) {
    let errorObj = {
      "message": "請先登入"
    };
    res.send(errorObj);
    return;
  }
  for(let i = 0; i < jsonContent.length; i++) {
    if(jsonContent[i].id > postID) {
      postID = jsonContent[i].id;
    }
  }
  for(let i = 0; i < jsonAuthorContent.length; i++) {
    if(req.cookies.passKey == jsonAuthorContent[i].username) {
      let date = new Date();
      let dataObj = {
        "id": postID + 1,
        "title": postObj.title,
        "content": postObj.content,
        "created_at": date.toISOString(),
        "updated_at": date.toISOString(),
        "author": {
          "username": jsonAuthorContent[i].username,
          "name": jsonAuthorContent[i].name,
          "gender": jsonAuthorContent[i].gender,
          "address": jsonAuthorContent[i].address
        },
        "tags": postObj.tags
      };
      jsonContent[jsonContent.length] = dataObj;
      fs.writeFile('./data/posts.json', JSON.stringify(jsonContent, null, 4), 'utf-8');
      res.send(dataObj);
      break;
    } else if(jsonAuthorContent.length - 1 == i) {
      let errorObj = {
        "message": "找不到使用者帳號"
      };
      res.send(errorObj);
    }
  }
});

//get target id post
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
          "message": "找不到該貼文"
        }
        res.send(errorObj);
      }
    }
  }
});

//patch for update
router.patch('/:id', function(req, res, next) {
  let contents = fs.readFileSync("./data/posts.json");
  let authorContents = fs.readFileSync("./data/author.json");
  let jsonContent = JSON.parse(contents);
  let jsonAuthorContent = JSON.parse(authorContents);
  let target = req.params.id;
  let postObj = req.body;
  if(!req.cookies.passKey) {
    let errorObj = {
      "message": "請先登入"
    };
    res.send(errorObj);
    return;
  }
  for(let i = 0; i < jsonContent.length; i++) {
    if(jsonContent[i].id == target) {
      for(let j = 0; j < jsonAuthorContent.length; j++) {
        if(jsonAuthorContent[j].username == jsonContent[i].author.username) {
          let date = new Date();
          jsonContent[i].title = postObj.title;
          jsonContent[i].content = postObj.content;
          jsonContent[i].updated_at = date.toISOString();
          jsonContent[i].tags = postObj.tags;
          fs.writeFile('./data/posts.json', JSON.stringify(jsonContent, null, 4), 'utf-8');
          res.send(jsonContent[i]);
          break;
        } else if(jsonAuthorContent.length - 1 == j) {
          let errorObj = {
            "message": "could not found the author information of that post"
          };
          res.send(errorObj);
          break;
        }
      }
    } else if(jsonContent.length - 1 == i && !res.headersSent) {
      let errorObj = {
        "message": "找不到該貼文"
      };
      res.send(errorObj);
      break;
    }
  }
});

router.delete('/:id', function(req, res, next) {
  let contents = fs.readFileSync("./data/posts.json");
  let authorContents = fs.readFileSync("./data/author.json");
  let jsonContent = JSON.parse(contents);
  let jsonAuthorContent = JSON.parse(authorContents);
  let target = req.params.id;
  let postObj = req.body;
  if(!req.cookies.passKey) {
    let errorObj = {
      "message": "請先登入"
    };
    res.send(errorObj);
    return;
  }
  for(let i = 0; i < jsonContent.length; i++) {
    if(jsonContent[i].id == target) {
      for(let j = 0; j < jsonAuthorContent.length; j++) {
        if(jsonAuthorContent[j].username == jsonContent[i].author.username) {
          if(req.cookies.passKey == jsonContent[i].author.username) {
            delete jsonContent[i];
            jsonContent.splice(i, 1);
            fs.writeFile('./data/posts.json', JSON.stringify(jsonContent, null, 4), 'utf-8');
            let count = 0;
            for(let k = 0; k < jsonContent.length; k++) {
              if(jsonContent[k].author.username == req.cookies.passKey) {
                count++;
              }
            }
            let successObj = {
              "remain": count 
            };
            res.send(successObj);
            break;
          } else {
            let errorObj = {
              "message": "目前登入使用者與貼文者不符, 請確認登入的帳號"
            };
            res.send(errorObj);
            break;
          }
        } else if(jsonAuthorContent.length - 1 == j) {
          let errorObj = {
            "message": "找不到符合該貼文的作者資訊"
          };
          res.send(errorObj);
          break;
        }
      }
    } else if(jsonContent.length - 1 == i && !res.headersSent) {
      let errorObj = {
        "message": "找不到該貼文"
      };
      res.send(errorObj);
      break;
    }
  }
});

module.exports = router;