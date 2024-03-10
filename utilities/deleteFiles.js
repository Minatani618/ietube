const fs = require("fs")
const path = require("path")
const ietubeImagesFolderPath ="\\\\ms\\Users\\minatani\\Desktop\\programs\\ietube_v2\\public\\images"
let contentCount =0
let deletedCount =0

//対象iamgesフォルダ
const imagesSubFolders=fs.readdirSync(ietubeImagesFolderPath)

//作品フォルダループ
for (let i = 0; i <imagesSubFolders.length;i++){
    const folderPath =path.join(ietubeImagesFolderPath,imagesSubFolders[i])
    const contents= fs.readdirSync(folderPath)

    //ファイルごとループ
    for(let j = 0;j<contents.length;j++){

        //名前にdeleteとついていると論理削除なのでそれをカウントして削除
        const isDeleted = contents[j].includes("delete") ? true : false
        if(isDeleted){
            contentCount+=1
            deletedCount+=1
            const contentName = path.join(folderPath,contents[j])
            console.log(contentName)
            fs.unlinkSync(contentName) //削除
        }
        else{
            contentCount+=1 //削除でないならカウントのみ
        }

        if(contents[j].endsWith("txt")){
            console.log(imagesSubFolders[i])
            const contentName = path.join(folderPath,contents[j])
            fs.unlinkSync(contentName) //削除
        }



        }
    
    //ファイルが一つもないフォルダは削除する
    if(fs.readdirSync(folderPath).length==0){
        fs.rmSync(folderPath, { recursive: true })
    }
}

//結果表示
console.log("contentsCount:" + contentCount)
console.log("deletedCount:"+ deletedCount)
console.log((contentCount-deletedCount)/contentCount*100)