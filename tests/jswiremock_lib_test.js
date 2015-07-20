/**
 * Created by jlidder on 7/17/15.
 */
var http = require('http');
var assert = require('assert');
var chai = require('chai');
chai.should();

var jswiremocklib, stubFor, get, urlEqualTo, a_response;
jswiremocklib = require('../jswiremock'), stubFor = jswiremocklib.stubFor, get = jswiremocklib.get, urlEqualTo = jswiremocklib.urlEqualTo, a_response = jswiremocklib.a_response;

describe('jswiremock library', function() {
    describe('setup process', function() {
        it('should return a mock_request and mock_response object with the right info', function() {
            var mockRequest = get(urlEqualTo("/1"))
                                    .willReturn(a_response()
                                        .withStatus(200)
                                        .withHeader({"Content-Type": "application/json"})
                                        .withBody("[{\"status\":\"success\", \"custom_audience_id\":\"12345\", \"lookalike_audience_id\": \"678999\"}]"));
            assert.equal(mockRequest.getUrl().getData(), "1", "URL do not match");
            assert.equal(mockRequest.getRequestType(), "GET");
            var mockResponse = mockRequest.getMockResponse();
            assert.equal(mockResponse.getStatus(), 200);
            assert.equal(mockResponse.getBody(), "[{\"status\":\"success\", \"custom_audience_id\":\"12345\", \"lookalike_audience_id\": \"678999\"}]");
            assert.deepEqual(mockResponse.getHeader(), {"Content-Type": "application/json"})
        });
    });
});