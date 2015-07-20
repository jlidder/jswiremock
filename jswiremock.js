/**
 * Created by jlidder on 7/15/15.
 */

var express = require('express');
var app = express();

var urlParser = require('./urlparser');

exports.jswiremock = function(port){

    var server = app.listen(port, function () {
        var host = server.address().address;
        var port = server.address().port;
    });

    global.stubs = [];

    this.addStub = function(mockRequest){
        global.stubs.push(mockRequest);
    };

    this.stop_js_wire_mock = function(){
        server.close();
    };

    this.stopJswiremock = function(){
        server.close();
    };

    app.get('/*', function (req, res) {
        var returnedStub = urlParser.hasMatchingStub(urlParser.buildUrlStorageLinkedList(req.originalUrl), stubs)

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
    return this;
}

exports.urlEqualTo = function(url){
    var mockRequest = new MockRequest(url);
    return mockRequest;
}

exports.get = function(mockRequest){
    mockRequest.setRequestType("GET");
    return mockRequest;
}

exports.post= function(mockRequest){
    mockRequest.setRequestType("POST");
    return mockRequest;
}

exports.stubFor = function(jsWireMock, mockRequest){
    jsWireMock.addStub(mockRequest);
}

exports.a_response = function(){
    return new MockResponse();
}

function MockRequest(url) {
    this.url = urlParser.buildUrlStorageLinkedList(url);
    this.mockResponse = null;
    this.requestType = null;

    this.getUrl = function(){
        return this.url;
    }

    this.getMockResponse = function(){
        return this.mockResponse;
    }

    this.willReturn = function(mockResponse){
        this.mockResponse = mockResponse;
        return this;
    }

    this.setRequestType = function(requestType){
        this.requestType = requestType;
    };
    this.getRequestType = function(){
        return this.requestType;
    }
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

