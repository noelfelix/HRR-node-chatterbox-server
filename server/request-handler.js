/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var dataStore = {
                  '/classes/messages':[],
                  '/classes/room1': []
                };

var requestHandler = function(request, response) {
  var headers = defaultCorsHeaders;
  var url = request.url.toLowerCase();
  var method = request.method;
  var statusCode = 200;
  var responseObject = {};
  responseObject.results = [];

  if(method === 'OPTIONS'){
    response.writeHead(200, headers['access-control-allow-methods']);
    response.end();   
  }

  var body = '';
  request.on('error', function(err) {
    console.error(err);
  });
  
  request.on('data', function(chunk) {
    body += chunk;
  });

  request.on('end', function() {
    if(method === 'POST'){
      // body = Buffer.concat(body).toString();
      if(!dataStore.hasOwnProperty(url)){
        dataStore[url] = [];
      }
      statusCode = 201;
      dataStore[url].push(JSON.parse(body));
    } else if (method === 'GET'){
      if(dataStore.hasOwnProperty(url)){
        console.log(dataStore[url]);
        responseObject.results = dataStore[url];
      } else {
        statusCode = 404;
      }
    }

    console.log("Serving request type " + request.method + " for url " + request.url);

    headers['Content-Type'] = "text/plain";

    response.writeHead(statusCode, headers);

    response.end(JSON.stringify(responseObject));

  });

  //If options


};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

exports.requestHandler = requestHandler;