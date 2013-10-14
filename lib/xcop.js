"use strict";

var Q = require("q");
var xhrLocal = require("./xhr");

module.exports = function (origin, options) {
    options = options || {};

    function xhrProxy(request) {
        var deferred = Q.defer();
        queue[id] = { deferred: deferred };
        iframeWindow.postMessage(JSON.stringify({ id: id, request: request }), origin); // Post to the xhr proxy.
        id = (id + 1) % 65536; // Recycle ids (eventually).
        return deferred.promise;
    }

    function reject(err) {
        clearTimeout(iframeTimer);
        window.removeEventListener("message", readyMessageHandler);
        iframe.parentNode.removeChild(iframe);
        xcopReadyDeferred.reject(err);
    }

    function xcopTimeout() {
        reject(new Error("XCOP is unavailable from origin " + origin));
    }

    function getMessageIfTrustedSender(e) {
        if (e.source === iframeWindow && e.origin === origin) {
            return JSON.parse(e.data);
        } else {
            return null;
        }
    }

    function readyMessageHandler(e) {
        var message = getMessageIfTrustedSender(e);
        if (message && message.type === "XCOP-READY") {
            clearTimeout(iframeTimer);
            window.removeEventListener("message", readyMessageHandler);
            window.addEventListener("message", responseMessageHandler);
            xcopReadyDeferred.resolve(xhrProxy);
        } else if (message && message.type === "XCOP-ERROR") {
            reject(new Error(message.message));
        }
    }

    function responseMessageHandler(e) {
        var message = getMessageIfTrustedSender(e);
        if (message && message.type === "XCOP-RESPONSE") {
            var response = message.response;
            var deferred = queue[message.id].deferred;
            delete queue[message.id];
            deferred.resolve(response);
        }
    }

    if (!origin || origin === location.origin) {
        Q.resolve(xhrLocal); // No need to proxy so use native/local XHR.
    } else {
        var id = 0;
        var queue = {};
        var xcopReadyDeferred = Q.defer();

        window.addEventListener("message", readyMessageHandler); // Setup reverse listener.

        var iframe = document.createElement("iframe");
        iframe.style.display = "none";
        document.body.appendChild(iframe);
        var iframeWindow = iframe.contentWindow;
        var iframeTimer = setTimeout(xcopTimeout, (options.proxyTimeout || 15) * 1000);
        iframe.src = origin + (options.xcopDocument || "/xcop.html") + "?origin=" + encodeURIComponent(location.origin);

        return xcopReadyDeferred.promise;
    }
};
