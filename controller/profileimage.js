import multer from 'multer'
import { existsOrNotImage , profileImageSave , getImageData, updateProfile,getProfile } from '../models/imageModel.js';
import path from  'path';
import fs from  'fs';
const imagePath = path.join(process.cwd(), 'uploadsimage');
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null,'uploadsimage'); 
    },
    filename: (req, file, callback) => {
      const timestamp = Date.now();
      callback(null, `${timestamp}_${file.originalname}`);
    },
  });
const upload = multer({ storage: storage })
const profileImage = async (req,res) =>{
  try{
    const id = req.body.id
    const existsImage = await existsOrNotImage([id])
    if(existsImage.rows[0].count==0){
      const data= await profileImageSave([id,req.file.path])
      res.status(200).send('Profile image has been saved.');
    }
    else{
      const image = await getImageData([id])
      const imageName =  image.rows[0].image_name
      fs.unlink(imageName,(error)  => error)
      await updateProfile([req.file.path,id])
      res.status(200).send('Profile image has been updated.');

    } 
  }
  catch(error){
    console.log(error)
  }
}
const userProfile =  async(req,res) =>{
  try{
    const userId = req.params.id;
    const imageData = await getProfile([userId])
    const image = imageData.rows[0].image_name.slice(13)
    const imagePathFull = path.join(imagePath,image );
    res.sendFile(imagePathFull);
  }
    catch(error){

    }
  }
export { profileImage,upload, userProfile}