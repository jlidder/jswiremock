/**
 * Created by jlidder on 7/17/15.
 */
var jswiremocklib, jswiremock, stubFor, get, urlEqualTo, a_response;
jswiremocklib = require('../jswiremock'), jswiremock = jswiremocklib.jswiremock, stubFor = jswiremocklib.stubFor, get = jswiremocklib.get, urlEqualTo = jswiremocklib.urlEqualTo, a_response = jswiremocklib.a_response;

var jswiremock = new jswiremock(5001);

stubFor(jswiremock, get(urlEqualTo("/1"))
    .willReturn(a_response()
        .withStatus(200)
        .withHeader({"Content-Type": "application/json"})
        .withBody("[{\"status\":\"success\", \"custom_audience_id\":\"12345\", \"lookalike_audience_id\": \"678999\"}]")));
