const fs = require("fs");
const path = require("path");

class imageManager {
  constructor() {}

  setImageFolderPath(imageFolderPath) {
    this.imageFolderPath = path.join(__dirname, imageFolderPath);
  }

  setTargetFolderPath(folderName) {
    this.targetFolderPath = path.join(imageFolderPath, folderName);
  }

  //フォルダ内のコンテンツファイル名を読み込む
  getFolderContents() {
    return fs.readdirSync(this.targetFolderPath);
  }

  //一ページに表示するコンテンツ数を設定
  setNumContentsPerPage(num) {
    this.numContentsPerPage = num;
  }

  //論理削除したファイルを表示しない(ファイル名にdeletedを付けたやつを論理削除としている)
  filterDeletedContents(contents) {
    const filteredContents = contents.filter(
      (content) => !content.includes("delete")
    );
    return filteredContents;
  }

  //テキストファイルを除外（画像自動取得プログラムの制御ファイルがたまに残っているため）
  filterText(contents) {
    const filteredContents = contents.filter(
      (content) => !content.includes("txt")
    );
  }

  //不要ファイルを除外する上記メソッドを順に実行するだけ
  filterContents(contents) {
    const filteredContents1 = this.filterDeletedContents(contents);
    const filteredContents2 = this.filterText(filteredContents1);
    return filteredContents2;
  }

  //ページに表示されるコンテンツを番号順に並び変え(フォルダ内のファイルが番号順になっている前提)
  sortContents(contents) {
    const sortedContents = contents.sort((a, b) => {
      const aName = parseInt(a.split(".")[0]);
      const bName = parseInt(b.split(".")[0]);
      return aName - bName;
    });
    return sortedContents;
  }

  //
  createContentsListArr() {}

  setPageNumber(number) {
    this.pageNumber = number;
  }

  //そのページに表示するコンテンツが配列の何番目からかを指定する
  setFirstContentsNumOfPage() {
    this.firstContentsNumOfPage =
      (this.pageNumber - 1) * this.numContentsPerPage;
  }
  //そのページに表示するコンテンツのファイル名配列をセットする
  setContentsOfPage(contents, pageNumber) {
    const firstContentsNumber = this.numContentsPerPage * (pageNumber - 1);
    this.contentsOfPage = contents.slice(
      firstContentsNumber,
      firstContentsNumber + this.numContentsPerPage
    );
  }

  //削除するファイル名文字列(,で区切られた文字列)を受け取ってそれを論理削除する
  deleteFiles(contentsFileNamesStr) {
    return new Promise((resolve, reject) => {
      const contentsToBeDeleted = contentsFileNamesStr.split(",");
      contentsToBeDeleted.forEach((contentFileName) => {
        const oldFileName = path.join(this.targetFolderPath, contentFileName);
        const newFileName = path.join(
          this.targetFolderPath,
          `delete_${contentFileName}`
        );
        fs.renameSync(oldFileName, newFileName);
        resolve();
      });
    });
  }
}
//--------------------------------------------------------------------------------

/* /ietube/images/folderIndPage/作品名/ページ番号 でリクエストしてきたとき */
router.get("/:folderName/:page", function (req, res, next) {
  const folderName = req.params.folderName;
  const page = req.params.page;

  //ページ番号が0等の時には1として表示
  if (page < 1) {
    res.redirect("/ietube/images/folderIndPage/" + folderName + "/" + 1);
  }

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

//--------------------------------------------------------------------------------

module.exports = imageManager;
