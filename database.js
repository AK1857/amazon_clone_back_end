const mongoose=require('mongoose');
const assert=require('assert');

const db_url=process.env.DB_URL;


// stablished database connection
mongoose.connect(

    db_url,{
        useNewUrlParser: true, 
        useUnifiedTopology: true ,
        useCreateIndex:null,
        useFindAndModify:null
    },
    (error,link)=>{

        // chexk errro

        assert.strictEqual(error,null,'DB Connection failed...'+error);

        // success
        console.log("database connection establesd.... ")

    }
);