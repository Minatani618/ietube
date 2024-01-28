var express = require("express");
var router = express.Router();

/* /ietube/images/ページ番号 でリクエストしてきたとき */
router.get("/", function (req, res, next) {
  res.render("images/images", { title: "ietube images ポータル" });
});

module.exports = router;
