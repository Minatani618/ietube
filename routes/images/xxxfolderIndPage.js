var express = require("express");
var router = express.Router();
const fs = require("fs");
const path = require("path");

const imageFolderPath = path.join(__dirname, "../../public/images");

/* /ietube/images/folderIndPage/作品名/ページ番号 でリクエストしてきたとき */
router.get("/:folderName/:page", function (req, res, next) {
  const folderName = req.params.folderName;
  const page = req.params.page;

  //ページ番号が0等の時には1として表示
  if (page < 1) {
    res.redirect("/ietube/images/folderIndPage/" + folderName + "/" + 1);
  }

  //フォルダのコンテンツ一覧を取得
  const folderPath = path.join(imageFolderPath, folderName);
  const contentsList = fs.readdirSync(folderPath);

  //論理削除を除去
  const deleteRemovedList = contentsList.filter(
    (content) => !content.includes("delete")
  );

  //不要物を削除
  let filteredList = deleteRemovedList.filter(
    (content) => !content.includes(".txt")
  );

  //ならべかえ
  const sortedContentsList = filteredList.sort((a, b) => {
    const aName = parseInt(a.split(".")[0]);
    const bName = parseInt(b.split(".")[0]);
    return aName - bName;
  });

  //ページ番号に対応したフォルダのみを抽出
  const displayNumOfPage = 50;
  const startNumberOfPage = (page - 1) * displayNumOfPage;
  const slicedContentsList = sortedContentsList.slice(
    startNumberOfPage,
    parseInt(startNumberOfPage) + parseInt(displayNumOfPage)
  );

  const data = {
    title: "images フォルダ個別ページ",
    page: parseInt(page),
    folderName: folderName,
    contentsList: slicedContentsList,
    colNum: 1,
    displayNumOfPage: displayNumOfPage,
  };

  res.render("images/folderIndPage", data);
});

/* ページ番号がないリクエストの時は1ページ目を表示する */
router.get("/:folderName", function (req, res, next) {
  const folderName = req.params.folderName;
  res.redirect("/ietube/images/folderIndPage/" + folderName + "/" + 1);
});

/* ★post★ */
router.post("/:folderName/:page", async function (req, res, next) {
  const folderName = req.params.folderName;
  const page = req.params.page;

  //ページ番号が0等の時には1として表示
  if (page < 1) {
    res.redirect("/ietube/images/folderIndPage/" + folderName + "/" + 1);
  }

  //リクエストボディを変数格納
  const requestBody = req.body;
  const colNum = requestBody.colNum ? requestBody.colNum : 1;
  const displayNumOfPage = requestBody.displayNumOfPage
    ? requestBody.displayNumOfPage
    : 50;
  const deleteSelectedContentsStr = requestBody.delete;

  /*  */
  if (requestBody.delete) {
    console.log(requestBody.delete);
    await deleteFile(requestBody.delete, folderName);
  }
  console.log(`colNum: ${colNum}, displayNumOfPage: ${displayNumOfPage}`);
  console.log(`delete${requestBody.delete}`);

  //フォルダのコンテンツ一覧を取得
  const folderPath = path.join(imageFolderPath, folderName);
  const contentsList = fs.readdirSync(folderPath);

  //論理削除を除去
  const deleteRemovedList = contentsList.filter(
    (content) => !content.includes("delete")
  );

  //ならべかえ
  const sortedContentsList = deleteRemovedList.sort((a, b) => {
    const aName = parseInt(a.split(".")[0]);
    const bName = parseInt(b.split(".")[0]);
    return aName - bName;
  });

  //ページ番号に対応したフォルダのみを抽出
  const startNumberOfPage = (page - 1) * displayNumOfPage;
  const slicedContentsList = sortedContentsList.slice(
    startNumberOfPage,
    parseInt(startNumberOfPage) + parseInt(displayNumOfPage)
  );

  const data = {
    title: "images フォルダ個別ページ",
    page: parseInt(page),
    folderName: folderName,
    contentsList: slicedContentsList,
    colNum: colNum,
    displayNumOfPage: displayNumOfPage,
  };

  res.render("images/folderIndPage", data);
});

const deleteFile = (filenameStr, folderName) => {
  return new Promise((resolve, reject) => {
    const filenames = filenameStr.split(",").filter((filename) => {
      return filename;
    });
    console.log(filenameStr);
    console.log(folderName);
    console.log(filenames);
    const folderPath = path.join(imageFolderPath, folderName);
    filenames.forEach((filename) => {
      const oldFileName = path.join(folderPath, filename);
      const newFileName = path.join(folderPath, `delete_${filename}`);
      fs.renameSync(oldFileName, newFileName);
      resolve();
    });
  });
};

module.exports = router;
