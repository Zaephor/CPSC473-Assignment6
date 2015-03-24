/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */

/***************************************
 * CPSC473 Section 1 - Assignment 6
 * Eric Donaldson + Kyle Meyerhardt
 * ExpressJS version of ClientSide + ServerSide Rock Paper Scissors Lizard Spock game
 * Sources: Assignment 1 nudge submission, https://gist.github.com/Zaephor/485b52c7ae860ed922bb, Assignments 3-4 submission, Mozzila Development Network, ExpressJS api pages
 ***************************************
 */

var main = function () {
    "use strict";

    var setPlayer = function (options) {
        $("#player").append(
            $("<ul/>")
        );
        $.each(options, function (key, val) {
            $("#player ul").append(
                $("<li/>").addClass(val).append(
                    $("<a/>", {href: "#"}).addClass("play").append(val)
                )
            );
        });
    };
    var setComputer = function (options) {
        $("#computer").append(
            $("<ul/>")
        );
        $.each(options, function (key, val) {
            $("#computer ul").append(
                $("<li/>").addClass(val).append(val)
            );
        });
    };

    var setScore = function() {
      $("#score").append(
          $("<div/>").addClass("progress").text("Will load when you take your first turn.")
      );
    };

    var updateScore = function (data) {
        var stats = {sum: data.score.wins + data.score.losses + data.score.ties};
        stats.win = Math.floor((data.score.wins / stats.sum) * 100).toString() + "%";
        stats.tie = Math.floor((data.score.ties / stats.sum) * 100).toString() + "%";
        stats.loss = Math.floor((data.score.losses / stats.sum) * 100).toString() + "%";
        $("#score div").replaceWith(
            $("<div/>").addClass("progress").append(
                $("<div/>").addClass("progress-bar").addClass("progress-bar-success").css("width", stats.win).append(
                    $("<span/>").text(stats.win + "(" + data.score.wins + ")")
                )
            ).append(
                $("<div/>").addClass("progress-bar").addClass("progress-bar-warning").css("width", stats.tie).append(
                    $("<span/>").text(stats.tie + "(" + data.score.ties + ")")
                )
            ).append(
                $("<div/>").addClass("progress-bar").addClass("progress-bar-danger").css("width", stats.loss).append(
                    $("<span/>").text(stats.loss + "(" + data.score.losses + ")")
                )
            )
        );
        $("#score h2").replaceWith(
            $("<h2/>").text("Score - "+data.last.outcome)
        );
    };

    $.getJSON("/play/options", function (data) {
        setPlayer(data);
        setComputer(data);
        setScore(); // Dummy data

        // Dom should be fully configured by this stage
        $("a.play").click(function (event) {
            event.preventDefault();
            var playerChoice = event.target.innerText;
            $.getJSON("/play/" + playerChoice, function (data) {
                $("#player ul li").removeClass("played");
                $("#computer ul li").removeClass("played");
                $("#player ul li." + data.last.user).addClass("played");
                $("#computer ul li." + data.last.computer).addClass("played");
                updateScore(data)
            });
        });
    });

};
$(document).ready(main);
