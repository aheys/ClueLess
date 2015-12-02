var app = angular.module('clueApp', []);

app.controller("ClueCtrl", function($scope, RestService) {
    $scope.gameStart = false;
    $scope.player = {};
    $scope.gamePieces = RestService.getGamePieces();
        
    var MapSizeX = 5;
    var MapSizeY = 5;
    
    $scope.pieceSelected = function(piece) {
        RestService.setPlayerPiece(piece);
    };
    $scope.startGame = function() {
        $scope.playerPieces = RestService.getPlayerPieces();
        $scope.gameStart=true;
        PlayClue();
    };
    
    function PlayClue() {
        $scope.curPlayer = $scope.playerPieces[0]; //Miss Scarlet goes first
        
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
        Need to add: checkMove() to check if hallway is occupied
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

        var index = $scope.playerPieces.indexOf($scope.curPlayer) + 1;
        if (index>$scope.playerPieces.length-1) 
            index = 0;
        
        $scope.$apply(function () {
            $scope.curPlayer = $scope.playerPieces[index];
        });
    }
    
})

