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
        self.ableToSuggest = false;
        self.playerCount = 0;
        self.moveMade = false;
        self.suggestionMade = false;
        self.secretPassageAvailable = false;
        self.messageLog = "";
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
                    if (self.game_boards.length == 0) {
                        self.game_board = null;
                    }
                    else {
                        self.game_board = response.data[0];
                        self.serverPlayers = self.game_board.players;
                        self.playerCount = self.serverPlayers.length;
                        
                        console.log(self.game_board);
                        
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
                console.log(response);
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
                console.log(self.serverPlayers);
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
                console.log(self.cards);
                
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
        console.log(data);
        self.promise = RestService.postAction('players', id, "move", data);
        self.promise.then(
            function (response) {
                console.log(response);
            },
            function (error) {
                alert("Error making move to " + location);
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
        for (var i=0; i<self.playerCount; i++) {
            var obj = ClientService.MapLocationIdToXY(self.serverPlayers[i].location_id);
            self.serverPlayers[i].x = obj.x;
            self.serverPlayers[i].y = obj.y;
            if (self.serverPlayers[i].player_in_turn == true) {
                
                //check if curPlayer is already set to the correct current player in turn or if just one player is playing
                //if not then set new curPlayer
                if (self.curPlayer == null || self.curPlayer.id != self.serverPlayers[i].id || self.playerCount==1) {
                    self.curPlayer = self.serverPlayers[i];
                    self.messageLog+=self.curPlayer.board_piece.name + "'s Turn\n"
                    
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
            self.messageLog+= self.curPlayer.board_piece.name + ' is moving ' + direction + ' to ' + self.game_board.board.rooms[self.curPlayer.location_id].name + '!\n';
        }
        else {
            self.messageLog+= self.curPlayer.board_piece.name + ' is moving ' + direction + ' to ' + self.game_board.board.halls[self.curPlayer.location_id-9].name + '!\n';
        }
        
        
    };
    
    self.endTurn = function () {
        self.promise = RestService.postAction('players', id, "end_turn", '');
        self.promise.then(
            function (response) {
                console.log(response);
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
        
        //update client position
        var obj = ClientService.MapLocationIdToXY(location);
        self.curPlayer.x = obj.x;
        self.curPlayer.y = obj.y;
    };
    
    self.checkIfAbleToSuggest = function (location) {
        return (location < 9);
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
                room: function () {
                    return self.cards.rooms[self.curPlayer.location_id];
                }
            }
        });

        //return suggestion/accusation
        SuggestionModal.result.then(function (selection) {
            if (selection.type == "Suggestion") {
                self.suggestionMade = true;
            }
            //Accusation
            else {
                
            }
            self.sendSelection(selection);
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
        
        console.log(data);
        self.promise = RestService.postAction('players', id, route, data);
        self.promise.then(
            function (response) {
                console.log(response);
                self.getGameBoard();
            },
            function (error) {
                alert("Error sending selection!");
            })
    };
    
    //Modal Window for disputing a suggestion, modal-controller.js holds logic
    self.openDisputeModal = function (type) {
        var DisputeModal = $uibModal.open({
            animation: true,
            templateUrl: 'scripts/dispute-modal.html',
            controller: 'DisputeModalCtrl',
            resolve: {
            }
        });

        //return disputed suggestion
        DisputeModal.result.then(function (selection) {
            //do something with disputed cards
        }, function () {
            });
    };

    self.openGameResultsModal = function (type) {
        var DisputeModal = $uibModal.open({
            animation: true,
            templateUrl: 'scripts/game-results-modal.html',
            controller: 'GameResultsModalCtrl',
            resolve: {
            }
        });

        //return disputed suggestion
        DisputeModal.result.then(function (selection) {
            //do something with disputed cards
        }, function () {
        });
    };
    
    //Turned off for developing, calls getGameBoard every 2 seconds
    $interval((function () {
        if (self.isMyTurn == false) {
            self.getGameBoard();
        }
    }), 3000);
    
    
    self.initGame();
});
