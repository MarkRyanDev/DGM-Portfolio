console.log("server start");
var express = require("express");
var mysql = require('mysql');

//load middleware modules
var logger = require("morgan");
var fs = require('fs');
var bodyParser = require('body-parser');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'portfolioPage'
});

//create app
var app = express();
var compression = require('compression');
//var favicon = require('serve-favicon');

//load middleware

app.use(logger("dev"));
app.use(compression());
// app.use(favicon(web + '/favicon.ico'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//REST calls

app.get('/api/pages/:name', (req, res) => {
  connection.query(`select * from posts where page="${req.params.name}"`, (error, results, fields) => {
    res.status(200).json(results);
  });
});

app.get('/api/images', (req, res) => {
  fs.readdir(__dirname + '/web/img', (err, listing) => {
    console.log(listing);
    res.status(200).json(listing);
  });
});

app.post('/api/posts', (req,res) => {
  var post = req.body;
  connection.query(`INSERT INTO posts (title, type, content, description, page) values ("${post.title}", "${post.type}", "${post.content}", "${post.description || 'NULL'}", "${post.page}")`,
    (erro,results, fields) => {
      res.sendStatus(204);
    });
});

app.patch('/api/posts/:id', (req,res) => {
  var updatedInfo = [];
  var data = req.body;
  for (var property in data) {
    if(property === 'id') continue;
    updatedInfo.push(`${property}="${data[property]}", `);
  }
  updatedInfo = updatedInfo.join('').slice(0,-2);
  console.log(`got body ${data}`);
  console.log(`making query: ${`UPDATE posts SET ${updatedInfo} WHERE id=${req.params.id}`}`);
  connection.query(`UPDATE posts SET ${updatedInfo} WHERE id=${req.params.id}`, (error, results, fields) => {
    if(error) throw error;
    res.sendStatus(204);
  });
})

app.use(express.static(__dirname + '/web'));

app.get('*', function(req, res){
    res.status(404).sendFile(`${__dirname}/web/404.html`);
});

// var server = app.listen(process.env.PORT, process.env.IP);
var server = app.listen(8080, 'localhost');

console.log(`app listening on localhost:8080`);

function gracefulShutdown(){
    console.log('\nStarting Shutdown');
    server.close(() => {
        console.log('\nShutdown Complete');
    });
}

process.on('SIGTERM', gracefulShutdown);

process.on('SIGINT', gracefulShutdown);
