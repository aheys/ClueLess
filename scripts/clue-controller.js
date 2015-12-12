app.controller("clueCtrl", function($scope, $log, $interval, $uibModal, ClientService, RestService) {
    var self = this;
    /*
    TO DO: FIX gameboard.js piece color
    modal window: rooms, suspects, and weapons
    player must do move after suggestion
    player only gets one move per turn
    get cards route
    */
    // cg-busy
    self.delay = 0;
    self.minDuration = 0;
    self.message = 'Please Wait...';
    self.backdrop = false;
    self.promise = null;
    
    
    self.gamePieces = ClientService.getGamePieces();
        
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
        for (var j=0; j<self.gamePieces.length; j++) {
            self.gamePieces[j].isTaken = false;
        }
        
        var id = null;
        self.myPlayer = null;
        self.myCards = null;
        self.curPlayer = null;
        self.myPlayerAdded = false;
        self.isMyTurn = false;
        self.gameStart = false;
        self.game_board = null;
        self.joinedAfterStart = false;
        self.createNewGame = false;
        self.host = false;
        self.ableToSuggest = false;
        self.playerCount = 0;
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
//                        self.createGameBoard();
                        //button for creating a new game if none exist
                        self.game_board = null;
                        self.createNewGame = true;
                    }
                    else {
                        self.game_board = response.data[0];
                        self.setCards();
                        //if game already started
                        self.createNewGame = false;
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
            }
        )
    };
    
    self.createGameBoard = function () {
        self.promise = RestService.post('game_boards', '');
        self.promise.then(
            function (response) {
                self.game_board = response.data;
                console.log(response);
                self.getPlayers();
            },
            function (error) {
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
    
    //this is currently unused, using getPlayers() and then finding my cards through getCardsByPlayerId
    self.getPlayerById = function () {
        self.promise = RestService.getOne('players', id);
        self.promise.then(
            function (response) {
                self.myCards = response.data.cards;
            },
            function (error) {
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
                self.isMyTurn = false;
                self.getPlayers();
            },
            function (error) {
            }
        )
    };
    
    self.getCards = function () {
        self.promise = RestService.get('players');
        self.promise.then(
            function (response) {
                console.log(response);
            },
            function (error) {
            }
        )
    };
    
    self.getCardsByPlayerId = function () {
        self.myCards = self.serverPlayers[id].cards;
    };
    
    //set game pieces to taken so that a user cannot click on a button for that character
    self.setPiecesTaken = function () {
        self.playersColors = [];
        for (var i=0; i<self.playerCount; i++) {
            for (var j=0; j<self.gamePieces.length; j++) {
                if (self.serverPlayers[i].board_piece.name == self.gamePieces[j].name)  {   
                    self.gamePieces[j].isTaken = true;
                    self.playersColors[i] = self.gamePieces[j].color;
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
                
                //check if curPlayer is already set to the correct current player in turn
                //if not then set new curPlayer
                if (self.curPlayer == null || self.curPlayer.id != self.serverPlayers[i].id) {
                    self.curPlayer = self.serverPlayers[i];
                    console.log(self.curPlayer.board_piece.name + "'s Turn");
                    
                    if (self.curPlayer.id == id) {
                        self.isMyTurn = true;
                        if (self.curPlayer.location_id < 9) {
                            self.ableToSuggest = true;
                        }
                    }
                    else {
                        self.isMyTurn = false;
                        self.ableToSuggest = false;
                    }
                }
            }
        }
    };
    
    self.setCards = function () {
        self.cards = {}
        self.cards.rooms = [];
        self.cards.weapons = [];
        self.cards.suspects = [];
        for (var i=0; i<self.game_board.rooms.length; i++) {
            self.cards.rooms.push(self.game_board.rooms[i]);
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
                alert('invalid move');
                return;
            }
        }
        else if (direction == "down") {
            if (self.curPlayer.y < MapSizeY-1 && self.curPlayer.x%2 == 0) {
                y++;
            }
            else {
                alert('invalid move');
                return;
            }
        }
        else if (direction == "left") {
            if (self.curPlayer.x > 0 && self.curPlayer.y%2 == 0) {
                x--;
            }
            else {
                alert('invalid move');
                return;
            }
        }
        else if (direction == "right") {
            if (self.curPlayer.x < MapSizeX-1 && self.curPlayer.y%2 == 0) {
               x++;
            }
            else {
                alert('invalid move');
                return;
            }
        }
        
        if (self.checkIfMoveValid(x, y)) {
            //valid move
            self.curPlayer.x = x;
            self.curPlayer.y = y;
        }
        else {
            alert('invalid move');
            return;
        }
            
        var locationId = ClientService.MapXYtoLocationId(self.curPlayer);
        console.log(self.curPlayer.board_piece.name + ' is moving ' + direction + ' to ' + self.curPlayer.x + ',' + self.curPlayer.y + ' - ' + locationId + '!');
        self.serverPlayers[id] = self.curPlayer;
        self.sendPlayerMove(locationId);
        
        
    };
    
    self.endTurn = function () {
        var locationId = ClientService.MapXYtoLocationId(self.curPlayer);
        self.sendPlayerMove(locationId);
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
        
    //Turned off for developing, calls getPlayers every 2 seconds
    $interval((function () {
        if (self.isMyTurn == false) {
            self.getPlayers();
        }
    }), 3000)
    

    //Modal Window for user suggestion/accusation, modal-controller.js holds logic
    self.openModal = function (title) {
        console.log(self.cards.rooms);
        console.log(self.curPlayer);
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'scripts/myModalContent.html',
            controller: 'ModalInstanceCtrl',
            resolve: {
                title: function () {
                    return title;
                },
                suspects: function () {
                    return ClientService.getSuspects();
                },
                weapons: function () {
                    return ClientService.getWeapons();
                },
                rooms: function () {
                    return self.cards.rooms;
                },
            }
        });

        modalInstance.result.then(function (selection) {
            self.userSelection = selection;
            //do something with selection now
        }, function () {
            });
    };
    
    self.initGame();
});
