var express = require('express');
var router = express.Router();
var session = require('cookie-session');
var async = require('async');
module.exports = router;
function checkTeamMatchStatus(teamId,callback){
    models.Match.findOne({
        $or:[
        {
            "team1.team":teamId
        },{
            "team2.team":teamId
        }]
    })
    .sort({
        timeOfMatch:-1
    })
    .exec(function(err,match){
        if(err){
            console.log(err);
            callback(true);
        }
        else if(match&&match.winner==null){
            callback(false,match._id);
	}
        else{
                models.Player.find({
			team : teamId
		},function(err,players){
		 	if(err){
				console.log(err);
				callback(true);
				return;
			}
			if(players.length<11){
				callback(false,null,true);
			}else{
                            callback(false,null);
                        }
		});
	}
    });
}
router.get('/',function(req,res){
    var sess = req.session;
    var callback=function(err,matchId,playerRestriction){
        if(err){
            res.send("Error").end();
            return;
        }
	if(playerRestriction){
		res.send("You dont have 11 players.<a href='/Market'>Click here to buy them</a>").end();
		return;
	}
        if(matchId!=null){
            res.redirect('/Match');
            return;
        }
            res.render('arena',{
                team : JSON.stringify(sess.team),
                LayoutTeam : req.session.team,
                partials : {
                    layout : 'layout'
                }
            });

    }
    if(sess.team)
        checkTeamMatchStatus(sess.team._id,callback);
    else{
         req.session.loginRedirect = '/Arena'; 
         res.redirect('/login');
    }
});
