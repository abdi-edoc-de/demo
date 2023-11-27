var express = require("express");
var fs = require("fs");
const helmet = require("helmet");

var app = express();
const router = express.Router();
const framesRouter = express.Router();

router.use(
  helmet.hsts({
    maxAge: 123456,
    includeSubDomains: true,
    preload: true,
  })
);
// Sets "X-Content-Type-Options: nosniff"
router.use(helmet.noSniff());
// Sets "X-XSS-Protection: 0"
router.use(helmet.xssFilter());
router.use(helmet.frameguard({ action: "deny" }));
// router.disable("x-powered-by");
// This sets custom options for the `referrerPolicy` middleware.
router.use(
  helmet({
    referrerPolicy: { policy: "no-referrer" },
  })
);
if (fs.existsSync(__dirname + "/build/index.html")) {
  // Serve the static files from the build folder
  router.use(express.static(__dirname + "/build"));
} else {
  // Serve the static files from the build folder
  router.use(express.static(__dirname + "/build_temp"));
}
const db = [["http://localhost:8080/"], []];

// Redirect all traffic to the index
router.get("*", function (req, res) {
  if (fs.existsSync(__dirname + "/build/index.html")) {
    res.sendFile(__dirname + "/build/index.html");
  } else if (fs.existsSync(__dirname + "/build_temp/index.html")) {
    res.sendFile(__dirname + "/build_temp/index.html");
  } else {
    res.sendFile(__dirname + "/maintenance.html");
  }
});


framesRouter.use("/:clientId/:reviewId", (req, res, next) => {
  const id = req.params.ReviewId;
  const clientId = req.params.clientId;
  const referer = req.get("Referer");

  if (clientId < db.length && db[clientId].includes(referer)) {
    res.header("Access-Control-Allow-Origin", referer);
  }
  next();
});

framesRouter.get("/:clientId/:ReviewId", (req, res) => {
  const id = req.params.ReviewId;
  const clientId = req.params.clientId;
  const referer = req.get("Referer");
  console.log("Referer:", referer);
  if (clientId >= db.length || !db[clientId].includes(referer)) {
    res.send("<html><body><p>error</p></body></html>");
  } else if (fs.existsSync(__dirname + "/build/index.html")) {
    res.sendFile(__dirname + "/build/index.html");
  } else if (fs.existsSync(__dirname + "/build_temp/index.html")) {
    res.sendFile(__dirname + "/build_temp/index.html");
  } else {
    res.sendFile(__dirname + "/maintenance.html");
  }
});

app.use("/framedservice", framesRouter);
app.use("/", router);
// Listen to port 3000
app.listen(process.env.PORT || 3000);
