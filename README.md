# XCOP
**A NobleJS production**

## Introduction

**XCOP** (XHR Cross Origin Proxy) allows you to make XHR requests to different friendly API services.

I'm sure that you've faced this delema... You web application needs to "phone home" via XMLHttpRequest call back to
your site to get some information. You'd like these XHR calls to use HTTPS (maybe they contain some PII). The problem is that you've
served the HTML, CSS, JavaScript, and images from an HTTP server and that would constitute a cross origin call.
Historicly, you were left with few options:

1. Serve the entire site from the same origin as the web services. ex: https://api.example.com (Boo, hiss)
2. Use CORS. But this limits you to GET and POST and does not allow you to set headers.
3. Use a reverse proxy server on the domain that served your html file. This can be, in some cases, dificult to setup, and is slower than
hitting the destination server directly. Plus it leaves the information in the clear on the first leg of it's journey (i.e. not HTTPS).

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

XCOP us easy to use. Just call xcop with the origin that you would like to communicate with (xcop.html must be in the root of the cross origin server).
XCOP will return a Q promise that is fulfilled with an XHR object.

The XHR object accepts a request object that consists of the following:

* **url** - the url that you would like to hit, relative to the origin.
* **headers** - an object with key/value pairs.
* **method** - the HTTP method (default = "GET").
* **body** - a string containing optional data sent in a POST or PUT.

It returns a promise that is fulfilled with a response object. The response object contains the following:

* **status** - the HTTP status reponse (ex: 200 for "OK")
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
        url: "/items",
        headers: {"content-type": "application/json"},
        method: "POST",
        body: JSON.stringify({name: "new item"})
    };
    xhr(request).done(function(response) {
        console.log(response.status + " " + response.body);
    });
}, function (err) {
    console.log(err.message);
});

```

### Origin White Listing

Instead of opening your web service up to other websites, you may now "white list" which origins are allowed to access your server.
To do so, edit the `xcop.html` file served by the destination server. Here is how it looks by default:

``` javascript
var checkWhiteList = false;
var whiteList = ["http://127.0.0.1:9000", "http://localhost:9000"];
```

`checkWhiteList` defaults to `false`. Set this to `true` and replace the `whteList` array with the list of your allows origins.
In our example above, you may chose to only allow http://www.example.com to use your api. If so, your `xcop.html` file will read:

``` javascript
var checkWhiteList = true;
var whiteList = ["http://www.example.com"];
```

You may choose to use different `xcop.html` files with different white lists for development, QA, and production.


### Troubleshooting

**Q.** I'm getting the error "XCOP is unavailable".  
**A.** You likely have not setup xcop.html in the root of the origin server that you are hitting with XCOP.
In the example above, that would be https://api.example.com/xcop.html

**Q.** How cool is XCOP?  
**A.** Very!
