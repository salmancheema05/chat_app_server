import { AllFriendsList } from "../models/AllModel.js"
import path from  'path';
import fs from  'fs';
const imagePath = path.join(process.cwd(), 'uploadsimage');
const allfriend = async (req,res)=>{
    try{
        let newArray =[]
        const id = req.params.id
        const result = await AllFriendsList([id])
        const arrayLength = result.rows.length
            for(let i=0;i<arrayLength;i++){
                if(result.rows[i].image_name!=null){
                    let dataObject = result.rows[i]
                    let imageName = dataObject.image_name.slice(13)
                    let imagePathFull = path.join(imagePath ,imageName);
                    let imageData = fs.readFileSync(imagePathFull, { encoding: "base64" })
                    dataObject.image_name=imageData
                    newArray.push(dataObject)
                }
                else{
                    newArray.push(result.rows[i])
                }
            }
            res.status(200).send(newArray)
    }
    catch(error){
        res.status(500).send({'error':"server error"})
    }
}
export {allfriend}