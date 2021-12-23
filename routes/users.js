// include libreaty

const router=require('express').Router();
const bcrypt=require('bcryptjs');
const bodyParser=require('body-parser');

const {check,validationResult}=require('express-validator');

const jwt=require('jsonwebtoken');
const moment=require('moment');

const User=require('./../models/user');

const token=process.env.TOKEN_KEY;

// middleware setup

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended :true}));

// default route
// access public
//url: localhost://500/user

router.get('/',(req,res)=>{

    res.status(200).json({
        "status":true,
        "message":"default route "
    });

});


module.exports=router;


