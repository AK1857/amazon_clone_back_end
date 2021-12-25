const jwt=require('jsonwebtoken');
const User = require('../models/user');

const token_key=process.env.TOKEN_KEY;



function verifyToken(req,res,next)
{
    // reqd jwt token from htttp hreader

    const token=req.headers['x-access-token'];

    if(!token){
        return res.status(404).json({
            'status':true,
            'Message':"json web toke not found..",
           
        });
    }

    jwt.verify(token,token_key,function (error,decoded) {

        // check error
        if(error){
            return res.status(404).json({
                'status':true,
                'Message':"json web toke not Decoded..",
                'error':error
               
            });
        }

    // check user existing in database or not

    User.findById(decoded.id,{password:0,createdAt:0,updatedAt:0,profile_pic:0})
    .then(user=>{
        // check user is empty
        if(!user){ 
            return res.status(401).json({
                'status':false,
                'Message':"user not eist",
                'error':error
            
            });
    }

    // set user object in request object
        req.user={
        id:user._id,
        password:user.password,
        email:user.email,
        username:user.username
        };

        return next();

    })
    .catch(error=>{
        return res.status(502).json({
            'status':false,
            'Message':"Database Error",
            'error':error
           
        });
    })
   

    });
}

module.exports=verifyToken;