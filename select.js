var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'patents'
});

connection.connect();

var id;
var name;
var department;
var date;

//in query surround id, name etc in connection.escape();
//can also pass as placeholder IE: (quesry ?), id function(err, result){}

var query = connection.query('select * from patents.products limit 3', function (err, result){
  if(err){
    console.error(err);
  }else{
    console.error(result);
  }
});
