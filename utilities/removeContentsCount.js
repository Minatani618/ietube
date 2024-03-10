const fs = require("fs")
const path = require("path")
const ietubeImagesFolderPath ="\\\\ms\\Users\\minatani\\Desktop\\programs\\ietube_v2\\public\\images"

const folderNames = fs.readdirSync(ietubeImagesFolderPath)

for(folderName of folderNames){
    const oldFolderPath = path.join(ietubeImagesFolderPath,folderName)
    const newFolderName = folderName.replace(/.*_/g,"")
    const newFolderPath = path.join(ietubeImagesFolderPath,newFolderName)
    fs.rename(oldFolderPath,newFolderPath,()=>{
        console.log(newFolderName)
    })
}
