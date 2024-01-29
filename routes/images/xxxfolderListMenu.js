var express = require("express");
var router = express.Router();
const fs = require("fs");
const path = require("path");

const imageFolderPath = path.join(__dirname, "../../public/images");
const folderList = fs.readdirSync(imageFolderPath); // public/images 内の全フォルダ名取得

//folderList並べ替え
const sortFolders = (list) => {
  return list.sort((a, b) => a < b);
};

//フォルダ名からサムネイルとなる画像のリストを配列として取得する
const getThumbnailName = (folderName) => {
  const folderPath = path.join(imageFolderPath, folderName);
  const imageList = fs.readdirSync(folderPath);
  const extractedImageList = imageList.filter(
    (image) => !image.includes("delete")
  );
  const sortedImageList = extractedImageList.sort((a, b) => {
    const aName = parseInt(a.split(".")[0]);
    const bName = parseInt(b.split(".")[0]);
    return aName - bName;
  });
  const thumbnails = sortedImageList.slice(0, 5);
  return thumbnails;
};

/* /ietube/images/ページ番号 でリクエストしてきたとき */
router.get("/:page", function (req, res, next) {
  const page = req.params.page;

  //ページ番号が0等の時には1として表示
  if (page < 1) {
    res.redirect("/ietube/images/folderListMenu/1");
  }

  //ならべかえ
  const sortedFolderList = sortFolders(folderList);

  //ページ番号に対応したフォルダのみを抽出
  const numbersOfPage = 10;
  const startNumberOfPage = (page - 1) * numbersOfPage;
  const slicedFolderList = sortedFolderList.slice(
    startNumberOfPage,
    startNumberOfPage + numbersOfPage
  );

  //テンプレエンジンにわたすフォルダのデータ(サムネイル画像リストを含む)を作成
  const folderListObj = {};
  slicedFolderList.forEach((folder) => {
    folderListObj[folder] = getThumbnailName(folder);
  });

  const data = {
    title: "images FolderListMenu",
    page: parseInt(page),
    folderListObj: folderListObj,
  };

  res.render("images/folderListMenu", data);
});

/* ページ番号がないリクエストの時は1ページ目を表示する */
router.get("/", function (req, res, next) {
  res.redirect("/ietube/images/folderListMenu/1");
});

module.exports = router;
