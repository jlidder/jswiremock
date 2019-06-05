/**
 * Created by jlidder on 4/04/17.
 * Integration test to be run manually for now.
 */

var jswiremocklib, stubFor, get, post, urlEqualTo, a_response;
jswiremocklib = require('../jswiremock'), jswiremock = jswiremocklib.jswiremock, stubFor = jswiremocklib.stubFor, get = jswiremocklib.get, post = jswiremocklib.post, urlEqualTo = jswiremocklib.urlEqualTo, a_response = jswiremocklib.a_response;

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
        .withBody("logged in")));

/*
 * Actual call to the stub below.
 */
var request = require("request");
var assert = require('assert');

request({
    uri: "http://localhost:5001/login",
    form: {username: "captainkirk", password: "enterprise"},
    method: "POST"
}, function(error, response, body) {
    assert.strictEqual(body, "logged in", 'post response is not the same.');
    assert.ok(jswiremock.verify(1, post(urlEqualTo("/login"), {username: "captainkirk", password: "enterprise"})));
    assert.ok(jswiremock.verify(0, post(urlEqualTo("/login"), {username: "captainkirk", password: "spock"})));
});

request({
    uri: "http://localhost:5001/account/4444321/delete/",
    method: "GET"
}, function(error, response, body) {
    assert.strictEqual(body, "[{\"status\":\"success\"}]", 'get response is not the same.');
    assert.ok(jswiremock.verify(1, get(urlEqualTo("/account/:varying_var/delete/"))));
    jswiremock.stopJSWireMock();
});
