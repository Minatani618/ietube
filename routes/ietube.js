var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("ietubeMainMenu", { title: "ietube main menu" });
});

module.exports = router;
