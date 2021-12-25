const multer= require('multer');
const random=require('randomstring');
const path=require('path');
const { getFips } = require('crypto');



// validate image file type
function checkFileType(file,cb){

    // allwed extension
    const allowedType=/jpeg|jpg|png|gif/

    // match file extension

    const isMatchExt= allowedType.test((path.extname(file.originalname)).toLowerCase());

    // match mime type

    const isMIMEmatch=allowedType.test(file.mimetype);

    if(isMIMEmatch&& isMIMEmatch){
        cb(null,true);
    }
    else{
        cb("Error: File type not supported");
    }
}



/// upload profile pic
function getProfilePicUpload(){

    let storage=multer.diskStorage({
        destination:function(req,file,cb){
            cb(null,'./public/profile_pic');
        },
        filename: function(req,file,cb){
            let p1=random.generate(5);
            let p2=random.generate(5);
            let ext=(path.extname(file.originalname)).toLowerCase();

            cb(null,p1+"_"+p2+ext);
        },
        
    });



    return multer({
        storage:storage,
        limits:{
            fileSize:1000000,
        },
        fileFilter:function(req,file,cb){

            checkFileType(file,cb);
        }

       
    }).single('profile_pic')

}


module.exports={
    getProfilePicUpload
}