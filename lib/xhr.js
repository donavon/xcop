"use strict";

var Q = require("q");

function xhr(request) {
    var deferred = Q.defer();
    var xhr = new XMLHttpRequest();

    if (typeof request === "string") {
        request = { url: request };
    }

    xhr.open(request.method || 'GET', request.url, true);
    Object.keys(request.headers || {}).forEach(function (key) {
        xhr.setRequestHeader(key, request.headers[key]);
    });

    xhr.onload = function () {
        var headers = {};
        var htext = xhr.getAllResponseHeaders();
        htext.split(/\r?\n/).forEach(function (line) { // Some servers use "\n" and some use "\r\n".
            var m = /^([^\s]*)\s*:\s*(.*)/.exec(line);
            if (m) {
                headers[m[1].toLowerCase()] = m[2];
            }
        });
        var response = { status: xhr.status, body: xhr.responseText, headers: headers };
        deferred.resolve(response);
    };

    xhr.onerror = function (err) {
        deferred.reject(new Error("XCOP XMLHttpRequest Error"));
    };

    xhr.send(request.body);
    return deferred.promise;
}
xhr.destroy = function () { };

module.exports = xhr;
