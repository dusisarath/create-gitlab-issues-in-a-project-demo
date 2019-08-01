var express = require('express');
var app = express();
var path = require('path');
var outerRequest = require('request');
var bodyParser = require('body-parser');

var port = (process.env.VCAP_APP_PORT || 3002);
var host = (process.env.VCAP_APP_HOST || 'localhost');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

//var baseUrl = "http://localhost:8080";
var baseUrl = "https://gitlab.com/api/v3/projects/";
var apiUrl = "https://gitlab.com/api/v3/";

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/rest/projects/id/', function(request, response) {
	var urlStr = baseUrl + encodeURIComponent(request.query.user_name + '/' + request.query.project_name);
	var private_token = request.query.sessionToken;
	var options = {
		method : "GET",
		uri : urlStr,
		headers : {
			"PRIVATE-TOKEN" : private_token
		}
	};
	outerRequest.get(options, function(err,res,body){
		response.send(body);
	});
});

app.post('/rest/projects/id/issues', function(request, response) {
	var urlStr = baseUrl + request.body.projectId;
	var qs = {};
	qs.title = request.body.title;
	qs.description = request.body.issue_description;
	qs.labels = request.body.labels;
	qs.milestone_id = request.body.milestone_id;
	
	var options = {
		method : "POST",
		uri : urlStr + "/issues",
		qs : qs,
		headers : {
			"PRIVATE-TOKEN" : request.body.sessionToken
		},
		
	};
	outerRequest.post(options, function(err,res,body){
		response.send(body);
	});
});

app.post('/rest/projects/id/milestones', function(request, response) {
	var projectId = request.body.projectId;
	var urlStr = baseUrl + projectId;
	var qs = {};
	qs.id = projectId;
	qs.title = request.body.milestone;
	var options = {
		method : "POST",
		uri : urlStr + "/milestones",
		qs : qs,
		headers : {
			"PRIVATE-TOKEN" : request.body.sessionToken
		},
		
	};
	outerRequest.post(options, function(err,res,body){
		response.send(body);
	});
});

app.get('/rest/projects/id/milestones', function(request, response) {
	var urlStr = baseUrl + request.query.projectId;
	var options = {
		method : "GET",
		uri : urlStr + "/milestones",
		headers : {
			"PRIVATE-TOKEN" : request.query.sessionToken
		},
		
	};
	outerRequest.get(options, function(err,res,body){
		response.send(body);
	});
});

app.post('/rest/session', function(request, response) {
	var urlStr = apiUrl + "session";
	var queryString = {};
	queryString.login = request.body.user_name;
	queryString.password = request.body.passwd;
	
	var options =  {
		method: "POST",
		uri : urlStr,
		qs : queryString
	};
	outerRequest.post(options, function(err,res,body){
		// body is a string, parse it to make it an object
		var newBody = JSON.parse(body);
		response.send(newBody);
	});
});

app.listen(port);


