"use strict";

// Testing require
var expect = require("chai").expect;
var sinon = require("sinon");
var rewire = require("rewire");

var mesosDNS = rewire("../../lib/mesosdns");

describe("mesosDNS test", function () {
    var rewires = [];
    afterEach(function () {
        rewires.forEach(function (restore) {
            restore();
        });
        rewires = [];
    });
    it("Test a normal lookup with all parameters", function (done) {
        var dnsMock = {"resolveSrv": function (name, dnscallback) {
            dnscallback(null, [{"name": "fdsfds", "port": 23423}]);
        }};
        mesosDNS.__set__("dns", dnsMock);
        mesosDNS.resolve("dfsfdsfds.sfsafas.sdfs", 2, "sfsafas.sdfs", function (error, response) {
            expect(error).to.be.null;
            expect(response).to.have.lengthOf(1);
            done();
        });
    });
    it("Test a normal lookup with minimum parameters", function (done) {
        var dnsMock = {"resolveSrv": function (name, dnscallback) {
            expect(name).to.equal("_dfsfdsfds.sfsafas.sdfs._tcp.marathon.mesos.");
            dnscallback(null, [{"name": "fdsfds", "port": 23423}, {"name": "fdsfds", "port": 2323}]);
        }};
        mesosDNS.__set__("dns", dnsMock);
        mesosDNS.resolve("dfsfdsfds.sfsafas.sdfs", function (error, response) {
            expect(error).to.be.null;
            expect(response).to.have.lengthOf(1);
            done();
        });
    });
    it("Test a normal lookup with minimum parameters - with a dot", function (done) {
        var dnsMock = {"resolveSrv": function (name, dnscallback) {
            expect(name).to.equal("_dfsfdsfds._tcp.sfsafas.sdfs.");
            dnscallback(null, [{"name": "fdsfds", "port": 23423}, {"name": "fdsfds", "port": 2323}]);
        }};
        mesosDNS.__set__("dns", dnsMock);
        mesosDNS.resolve("dfsfdsfds.sfsafas.sdfs.", function (error, response) {
            expect(error).to.be.null;
            expect(response).to.have.lengthOf(1);
            done();
        });
    });
    it("Test a normal lookup with 3 parameters", function (done) {
        var dnsMock = {"resolveSrv": function (name, dnscallback) {
            dnscallback(null, [{"name": "fdsfds", "port": 23423}]);
        }};
        mesosDNS.__set__("dns", dnsMock);
        mesosDNS.resolve("dfsfdsfds.sfsafas.sdfs", 2, function (error, response) {
            expect(error).to.be.null;
            expect(response).to.have.lengthOf(1);
            done();
        });
    });
    it("Resolve basic check (without ending dot)", function (done) {
        rewires.push(mesosDNS.__set__("dns", {resolveSrv: function (name, callback) {
            expect(name).to.equal("_test.test_group._tcp.marathon.mesos.");
            callback(null, [{name: "testhost", port: 3214}, {name: "testhost", port: 32114}]);
        }}));
        mesosDNS.promiseResolve("test.test_group").then(function (response) {
            expect(response).to.be.an("array");
            expect(response).to.have.lengthOf(1);
            expect(response[0].host).to.equal("testhost");
            expect(response[0].ports[0]).to.equal(3214);
            done();
        });
    });
    it("Resolve basic error", function (done) {
        rewires.push(mesosDNS.__set__("dns", {resolveSrv: function (name, callback) {
            callback(new Error("resolve error"));
        }}));
        mesosDNS.promiseResolve("test.test_group").catch(function (error) {
            done();
        });
    });

    it("Resolve short name", function (done) {
        mesosDNS.promiseResolve("test.test_group", 3, "a").catch(function (response) {
            done();
        });
    });
    it("Resolve basic check (with callback)", function (done) {
        rewires.push(mesosDNS.__set__("dns", {resolveSrv: function (name, callback) {
            expect(name).to.equal("_test.test_group._tcp.a.b.");
            callback(null, [{name: "testhost", port: 32114}, {name: "testhost", port: 3214}]);
        }}));
        mesosDNS.resolve("test.test_group.a.b", 2, "a.b", function (err, response) {
            expect(response).to.be.an("array");
            expect(response).to.have.lengthOf(1);
            expect(response[0].host).to.equal("testhost");
            expect(response[0].ports[0]).to.equal(3214);
            done();
        });
    });
    it("Resolve basic check 2 params (with callback)", function (done) {
        rewires.push(mesosDNS.__set__("dns", {resolveSrv: function (name, callback) {
            expect(name).to.equal("_test.test_group._tcp.marathon.mesos.");
            callback(null, [{name: "testhost", port: 3214}, {name: "testhost", port: 32114}]);
        }}));
        mesosDNS.resolve("test.test_group", 2, function (err, response) {
            expect(response).to.be.an("array");
            expect(response).to.have.lengthOf(1);
            expect(response[0].host).to.equal("testhost");
            expect(response[0].ports[0]).to.equal(3214);
            done();
        });
    });
    it("Resolve basic check 1 param (with callback)", function (done) {
        rewires.push(mesosDNS.__set__("dns", {resolveSrv: function (name, callback) {
            expect(name).to.equal("_test.test_group._tcp.marathon.mesos.");
            callback(null, [{name: "testhost", port: 3214}, {name: "testhost", port: 32114}]);
        }}));
        mesosDNS.resolve("test.test_group", function (err, response) {
            expect(response).to.be.an("array");
            console.log(response);
            expect(response).to.have.lengthOf(1);
            expect(response[0].host).to.equal("testhost");
            expect(response[0].ports[0]).to.equal(3214);
            done();
        });
    });
    it("Resolve basic check with bad callback (with callback)", function (done) {
        rewires.push(mesosDNS.__set__("dns", {resolveSrv: function (name, callback) {
            callback(null, [{name: "testhost", port: 3214}, {name: "testhost", port: 32114}]);
        }}));
        try {
            mesosDNS.resolve("test.test_group", null);
        } catch (err) {
            expect(err).to.be.an("error");
            done();
        }
    });
});
