# jswiremock [![Build Status](https://travis-ci.org/jlidder/jswiremock.svg?branch=master)](https://travis-ci.org/jlidder/jswiremock)

Miss WireMock in Java? This is the Nodejs sibling to WireMock. At least that is the goal!

## Right now in v0.1:

- Simple GET and POST requests can be mocked.
- Fixed URL stubs. (Dynamic stubs (random id's for ex) are being worked for v0.2).

## Installation
     $ npm install express


## How to use it?

```javascript
var jswiremocklib, jswiremock, stubFor, get, urlEqualTo, a_response;
jswiremocklib = require('../jswiremock'), jswiremock = jswiremocklib.jswiremock, stubFor = jswiremocklib.stubFor, get = jswiremocklib.get, urlEqualTo = jswiremocklib.urlEqualTo, a_response = jswiremocklib.a_response;

var jswiremock = new jswiremock(5001);

stubFor(jswiremock, get(urlEqualTo("/1"))
    .willReturn(a_response()
        .withStatus(200)
        .withHeader({"Content-Type": "application/json"})
        .withBody("[{\"status\":\"success\", \"custom_audience_id\":\"12345\", \"lookalike_audience_id\": \"678999\"}]")));

jswiremock.stop_js_wire_mock();
```

## Design

Everything is built on top of Express js.

## Issues or new feature requests

Please feel free to use github's built-in issue tracking feature.
