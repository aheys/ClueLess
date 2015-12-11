app.controller("clueCtrl", function($scope, $log, TestService, RestService) {
    var self = this;
    
    // cg-busy
    self.delay = 0;
    self.minDuration = 0;
    self.message = 'Please Wait...';
    self.backdrop = true;
    self.promise = null;
    
    var id = null;
    self.myPlayer = null;
    self.myCards = null;
    self.testMyPlayer = null;
    self.gameStart = false;
    self.host = false;
    self.player = {};
    self.testGamePieces = TestService.testGetGamePieces();
        
    var MapSizeX = 5;
    var MapSizeY = 5;
    
    self.pieceSelected = function(piece) {
        TestService.testAddPlayer(piece);
        self.testPlayers = TestService.testGetPlayers();
        self.testMyPlayer = piece;
        
        //first player to select a piece becomes 'host' and is the only player that can start the game
        if (self.testMyPlayer == self.testPlayers[0]) {
            self.host = true;
        }
        
        self.myPlayer = {
            "board_piece": piece.name
        }
        self.addPlayer(self.myPlayer);
    };
    
    self.initGame = function() {
        self.playerCount = 0;
        self.testPlayers = TestService.testGetPlayers();

        //Get current gameboard, if none exists createGameBoard() is called
        //after getting the gameboard, getPlayers() is called
        self.getGameBoard();
        
    };
    
    self.startGame = function() {
        self.gameStart=true;
        self.curPlayer = self.testPlayers[0]; //Miss Scarlet goes first    
        self.startGameBoard();
    };
    
    self.getGameBoard = function () {
        self.promise = RestService.get('game_boards');
        self.promise.then(
            function (response) {
                self.game_boards = response.data;
                if (self.game_boards.length == 0) {
                    self.createGameBoard();
                }
                else {
                    self.game_board = response.data[0];
                    self.getPlayers();
                    console.log(self.game_board);
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

                self.playerCount = self.serverPlayers.length;
//                console.log(self.serverPlayers[0].board_piece.name)
                self.setPiecesTaken();
            },
            function (error) {
            }
        )
    };
    
    self.addPlayer = function (player) {
        self.promise = RestService.post('players', player);
        self.promise.then(
            function (response) {
                self.serverPlayers = response.data;
                self.playerCount = self.serverPlayers.length;
                self.setPiecesTaken();
                self.findMyPlayerId();
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
                self.game_board = null;
                self.playerCount = 0;
                self.setPiecesAvailable();
            },
            function (error) {
            }
        )   
    };
    
    self.startGameBoard = function () {
        self.promise = RestService.post('game_boards/start_game', '');
        self.promise.then(
            function (response) {
                console.log(response);
                self.getPlayerById();
            },
            function (error) {
            }
        )
    }
    
    self.getPlayerById = function () {
        self.promise = RestService.getOne('players', id);
        self.promise.then(
            function (response) {
                self.myCards = response.data.cards;
                console.log(self.myCards);
            },
            function (error) {
            }
        )
    }
    
    //set game pieces to taken so that a user cannot click on a button for that character
    self.setPiecesTaken = function () {
        for (var i=0; i<self.playerCount; i++) {
            for (var j=0; j<self.testGamePieces.length; j++) {
                if (self.serverPlayers[i].board_piece.name == self.testGamePieces[j].name)  {   
                    self.testGamePieces[j].isTaken = true;
                }
            }
        }
    }
    self.setPiecesAvailable = function () {
        for (var j=0; j<self.testGamePieces.length; j++) {
            self.testGamePieces[j].isTaken = false;
        }
    }
    
    self.findMyPlayerId = function () {
        for (var i=0; i<self.playerCount; i++) {
            if (self.serverPlayers[i].board_piece.name == self.myPlayer.board_piece) {
                id = self.serverPlayers[i].id;
            }
        }
    }
    /*
        Need to add: checkMove() to check if hallway is occupied, handle secret pathways
    */
    
    
    //update coordinates of player, curPlayer is now next player to update turn
    self.makeMove = function (direction) {
        if (direction == "up"){
            if (self.curPlayer.y > 0 && self.curPlayer.x%2 == 0){
                self.curPlayer.y--;
            }
            else{
                console.log('invalid move');
                return;
            }
        }
        else if (direction == "down") {
            if (self.curPlayer.y < MapSizeY-1 && self.curPlayer.x%2 == 0) {
                self.curPlayer.y++;
            }
            else {
                console.log('invalid move');
                return;
            }
        }
        else if (direction == "left") {
            if (self.curPlayer.x > 0 && self.curPlayer.y%2 == 0) {
                self.curPlayer.x--;
            }
            else {
                console.log('invalid move');
                return;
            }
        }
        else if (direction == "right") {
            if (self.curPlayer.x < MapSizeX-1 && self.curPlayer.y%2 == 0) {
                self.curPlayer.x++;
            }
            else {
                console.log('invalid move');
                return;
            }
        }
            
        console.log(self.curPlayer.name + ' is moving ' + direction + '!');
        TestService.testUpdatePlayers(self.curPlayer);
        
        var index = self.testPlayers.indexOf(self.curPlayer) + 1;
        if (index>self.testPlayers.length-1) 
            index = 0;
        
        self.curPlayer = self.testPlayers[index];
    }
    
    self.initGame();
})