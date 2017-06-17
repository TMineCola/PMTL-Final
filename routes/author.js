var express = require('express');
var router = express.Router();
var fs = require("fs");

router.get('/:username', function(req, res, next) {
  let contents = fs.readFileSync("./data/author.json");
  let jsonContent = JSON.parse(contents);
  let target = req.params.username;
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
          "message": "author not found"
        };
        res.send(errorObj);
      }
    }
  }

});

module.exports = router;
