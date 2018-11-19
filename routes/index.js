var express = require('express');
var router = express.Router();

//get homepage
router.get('/', function(req, res){
  console.log(req.user);
  console.log(req.isAuthenticated());
  res.render('index');
});

router.get('/login', function(req, res){
  res.render('login');
});

router.get('/register', function(req, res){
  res.render('register');
});

router.get('/reset', function(req, res){
  res.render('reset');
});

router.get('/profile', function(req, res){
  var data = {age: 23, hobbies: ['Canoeing', 'Computing', 'Gaming']};
  res.render('profile', {data: data});
});

router.get('/profile/:id', function(req, res){
  res.send('You requested to see a profile with the id of ' + req.params.id);
});

module.exports = router;
