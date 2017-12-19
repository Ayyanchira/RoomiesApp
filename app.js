var express = require('express');
var app = express();
var router = express.Router();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// var connection = dbconnection.connection;

var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'syntel123$',
  database : 'sys'
});

app.post('/login',function(req,res){
        var username = req.body.username;
        var password = req.body.password;
        console.log(username + "is the username and "+password +" is the password");
        connection.query('SELECT * FROM users WHERE username = ? && password = ?',[username,password], function (error, results, fields) {
        if (error) {
          message = "error occured";
          res.send({
            "code":400,
            "message":message
          })
        }else{
          console.log(results);
          if(results.length > 0){
            res.send({
                "code":200,
                "message":"Login Successfull",
                "points":results[0].points,
                "firstName":results[0].firstname,
                "lastname":results[0].lastname
                  });
          }
          else{
            message="UserName and password does not match";
            res.send({
              "code":400,
              "message":message
                });
          }
        }
        });
})

app.get('/getAllJobs',function(req,res){

})

app.get('/sample',function(req,res){
    res.send({
        "code" :"Success"
    })
})

app.listen(4001,function(){
    console.log('Server starter at port 4000')
})

connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... nn");
    } else {
        console.log("Error connecting database ... nn");
    }
    });
    exports.connection=connection;