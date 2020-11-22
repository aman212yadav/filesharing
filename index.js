const express=require("express");
const app=express();
const bodyparser = require('body-parser')
const path=require('path')
const PORT=process.env.PORT || 3000 ;

const connectDb=require('./config/db');
connectDb();
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
app.set('view engine', 'ejs');
app.use('/api/files',require('./routes/files'));
app.use('/files',require('./routes/show'));
app.use('/files/download',require('./routes/download'));

app.listen(PORT,()=>{
  console.log(`server started at port ${PORT}`);
});
