require('dotenv').config()  // using dotenv you can use  values in enviroment file

const express=require('express')
const app =express()

const cors=require('cors')
const morgan=require('morgan')


port=process.env.PORT;

const database=require('./database');

//middle ware

app.use(cors()) ;
app.use(morgan('dev'));

//rout

app.get('/',(req,res)=>{

return res.status(200).json({
    'status':true,
    'message':"server run"
})
});


// start server
app.listen( port,()=>{
    console.log("Server runing at port number"+port);
})