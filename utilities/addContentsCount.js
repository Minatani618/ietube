/* 各フォルダに残っているコンテンツ数をカウントしてそれをフォルダ先頭につける */
const fs = require("fs");
const path = require("path");

const ietubeImagesFolderPath =
  "\\\\ms\\Users\\minatani\\Desktop\\programs\\ietube_v2\\public\\images";

const folders = fs.readdirSync(ietubeImagesFolderPath);

for (folder of folders) {
  const folderPath = path.join(ietubeImagesFolderPath, folder);
  const contents = fs.readdirSync(folderPath);
  const newFolderName = contents.length + "_" + folder;
  const newFolderPath = path.join(ietubeImagesFolderPath, newFolderName);
  fs.renameSync(folderPath, newFolderPath);
}
