var mongoose = require("mongoose");

var movieSchema = new mongoose.Schema({
    name: String,
    image : String,
    animename : String,
    description : String,
    createdAt : {type: Date , default : Date.now},
    author: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref:"user"
            },
            username : String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }

    ]
});

module.exports  = mongoose.model("movie", movieSchema);