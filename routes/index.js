var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.cookies.user == null){
    res.redirect('/signin');
  }else{
    res.sendfile('views/index.html');
  }
});

/* GET signin page */
router.get('/signin', function(req, res, next){
  res.sendfile('views/signin.html');
});

router.post('/signin', function(req, res, next){
  // if(users[req.body.name]){
  //   res.redirect('/signin');
  // }else{
    res.cookie("user", req.body.name, {maxAge: 1000*60*60*24*30});
    res.redirect('/');
  // }
})
module.exports = router;
