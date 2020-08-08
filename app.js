var express        = require("express");
var app            = express();
var port           = 8080;
var bodyParser     = require("body-parser")
var flash          = require("connect-flash");
var methodOverride = require("method-override");
var passport       = require("passport");
var LocalStrategy  = require("passport-local");
var Campground     = require("./models/campground")
var Comment        = require("./models/comments");
var user           = require("./models/user");
var seedDB         = require("./seeds")


var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");
//Config.
var urlencodedParser = app.use(bodyParser.urlencoded({ extended: false}))
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");
var mongoose = require("mongoose");
const campground = require("./models/campground");
//seedDB(); //seed Database.


//Passport Config.
app.use(require("express-session")({
    secret: "Stay hungry,Stay foolish",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()))
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error= req.flash("error");
    res.locals.success = req.flash("success");
    next();
});
//======================================================
//Connections.
//======================================================
try{
    mongoose.connect("mongodb+srv://Abhinandan:Selenagomez22@cluster0-uqx3h.mongodb.net/video?retryWrites=true&w=majority",{useNewUrlParser: true,  useUnifiedTopology: true})
}catch(error){
    console.log(error);
}

app.use(indexRoutes);
app.use(commentRoutes);
app.use("/campgrounds",campgroundRoutes); //This appends "/campgrounds" to campgrounds.js file routes.

app.listen(port,()=>`${port}`,function(){
    console.log("Server Started");
})