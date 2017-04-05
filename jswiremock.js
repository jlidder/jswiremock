/**
 * Created by jlidder on 7/15/15.
 */

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
//app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

var urlParser = require('./UrlParser');

exports.jswiremock = function(port){

    var server = app.listen(port, function () {
        var host = server.address().address;
        var port = server.address().port;
    });

    global.getRequestStubs = [];
    global.postRequestStubs = [];
    global.putRequestStubs = [];
    global.deleteRequestStubs = [];

    this.addStub = function(mockRequest){
        if(mockRequest.getRequestType() === "GET") {
            global.getRequestStubs.push(mockRequest);
        } else if(mockRequest.getRequestType() === "POST"){
            global.postRequestStubs.push(mockRequest);
        }
    };

    this.stopJswiremock = function(){
        //this.server.close(); (DOESN'T WORK)
        //server.close(); (WORKS, BUT NEEDS CALLBACK, OTHERWISE PREMATURLY STOPS EVERYTHING ELSE.)
        //process.exit();
    };

    this.buildResponse = function(res){
        //TODO
    };

    app.use('/*', function (req, res, next) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
        next();
    });

    app.get('/*', function (req, res) {
        var returnedStub = urlParser.hasMatchingStub(urlParser.buildUrlStorageLinkedList(req.originalUrl), getRequestStubs)

        if (returnedStub != null){
            for(var key in returnedStub.getMockResponse().getHeader()){
                res.set(key, returnedStub.getMockResponse().getHeader()[key]);
            }
            res.status(returnedStub.getMockResponse().getStatus());
            res.send(returnedStub.getMockResponse().getBody());
        }
        else{
            res.status(404);
            res.send("Does not exist");
        }
    });

    app.post('/*', function (req, res) {
        var returnedStub = urlParser.hasMatchingStub(urlParser.buildUrlStorageLinkedList(req.originalUrl), postRequestStubs)

        if (returnedStub != null){
            //TODO - ONLY VERIFY POST REQUEST PARAMS
            for(key in returnedStub.getPostParams()){
                if(req.body[key] != null){
                    if(req.body[key] === returnedStub.getPostParams()[key]){
                        continue;
                    }
                } else {
                    res.status(404);
                    res.send("Does not exist");
                }
            }

            for(var key in returnedStub.getMockResponse().getHeader()){
                res.set(key, returnedStub.getMockResponse().getHeader()[key]);
            }
            res.status(returnedStub.getMockResponse().getStatus());
            res.send(returnedStub.getMockResponse().getBody());
        }
        else{
            res.status(404);
            res.send("Does not exist");
        }
    });

    return this;
};

exports.urlEqualTo = function(url){
    var mockRequest = new MockRequest(url);
    return mockRequest;
};

exports.get = function(mockRequest){
    mockRequest.setRequestType("GET");
    return mockRequest;
};

exports.post= function(mockRequest, postParams){
    mockRequest.setRequestType("POST");
    mockRequest.setPostParams(postParams);
    return mockRequest;
};

exports.withPostParams = function(postParams){
    return postParams;
};

exports.stubFor = function(jsWireMock, mockRequest){
    jsWireMock.addStub(mockRequest);
};

exports.a_response = function(){
    return new MockResponse();
};

function MockRequest(url) {
    this.url = urlParser.buildUrlStorageLinkedList(url);
    this.mockResponse = null;
    this.requestType = null;
    this.postParams = null;

    this.getUrl = function(){
        return this.url;
    };
    this.getMockResponse = function(){
        return this.mockResponse;
    };
    this.willReturn = function(mockResponse){
        this.mockResponse = mockResponse;
        return this;
    };
    this.setRequestType = function(requestType){
        this.requestType = requestType;
    };
    this.getRequestType = function(){
        return this.requestType;
    };
    this.setPostParams = function(postParams){
        this.postParams = postParams;
    };
    this.getPostParams = function(){
        return this.postParams;
    };
}

function MockResponse(){
    this.status = null;
    this.withStatus = function(status){
        this.status = status;
        return this;
    };
    this.getStatus = function(){
        return this.status;
    };

    this.body = null;
    this.withBody = function(body){
        this.body = body;
        return this;
    };
    this.getBody = function(){
        return this.body;
    };

    this.header = null;
    this.withHeader = function(header){
        this.header = header;
        return this;
    };
    this.getHeader = function(){
        return this.header;
    };
}

/*
 stubFor(jswiremock, post(urlEqualTo("/account/:varying_var/delete/"), withPostParams({testdata_1 : 1, testdata_2 : 2}))
 .willReturn(a_response()
 .withStatus(200)
 .withHeader({"Content-Type": "application/json"})
 .withBody("[{\"status\":\"success\"}]")));
 */
