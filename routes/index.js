var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var User        = require("../models/user");

//root route

router.get("/", function(req, res){
    req.session.returnTo = req.originalUrl;
    res.render("landing");    
});

//Show register form

router.get("/register", function(req, res){
     if(req.user) {
        req.flash("error", "You are already logged in, you cannot register.");
        return res.redirect("back");
     } else {
        req.session.returnTo = req.originalUrl;
        res.render("register", {page: "register"}); 
     }
});

//handle sign up logic

router.post("/register", function(req, res) {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    //   if(err){
    //     console.log(err);
    //     return res.render("register", {error: err.message});
    //  }
      if(err){
          console.log(err);
          req.flash("error", err.message);
          return res.redirect("/register");
      }
      passport.authenticate("local")(req, res, function(){
          req.flash("success", "Thanks for signing up, " + req.body.firstName + "!");
          req.session.returnTo = req.originalUrl;
          res.redirect("/sites");
      });
  });
});

//Show login

router.get("/login", function(req, res){
   res.render("login", {page: "login"}); 
});


//handling login logic

router.post("/login", passport.authenticate("local", 
    {
        // successRedirect: "/sites",
        failureRedirect: "/login"
        
    
}), function (req, res) {
        req.flash("success", "Welcome back, " + req.body.username + "!");
        //remove code below
        console.log(User);
        res.redirect(req.session.returnTo || '/sites');
        delete req.session.returnTo;
});

// , function(err){
//     if (err){
//         req.flash("error", err.message);
//     }
// }

//logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "You are now logged out");
   res.redirect("/sites");
});

module.exports = router;