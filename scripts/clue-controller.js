app.controller("clueCtrl", function($scope, $log, $interval, $uibModal, ClientService, RestService) {
    var self = this;

    // cg-busy
    self.delay = 0;
    self.minDuration = 0;
    self.message = 'Please Wait...';
    self.backdrop = false;
    self.promise = null;
    
    
    var MapSizeX = 5;
    var MapSizeY = 5;
    
    self.pieceSelected = function(piece) {
        self.myPlayer = piece.name;
        
        self.addPlayer(self.myPlayer);
        
    };
    
    self.initGame = function() {
        self.reset();
        //Get current gameboard
        self.getGameBoard();
    };
    
    self.reset = function () {
        
        var id = null;
        self.myPlayer = null;
        self.myCards = null;
        self.cards = null;
        self.curPlayer = null;
        self.myPlayerAdded = false;
        self.isMyTurn = false;
        self.gameStart = false;
        self.game_board = null;
        self.joinedAfterStart = false;
        self.host = false;
        self.playerCount = 0;
        self.moveMade = false;
        self.suggestionMade = false;
        self.ableToSuggest = false;
        self.disputingSuggestion = false;
        self.awaitingSuggestionResponse = false;
        self.suggestionLogged = false;
        self.disputeLogged = false;
        self.accusationLogged = false;
        self.secretPassageAvailable = false;
        self.myDetectiveNotebook = [];
        self.messageLog = "";
        self.playerIsLoser = false;
        self.winner = null;
        self.solutionSet = null;
        self.resultsModalOpen = false;
    };
    
    self.startGame = function() {
        self.startGameBoard();
    };
    
    //gets game_boards from server, if none found then it creates one
    self.getGameBoard = function () {
        self.promise = RestService.get('game_boards');
        self.promise.then(
            function (response) {
                self.game_boards = response.data;
                if (self.game_boards) {
                    if (self.game_boards.length == 0 || (self.gameStart && self.playerCount == 0)) {
                        self.reset();
                    }
                    else {
                        self.game_board = response.data[0];
                        self.serverPlayers = self.game_board.players;
                        self.playerCount = self.serverPlayers.length;

                        self.winner = self.game_board.winner;
                        
                        $log.debug(self.game_board);
                        
                        //if player joins after game already started
                        if (self.game_board.game_in_play && !self.myPlayerAdded) {
                            self.gameStart = true;
                            self.joinedAfterStart = true;
                            return;
                        }
                        
                        //game has just started, set my cards
                        if (self.gameStart == false && self.game_board.game_in_play == true) {
                            self.getCardsByPlayerId();
                        }

                        if(!self.solutionSet) {
                            self.getSolutionSet();
                        }

                        // Signals game over for player since game was in play and no isn't
                        if (self.gameStart == true && self.game_board.game_in_play == false && self.winner) {

                            self.playerIsLoser = self.winner.board_piece.item_name != self.myPlayer;

                            if(!self.resultsModalOpen) {
                                if(self.playerIsLoser) {
                                    self.openGameResultsModal({solutionSet: self.solutionSet, winner: self.winner});
                                } else {
                                    self.openGameResultsModal({type: 'accusation', success: true, solutionSet: self.solutionSet});
                                }
                            }

                        }

                        self.gameStart = self.game_board.game_in_play;
                        
                        if (!self.cards)
                            self.getAllCards();
                        
                        if (self.playerCount>0) {
                            if (!self.gameStart && self.cards) {
                                self.setPiecesTaken();
                            }
                            else { //gameStart == true, main update loop
                                self.updatePlayers();
                            }
                        }

                    }
                }
            },
            function (error) {
                alert('Error getting gameboard, server may be down');
            }
        )
    };
    
    self.createGameBoard = function () {
        self.promise = RestService.post('game_boards', '');
        self.promise.then(
            function (response) {
                self.getAllCards();
                $log.debug(response);
                self.getGameBoard();
            },
            function (error) {
                alert('Error creating gameboard');
            }
        )
    };
        
    self.addPlayer = function (player) {
        var data = {
            "board_piece": player
        }
        self.promise = RestService.post('players', data);
        self.promise.then(
            function (response) {
                self.serverPlayers = response.data;
                self.playerCount = self.serverPlayers.length;
                self.setPiecesTaken();
                $log.debug(self.serverPlayers);
                self.findMyPlayerId();
                self.myPlayerAdded = true;
            },
            function (error) {
                alert("Player Taken or No Game Created!")
            }
        )
    };
    
    self.deleteGameBoard = function () {
        self.promise = RestService.delete('game_boards');
        self.promise.then(
            function (response) {
                self.reset();
            },
            function (error) {
                alert("Error deleting gameboard!");
            }
        )   
    };
    
    self.startGameBoard = function () {
        self.promise = RestService.post('game_boards/start_game', '');
        self.promise.then(
            function (response) {
                
                //I have to getGameBoard() again to set location_id now that they are set from startGameBoard()
                self.getGameBoard();
            },
            function (error) {
            }
        )
    };
    
    self.getAllCards = function () {
        self.promise = RestService.get('cards');
        self.promise.then(
            function (response) {
                self.cards = response.data;
                $log.debug(self.cards);
                
                //adding setPieces because cards don't load until after it would normally be called on startup
                self.setPiecesTaken();
            },
            function (error) {
                alert('Error getting cards');
            }
        )
    };
    
    self.sendPlayerMove = function (location) {
        var data = {
            "player_id": id,
            "location_id": location
        };
        $log.debug(data);
        self.promise = RestService.postAction('players', id, "move", data);
        self.promise.then(
            function (response) {
                self.getGameBoard();
                $log.debug(response);
            },
            function (error) {
                alert("Error making move to " + location);
            }
        )
    };

    self.getSolutionSet = function () {
        self.promise = RestService.get('game_boards/solution_set');
        self.promise.then(
            function (response) {
                self.solutionSet = response.data;
                $log.debug(self.solutionSet);
            },
            function (error) {
                alert('Error getting cards');
            }
        )
    };
    
    self.getCardsByPlayerId = function () {
        self.myCards = self.serverPlayers[id].cards;
    };
    
    //set game pieces to taken so that a user cannot click on a button for that character
    self.setPiecesTaken = function () {
        
        //this assumes suspects stay in order: Scarlet, Mustard, etc.
        var suspectColors = [
            "orange",
            "yellow",
            "white",
            "lightgreen",
            "#0066FF",
            "purple",
        ];
        self.playersColors = [];
        for (var i=0; i<self.playerCount; i++) {
            for (var j=0; j<self.cards.suspects.length; j++) {
                if (self.serverPlayers[i].board_piece.name == self.cards.suspects[j].name)  { 
                    self.cards.suspects[j].isTaken = true;
                    self.playersColors[i] = suspectColors[j];
                }
            }
        }
    };
    
    self.findMyPlayerId = function () {
        for (var i=0; i<self.playerCount; i++) {
            if (self.serverPlayers[i].board_piece.name == self.myPlayer) {
                id = self.serverPlayers[i].id;
                
                //first player to select a piece becomes 'host' and is the only player that can start the game
                if (id == self.serverPlayers[0].id) {
                    self.host = true;
                }
            }
        }
    };
    
    //confusing language here, curPlayer is the most recent player_in_turn from getGameBoard() call
    self.updatePlayers = function () {
        var newTurn = false;
        
        for (var i=0; i<self.playerCount; i++) {
            var obj = ClientService.MapLocationIdToXY(self.serverPlayers[i].location_id);
            self.serverPlayers[i].x = obj.x;
            self.serverPlayers[i].y = obj.y;
            if (self.serverPlayers[i].player_in_turn == true) {
                
                //check if curPlayer is already set to the correct current player in turn or if just one player is playing
                //if not then set new curPlayer
                if (self.curPlayer == null || self.curPlayer.id != self.serverPlayers[i].id || self.playerCount==1) {
                    self.curPlayer = self.serverPlayers[i];
                    
                    //reset booleans on turn change
                    newTurn = true;
                    self.disputeLogged = false;
                    self.disputingSuggestion = false;
                    self.suggestionLogged = false;
                    self.accusationLogged = false;
                    
                    //this line shouldn't be needed, but built in to protect for errors
                    self.awaitingSuggestionResponse = false;
                    
                    if (self.curPlayer.id == id) {
                        var location = self.curPlayer.location_id;
                        self.isMyTurn = true;
                        self.moveMade = false;
                        self.ableToSuggest = self.checkIfAbleToSuggest(location);
                        if (location < 9) {
                            if (self.game_board.board.rooms[location].secret_passage != null)
                                self.secretPassageAvailable = true;
                            else 
                                self.secretPassageAvailable = false;
                        }
                        else 
                            self.secretPassageAvailable = false;
                    }
                    else {
                        self.isMyTurn = false;
                    }
                }
            }  
        }
        
        //someone made an accusation
        if (self.game_board.accusation) {
            if (self.game_board.accusation.from.id != id && self.accusationLogged == false) {
                self.messageLog += self.game_board.accusation.from.board_piece.name + " made the incorrect accusation: " + self.game_board.accusation.cards[0].item_name + ", " + self.game_board.accusation.cards[1].item_name + ", " + self.game_board.accusation.cards[2].item_name + " and has lost.\n";
                self.accusationLogged = true;
            }
        }
        
        if (newTurn)
            self.messageLog+=self.curPlayer.board_piece.name + "'s Turn\n";
        
        //if the game_board is waiting for someone to response to a suggestion
        if (self.game_board.awaiting_suggest_response) {
            if (self.suggestionLogged == false && self.curPlayer.id != id){
                
                self.messageLog += self.curPlayer.board_piece.name + " made the suggestion: " + self.game_board.suggestion.cards[0].item_name + ", " + self.game_board.suggestion.cards[1].item_name + ", " + self.game_board.suggestion.cards[2].item_name + ".\n";
                self.suggestionLogged = true;
            }
            

            //if I'm the one that has to respond to the suggestion
            if (self.game_board.suggestion.player.id == id) {
                //do dispute 
                //this if statement prevents multiple modals from opening
                if (self.disputingSuggestion == false) {
                    
                    var matchingCards = self.findMatchingCards(self.game_board.suggestion.cards);
                    self.openDisputeModal(matchingCards);
                    self.disputingSuggestion = true;
                }
            }

        }
        //if there was no suggestion response, but there was a suggestion
        else if (self.game_board.awaiting_suggest_response == false && self.game_board.suggestion) {
            if (self.suggestionLogged == false && self.curPlayer.id != id) {
                self.messageLog += self.curPlayer.board_piece.name + " made the suggestion: " + self.game_board.suggestion.cards[0].item_name + ", " + self.game_board.suggestion.cards[1].item_name + ", " + self.game_board.suggestion.cards[2].item_name + ".\n";
                self.messageLog += "Nobody could dispute this suggestion.\n";
                self.suggestionLogged = true;
            }
        }
        
        //handle dispute response
        if (self.game_board.suggest_response) {
            self.suggestionLogged = false;

            //if it was me that made the suggestion
            if (self.awaitingSuggestionResponse == true) {
                self.awaitingSuggestionResponse = false;
                self.messageLog += self.game_board.suggest_response.player.board_piece.name + " disputed your suggestion with " + self.game_board.suggest_response.card.item_name + ".\n";
                self.disputeLogged = true;
                self.myDetectiveNotebook.push(self.game_board.suggest_response.card);
            }

            //if it wasn't me that made the suggestion, and I haven't logged it yet
            if (self.disputeLogged == false && self.curPlayer.id != id) {
                self.messageLog += self.game_board.suggest_response.player.board_piece.name + " disputed the suggestion!\n";
                self.disputeLogged = true;
            }
        }
        
        //If the was no suggestion reponse and I was expecting one...
        else if (self.game_board.awaiting_suggest_response == false && self.awaitingSuggestionResponse == true) {
            self.messageLog += "Nobody could dispute your suggestion.\n";
            self.awaitingSuggestionResponse = false;
        }
        
    };
    
    
    //update coordinates of player, curPlayer is now next player to update turn
    self.makeMove = function (direction) {
        var x = self.curPlayer.x;
        var y = self.curPlayer.y;

        if (direction == "up"){
            if (self.curPlayer.y > 0 && self.curPlayer.x%2 == 0){
                y--;
            }
            else{
                alert('Invalid move, out of bounds!');
                return;
            }
        }
        else if (direction == "down") {
            if (self.curPlayer.y < MapSizeY-1 && self.curPlayer.x%2 == 0) {
                y++;
            }
            else {
                alert('invalid move, out of bounds!');
                return;
            }
        }
        else if (direction == "left") {
            if (self.curPlayer.x > 0 && self.curPlayer.y%2 == 0) {
                x--;
            }
            else {
                alert('invalid move, out of bounds!');
                return;
            }
        }
        else  {     //direction == "right"
            if (self.curPlayer.x < MapSizeX-1 && self.curPlayer.y%2 == 0) {
               x++;
            }
            else {
                alert('invalid move, out of bounds!');
                return;
            }
        }
        
        if (self.checkIfMoveValid(x, y)) {
            //valid move
            self.curPlayer.x = x;
            self.curPlayer.y = y;
        }
        else {
            alert('invalid move, hallway is occupied!');
            return;
        }
         
        self.moveMade = true;

        //Player cannot suggest again until moving
        self.suggestionMade = false;
        
        var locationId = ClientService.MapXYtoLocationId(self.curPlayer);
        self.curPlayer.location_id = locationId;
        self.ableToSuggest = self.checkIfAbleToSuggest(locationId);
        self.sendPlayerMove(locationId);
        
        //split into below 9 for rooms and 9 or greater for halls
        //gameboard returns 2 arrays: rooms and halls, index is based on id, but halls start after rooms so id=9 mean index 0
        if (locationId < 9) {
            if (self.game_board.board.rooms[locationId].secret_passage) {
                self.secretPassageAvailable = true;
            }
            else {
                self.secretPassageAvailable = false;
            }
        }
        
        
    };
    
    self.endTurn = function () {
        self.promise = RestService.postAction('players', id, "end_turn", '');
        self.promise.then(
            function (response) {
                $log.debug(response);
                self.getGameBoard();
                self.isMyTurn = false;
                self.moveMade = false;
            },
            function (error) {
                alert ('Error ending turn');
            }
        )
    };
    
    self.checkIfMoveValid = function (x, y) {
        //first check if it is hall
        //hallways are all located at odd combinations of x+y, if x+y is even it cannot be a hallway
        if ((x+y)%2 == 0) {
            return true;
        }
        //is a hallway
        else {
            var location = ClientService.MapXYtoLocationId({x: x, y: y});
            for (var i=0; i<self.playerCount; i++) {
                if (self.serverPlayers[i].location_id == location)
                    return false;
            }
            return true;
        }
    };
    
    self.takeSecretPassage = function () {
        
        var location = self.game_board.board.rooms[self.curPlayer.location_id].secret_passage;
        self.sendPlayerMove(location);
        self.messageLog+= self.curPlayer.board_piece.name + ' is taking secret passage to ' + self.game_board.board.rooms[location].name + '!\n';
        self.moveMade = true; 
        self.suggestionMade = false;
        
        //update client position
        self.curPlayer.location_id = location;
        var obj = ClientService.MapLocationIdToXY(location);
        self.curPlayer.x = obj.x;
        self.curPlayer.y = obj.y;
    };
    
    self.checkIfAbleToSuggest = function (location) {
        return (location < 9);
    };
    
    self.findMatchingCards = function (suggestionCards) {
        var cards = [];
        for (var i=0; i<suggestionCards.length; i++) {
            for (var j=0; j<self.myCards.length; j++) {
                if (suggestionCards[i].name == self.myCards[j].name) {
                    cards.push(suggestionCards[i]);
                }
            }
        }
        return cards;
    }
    

    //Modal Window for user suggestion/accusation, modal-controller.js holds logic
    self.openSuggestionModal = function (type) {
        var SuggestionModal = $uibModal.open({
            animation: true,
            templateUrl: 'scripts/suggestion-modal.html',
            controller: 'SuggestionModalCtrl',
            resolve: {
                type: function () {
                    return type;
                },
                suspects: function () {
                    return self.cards.suspects;
                },
                weapons: function () {
                    return self.cards.weapons;
                },
                rooms: function () {
                    return self.cards.rooms;
                },
                location: function () {
                    return self.curPlayer.location_id;
                }
            }
        });

        //return suggestion/accusation
        SuggestionModal.result.then(function (selection) {
            self.disputingSuggestion = false;
            if (selection.type == "Suggestion") {
                self.suggestionMade = true;
                self.moveMade = true;
                self.sendSelection(selection);
                self.messageLog += "You've made the suggestion: " + selection.suspect.item_name + " with the " + selection.weapon.item_name + " in the " + selection.room.item_name + "\n";
            }
            //Accusation
            else {
                self.sendSelection(selection);
                self.messageLog += "You've made the accusation: " + selection.suspect.item_name + " with the " + selection.weapon.item_name + " in the " + selection.room.item_name + "\n";
            }
        }, function () {
            });
    };
    
    //sendSelection implements send suggestion and accusation
    self.sendSelection = function (selection) {
        var data = {
            "location_id" : selection.room.name,
            "weapon_id" : selection.weapon.name,
            "suspect_id" : selection.suspect.name
        };
        var route;
        if (selection.type == "Suggestion") {
            route = "suggest";
        }
        else 
            route = "accuse";
        
        $log.debug(data);
        self.promise = RestService.postAction('players', id, route, data);
        self.promise.then(
            function (response) {
                $log.debug(response);
                if (route == "suggest") {
                    self.awaitingSuggestionResponse = true;
                    if (self.playerCount == 1) {
                        //if player playing by themself, don't bother
                        self.awaitingSuggestionResponse = false;
                    }
                }
                else { // route == "accuse" returns success
                    //find out if accuse was successful
                    //handle true/false
                    if(response.data['success'] == true) {
                        $log.debug("Good accusation. success response: " + response.data['success']);
                        self.openGameResultsModal({type: 'accusation', success: true, solutionSet: self.solutionSet});
                        self.messageLog += "You've made a successful accusation. Congratulations!\n";
                    } else {
                        $log.debug("Bad accusation. success response: " + response.data['success']);
                        self.openGameResultsModal({type: 'accusation', success: false, solutionSet: self.solutionSet, winner: self.winner});
                        self.messageLog += "You've made an incorrect accusation. You have lost the game. Please remain in the game to dispute other players' cards.\n";
                    }
                    
                }
                self.getGameBoard();
            },
            function (error) {
                alert("Error sending selection!");
            })
    };
    
    //Modal Window for disputing a suggestion, modal-controller.js holds logic
    self.openDisputeModal = function (cards) {
        var DisputeModal = $uibModal.open({
            animation: true,
            templateUrl: 'scripts/dispute-modal.html',
            controller: 'DisputeModalCtrl',
            resolve: {
                cards: function () {
                    return cards;
                }
            }
        });

        //return disputed suggestion
        DisputeModal.result.then(function (card) {
            self.sendDispute(card);
        }, function () {
            //modal cancelled, so select first matching card and send it
            var card = self.game_board.suggestion.cards[0];
            self.sendDispute(card);
            }
        )
    };
    
    self.sendDispute = function (card) {
        var data = {
            "card_id": card.name
        };
        
        $log.debug(data);
        self.promise = RestService.postAction('players', id, "answer_suggestion", data);
        self.promise.then(
            function (response) {
                $log.debug(response);
                self.messageLog += "You disputed with " + card.item_name + ".\n";
                self.getGameBoard();
                self.disputingSuggestion = false;
            },
            function (error) {
                alert("Error sending dispute!");
            })
    };

    self.openGameResultsModal = function (resultsInfo) {
        self.resultsModalOpen = true;
        var ResultModal = $uibModal.open({
            animation: true,
            templateUrl: 'scripts/game-results-modal.html',
            controller: 'GameResultsModalCtrl',
            resolve: {
                resultsInfo: function(){
                    for (var sol in resultsInfo.solutionSet){
                        if(self.solutionSet[sol].type == 'weapon'){
                            resultsInfo.weaponSolution = resultsInfo.solutionSet[sol];
                        }else if(self.solutionSet[sol].type == 'suspect'){
                            resultsInfo.suspectSolution = resultsInfo.solutionSet[sol];
                        }else{
                            resultsInfo.locationSolution = resultsInfo.solutionSet[sol];
                        }
                    }
                    return resultsInfo;
                }
            }
        });

        ResultModal.result.then(function (type) {
            self.resultsModalOpen = false;
                if(type == 'endGame') {
                    $log.debug("Ending Game");
                    self.deleteGameBoard();
                } else if(type == 'losingPlayer') {
                    $log.debug("Refresh Game to redirect player to new game screen.");
                    self.getGameBoard();
                }
            }
        )
    };
    
    self.instructions = function () {
        var InstructionsModal = $uibModal.open({
            animation: true,
            templateUrl: 'scripts/instructions-modal.html',
            controller: 'InstructionsCtrl'
        });
    }

    //Turned off for developing, calls getGameBoard every 2 seconds
    $interval((function () {
        if (self.isMyTurn == false && self.disputingSuggestion == false || self.awaitingSuggestionResponse == true) {
            self.getGameBoard();
        }
    }), 3000);
    
    
    self.initGame();
});
