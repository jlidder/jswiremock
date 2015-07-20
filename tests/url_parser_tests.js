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

        it('should return a linked list of a url of /7/testacular?test=1&tester=2', function() {
            var parent_node = url_parser.build_url_storage_linked_list("/7/testacular?test=1&tester=2");
            assert.deepEqual(parent_node.getData(), "7");
            assert.deepEqual(parent_node.getNext().getData(), "testacular");
            assert.deepEqual(parent_node.getNext().getParams()["test"], "1");
            assert.deepEqual(parent_node.getNext().getParams()["tester"], "2");
        });

        it('should return a linked list of a url of /testacular?test=1&tester=2', function() {
            var parent_node = url_parser.build_url_storage_linked_list("/testacular?test=1&tester=2");
            assert.deepEqual(parent_node.getData(), "testacular");
            assert.deepEqual(parent_node.getParams()["test"], "1");
            assert.deepEqual(parent_node.getParams()["tester"], "2");
        });

        it('should return a linked list of a url of /testacular/:wtv/ops?test=1&tester=2', function() {
            var parent_node = url_parser.build_url_storage_linked_list("/testacular/:wtv/ops?test=1&tester=2");
            assert.deepEqual(parent_node.getData(), "testacular");
            assert.deepEqual(parent_node.getNext().getData(), ":wtv");
            assert.deepEqual(parent_node.getNext().getNext().getData(), "ops");
            assert.deepEqual(parent_node.getNext().getNext().getParams()["test"], "1");
            assert.deepEqual(parent_node.getNext().getNext().getParams()["tester"], "2");
        });
        it('should return a linked list of a url of /testacular/:wtv/ops?test=1&tester=2', function() {
            var parent_node = url_parser.build_url_storage_linked_list("/testacular/:wtv/:ops?test=1&tester=2");
            assert.deepEqual(parent_node.getData(), "testacular");
            assert.deepEqual(parent_node.getNext().getData(), ":wtv");
            assert.deepEqual(parent_node.getNext().getNext().getData(), ":ops");
            assert.deepEqual(parent_node.getNext().getNext().getParams()["test"], "1");
            assert.deepEqual(parent_node.getNext().getNext().getParams()["tester"], "2");
        });
        it('should return a linked list of a url of /testacular/:wtv/ops?test=:var&tester=2', function() {
            var parent_node = url_parser.build_url_storage_linked_list("/testacular/:wtv/:ops?test=:var&tester=2");
            assert.deepEqual(parent_node.getData(), "testacular");
            assert.deepEqual(parent_node.getNext().getData(), ":wtv");
            assert.deepEqual(parent_node.getNext().getNext().getData(), ":ops");
            assert.deepEqual(parent_node.getNext().getNext().getParams()["test"], ":var");
            assert.deepEqual(parent_node.getNext().getNext().getParams()["tester"], "2");
        });
    });

    //recursive_url_linked_list_search
    describe('recursive url link search function', function() {
        before(function() {
            var mock_request_1 = get(urlEqualTo("/1"))
                .willReturn(a_response()
                    .withStatus(200)
                    .withHeader({"Content-Type": "application/json"})
                    .withBody("[{\"status\":\"success\"}]"));

            var mock_request_2 = get(urlEqualTo("/5/:test/delete"))
                .willReturn(a_response()
                    .withStatus(200)
                    .withHeader({"Content-Type": "application/json"})
                    .withBody("[{\"status\":\"success\"}]"));

            var mock_request_3 = get(urlEqualTo("/account/:varying_var/delete/"))
                .willReturn(a_response()
                    .withStatus(200)
                    .withHeader({"Content-Type": "application/json"})
                    .withBody("[{\"status\":\"success\"}]"));

            var mock_request_4 = get(urlEqualTo("/:varying_var/delete/"))
                .willReturn(a_response()
                    .withStatus(200)
                    .withHeader({"Content-Type": "application/json"})
                    .withBody("[{\"status\":\"success\"}]"));

            var mock_request_5 = get(urlEqualTo("/delete/:varying_var/"))
                .willReturn(a_response()
                    .withStatus(200)
                    .withHeader({"Content-Type": "application/json"})
                    .withBody("[{\"status\":\"success\"}]"));

            var mock_request_7 = get(urlEqualTo("/delete/:wtv/hello?meansit=:var"))
                .willReturn(a_response()
                    .withStatus(200)
                    .withHeader({"Content-Type": "application/json"})
                    .withBody("[{\"status\":\"success\"}]"));

            global.test_stubs = [];
            test_stubs.push(mock_request_1);
            test_stubs.push(mock_request_2);
            test_stubs.push(mock_request_3);
            test_stubs.push(mock_request_4);
            test_stubs.push(mock_request_5);
            test_stubs.push(mock_request_7);
        });
        it('should find the right match for /5/:test/delete in stubs and receive url of /5/4536354345/delete', function() {
            assert.deepEqual(url_parser.has_matching_stub(url_parser.build_url_storage_linked_list("/5/4536354345/delete"), test_stubs) != null, true);
        });
        it('should find the right match for /account/:varying_var/delete/ in stubs and receive url of /account/4536354345/delete', function() {
            assert.deepEqual(url_parser.has_matching_stub(url_parser.build_url_storage_linked_list("/account/4536354345/delete"), test_stubs) != null, true);
        });
        it('should find the right match for /:varying_var/delete/ in stubs and receive url of /account/4536354345/delete', function() {
            assert.deepEqual(url_parser.has_matching_stub(url_parser.build_url_storage_linked_list("/4536354345/delete"), test_stubs) != null, true);
        });
        it('should find the right match for /delete/:varying_var/ in stubs and receive url of /account/4536354345/delete', function() {
            assert.deepEqual(url_parser.has_matching_stub(url_parser.build_url_storage_linked_list("/4536354345/delete"), test_stubs) != null, true);
        });
        it('should find the right match for /delete/:wtv/hello?meansit=:var in stubs and receive url of /delete/1/hello?meansit=7', function() {
            assert.deepEqual(url_parser.has_matching_stub(url_parser.build_url_storage_linked_list("/delete/1/hello?meansit=7"), test_stubs) != null, true);
        });
    });

});