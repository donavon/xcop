# XCOP

## Introduction

**XCOP** (XHR Cross Origin Proxy) allows you to make XHR requests to different friendly API services.

I'm sure that you've faced this dilemma... You web application needs to "phone home" via XMLHttpRequest call back to
your site to get some information. You'd like these XHR calls to use HTTPS (maybe they contain some PII). The problem is that you've
served the HTML, CSS, JavaScript, and images from an HTTP server and that would constitute a cross origin call.
Historically, you were left with few options:

1. Serve the site from the same origin as the web services.
2. Use CORS. But this adds latency as the browser must make an additional OPTIONS request before the original request. it also requires setting up CORS headers on the server side.
3. Use a reverse proxy server on the domain that served your HTML file. This can be, in some cases, difficult to setup, and is slower than
hitting the destination server directly.

## Enter XCOP!

With XCOP you can effectively make cross origin XHR requests with full verbs (not only GET and POST but also PUT, DELETE, PATCH, etc).
You can also set HTTP headers to your heart's content. Simply place a simple HTML file on the friendly cross origin server (yes, you need access
to the server). Under the covers, XCOP package will load this into an iframe and communicate with it via PostMessage. You will need a fairly modern
browser.

### Install it

```
$ npm install xcop
```

### Usage

XCOP us easy to use. Just call XCOP with the origin that you would like to communicate with (xcop.html must be in the root of the cross origin server).
XCOP will return a promise that is fulfilled with an XHR object.

#### Options
You can pass the following options as the second parameter to XCOP:
* **useCors** - Instructs XCOP that, even if the origin is different, it should use the built-in XHR. CORS must be setup on the server to use HTTP verbs other than GET/POST and headers.
* **proxyTimeout** - Time in seconds to wait for XCOP to be ready. (default = 15)
* **xcopDocument** - File name of the "xcop.html" file on the server. Defaults to "/xcop.html".

The returned XHR object accepts a request object that consists of the following:

* **url** - the URL that you would like to hit, relative to the origin.
* **headers** - an object with key/value pairs.
* **method** - the HTTP method (default = "GET").
* **body** - a string containing optional data sent in a POST or PUT.

It returns a promise that is fulfilled with a response object. The response object contains the following:

* **status** - the HTTP status response (ex: 200 for "OK")
* **body** - the body of the response
* **headers** - a response header object with key/value pairs.

### Example

Let's say that you have a web page that is loaded from http://www.example.com, but you need to post some
data to https://api.example.com (i.e. not on the same origin). The code below will show you how to do so.

``` javascript
var xcop = require("xcop");

var origin = "https://api.example.com";
xcop(origin).done(function (xhr) {
    var request = {
        url: "/items/123",
        headers: {"content-type": "application/json"},
        method: "PUT",
        body: JSON.stringify({id: 123, name: "new name"})
    };
    xhr(request).done(function(response) {
        console.log(response.status + " " + response.body);
    }, function (err) {
        console.error("Something went wrong.", err.message);
    });
}, function (err) {
    console.error(err.message);
});

```

### Live Demo

You can also see XCOP in action, live, on the Interwebs! Check out this fiddle. <http://jsfiddle.net/donavon/6tozto6v/>

### Origin White Listing

Instead of opening your web service up to other websites, you may now "white list" which origins are allowed to access your server.
To do so, edit the `xcop.html` file served by the destination server. By default, XCOP allows access from any origin.

``` javascript
var whiteList = [];
```

To setup a whitelist, replace the `whiteList` array with the list of your allows origins.
In our example above, you may chose to only allow http://www.example.com to use your API.
If so, your `xcop.html` file will read:

``` javascript
var whiteList = ["http://www.example.com"];
```

You may choose to use different `xcop.html` files with different white lists for development, QA, and production.


### Troubleshooting

**Q.** I'm getting the error "XCOP is unavailable".  
**A.** You likely have not setup xcop.html in the root of the origin server that you are hitting with XCOP.
In the example above, that would be https://api.example.com/xcop.html

**Q.** How cool is XCOP?  
**A.** Very!

### License
For use under [MIT license](http://github.com/donavon/xcop/raw/master/LICENSE)
