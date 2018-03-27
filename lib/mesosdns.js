/*jslint
node: true, es6:true  for */
"use strict";

var dns = require("dns");

function numericSort(first, second) {
    return first - second;
}

function resolveMesosDNS(serviceName, suffixZones, suffix, callback) {

    if (suffixZones && typeof(suffixZones) === 'function') {
        callback = suffixZones;
        suffixZones = undefined;
    }
    if (suffix && typeof(suffix) === 'function') {
        callback = suffix;
        suffix = undefined;
    }
    if (!callback || typeof(callback) !== 'function') {
        throw new Error("Bad callback");
    }
    if (!suffix && !serviceName.endsWith(".")) {
        serviceName = serviceName + ".marathon.mesos";
    }
    if (!suffixZones || suffixZones < 1) {
        suffixZones = 2;
    }

    serviceName = serviceName.replace(/\.$/, "");

    var zones = serviceName.split(".");
    if (zones.length < suffixZones) {
        callback(new Error("Name shorter than suffix"), []);
        return;
    }
    var lookupName = "_";
    var i;
    for (i = 0; i < (zones.length - suffixZones); i += 1) {
        lookupName += zones[i] + ".";
    }
    lookupName += "_tcp.";
    for (i = (zones.length - suffixZones); i < zones.length; i += 1) {
        lookupName += zones[i] + ".";
    }
    dns.resolveSrv(lookupName, function (err, addresses) {
        if (err || !addresses || addresses.length <= 0) {
            callback(err, []);
            return;
        }
        var hosts = {};
        addresses.forEach(function (host) {
            if (!hosts[host.name]) {
                hosts[host.name] = {ports: []};
            }
            hosts[host.name].ports.push(host.port);
        });
        var response = [];
        Object.getOwnPropertyNames(hosts).forEach(function (host) {
            response.push({"host": host, "ports": hosts[host].ports.sort(numericSort)});
        });
        callback(null, response);
    });
}

function promiseResolve(serviceName, suffixZones, suffix) {
    return new Promise(function (resolve, reject) {
        resolveMesosDNS(serviceName, suffixZones, suffix, function (err, response) {
            if (err || !response || response.length === 0) {
                return reject(err);
            }
            return resolve(response);
        });
    });
}

module.exports = {"resolve": resolveMesosDNS, "promiseResolve": promiseResolve};
