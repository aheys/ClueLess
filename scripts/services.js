app.factory('RestService', function() {
    
    
    /*
    Need to add: Eventually hook up with backend, add Restangular, moving piece should interact with a service, turns should have a service
    */
    
    var gamePieces = [
                {
                    name: "Miss Scarlet",
                    color: "red",
                    x: 3,
                    y: 0
                },
                {
                    name: "Col. Mustard",
                    color: "yellow",
                    x: 4,
                    y: 1
                },
                {
                    name: "Prof. Plum",
                    color: "plum",
                    x: 0,
                    y: 1
                },
                {
                    name: "Mrs. Peacock",
                    color: "pink",
                    x: 0,
                    y: 3
                },
                {
                    name: "Mr. Green",
                    color: "green",
                    x: 1,
                    y: 4
                },
                {
                    name: "Mrs. White",
                    color: "white",
                    x: 3,
                    y: 4
                }
            ];
    var playerPieces = [];
    var service = {
        getGamePieces: function() {   
            return gamePieces;
        },
        addPlayerPiece: function(piece) {
            if (playerPieces.indexOf(piece) == -1)
                playerPieces.push(piece);
        },
        getPlayerPieces: function() {
            return playerPieces;
        },
        updatePlayerPieces: function(piece) {
            for (var i=0; i<playerPieces.length; i++) {
                if (piece.name == playerPieces[i].name) {
                    playerPieces[i].x = piece.x;
                    playerPieces[i].y = piece.y;
                }
            }
        }
    };
    return service;
})