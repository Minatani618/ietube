/* ejs metaDivからの要素取得 */
const colNum = parseInt(document.getElementById("metaColNum").textContent);
const DisplayNumOfPage = parseInt(
  document.getElementById("metaDisplayNumOfPage").textContent
);
const folderName = document.getElementById("metaFolderName").textContent;
const contentListElements = document.getElementsByClassName("metaContentName");

/* 表示ファイル名を配列格納 */
const contentList = Array.from(contentListElements).map((element) => {
  return element.textContent;
});

/* 要素作成・追加 */
const displayContainer = document.getElementById("contentDisplayContainer");

const rowCount = Math.round(contentList.length / colNum);
const contentImgWidth = 97 / colNum;

console.log(rowCount);

let contentsCount = 0;
for (let i = 1; i <= rowCount; i++) {
  const rowContainer = document.createElement("div");
  rowContainer.classList.add("rowContainer");

  for (let j = 1; j <= colNum; j++) {
    const contentImg = document.createElement("img");
    contentImg.src = "/images/" + folderName + "/" + contentList[contentsCount];
    contentImg.classList.add("contentImg");
    contentImg.addEventListener("click", () => {
      contentImg.classList.toggle("selected");
    });
    contentImg.style.width = `${contentImgWidth}%`;
    rowContainer.appendChild(contentImg);
    contentsCount += 1;
  }

  displayContainer.appendChild(rowContainer);
}

/* ------------------------------------------------------- */
const selectOptFunc = async (event, opt) => {
  event.preventDefault(); // ボタンを押したときのデフォルトのフォーム送信を防ぐ
  const selectedContents = await collectSelectedContents();

  // deleteの場合
  if (opt == "delete") {
    //選択されたコンテンツを収集し文字列に
    const selectedContentsFileName = selectedContents.map((content) => {
      const srcUrl = content.src;
      const fileName = srcUrl.split("/")[5];
      return fileName;
    });
    let selectedFilenameStr = "";
    selectedContentsFileName.forEach((filename) => {
      selectedFilenameStr += `,${filename}`;
    });

    //input要素作成追加
    const deleteInput = document.createElement("input");
    deleteInput.name = "delete";
    deleteInput.value = selectedFilenameStr;
    deleteInput.type = "hidden";
    const deleteSelectedContentsForm = document.getElementById(
      "deleteSelectedContentsForm"
    );
    deleteSelectedContentsForm.appendChild(deleteInput);

    //POST送信
    document.getElementById("deleteSelectedContentsForm").submit();
  }
};

/* ------------------------------------------------------- */

// ボタンにクリックイベントリスナーを追加
document.getElementById("selectOptDelete").addEventListener("click", () => {
  selectOptFunc(event, "delete");
});

const collectSelectedContents = () => {
  return new Promise((resolve, reject) => {
    const selectedContents = Array.from(
      document.getElementsByClassName("selected")
    );
    resolve(selectedContents);
  });
};

/* test用 */
const sleep = (sec) => {
  return new Promise((resolve, reject) => {
    setTimeout((sec) => {
      resolve();
    }, sec * 1000);
  });
};

/* 選択入れ替え */
const switchSelectContentsBtn = document.getElementById("selectOptSwitch");
const switchSelectContents = (event) => {
  event.preventDefault();
  const contentDisplayContainer = document.getElementById(
    "contentDisplayContainer"
  );
  const selectedContents = Array.from(
    contentDisplayContainer.getElementsByTagName("img")
  );
  selectedContents.forEach((img) => {
    img.classList.toggle("selected");
  });
  console.log(selectedContents);
};
switchSelectContentsBtn.addEventListener("click", switchSelectContents);
