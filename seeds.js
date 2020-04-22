var mongoose = require("mongoose");
var movie = require("./models/movie");
var comment = require("./models/comments");

var data = [
    {
        name : "Inception", 
        image: "https://resizing.flixster.com/Kt6tZT-7ljgnLjQx96NTO_0R8t8=/206x305/v1.bTsxMTE2NjcyNTtqOzE4NDQ0OzEyMDA7ODAwOzEyMDA",
        description:"A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O."
    },
    {
        name : "The Dark Knight", 
        image: "https://upload.wikimedia.org/wikipedia/en/8/8a/Dark_Knight.jpg",
        description:"A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O."
    },
    {
        name : "Inception", 
        image: "https://resizing.flixster.com/Kt6tZT-7ljgnLjQx96NTO_0R8t8=/206x305/v1.bTsxMTE2NjcyNTtqOzE4NDQ0OzEyMDA7ODAwOzEyMDA",
        description:"A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O."
    },
]

function seedDB(){
    movie.remove(function(err){
        // if(err){
        //     console.log(err);
        // }
        // console.log("Removed movies");
        // data.forEach(function(element){
        //     movie.create(element,function(err,movie){
        //         if(err){
        //             console.log(err);
        //         }else {
        //             comment.create({
        //                 text:"This is a iconic movie.",
        //                 author:" Homer "
        //             },function(err ,comment){
        //                 if(err){
        //                     console.log(err);
        //                 }else{
        //                     movie.comments.push(comment);
        //                     movie.save();
        //                 }
        //             })
        //         }
        //     })
        // })
    })
}

module.exports = seedDB;