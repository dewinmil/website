var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
var passport = require('passport');
var app = require('../app');
var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');
var bcrypt = require('bcryptjs');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: "",
  database: 'patents'
});

const saltRounds = 10;

router.use(expressValidator())

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});

//register
router.get('/register', function(req, res){
  res.render('register');
});

//login
router.get('/login', function(req, res){
  res.render('login');
});

router.get('/loginfail', function(req, res){
  res.render('login');
});

router.get('/sendreset', function(req, res){
  res.render('sendreset');
});

router.get('/reset', function(req, res){
  res.render('reset');
});

//register user
router.post('/register', urlencodedParser, function(req, res){
  var email = req.body.email;
  var password = req.body.password;
  var password2 = req.body.password2;

  //validation
  req.checkBody('email', 'Email is required').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  var err = req.validationErrors();

  if(err){
    res.render('register', {
      //pass errors to register.ejs
      errors:err
    })
  }else{
    var query = connection.query('SELECT email FROM patents.users WHERE email = ' +
      connection.escape(req.body.email), function(err, result){
      console.log(query.sql);
      if(result.length != 0){
        //email in use error
      }else{
        bcrypt.hash(req.body.password, saltRounds, function(err, hash){

          connection.query('INSERT INTO patents.users (email,' +
          ' password) VALUES (' + connection.escape(req.body.email) + ', ' +
          connection.escape(hash) +')', function (err, result, fields){
            if(err){
              console.error(err);
            }else{
              console.error(result);
            }
            connection.query('SELECT id FROM patents.users WHERE email = ' +
            connection.escape(req.body.email), function(error, result, fields){
              if(error){
                console.error(error);
              }else{
                console.error(result);
              }
              const user_id = result[0];
              console.log(result[0])
              req.login(user_id, function(err){
                res.redirect('/');
              });
            });
          });
        });
      }
    });
  }
});

passport.serializeUser(function(user_id, done){
  done(null, user_id);
});

passport.deserializeUser(function(user_id, done){
  done(null, user_id);
});

router.post('/login', urlencodedParser, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}));

//logout
router.get('/logout', (req, res, next) =>{
  req.logout()
  req.session.destroy(() => {
    res.clearCookie('connect.sid')
    res.redirect('/')
  })
})


//reset user
router.post('/reset', urlencodedParser, function(req, res){
  var email = req.body.email;
  var password = req.body.password;

  //validation
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Password is required').equals(req.body.password)();

  var errors = req.validationErrors();

  if(errors){
    res.render('reset', {
      //pass errors to register.ejs
      errors:errors
    })
  }else{
    res.render('reset');
  }
});

//login user
router.post('/sendreset', urlencodedParser, function(req, res){
  var email = req.body.email;
  var password = req.body.password;

  //validation
  req.checkBody('email', 'Email is required').isEmail();

  var errors = req.validationErrors();

  if(errors){
    res.render('sendreset', {
      //pass errors to register.ejs
      errors:errors
    })
  }else{
    res.render('sendreset');
  }
});

function authenticationMiddleware(){
  return(req, res, next) => {
    console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);
    if(req.isAuthenticated()) return next();
    res.redirect('/login')
  }
}

module.exports = router;
