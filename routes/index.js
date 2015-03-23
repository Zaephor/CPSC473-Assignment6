/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */
"use strict";

var express = require("express");
var router = express.Router();

var rpssl = {
    last: { outcome: "none", user: "none", computer: "none" },
    score: { "wins": 0, "losses": 0, "ties": 0 },
    playOptions:  {
        "rock": ["lizard", "scissors"],
        "paper": ["rock", "spock"],
        "scissors": ["paper", "lizard"],
        "lizard": ["paper", "spock"],
        "spock": ["rock", "scissors"]
    },
    playTurn: function(userPlayed){
        var randomNumber = Math.floor(Math.random() * Object.keys(this.playOptions).length);
        this.last.computer = Object.keys(this.playOptions)[randomNumber];
        this.last.user = userPlayed;

        if (this.last.user === this.last.computer) {
            this.score.ties++;
            this.last.outcome = "tie";
        } else if (this.playOptions[this.last.user].indexOf(this.last.computer) > -1) {
            this.score.wins++;
            this.last.outcome = "win";
        } else if (this.playOptions[this.last.computer].indexOf(this.last.user) > -1) {
            this.score.losses++;
            this.last.outcome = "lose";
        } else {
            return "failed?";
        }
    }
};

/* GET home page. */
router.get("/", function (req, res, next) {
    res.render("index", {title: "Rock Paper Scissors Lizard Spock"});
});

/* Handle post /play requests */
router.all("/play/:action", function (req, res, next) {
    if(typeof rpssl.playOptions[req.params.action.toLowerCase()] !== "undefined"){
        // Play user's turn
        rpssl.playTurn(req.params.action.toLowerCase());
        res.json({score: rpssl.score, last: rpssl.last});
    } else if(req.params.action.toLowerCase() === "options") {
        // Return options
        res.json(Object.keys(rpssl.playOptions));
    } else {
        // Return error
        res.json({error:"Invalid Request"});
    }

});

module.exports = router;
