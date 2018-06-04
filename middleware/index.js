var Site            = require("../models/site");
var Comment         = require("../models/comment");
var middlewareObj   = {};

middlewareObj.checkSiteOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Site.findById(req.params.id, function(err, site){
            if (err || !site){
                console.log("Something went wrong");
                req.flash("error", "Site not found.");
                res.redirect("back");
            } else {
                //Does user own site?
                if (site.author.id.equals(req.user._id)){
                    next(); 
                } else {
                    req.flash("error", "You don't have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err || !foundComment){
                console.log(err);
                req.flash("error", "Comment not found.");
                res.redirect("back");
            } else {
                //Does user own comment?
                if (foundComment.author.id.equals(req.user._id)){
                    next(); 
                } else {
                    req.flash("error", "You don't have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that.");
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
};

module.exports = middlewareObj;