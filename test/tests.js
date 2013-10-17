"use strict";
var test = require('tape');
var xcop = require('../.');
var locationOrigin = location.protocol + "//" + location.host;
var useGoogle = true;

if (useGoogle) {
    var options = { xcopDocument: "/host/0B32WZ_OndfDhY0lkSTNaeTNvSzA/xcop.html" };
    var testOrigin = "https://googledrive.com";
} else {
    var options = { proxyTimeout: 8 };
    var port = parseInt(location.host.split(":")[1], 10) + 1;
    var testOrigin = "http://localhost:" + port;
}

// Just test the happy path.
test("Test XCOP against origin " + testOrigin, function (t) {
    t.notEqual(locationOrigin, testOrigin, "The origins are different");
    xcop(testOrigin, options).done(function (xhr) {
        t.pass("XCOP promise resolved"); // Yay! XHR object returned.

        xhr({ url: "message.json" }).done(function (response) {
            t.pass("XHR request resolved"); // Yay! XHR object returned.

            t.equal(response.status, 200, "The status is 200");
            t.equal(response.body, '{"message": "Greetings Earthlings!"}', "Correct message.json body returned");
            t.end();

        }, function (err) {
            t.fail("Promise rejected with: " + err.message);
            t.end();
        });

    }, function (err) {
        t.fail("Promise rejected with: " + err.message); // Boo! No XHR object returned.
        t.end();
    });
});
