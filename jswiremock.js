/**
 * Created by jlidder on 7/15/15.
 */

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var urlParser = require('./UrlParser');

exports.jswiremock = function(port, bodyEncoding){
    switch((bodyEncoding || 'url').toLowerCase()){
        case 'json':
            app.use(bodyParser.json());
            break;
        case 'url':
        default:
            app.use(bodyParser.urlencoded({
                extended: true
            }));
            break;
    }

    server = app.listen(port, function () {
        server.address().address;
        server.address().port;
    });

    global.getRequestStubs = [];
    global.postRequestStubs = [];
    global.putRequestStubs = [];
    global.deleteRequestStubs = [];

    global.getRequests = [];
    global.postRequests = [];

    this.addStub = function(mockRequest){
        if(mockRequest.getRequestType() === "GET") {
            global.getRequestStubs.push(mockRequest);
        } else if(mockRequest.getRequestType() === "POST"){
            global.postRequestStubs.push(mockRequest);
        }
    };

    this.stopJSWireMock = function(){
        global.getRequestStubs = [];
        global.postRequestStubs = [];
        global.putRequestStubs = [];
        global.deleteRequestStubs = [];

        global.getRequests = [];
        global.postRequests = [];

        server.close();
        setImmediate(function(){server.emit('close')});
    };

    this.verify = function (count, mockRequest) {
        var array;
        if (mockRequest.getRequestType() === "GET") {
            array = global.getRequests;
        } else if (mockRequest.getRequestType() === "POST") {
            array = global.postRequests;
        }
        var counter = 0;
        for (var i in array) {
            if (urlParser.isMatchingStub(urlParser.buildUrlStorageLinkedList(array[i].originalUrl), mockRequest)) {
                if (mockRequest.getRequestType() === "POST") {
                    var bodiesMatch = recursiveBodyMatch(mockRequest.getPostParams(), array[i].body);

                    if (bodiesMatch) {
                        counter++;
                    }
                } else {
                    counter++;
                }
            }
        }
        return counter === count;
    };

    var recursiveBodyMatch = function(bodyOne, bodyTwo){
        if(Array.isArray(bodyOne)){
            if(bodyOne.length != bodyTwo.length)
                return false;

            for(var i = 0; i < bodyOne.length; i++){
                if(bodyTwo[i] == undefined || !recursiveBodyMatch(bodyOne[i], bodyTwo[i]))
                    return false;
            }

            return true;
        }

        if(typeof(bodyOne) == "object"){
            for(var key in bodyOne){
                if(bodyTwo[key] == undefined || !recursiveBodyMatch(bodyOne[key], bodyTwo[key]))
                    return false;
            }

            return true;
        }

        var dateCast = Date.parse(bodyOne);
        if(!isNaN(dateCast)){
            if(dateCast != Date.parse(bodyTwo))
                return false;

            return true;
        }

        return bodyOne == bodyTwo;
    }

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
        getRequests.push(req);
        var returnedStub = urlParser.hasMatchingStub(urlParser.buildUrlStorageLinkedList(req.originalUrl), getRequestStubs);

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
        postRequests.push(req);
        var returnedStub = urlParser.hasMatchingStub(urlParser.buildUrlStorageLinkedList(req.originalUrl), postRequestStubs);

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
