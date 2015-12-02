app.factory('RestService', function() {
    var playerPieces = [];
    var service = {
        getGamePieces: function() {
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
            return gamePieces;
        },
        setPlayerPiece: function(piece) {
            if (playerPieces.indexOf(piece) == -1)
                playerPieces.push(piece);
        },
        getPlayerPieces: function() {
            return playerPieces;
        }
    };
    return service;
})