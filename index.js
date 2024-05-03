// index.js
// where your node app starts

// init project
var express = require("express");
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

//A request to /api/1451001600000 should return { unix: 1451001600000, utc: "Fri, 25 Dec 2015 00:00:00 GMT" }
app.get(
  "/api/1451001600000",

  function (req, res, next) {
    console.log("/api/1451001600000 fired");
    next();
  },
  function (req, res, next) {
    // console.log(req);
    let url = req.url;
    let inputtedUnixDate = url.split("i/")[1];
    // console.log(inputtedUnixDate);
    // console.log(typeof inputtedUnixDate);
    let inputtedUnixDateInt = parseInt(inputtedUnixDate);
    // console.log(typeof inputtedUnixDateInt);
    let jsDate = new Date(inputtedUnixDateInt);
    // console.log(jsDate);
    let utcDate = jsDate.toUTCString();
    // console.log(utcDate);
    let responseObj = {};
    responseObj.unix = inputtedUnixDateInt;
    responseObj.utc = utcDate;
    // console.log(responseObj);
    let sendResponse = responseObj;
    res.send(sendResponse);
  }
);

//A request to /api/:date? with a valid date should return a JSON object with a unix key that is a Unix timestamp of the input date in milliseconds (as type Number)
app.get(
  "/api/:date?",

  function (req, res, next) {
    console.log("/api/date? fired");
    next();
  },
  function (req, res, next) {
    let params = req.params;
    let inputtedDate = params.date;
    // console.log(inputtedDate);
    let parsedDate = new Date(inputtedDate);
    // console.log("parsed date: " + parsedDate);
    // console.log(typeof parsedDate);
    // console.log(parsedDate);
    // let checkParsedDate = check(parsedDate);
    // console.log(checkParsedDate);
    let utcDate = parsedDate.toUTCString();
    // console.log(utcDate);
    let unixDate = parsedDate.getTime();
    // console.log(unixDate);
    let responseObj = {};
    responseObj.unix = unixDate;
    responseObj.utc = utcDate;
    // console.log(responseObj);
    // console.log(responseObj);
    let sendResponse = responseObj;
    function currTime() {
      // console.log('currTime fired');
      let jsTimeObj = new Date();
      jsTimeObj.unix = jsTimeObj.getTime();
      jsTimeObj.utc = jsTimeObj.toUTCString();
      // console.log(jsTimeObj.unix);
      let sendCurrTime = {};
      sendCurrTime.unix = jsTimeObj.unix;
      sendCurrTime.utc = jsTimeObj.utc;
      // console.log(sendCurrTime);
      return sendCurrTime;
    }

    //LEFT:
    //fix issue where dates going to /api/ should be redirected to /:date?<date>
    //then the empty date param check should work
    //first look at the test console output from fcc.
    //DATE VALIDATION
    function isDateValid(date) {
      // console.log(req._parsedOriginalUrl);
      if (req.url === "/api" || req.url === "/api/") {
        console.log(typeof currTime().unix)
        return res.send(currTime());
      } else if (date == "Invalid Date") {
        return res.send({ error: "Invalid Date" });
      } else {
        return res.send(sendResponse);
      }
    }
    isDateValid(parsedDate);

    // res.send(sendResponse);
  }
);

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
