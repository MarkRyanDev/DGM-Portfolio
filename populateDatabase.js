var fs = require('fs');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'portfolioPage'
});

var pages = fs.readdirSync('posts');

for(var page of pages){
  var postList = JSON.parse(fs.readFileSync(`posts/${page}`, 'utf8'));
  for (var post of postList){
    connection.query(`INSERT INTO posts (title, type, content, description, page) values ("${post.title}", "${post.type}", "${post.content}", "${post.description || 'NULL'}", "${page.replace('.json', '')}")`, () => {
      console.log(`inserted ${post.title}`);
    })
  }
}
