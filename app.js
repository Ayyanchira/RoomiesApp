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
        var points = getMyPoints(username);
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
            getMyPoints(username);
            res.send({
                "code":200,
                "message":"Login Successful",
                "points":points,
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
    var date =  new Date();
    date.setHours = date.getHours() - 3;
    var dateAndTimeString = date.toLocaleDateString() +" "+ date.toLocaleTimeString();
    connection.query('insert into pointlog(username,jobid,jobname,point,datetime) values(?,?,?,?,?)',[username,jobid,jobname,point,dateAndTimeString], function (error, results, fields) {
    if (error) {
      message = "error occured";
      res.send({
        "code":400,
        "message":error
      })
    }else{
      if(results.affectedRows > 0){
        // updateScore(username,point);

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

function getMyPoints(username){
  var totalPoint = 0;
  console.log('get my points is getting called');
  connection.query('Select * from pointlog where username = ?',[username],function(error,results,fields){
    if (error == null){
      console.log(results);
      for (i=0 ; i < results.length; i++){
        totalPoint = totalPoint + results[i].point;
      }
      console.log('Total Point is '+totalPoint);
      return totalPoint;
    }
  });
}

app.post('/removeMyTask',function(req,res){
  var logID = req.body.logID;
  var username = req.body.username;
  connection.query('DELETE FROM pointlog WHERE logID = ?',[logID], function (error, results, fields) {
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
          "message":"Record Removed"
            });
    }
    else{
      message="Something went wrong";
      res.send({
        "code":202,
        "message":"Record has already been deleted."
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

function updateScore(username,topUp){
    connection.query('SELECT * FROM users WHERE username = ?',[username], function (error, results, fields) {
        if (error) {
          console.log('Error while fetching the scores');
        }else{
          if(results.length > 0){
              var score = results[0].points;
              if (score == null){
                  score = topUp;
              }else{
                score = score + topUp;
              }
              connection.query('UPDATE users SET points =? WHERE username = ?',[score,username], function (error, results, fields) {  
                if (error) {
                    console.log('Error while updating the scores');
                  }else{
                    console.log('Points updated')
                }
              });
          }
        }
        });
}



app.post('/addJob',function(req,res){
    var name = req.body.name;
    var description = req.body.description;
    var type = req.body.type;
    var category = req.body.category;
    var point = req.body.point;

    connection.query('insert into jobs(name, description, type, category, point) values(?,?,?,?,?)',[name, description, type, category, point], function (error, results, fields) {
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
            "message":"Job Added Successfully"
              });
      }
      else{
        message="Something went wrong";
        res.send({
          "code":400,
          "message":"Some unhandled condition occurred. Contact the developer"
            });
      }
    }
    });
})

app.post('/updateJob',function(req,res){
    var name = req.body.name;
    var description = req.body.description;
    var type = req.body.type;
    var category = req.body.category;
    var point = req.body.point;
    var jobid = req.body.jobid;
    
    connection.query('update sys.jobs set name=?, description=?, type=?, category=?, point=? where jobid=?',[name, description, type, category, point,jobid], function (error, results, fields) {
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
            "message":"Job Updated Successfully"
              });
      }
      else{
        res.send({
          "code":202,
          "message":"No changes found"
            });
      }
    }
    });
})


app.post('/myPoints',function(req,res){
    var username = req.body.username;

    connection.query('SELECT * FROM pointlog WHERE username = ?',[username], function (error, results, fields) {
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
                "points":results
                  });
          }else{
              res.send({
                  "code" : 202,
                  "message": "No records found"
              })
          }
        }
        });
})

app.post('/showMemberPoints',function(req,res){
  connection.query('SELECT username, sum(point) as points FROM pointlog group by username', function (error, results, fields) {
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
            "points":results
              });
      }else{
          res.send({
              "code" : 202,
              "message": "No records found"
          })
      }
    }
    });
})


app.get('/resetAll',function(req,res){
    connection.query('UPDATE `sys`.`users` SET `points`= ?',[0],function(error,results,fields){
        if(error == null){
            connection.query('delete from sys.pointlog',function(error2,results2,fields2){
                if(error2 == null){
                    res.send({
                        "code" : 200,
                        "message" : "Records reset successful"
                    })
                }
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
        console.log("Error connecting database ... nn" + err);
    }
    });
    exports.connection=connection;