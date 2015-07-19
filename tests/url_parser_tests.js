/**
 * Created by jlidder on 7/18/15.
 */
var http = require('http');
var assert = require('assert');
var chai = require('chai');
chai.should();

var jswiremocklib, stubFor, get, urlEqualTo, a_response;
jswiremocklib = require('../jswiremock'), stubFor = jswiremocklib.stubFor, get = jswiremocklib.get, urlEqualTo = jswiremocklib.urlEqualTo, a_response = jswiremocklib.a_response;

var url_parser = require('../url_parser');

describe('url_parser library', function() {
    describe('linked list builder function', function() {
        it('should return a linked list of a url of /test/1/2/3/4/5', function() {
            var parent_node = url_parser.build_url_storage_linked_list("/test/1/2/3/4/5");
            assert.deepEqual(parent_node.getData(), "test");
            assert.deepEqual(parent_node.getNext().getData(), "1");
            assert.deepEqual(parent_node.getNext().getNext().getData(), "2");
            assert.deepEqual(parent_node.getNext().getNext().getNext().getData(), "3");
            assert.deepEqual(parent_node.getNext().getNext().getNext().getNext().getData(), "4");
            assert.deepEqual(parent_node.getNext().getNext().getNext().getNext().getNext().getData(), "5");
        });

        it('should return a linked list of a url of /5/:test/delete', function() {
            var parent_node = url_parser.build_url_storage_linked_list("/5/:test/delete");
            assert.deepEqual(parent_node.getData(), "5");
            assert.deepEqual(parent_node.getNext().getData(), ":test");
            assert.deepEqual(parent_node.getNext().getNext().getData(), "delete");
        });
    });

    //recursive_url_linked_list_search
    describe('recursive url link search function', function() {
        before(function() {
            var mock_request_1 = get(urlEqualTo("/1"))
                .willReturn(a_response()
                    .withStatus(200)
                    .withHeader({"Content-Type": "application/json"})
                    .withBody("[{\"status\":\"success\", \"custom_audience_id\":\"12345\", \"lookalike_audience_id\": \"678999\"}]"));

            var mock_request_2 = get(urlEqualTo("/5/:test/delete"))
                .willReturn(a_response()
                    .withStatus(200)
                    .withHeader({"Content-Type": "application/json"})
                    .withBody("[{\"status\":\"success\", \"custom_audience_id\":\"12345\", \"lookalike_audience_id\": \"678999\"}]"));

            global.test_stubs = [];
            test_stubs.push(mock_request_1);
            test_stubs.push(mock_request_2);
        });
        it('should find the right match for /5/:test/delete in stubs and receive url of /5/4536354345/delete', function() {
            assert.deepEqual(url_parser.check_url_match(url_parser.build_url_storage_linked_list("/5/4536354345/delete"), test_stubs), true);
        });
    });

});