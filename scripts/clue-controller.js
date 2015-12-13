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
        //Get current gameboard, if none exists createGameBoard() is called
        //after getting the gameboard, getPlayers() is called
        self.getGameBoard();
        
    };
    
    self.reset = function () {
        
        var id = null;
        self.myPlayer = null;
        self.myCards = null;
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
        self.messageLog = "Message Log:\n";
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
                        //button for creating a new game if none exist
                        self.game_board = null;
                    }
                    else {
                        self.game_board = response.data[0];
                        self.getAllCards();
                        //if game already started
                        if (self.game_board.game_in_play) {
                            self.gameStart = true;
                            self.joinedAfterStart = true;
                        }

                        self.getPlayers();

                        console.log(self.game_board);
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
                self.game_board = response.data;
                self.getAllCards();
                console.log(response);
                self.getPlayers();
            },
            function (error) {
                alert('Error creating gameboard');
            }
        )
    };
    
    self.getPlayers = function () {
        self.promise = RestService.get('players');
        self.promise.then(
            function (response) {
                self.serverPlayers = response.data;
                console.log(self.serverPlayers);
                self.playerCount = self.serverPlayers.length;
                if (self.playerCount>0) {
                    if (!self.gameStart) {
                        self.setPiecesTaken();

                        //only way I can see if game starts from a remote player waiting in lobby
                        if (self.serverPlayers[0].player_in_turn == true) {
                            self.getCardsByPlayerId();
                            self.updatePlayers();
                            self.gameStart=true;
                        }
                    }
                    if (self.gameStart && !self.joinedAfterStart) {
                        self.updatePlayers();

                    }
                }
                if (!self.game_board) {
                    self.getGameBoard();
                }
            },
            function (error) {
                //if game is deleted reset client variables
                if (self.gameStart) {
                    self.reset();
                }
                self.getGameBoard();
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
                //I have to re-grab players() in order to get my player's cards after the game has started
//                self.getCardsByPlayerId();
//                self.gameStart=true;   
                
                //I have to getPlayers() again to set location_id now that they are set from startGameBoard()
                self.getPlayers();
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
            },
            function (error) {
                alert('Error getting cards');
            }
        )
    };
    
    //this is currently unused, using getPlayers() and then finding my cards through getCardsByPlayerId
//    self.getPlayerById = function () {
//        self.promise = RestService.getOne('players', id);
//        self.promise.then(
//            function (response) {
//                self.myCards = response.data.cards;
//            },
//            function (error) {
//            }
//        )
//    };
    
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
                alert("Error making move!");
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
    
    //confusing language here, curPlayer is the most recent player_in_turn from getPlayers() call
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
                            if (self.game_board.rooms[location].secret_passage)
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
    
    /*
        Need to add: checkMove() to check if hallway is occupied, handle secret pathways
    */
    
    
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
        self.secretPassageAvailable = false;

        //Player cannot suggest again until moving
        self.suggestionMade = false;
        
        var locationId = ClientService.MapXYtoLocationId(self.curPlayer);
        self.curPlayer.location_id = locationId;
        self.ableToSuggest = self.checkIfAbleToSuggest(locationId);
//        console.log(self.curPlayer.board_piece.name + ' is moving ' + direction + ' to ' + x + ',' + y + ' - ' + locationId + '!');
        self.messageLog+= self.curPlayer.board_piece.name + ' is moving ' + direction + ' to ' + locationId + '!\n';
        self.sendPlayerMove(locationId);
        
        
    };
    
    self.endTurn = function () {
        self.promise = RestService.postAction('players', id, "end_turn", '');
        self.promise.then(
            function (response) {
                console.log(response);
                self.getPlayers();
                self.isMyTurn = false;
                self.moveMade = false;
            },
            function (error) {
                alert ('Error ending turn');
            }
        )
    }
    
    //this function is untested
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
    
    self.checkIfAbleToSuggest = function (location) {
        return (location < 9);
    }
    

    //Modal Window for user suggestion/accusation, modal-controller.js holds logic
    self.openModal = function (type) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'scripts/myModalContent.html',
            controller: 'ModalInstanceCtrl',
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
                },
            }
        });

        //return suggestion/accusation
        modalInstance.result.then(function (selection) {
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
            },
            function (error) {
                alert("Error sending selection!");
            })
    };
    
    //Turned off for developing, calls getPlayers every 2 seconds
//    $interval((function () {
//        if (self.isMyTurn == false) {
//            self.getPlayers();
//        }
//    }), 3000)
    
    
    self.initGame();
});
