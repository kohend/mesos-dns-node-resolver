# mesosdns-node-resolver

A small library to resolve records in Mesos DNS (via SRV DNS records) for Node.js.  

## Dependencies:

None at runtime

## Usage

Parameters:
 - serviceName - a service name to resolve, the prefix will be added to it unless it ends with a dot
 - suffixZones - The number of zones in the suffix (defaults to 2, optional)
 - suffix - the DNS suffix (defaults to marathon.mesos)
 - callback - A function that gets err and result (array of object with host property and a sorted ports array)

``
mesosdns = require("mesosdns-node-resolver");
mesosdns.resolve("service.group", function (err, result) {
  console.log(result);
});
׳׳

To use promises call promiseResolve without a callback.
