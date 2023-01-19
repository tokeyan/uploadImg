const {Schema,model} = require('mongoose')

const uploadImg = new Schema({
    fileName : {
        type:String,
        required: true
    },
    fileType : {
        type:String,
        required: true
    },
    fileForm : {
        type:String,
        required: true
    }
})

module.exports = model("Imgup",uploadImg);