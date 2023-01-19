require('dotenv').config()
const express = require('express')
const multer = require('multer')
const fs = require('fs')
const Imgup = require('./models/Imgup')
const { connect,set } = require('mongoose')
const app = express()

const storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,"images")
    },
    filename:(req,file,cb) => {
        cb(null, new Date().toISOString() + file.originalname)
    }
})

const fileFilter = (req,file,cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ||  file.mimetype === 'image/jpg'){
        cb(null,true);
    }
    else{
        console.log("not supported file format");
        cb(null,false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter
})

app.post("/upload",upload.array("file",10),async(req,res) => {
    try {
        if (req.files.length <= 0) {
          return res
            .status(400)
            .json("You must select at least 1 file.");
        }
        let files = req.files;
        let imgArray = files.map((file) => {
            let img = fs.readFileSync(file.path);
            return encodeImg = img.toString('base64')
        });
        imgArray.map((src,index) => {
            let finalImg = {
                fileName : files[index].originalname,
                fileType : files[index].mimetype,
                fileForm : src
            }
            let newImg = new Imgup(finalImg)
            newImg.save().then(() => console.log("successfully uploaded in mongoDB")).catch((err) => console.log(err));
        })
        return res.status(200).send("Files have been uploaded");
    }
    catch(err){
        console.log(err);

        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          return res.status(400).json("Too many files to upload.");
        }
        return res.status(500).json(`Error when trying upload many files: ${err}`);
    }
})


app.use(express.json())

set('strictQuery', false)
connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
}).then(() => console.log("mongo db connected")).catch((err) => console.log(err));

app.listen(process.env.PORT,(err) => {
    if(err) throw err;
    console.log("port connected");
})
