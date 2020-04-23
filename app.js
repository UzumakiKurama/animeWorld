var express               = require("express");
var app                   = express();
var request               = require("request");
var flash                 = require("connect-flash");
var bodyParser            = require("body-parser");
var mongoose              = require("mongoose");
var movie_model           = require("./models/movie");
var comment               = require("./models/comments");
var user                  = require("./models/user");
var seeds                 = require("./seeds");
var methodOverride        = require("method-override");
var passport              = require("passport");
var localStrategy         = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var multer                = require("multer");
var cloudinary            = require('cloudinary');
var moment                = require("moment");

//image upload logic
var storage = multer.diskStorage({
    filename: function(req, file, callback) {
      callback(null, Date.now() + file.originalname);
    }
  });

var imageFilter = function (req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
          return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
  };
var upload = multer({ storage: storage, fileFilter: imageFilter})
  
cloudinary.config({ 
    cloud_name: 'kurama', 
    api_key: '172453226996526', 
    api_secret: 'A3IJVU6oOX7sigLeUMrr2OLjy98'
});

//seeds();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use(require("express-session")({
    secret: "This is a secret message",
    resave: false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
app.set("view engine","ejs");
// mongoose.connect("mongodb://localhost/movieWorld" ,{useNewUrlParser:true , useUnifiedTopology:true , useFindAndModify:false});
mongoose.connect("mongodb+srv://abhijeet:abhirock@cluster0-blgmm.mongodb.net/test?retryWrites=true&w=majority" ,{useNewUrlParser:true , useUnifiedTopology:true , useFindAndModify:false});

app.get("/",function(req,res){
    res.render("landing");
});

app.get("/movie",function(req,res){
    movie_model.find({},function(err,allmovie){
        if(err){
            console.log("Error :" + err);
        } else {
            res.render("index",{movie :allmovie});     
        }
    });
});

app.post("/movie",isLoggedIn, upload.single('image') ,function(req,res){
    cloudinary.uploader.upload(req.file.path, function(result) {
        // add cloudinary url for the image to the campground object under image property
        req.body.movie.image = result.secure_url;
        // add author to campground
        req.body.movie.author = {
          id: req.user._id,
          username: req.user.username
        }
        movie_model.create(req.body.movie, function(err, movie) {
          if (err) {
            req.flash('error', err.message);
            return res.redirect('back');
          }
          res.redirect('/movie/' + movie.id);
        });
      });
});

app.get("/movie/new",isLoggedIn,function(req,res){
    res.render("new");
});

app.get("/movie/:id",isLoggedIn,function(req,res){
    movie_model.findById(req.params.id).populate("comments").exec(function(err,desc){
        if(err){
            console.log(err);
        } else{
            res.render("show",{movie:desc});        
        }
    });
});

app.post("/movie/:id/comments",function(req,res){
    movie_model.findById(req.params.id,function(err,movie){
        if(err){
            console.log(err);
        } else{
            comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    movie.comments.push(comment);
                    movie.save();
                    res.redirect("/movie/" + movie._id)
                }
            })
        }
    })
})

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    let newUser = new user({username:req.body.username});
    user.register(newUser,req.body.password,function(err,user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Welcome to animeWorld  " + user.username);
            res.redirect("/movie");
        })
    });
});

app.get("/login" ,function(req,res){
    res.render("login");
})

app.post("/login",passport.authenticate("local",{
    successRedirect : "/movie",
    failureRedirect:"/login"
}),function(req,res){
});

app.get("/logout",function(req,res){
    req.logout();
    req.flash("success","You successfully logged out");
    res.redirect("/movie");
});

//Edit and Update Routes
app.get("/movie/:id/edit",function(req,res){
    movie_model.findById(req.params.id,function(err,movie){
        if(err){
            console.log(err);
            res.redirect("/movie/:id");
        }else{
            if(movie.author.id.equals(req.user._id)){
                res.render("movie_edit",{movie:movie});
            }else {
                req.flash("error","You don't have permission to do that.This is not your post.");
                res.redirect("back");
            }
        } 
    })

});

app.put("/movie/:id",function(req,res){
    let updatedMovie = {
        name: req.body.name,
        image: req.body.image,
        description : req.body.desc
    }
    movie_model.findByIdAndUpdate(req.params.id,updatedMovie,function(err,movie){
        if(err){
            console.log(err);
        } else{
            res.redirect("/movie/"+ req.params.id);
        }
    });
});

// Delete routes

app.delete("/movie/:id",userAuthentication,function(req,res){
    movie_model.findByIdAndRemove(req.params.id , function(err,deleted){
        if(err){
            console.log(err);
        }else{
            res.redirect("/movie");
        }
    })
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please login to add a post");
    res.redirect("/login");
}
 
function userAuthentication(req,res,next){
    movie_model.findById(req.params.id,function(err,movie){
        if(err){
            console.log(err);
            res.redirect("/movie/:id");
        }else{
            if(movie.author.id.equals(req.user._id)){
                next();
            }else {
                req.flash("error","You don't have permission to do that.You did not post this.");
                res.redirect("back");
            }
        } 
    })
}

app.listen(3000,function(){
    console.log("Yelcamp started ....");
});