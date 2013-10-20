"use strict";

var user = process.env.SAUCE_USER;
var key = process.env.SAUCE_KEY;
var path = require("path");
var packageJson = require("../package.json");
var brTapSauce = require("brtapsauce");

var browsers = [
    { browserName: "chrome", platform: "Windows 8", version: "" },
    { browserName: "firefox", platform: "Windows 8", version: "" },
    { browserName: "internet explorer", platform: "Windows 8", version: "10" },
    { browserName: "internet explorer", platform: "Windows 7", version: "9" },
    { browserName: "internet explorer", platform: "Windows 7", version: "8" },
    { browserName: "internet explorer", platform: "Windows XP", version: "7" },
    { browserName: "internet explorer", platform: "Windows XP", version: "6" },
    { browserName: "safari", platform: "OS X 10.6", version: "5" },
    { browserName: "safari", platform: "OS X 10.8", version: "6" },
    { browserName: "opera", platform: "Windows 7", version: "" },
    { browserName: "ipad", platform: "OS X 10.8", version: "6.1" },
    { browserName: "iphone", platform: "OS X 10.8", version: "5.1" },
    { browserName: "android", platform: "Linux", version: "4.0" }
];

if (!user) {
    throw new Error("Must set SAUCE_USER environment variable.");
}

if (!key) {
    throw new Error("Must set SAUCE_KEY environment variable.");
}

brTapSauce({
    name: packageJson.name,
    user: user,
    key: key,
    brsrc: path.resolve(__dirname, "tests.js"),
    capabilities: browsers
});
