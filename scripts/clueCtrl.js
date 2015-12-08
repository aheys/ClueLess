app.controller("clueCtrl", function($scope, TestService, RestService) {
    $scope.gameStart = false;
    $scope.player = {};
    $scope.gamePieces = TestService.getGamePieces();
        
    var MapSizeX = 5;
    var MapSizeY = 5;
    
    $scope.pieceSelected = function(player) {
        TestService.addPlayer(player);
    };
    
    $scope.initGame = function() {
        $scope.players = TestService.getPlayers();
//        var game_board = RestService.get('game_board');
//        console.log(game_board);
//        if (game_board.$$state.status == 404)
//            console.log('error!')
    };
    $scope.initGame();
    
    $scope.startGame = function() {
        $scope.gameStart=true;
        playClue();
        
        //create game_board
//        RestService.post('game_board');
    };
    
    function playClue() {
        $scope.curPlayer = $scope.players[0]; //Miss Scarlet goes first
        
         //using window because element binding won't work
        window.addEventListener("keydown", function(event) { 
            switch(event.keyCode) {
                case 87:            //W
                case 38:            //Up Arrow
                    if ($scope.curPlayer.y > 0 && $scope.curPlayer.x%2 == 0) { //cannot move up if at top or in hallways at x=1 or 3 
                        makeMove('up');
                    }
                    break;
                case 83:            //S
                case 40:            //Down Arrow
                    if ($scope.curPlayer.y < MapSizeY-1 && $scope.curPlayer.x%2 == 0) { 
                        makeMove('down');
                    }
                    break;
                case 65:            //A
                case 37:            //Left Arrow
                    if ($scope.curPlayer.x > 0 && $scope.curPlayer.y%2 == 0) { 
                        makeMove('left');
                    }
                    break;
                case 68:            //D
                case 39:            //Right Arrow
                    if ($scope.curPlayer.x < MapSizeX-1 && $scope.curPlayer.y%2 == 0) { 
                        makeMove('right');
                    }
                    break;
            }              
        });       
    }
    /*
        Need to add: checkMove() to check if hallway is occupied, handle secret pathways
    */
    
    //update coordinates of player, curPlayer is now next player to update turn
    function makeMove(direction) {
        if (direction == "up")
            $scope.curPlayer.y--;
        else if (direction == "down")
            $scope.curPlayer.y++;
        else if (direction == "left")
            $scope.curPlayer.x--;
        else  //right
            $scope.curPlayer.x++;
            
        console.log($scope.curPlayer.name + ' is moving ' + direction + '!');
        TestService.updatePlayers($scope.curPlayer);
        
        var index = $scope.players.indexOf($scope.curPlayer) + 1;
        if (index>$scope.players.length-1) 
            index = 0;
        
        $scope.$apply(function () {
            $scope.curPlayer = $scope.players[index];
        });
    }
    
})