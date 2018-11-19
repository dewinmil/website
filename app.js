var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mysql = require('mysql');
var routes = require('./routes/index');
var users = require('./routes/users');
var bcrypt = require('bcryptjs');
var cookieParser = require('cookie-parser');
var LocalStrategy   = require('passport-local').Strategy;

//Auth Packages
var session = require('express-session');
var passport = require('passport');
var MySQLStore = require('express-mysql-session')(session);

const saltRounds = 10;

var app = express();

app.use(express.static(path.join(__dirname, 'public')));

//var urlencodedParser = bodyParser.urlencoded({extended: false});

var options = {
  host: 'localhost',
  user: 'root',
  password: "",
  database: 'patents'
};

var sessionStore = new MySQLStore(options);

app.use(session({
  secret: 'amsujrlauwnqlauspnauisoa',
  resave: false,
  store: sessionStore,
  saveUninitialized: false,
  //cookie: {secure: true}
}));

//passport init
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: "",
  database: 'patents'
});


app.use(function(req, res, next){
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

app.use('/', routes);
app.use('/users', users);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  function(email, password, done){
    connection.query('SELECT id, password from patents.users WHERE email = ?', [email], function(error, results, fields){
      if(error) {return done(error)};

      if(results.length ==0){
        return done(null, false, 'Email Not Found');
      }

      const hash = results[0].password.toString();
      bcrypt.compare(password, hash, function(err, response){
        if(response === true){
          return done(null, {user_id: results[0].id});
        }else{
          return done(null, false, 'Incorrect Password');
        }
      });
    })

  }));


app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

exports.login = function(req, res){
  var query = connection.query('SELECT * FROM patents.users where email = ' +
    connection.escape(req.body.email) + 'AND password = ' +
    connection.escape(req.body.password), function(err, result){
    console.log(query.sql);
    if(result.length != 0){

    }else{

    }
  });
}



app.listen(3000);
