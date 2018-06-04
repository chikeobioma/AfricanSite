var mongoose    = require("mongoose"),
    Site        = require("./models/site"),
    Comment     = require("./models/comment"),
    data = [
        {
            name: "Nigeria",
            image: "https://i.onthe.io/vllkyt3e8ujvphqlpg.e94eeb51.jpg",
            description: "Divide behold Days whose days over man cattle deep was them under isn't. Fill kind every Void upon bearing multiply fish, meat. Behold yielding rule i replenish subdue won't beast earth kind Won't seasons bearing tree set were day night dominion. Moveth land stars all wherein also. Subdue may them night dry divided, all evening be thing let earth she'd form let spirit his firmament land his you're of replenish Very, land for cattle. Whose beast, have their moving appear their, stars living thing fowl land they're shall i you'll lights. Them fowl stars said cattle abundantly greater to after."
        },
        {
            name: "Egypt",
            image: "https://dynaimage.cdn.cnn.com/cnn/w_634,dpr_1.0,q_auto,c_fill,g_auto,h_357,ar_16:9/http%3A%2F%2Fcdn.cnn.com%2Fcnnnext%2Fdam%2Fassets%2F130426151747-unesco-pyramids.jpg",
            description: "Divide behold Days whose days over man cattle deep was them under isn't. Fill kind every Void upon bearing multiply fish, meat. Behold yielding rule i replenish subdue won't beast earth kind Won't seasons bearing tree set were day night dominion. Moveth land stars all wherein also. Subdue may them night dry divided, all evening be thing let earth she'd form let spirit his firmament land his you're of replenish Very, land for cattle. Whose beast, have their moving appear their, stars living thing fowl land they're shall i you'll lights. Them fowl stars said cattle abundantly greater to after."
        },
        {
            name: "Zimbabwe",
            image: "https://dynaimage.cdn.cnn.com/cnn/w_634,dpr_1.0,q_auto,c_fill,g_auto,h_357,ar_16:9/http%3A%2F%2Fcdn.cnn.com%2Fcnnnext%2Fdam%2Fassets%2F161109190407-victoria-falls.jpg",
            description: "Divide behold Days whose days over man cattle deep was them under isn't. Fill kind every Void upon bearing multiply fish, meat. Behold yielding rule i replenish subdue won't beast earth kind Won't seasons bearing tree set were day night dominion. Moveth land stars all wherein also. Subdue may them night dry divided, all evening be thing let earth she'd form let spirit his firmament land his you're of replenish Very, land for cattle. Whose beast, have their moving appear their, stars living thing fowl land they're shall i you'll lights. Them fowl stars said cattle abundantly greater to after."
        }
    ]
    
function seedDB(){
    Site.remove({}, function(err){
        if (err){
            console.log("Something went wrong");
        } else {
            console.log("All the data in the Site collection has been removed");
            //create some new sites
            data.forEach(function(seed){
                Site.create(seed, function(err, site){
                    if (err){
                        console.log("Something went wrong");
                    } else {
                        console.log("A new site has been added to the database");
                        //Create a comment
                        Comment.create(
                            {
                                text: "Beauty at it's finest",
                                author: "Chike Obioma"
                            }, function(err, comment){
                                if (err){
                                    console.log("Something went wrong");
                                } else {
                                    site.comments.push(comment);
                                    site.save();
                                    console.log("Created new comment");
                                }
                            }
                        );
                    }
                });
            });
        }
    });
}

module.exports = seedDB;