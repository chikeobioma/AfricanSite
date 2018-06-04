var express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    Site                = require("./models/site"),
    seedDB              = require("./seeds"),
    User                = require("./models/user"),
    passport            = require("passport"),
    flash               = require("connect-flash"),
    localStrategy       = require("passport-local"),
    Comment             = require("./models/comment"),
    methodOverride      = require("method-override");
    
//Requiring routes
var siteRoutes          = require("./routes/sites"),
    commentRoutes       = require("./routes/comments"),
    indexRoutes         = require("./routes/index");

var url = process.env.DATABASEURL || "mongodb://localhost/v13";
mongoose.connect(url);


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// seedDB(); //Seed the DB

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Ifeanyi Obioma is the greatest",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
   
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//require route

app.use("/", indexRoutes);
// app.use(indexRoutes);

app.use("/sites", siteRoutes);
// app.use(siteRoutes);

app.use("/sites/:id/comments", commentRoutes);
// app.use(commentRoutes);

     
// app.listen(8080, '0.0.0.0', function(){
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The African Sites app is now running...");
});