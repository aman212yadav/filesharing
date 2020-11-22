const router=require('express').Router();
const multer=require('multer');
const path=require('path');
const File=require('../models/file');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null,  Date.now() + path.extname(file.originalname));
    }
});
let upload = multer({
     storage,
     limit:{fileSize:1000000*100}
}).single('myfile');

router.post('/',(req,res)=>{

      // store files
        upload(req,res,async (err)=>{
          // validate
              if(!req.file){
                return res.json({error:"All fields are required."});
              }
          if(err){
            res.status(500).send({error:err.message})
          }
          const file=new File({
            filename:req.file.filename,
            uuid:uuidv4(),
            path:req.file.path,
            size:req.file.size
          });
          const response =await file.save();
          return res.json({file:`${process.env.APP_BASE_URL}/files/${response.uuid}`});

        });

      // store into datatbase

      // respsonse link - >
});
router.post("/send",async (req,res)=>{
  console.log(req.body);
  const uuid = req.body.uuid;
  const emailTo=req.body.emailTo;
  const emailFrom=req.body.emailFrom
  console.log(uuid);

  if(!uuid || !emailTo ||!emailFrom){
    return res.status(422).send({error:"All fields are required. "});
  }
  const file=await File.findOne({uuid:uuid});
  if(file.sender){
    return res.status(422).send({error:"Mail already sent. "});
  }
  file.sender=emailFrom;
  file.receiver=emailTo;
  const response=file.save();
  const sendMail=require('../services/emailService');
  sendMail({
    from:emailFrom,
    to:emailTo,
    subject:'Nit delhi file sharing',
    text:`$(emailFrom) shared a file with you`,
    html: require('../services/emailTemplate')(
          {
            emailFrom:emailFrom,
            downloadLink:`${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size:parseInt(file.size/1000)+'KB',
            expires:'24 hrs'
          }
    )
  })
  res.send({success:true});
});

module.exports=router;
