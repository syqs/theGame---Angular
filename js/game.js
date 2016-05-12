angular.module('theGameApp', [])
    .controller('theGameController', function($scope, $q, $timeout) {
        var timeout = 5000;
        var theGame = this;
        var choices  =  {
            rock : {name: "Rock", defeats: {scissors: "crushes", lizard: "crushes"}},
            paper: {name: "Paper", defeats: {rock:  "covers", spock: "disproves"}},
            scissors: {name: "Scissors", defeats:{paper : "cuts", lizard: "decapitates"}},
            lizard: {name: "Lizard", defeats:{paper: "eats", spock: "poisons"}},
            spock: {name: "Spock", defeats:{scissors : "smashes",rock : "vaporises", goku:"teaches the vulcan nerv pinch technique to"}},
            goku: {name: "Goku", defeats:{paper:"evaporates", rock:"slices", lizard:"become friends with", scissors:"laughs as"}},
            key: function(n) {
                return this[Object.keys(this)[n]];
            },
            level: 1
        };

        theGame.textList = 'Do you choose rock, paper, scissors, lizard, spock or perhaps the goku?';
        theGame.loop = true;
        theGame.player = {};
        theGame.ai = {};
        theGame.choices = choices;

        /**
         * invokes when user input choice
         */
        theGame.play = function() {
            theGame.player = {pick:theGame.pickText, win:false};
            theGame.pickText = '';
            theGame.loop = false;
            theGame.textList = 'Game started';
            
            var aiPick = theGame.aiPick();
            aiPick.then(function(result){
                var match = theGame.match();
                theGame.textList = 'Begin to fight: ' + theGame.player.pick +' vs. ' + theGame.ai.pick;
                match.then(function(result){
                    var end = theGame.end();
                    //if true means that player wins
                    end.then(function(result){
                        //TODO ask to go on level 2
                        resetGame();
                    },function(reject) {
                        resetGame();
                    })
                })
            })
        };

        /**
         * game ends result is reveal
         * @returns {number}
         */
        theGame.end = function() {
            var deferred = $q.defer();
            $timeout(function() {
                if (theGame.player.win){
                    deferred.resolve(true);
                } else if (theGame.ai.win) {
                    deferred.reject(false);
                }
            }, timeout);
            return deferred.promise;
        };

        /**
         * Matching picks
         */
        theGame.match = function() {

            var deferred = $q.defer();
            $timeout(function() {
                //TODO matching
                theJudge(theGame.ai.pick, theGame.player.pick, choices);
                theGame.player.win = true;
                deferred.resolve(true);
            }, timeout);
            return deferred.promise;
        };

        /**
         * AI picks
         */
        theGame.aiPick = function() {
            console.log('picking');
            var deferred = $q.defer();
            $timeout(function() {
                var computerChoice = theChoice(choices);
                theGame.ai = {pick: computerChoice, win: false};
                deferred.resolve({pick: computerChoice});
            }, timeout);
            return deferred.promise;
        };

        function resetGame(){
            theGame.loop = true;
            theGame.player = {};
            theGame.ai = {};
        };


        var choices2  =  {
            mutated_rock : {name: "Mutated_Rock", defeats: {neo: "crushes", gojira: "crushes"}},
            seriously_sharp_paper: {name: "Seriously_Sharp_Paper", defeats: {mutated_rock:  "covers", sarek: "disproves"}},
            neo: {name: "Neo", defeats:{paper : "cuts", gojira: "decapitates", seriously_sharp_paper: "decides there is no"}},
            gojira: {name: "Gojira", defeats:{paper: "eats", sarek: "rectifies"}},
            sarek: {name: "Sarek", defeats:{neo : "smashes",mutated_rock : "vaporises", super_goku:"teaches the Epic vulcan nerv pinch technique to"}},
            super_goku: {name: "super_goku", defeats:{paper:"evaporates", mutated_rock:"slices", gojira:"become friends with", neo:"laughs at"}},
            key: function(n) {
                return this[Object.keys(this)[n]];
            },
            level: 2
        };


        function theChoice(theObject){
            var computerChoice = Math.random();
            if (computerChoice < 0.2) {
                computerChoice = theObject.key(0).name.toLowerCase();
            } else if (computerChoice <= 0.4) {
                computerChoice = theObject.key(1).name.toLowerCase();
            } else if (computerChoice <= 0.6) {
                computerChoice = theObject.key(2).name.toLowerCase();
            } else if (computerChoice <= 0.8) {
                computerChoice = theObject.key(3).name.toLowerCase();
            } else {
                computerChoice = theObject.key(4).name.toLowerCase();
            }
            return computerChoice;
        }



        function theJudge(computerChoice, userChoice, choices){
            var computerChoice2 = {}
            if(computerChoice == userChoice){
                theGame.textList = "===";
            }else if(choices[userChoice] === undefined){
                theGame.textList = "Your choice was not based in wisdom";
            }else{
                userChoice = choices[userChoice];
                var victory = userChoice.defeats[computerChoice] !== undefined;
                computerChoice2 = choices[computerChoice];
                if(victory) {
                    theGame.textList = "The Victory! " + userChoice.name + " " + userChoice.defeats[computerChoice2.name.toLowerCase()] + " " + computerChoice2.name + "!";
                    theGame.player.win = true;
                }else{
                    theGame.textList = "The Defeat! " + computerChoice2.name + " " + computerChoice2.defeats[userChoice.name.toLowerCase()] + " " + userChoice.name + "!";
                    theGame.ai.win = true;
                }
            }
        }

    /*

    var start = function (n){
        var n = n || 0;
        if (n>=1){
            var userChoice2 = prompt("Do you choose mutated rock, super sharp paper, neo, gojira, spocks grandfather(sarek) or perhaps the super goku?").toLowerCase();
            computerChoice = theChoice(choices2);
            theJudge(computerChoice, userChoice2, choices2);
        }else{
            var userChoice = prompt("Do you choose rock, paper, scissors, lizard, spock or perhaps the goku?");
            computerChoice = theChoice(choices);
            theJudge(computerChoice, userChoice, choices);
        }
        n++
        start(n)
    };
*/
});