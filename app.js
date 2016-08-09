console.log("server start");
var express = require("express");

//load middleware modules
var logger = require("morgan");
var fs = require('fs');
//var bodyParser = require('body-parser');

//create app
var app = express();
var compression = require('compression');
//var favicon = require('serve-favicon');

//load middleware

app.use(logger("dev"));
app.use(compression());
// app.use(favicon(web + '/favicon.ico'));

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended:true}));

//REST calls

app.get('/api/posts/:name', (req, res) => {
  fs.readFile(`${__dirname}/posts/${req.params.name}.json`, (err, file) => {
    if (err) throw err;
    res.status(200).json(JSON.parse(file));
  });
});

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
