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
        //todo after starting gameboard get my cards by my player id
    };
    
    self.getGameBoard = function () {
        $log.debug('Getting gameboard...');
        this.promise = RestService.get('game_boards');
        this.promise.then(
            function (response) {
                $log.debug('Got gameboard ' + JSON.stringify(response));
                self.game_boards = response.data;
                if (self.game_boards.length == 0) {
                    self.createGameBoard();
                }
                else {
                    self.game_board = response.data[0];
                    self.getPlayers();
                }
                console.log(self.game_boards);
            },
            function (error) {
                $log.error('Error retrieving gameboard ' + JSON.stringify(error));
//                if (error.status == 404) {
//                    self.createGameBoard();
//                }
            }
        )
    };
    
    self.createGameBoard = function () {
        $log.debug('Getting gameboard...');
        this.promise = RestService.post('game_boards', '');
        this.promise.then(
            function (response) {
                $log.debug('Created gameboard ' + JSON.stringify(response));
                self.game_board = response.data;
                console.log(response);
                self.getPlayers();
            },
            function (error) {
                $log.error('Error creating gameboard ' + JSON.stringify(error));
            }
        )
    };
    
    self.getPlayers = function () {
        $log.debug('Getting players...');
        this.promise = RestService.get('players');
        this.promise.then(
            function (response) {
                $log.debug('Got players ' + JSON.stringify(response));
                self.serverPlayers = response.data;

                self.playerCount = self.serverPlayers.length;
//                console.log(self.serverPlayers[0].board_piece.name)
                self.setPiecesTaken();
            },
            function (error) {
                $log.error('Error retrieving players ' + JSON.stringify(error));
            }
        )
    };
    
    self.addPlayer = function (player) {
        $log.debug('Add player...');
        this.promise = RestService.post('players', player);
        this.promise.then(
            function (response) {
                $log.debug('Added player ' + JSON.stringify(response));
                self.serverPlayers = response.data;
                self.playerCount = self.serverPlayers.length;
                self.setPiecesTaken();
                self.findMyPlayerId();
            },
            function (error) {
                $log.error('Error adding player ' + JSON.stringify(error));
                alert("Player Taken or No Game Created!")
            }
        )
    };
    
    self.deleteGameBoard = function () {
        $log.debug('Delete gameboard...');
        this.promise = RestService.delete('game_boards');
        this.promise.then(
            function (response) {
                $log.debug('Deleted gameboard ' + JSON.stringify(response));
                self.game_board = null;
                self.playerCount = 0;
                self.setPiecesAvailable();
            },
            function (error) {
                $log.error('Error deleted gameboard ' + JSON.stringify(error));
            }
        )   
    };
    
    self.startGameBoard = function () {
        $log.debug('Starting gameboard...');
        this.promise = RestService.post('game_boards/start_game', '');
        this.promise.then(
            function (response) {
                $log.debug('Started gameboard ' + JSON.stringify(response));
                console.log(response);
            },
            function (error) {
                $log.error('Error starting gameboard ' + JSON.stringify(error));
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