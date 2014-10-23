// Node.js proxy server for CORS requests with single page, no-backend apps.
//
// Instructions:
// 1) Place file into your app directory
// 2a) If you don't have a package.json file in this directory, run "npm init" first
// 2b) Run "npm install --save express request query-string"
// 3) Run server with "node server.js"
// 4) Configure Express to use whatever folder you want to serve your site out of.
//    By default, this will run out of whatever folder you have your server.js in,
//    but you shouldn't do this since it'll make everything in this folder accessible,
//    which you may not want.
// 5) Good to go! You can now access your server at http://localhost:3000.
//    To make requests, you can make AJAX requests to /proxy, with the url and any
//    additional params in the query string. For instance, making a request to Google
//    with a "name" parameter set to "Bob" and an "age" param set to "20" looks like this:
//      
//      GET /proxy?url=http://www.google.com/&name=Bob&age=20
//    
//    The fully-resolved HTTP request that your server makes is:
//    
//      GET http://www.google.com/?name=Bob&age=20
// 
//    You can navigate to http://localhost:3000/proxy?url=http://www.google.com/&name=Bob&age=20
//    in your browser manually to see this in action -- you'll see the Google homepage.

var express = require('express');
var app = express();
var server = app.listen(3000);
var request = require('request');
var queryString = require('query-string');

// Set static assets config here
app.use(express.static(__dirname + ''));
// app.set('views', __dirname + '/public/views');
// app.set('view engine', 'ejs');

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/proxy', function(req, res) {
	var url = req.query.url;
	delete req.query.url;
	url += ('?' + queryString.stringify(req.query)) || '';
	console.log('Proxy request received:', url);

	var options = {
		url: url
	};

	request(options, function(error, response, body) {
		if (error) {
			console.log(error)
			res.send(error);
		} else {
			res.send(body);
		}
	});
});