var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');

var app = express();

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'patents'
});

connection.connect();

var urlencodedParser = bodyParser.urlencoded({extended: false});

app.post('/signin', urlencodedParser, function(req, res){
  console.log(req.body);
});



/*
var product = {
  id: '123456783',
  name: 'dish washer',
  department: 'appliances',
  date: '2018-09-03'
};

var query = connection.query('insert into patents.products set ?', product, function (err, result){
  if(err){
    console.error(err);
  }else{
    console.error(result);
  }
});
