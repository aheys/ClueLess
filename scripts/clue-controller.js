app.controller("clueCtrl", function($scope, $log, TestService, RestService) {
    var self = this;
    
    // cg-busy
    self.delay = 0;
    self.minDuration = 0;
    self.message = 'Please Wait...';
    self.backdrop = true;
    self.promise = null;
    
    
    self.gameStart = false;
    self.player = {};
    self.gamePieces = TestService.getGamePieces();
        
    var MapSizeX = 5;
    var MapSizeY = 5;
    
    self.pieceSelected = function(player) {
        TestService.testAddPlayer(player);
    };
    
    self.initGame = function() {
        self.players = TestService.testGetPlayers();
        
        //Get current gameboard, if none exists createGameBoard() is called
        //after getting the gameboard, getPlayers() is called
        self.getGameBoard();
        
        self.moveUpValid = false;
        self.moveDownValid = false;
        self.moveLeftValid = false; 
        self.moveRightValid = false; 
    };
    
    self.startGame = function() {
        self.gameStart=true;
        self.curPlayer = self.players[0]; //Miss Scarlet goes first        
    };
    
    self.getGameBoard = function () {
        $log.debug('Getting gameboard...');
        this.promise = RestService.get('game_board');
        this.promise.then(
            function (response) {
                $log.debug('Got gameboard ' + JSON.stringify(response));
                self.game_board = response;
                console.log(response);
                self.getPlayers();
            },
            function (error) {
                $log.error('Error retrieving gameboard ' + JSON.stringify(error));
                if (error.status == 404) {
                    self.createGameBoard();
                }
            }
        )
    };
    
    self.createGameBoard = function () {
        $log.debug('Getting gameboard...');
        this.promise = RestService.post('game_board', '');
        this.promise.then(
            function (response) {
                $log.debug('Created gameboard ' + JSON.stringify(response));
                self.game_board = response;
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
                self.serverPlayers = response.data.players;
                console.log(self.serverPlayers);
            },
            function (error) {
                $log.error('Error retrieving players ' + JSON.stringify(error));
            }
        )
    };
    
    self.addPlayer = function () {
        $log.debug('Add player...');
        this.promise = RestService.put('add_player');
        this.promise.then(
            function (response) {
                $log.debug('Added player ' + JSON.stringify(response));
                console.log(response);
            },
            function (error) {
                $log.error('Error retrieving players ' + JSON.stringify(error));
            }
        )
    };
    
    self.deleteGameBoard = function () {
        $log.debug('Delete gameboard...');
        this.promise = RestService.delete('game_board');
        this.promise.then(
            function (response) {
                $log.debug('Deleted gameboard ' + JSON.stringify(response));
            },
            function (error) {
                $log.error('Error deleted gameboard ' + JSON.stringify(error));
            }
        )   
    };
    

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
        TestService.updatePlayers(self.curPlayer);
        
        var index = self.players.indexOf(self.curPlayer) + 1;
        if (index>self.players.length-1) 
            index = 0;
        
        self.curPlayer = self.players[index];
    }
    
    self.initGame();
})