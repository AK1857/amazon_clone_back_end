// include libreaty

const router = require('express').Router();
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const { check, validationResult, body } = require('express-validator');
const { status } = require('express/lib/response');

const jwt = require('jsonwebtoken');
const moment = require('moment');
const user = require('./../models/user');

const User = require('./../models/user');

const token = process.env.TOKEN_KEY;

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
                "errors for empty field": errors.array()
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





module.exports = router;


