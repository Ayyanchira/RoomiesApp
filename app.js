var express = require('express');
var app = express();
var router = express.Router();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
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
          if(results.length > 0){
            res.send({
                "code":200,
                "message":"Login Successful",
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

app.post('/submitTask',function(req,res){
    var username = req.body.username;
    var jobid = req.body.jobid;
    var jobname = req.body.jobname;
    var point = req.body.point;

    connection.query('insert into pointlog(username,jobid,jobname,point) values(?,?,?,?)',[username,jobid,jobname,point], function (error, results, fields) {
    if (error) {
      message = "error occured";
      res.send({
        "code":400,
        "message":error
      })
    }else{
      if(results.affectedRows > 0){
        res.send({
            "code":200,
            "message":"Task Added"
              });
      }
      else{
        message="Something went wrong";
        res.send({
          "code":400,
          "message":"Some unhandled condition occurred. Contact Akshay"
            });
      }
    }
    });
})

app.get('/getAllJobs',function(req,res){
    connection.query('SELECT * FROM jobs', function (error, results, fields){
        if (error) {
            res.send({
              "code":400,
              "message":"Error Occurred"
            })
          }else{
              res.send({
                  "code":200,
                  "message":"Login Successful",
                  "results":results
                    });
            }
    });
    
})



app.get('/sample',function(req,res){
    res.send({
        "code" :"Success"
    })
})

app.listen(4001,function(){
    console.log('Server starter at port 4001')
})

connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... nn");
    } else {
        console.log("Error connecting database ... nn");
    }
    });
    exports.connection=connection;