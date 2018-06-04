var express         = require("express");
var router          = express.Router();
var Site            = require("../models/site");
var middlewareObj   = require("../middleware");

//INDEX - Show all sites
router.get("/", function(req, res){
    Site.find({}, function(err, allSites){
        if(err){
            console.log("Something is not right.");
            console.log(err);
        } else {
            req.session.returnTo = req.originalUrl;
            res.render("sites/index", {sites: allSites, page: "sites"});
        }
    });
});

//CREATE - Add new site to DB
router.post("/", middlewareObj.isLoggedIn, function(req, res){
    var name    = req.body.name,
        image   = req.body.image,
        price   = req.body.price,
        desc    = req.body.description,
        author  = {
            id: req.user._id,
            username: req.user.username
        };
    var newSite = {name: name, image: image, price: price, description: desc, author: author};
    // site.push(newSite);
    
    Site.create(newSite, function(err, newlyCreated){
       if(err){
           console.log("Something went wrong.");
           console.log(err);
       } else {
           req.session.returnTo = req.originalUrl;
           res.redirect("sites");
       }
    });
});

//NEW - Show form to create new site

router.get("/new", middlewareObj.isLoggedIn, function(req, res) {
    req.session.returnTo = req.originalUrl;
    res.render("sites/new");
});

// SHOW - shows more info about one site

router.get("/:id", function(req, res) {
   Site.findById(req.params.id).populate("comments").exec(function(err, foundsite){
       if(err || !foundsite){
           console.log("Something went wrong.");
           req.flash("error", "Site not found.");
           res.redirect("back");
       } else {
           console.log(foundsite);
           req.session.returnTo = req.originalUrl;
           res.render("sites/show", {site: foundsite});
       }
   }); 
});

//Edit Sites route

router.get("/:id/edit", middlewareObj.checkSiteOwnership, function (req, res) {
    Site.findById(req.params.id, function(err, site){
        if (err){
            console.log(err);
        } else{
            req.session.returnTo = req.originalUrl;
            res.render("sites/edit", {site: site});
        }
    });
});

// Update Route

router.put("/:id", middlewareObj.checkSiteOwnership, function (req, res){
    Site.findByIdAndUpdate(req.params.id, req.body.site, function(err, updatedSite){
        if(err){
            console.log(err);
            res.redirect("/sites");
        } else {
            res.redirect("/sites/" + req.params.id);
        }
    });
});

// Destroy Route

// router.get("/:id/delete", function(req, res){
//   Site.findByIdAndRemove(req.params.id, function(err){
//      if(err){
//          console.log(err);
//          res.redirect("/sites");
//      } else {
//          res.redirect("/sites");
//      }
//   });
// });

// Destroy Route

router.delete("/:id", middlewareObj.checkSiteOwnership, function(req, res){
  Site.findByIdAndRemove(req.params.id, function(err){
     if(err){
         console.log(err);
         res.redirect("/sites");
     } else {
         res.redirect("/sites");
     }
  });
});

module.exports = router;