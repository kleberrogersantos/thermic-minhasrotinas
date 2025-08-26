var http = require('http');
var index ='index.html'
var server = http.createServer(function (request, response) {
  const headers = {
    'Access-Control-Allow-Origin': '*', /* @dev First, read about security */
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Access-Control-Max-Age': 2592000, // 30 days
    /** add other headers as per requirement */
  };
  response.writeHead(200, headers);
  response.end(\index.html);
});
server.listen(6400);
console.log("Server running at http://127.0.0.1:6400/");	