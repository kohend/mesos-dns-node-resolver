# mesosdns-node-resolver

[![Package version](https://img.shields.io/npm/v/mesos-dns-node-resolver.svg)](https://www.npmjs.com/package/mesos-dns-node-resolver) [![Package downloads](https://img.shields.io/npm/dt/mesos-dns-node-resolver.svg)](https://www.npmjs.com/package/mesos-dns-node-resolver) [![Package license](https://img.shields.io/npm/l/mesos-dns-node-resolver.svg)](https://www.npmjs.com/package/mesos-dns-node-resolver) [![Build Status](https://img.shields.io/travis/Zooz/mesos-dns-node-resolver.svg)](https://travis-ci.org/Zooz/mesos-dns-node-resolver) [![NSP Status](https://nodesecurity.io/orgs/paymentsos/projects/1286ad57-2675-4e69-8500-0090ad214ac5/badge)](https://nodesecurity.io/orgs/paymentsos/projects/1286ad57-2675-4e69-8500-0090ad214ac5)

A small library to resolve records in Mesos DNS (via SRV DNS records) for Node.js.  

## Dependencies:

None at runtime

## Usage

Parameters:
 - serviceName - a service name to resolve, the suffix will be added to it unless it ends with a dot
 - suffixZones - The number of zones in the suffix (defaults to 2, optional)
 - suffix - the DNS suffix (defaults to marathon.mesos)
 - callback - A function that gets err and result (array of object with host property and a sorted ports array)

```
mesosdns = require("mesosdns-node-resolver");
mesosdns.resolve("service.group", function (err, result) {
  console.log(result);
});
```

To use promises call promiseResolve without a callback.
