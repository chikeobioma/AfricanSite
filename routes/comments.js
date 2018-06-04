var express         = require("express");
var router          = express.Router({mergeParams: true});
var Site            = require("../models/site");
var Comment         = require("../models/comment");
var middlewareObj   = require("../middleware");

//COMMENTS NEW

router.get("/new", middlewareObj.isLoggedIn, function(req, res) {
    Site.findById(req.params.id, function(err, site){
        if (err){
            console.log("Something went wrong");
            console.log(err);
        } else {
            req.session.returnTo = req.originalUrl;
            res.render("comments/new", {site: site});      
        }
    });
});

//COMMENTS CREATE

router.post("/", middlewareObj.isLoggedIn, function(req, res){
   Site.findById(req.params.id, function(err, site){
       if(err){
           console.log(err);
           req.flash("error", "Something went wrong.");
           res.redirect("/sites");
       } else {
           Comment.create(req.body.comment, function(err, comment){
              if (err){
                  console.log(err);
              } else {
                  //add username and id to comment
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  //save the comment
                  comment.save();
                  site.comments.push(comment);
                  site.save();
                  req.flash("success", "Your review has been added.");
                  req.session.returnTo = req.originalUrl;
                  res.redirect("/sites/" + site._id);
              }
           });
           
       }
   }); 
});

//COMMENT EDIT ROUTE

router.get("/:comment_id/edit", middlewareObj.checkSiteOwnership, middlewareObj.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
       if (err){
           res.redirect("back");
       } else {
           res.render("comments/edit", {site_id: req.params.id, comment: foundComment});
       }
    });
});

//COMMENT UPDATE ROUTE

router.put("/:comment_id", middlewareObj.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err){
            res.redirect("back");
        } else {
            req.flash("success", "Your review has been updated.");
            res.redirect("/sites/" + req.params.id);
        }
    });
});

// COMMENT DESTROY ROUTE

router.delete("/:comment_id", middlewareObj.checkCommentOwnership, function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Your review has been successfully deleted.");
           res.redirect("/sites/" + req.params.id);
       }
   });
});

module.exports = router;