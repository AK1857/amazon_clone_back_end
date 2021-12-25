// include libreaty

const router = require('express').Router();
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const { check, validationResult, body } = require('express-validator');
const { status } = require('express/lib/response');

const jwt = require('jsonwebtoken');
const moment=require('moment');
const { token } = require('morgan');
const user = require('./../models/user');

const User = require('./../models/user');

const storage=require('./storage');

const verifyToken=require('./../middleware/verify_token');

const token_key = process.env.TOKEN_KEY;


// middleware setup

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// default route
// access public
//url: localhost://500/api/user
//method:get

router.get('/', (req, res) => {

    res.status(200).json({
        "status": true,
        "message": "default route "
    });

});



// route for user registration 
//access:public
// ursl: localhost://500/user/api/register
// method:post

router.post('/register',
    [
        // check empty field
        check('userName').not().isEmpty().trim().escape(),
        check('password').not().isEmpty().trim().escape(),

        // check email validateion
        check('email').isEmail().normalizeEmail()

    ],
    (req, res) => {

        const errors = validationResult(req);
        // check form validation
        if (!errors.isEmpty()) {

            return res.status(400).json({
                "status": false,
                "errors ": errors.array(),
                "message":"Form validation error"
            });
        }
       




        // checking for eamail existence 
           user.findOne({'email':req.body.email}).then(user=>{

                if(user){
                    return res.status(409).json({
                        'status':false,
                        'message':"Emaail already existe"
                    });
                }
                else{
                    
                    // Hash user password
                    const salt = bcrypt.genSaltSync(10);
                    const hasdedPassword = bcrypt.hashSync(req.body.password, salt);

                    // Create user object from model
                    const newUser= new User({

                        'email':req.body.email,
                        'username':req.body.userName,
                        'password':hasdedPassword
    
                     });

                     // Insert new user
                        newUser.save().then((result)=>{
                            return res.status(200).json({
                                'status':true,
                                'user':result
                            });
                        }).catch( error=>{
                            return res.status(502).json({
                                'status':false,
                                'error':error
                            });
                        });
                }
           }).catch(error=>{

            return res.status(502).json({
                'status':false,
                'error':error
            });
           });

        // return res.status(200).json({
        //     "status": true,
        //     "data": req.body,
        //     "hasdedPassword": hasdedPassword
        // });


    });


// route for upload profile pic
//access:public
// ursl: localhost://500/user/api/uploadProfilePic
// method:post

router.post('/uploadProfilePic',
    verifyToken,
    (req,res)=>{

    let upload=storage.getProfilePicUpload();

    upload(req,res,(error)=>{   

        // profile pic upload has an arror
        if(error){
            return res.status(400).json({
                "status": false,
                "errors ": error.array,
                "message":"File upload fail.."
            });
        }

        // file not selected
        if(!req.file){
           return res.status(400).json({
                "status": false,
                "errors ": error.array,
                "message":"Form validation error"
            });
        }

        


        let temp={
            profile_pic:req.file.filename,
            updateAt:moment().format("DD/MM/YYYY")+";"+moment().format("hh:mm:ss")
        }
        // stor file name from user document

        User.findOneAndUpdate({_id:req.user.id},{$set:{ temp }})
        .then(user=>{
            return res.status(200).json({
                "status": true,
                
                "message":"File Upload success",
                "profile_pic":"http://localhost:500/profile_pic/"+req.file.filename
            });
        })
        .catch(error=>{
            return res.status(502).json({
                "status": false,
                "errors ": errors.array(),
                "message":"Database errror founded"
            });
        });
    
    }); 
}); // uploadProfilePic router end


 // route for user login 
//access:public
// ursl: localhost://500/user/api/uploadProfilePic
// method:post


router.post('/login',
    [
        // check empty field

        check('password').not().isEmpty().trim().escape(),

        // check email validateion
        check('email').isEmail().normalizeEmail()

    ],
    (req,res)=>{

        const errors = validationResult(req);
        // check form validation
        if (!errors.isEmpty()) {

            return res.status(400).json({
                "status": false,
                "errors ": errors.array(),
                "message":"Form validation error"
            });
        }


        
        // checking for eamail existence 
        user.findOne({'email':req.body.email}).then(user=>{


            // if user dont exist
            if(!user){
                return res.status(404).json({
                    'status':false,
                    'message':"User dont exist"
                });
            }
            else{

                // match user password
                let isPasswordMatch=bcrypt.compareSync(req.body.password,user.password);
                
                //JSON WEB TKEN GENERATE

                let token=jwt.sign({
                    id:user._id,
                    email:user.email,
                },
                token_key,
                {
                    expiresIn:3600,
                });





                // check is password match
                    if(isPasswordMatch){
                        return res.status(200).json({
                            'status':true,
                            'Message':"user login success",
                            'token':token,
                            'user':user
                        });
                    }





                else{
                    return res.status(401).json({
                        'status':false,
                        'Message':"Password not match.."
                    });
                }
                
            }
       }).catch(error=>{

        return res.status(502).json({
            'status':false,
            'error':" Database Error"+error
        });
       });

    
});


// verity token




module.exports = router;


