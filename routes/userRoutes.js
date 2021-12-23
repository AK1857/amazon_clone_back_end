// include libreaty

const router=require('express').Router();
const bcrypt=require('bcryptjs');
const bodyParser=require('body-parser');

const {check,validationResult, body}=require('express-validator');

const jwt=require('jsonwebtoken');
const moment=require('moment');

const User=require('./../models/user');

const token=process.env.TOKEN_KEY;

// middleware setup

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended :true}));

// default route
// access public
//url: localhost://500/api/user
//method:get

router.get('/',(req,res)=>{

    res.status(200).json({
        "status":true,
        "message":"default route "
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
        (req,res)=>{

            const errors=validationResult(req);
            // check form validation
            if(!errors.isEmpty()){

                return res.status(400).json({
                    "status":false,
                    "errors":errors.array()
                });
            }
            

            const saltvalue=bcrypt.genSaltSync(10);
            const hasdedPassword=bcrypt.hashSync(req.body.password,saltvalue);
                return res.status(200).json({
                    "status":true,
                    "data":req.body,
                    "hasdedPassword":hasdedPassword
                });
            

        });





module.exports=router;


