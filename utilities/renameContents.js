//説明
//ファイル名が連番の数字になっていないフォルダに対して、新たにすべてのファイルの名前を振りなおす
//以下のパスを編集してこのファイルを実行する
const targetPath ="\\\\ms\\Users\\minatani\\Desktop\\programs\\ietube_v2\\public\\images\\jpgs2"

const fs = require("fs")
const path = require("path")

const contents=fs.readdirSync(targetPath)

let contentsCount =1

for(content of contents){
    const contentPath = path.join(targetPath,content)
    const ext=path.extname(contentPath)
    const fileName = contentsCount + ext
    const newPath = path.join(targetPath,fileName)
    fs.renameSync(contentPath,newPath)
    contentsCount+=1
}