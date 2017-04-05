# jswiremock [![Build Status](https://travis-ci.org/jlidder/jswiremock.svg?branch=master)](https://travis-ci.org/jlidder/jswiremock)

Miss WireMock in Java? This is the Nodejs sibling to WireMock. At least that is the goal! 

Jswiremock is a flexible http api mocking library.

## Right now in v0.3:

- Simple GET and POST requests can be mocked.
- Fixed and Dynamic URL stubs (ex: /account/:varying_var/delete/)
- Fixed and Dynamic Query parameters (ex: /account/234234?active=:var&cool=true

## Installation
     $ npm install jswiremock


## How to use it?

```javascript
var jswiremocklib, jswiremock, stubFor, get, post, urlEqualTo, a_response;
jswiremocklib = require('../jswiremock'), jswiremock = jswiremocklib.jswiremock, stubFor = jswiremocklib.stubFor, get = jswiremocklib.get, post = jswiremocklib.post, urlEqualTo = jswiremocklib.urlEqualTo, a_response = jswiremocklib.a_response, stopJSWireMock = jswiremocklib.stopJSWireMock;

var jswiremock = new jswiremock(5001); //port

stubFor(jswiremock, get(urlEqualTo("/account/:varying_var/delete/"))
    .willReturn(a_response()
        .withStatus(200)
        .withHeader({"Content-Type": "application/json"})
        .withBody("[{\"status\":\"success\"}]")));

stubFor(jswiremock, post(urlEqualTo("/login"), {username: "captainkirk", password: "enterprise"})
    .willReturn(a_response()
        .withStatus(200)
        .withHeader({})
        .withBody("")));

/*
 * Actual call to the stub below.
 */
var request = require("request");
var assert = require('assert');

request({
    uri: "http://localhost:5001/account/4444321/get/",
    method: "GET"
}, function(error, response, body) {
    assert.strictEqual(body, "[{\"status\":\"success\"}]", 'get response is not the same.');
    jswiremock.stopJSWireMock();
});
```

## Issues or new feature requests

Please feel free to use github's built-in issue tracking feature.
