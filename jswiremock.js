/**
 * Created by jlidder on 7/15/15.
 */
    /*
    Sample Scenario:
    var jswiremock = new jswiremock(8005);
    stubFor(jswiremock, get(urlEqualTo("/task/bf7aa523-9a48-4e51-8d31-37fe8899cccc"))
     .willReturn(aResponse()
         .withStatus(200)
         .withHeader("Content-Type", "application/json")
         .withBody("[{\"status\":\"success\", \"custom_audience_id\":\"12345\", \"lookalike_audience_id\": \"678999\"}]")));
     */
var express = require('express');
var app = express();

exports.jswiremock = function(port){

    var server = app.listen(port, function () {
        var host = server.address().address;
        var port = server.address().port;
        console.log('Example app listening at http://%s:%s', host, port);
    });

    global.stubs = new Object();

    this.add_stub = function(mock_request){
        global.stubs[mock_request.getUrl()] = mock_request;
    };

    this.stop_js_wire_mock = function(){
        server.close();
    };

    app.get('/*', function (req, res) {
        //TODO: find the apprpriate stub to call based on req url
        if(stubs[req.originalUrl] != null){
            for(var key in stubs[req.originalUrl].get_mock_response().getHeader()){
                res.set(key, stubs[req.originalUrl].get_mock_response().getHeader()[key]);
            }
            res.status(stubs[req.originalUrl].get_mock_response().getStatus())
            res.send(stubs[req.originalUrl].get_mock_response().getBody());
        }
        else{
            //TODO throw an error or end it gracefully.
        }
    });
    return this;
}

exports.urlEqualTo = function(url){
    /* TODO: put URL checking logic here.*/
    var mock_request = new MockRequest(url);
    return mock_request;
}

exports.get = function(mock_request_object){
    mock_request_object.setRequestType("GET");
    return mock_request_object;
}

exports.post= function(mock_request_object){
    mock_request_object.setRequestType("POST");
    return mock_request_object;
}

exports.stubFor = function(js_wire_mock, mock_request){
    js_wire_mock.add_stub(mock_request);
}

function MockRequest(url) {
    this.url = url;
    this.mock_response = null;
    this.request_type = null;

    this.getUrl = function(){
        return this.url;
    }

    this.get_mock_response = function(){
        return this.mock_response;
    }

    this.willReturn = function(mock_response){
        this.mock_response = mock_response;
        return this;
    }

    this.setRequestType = function(request_type){
        this.request_type = request_type;
    };
    this.getRequestType = function(){
        return this.request_type;
    }
}

exports.a_response = function(){
    return new MockResponse();
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
