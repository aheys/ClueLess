app.factory('TestService', function() {
    
    
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
    var players = [];
    var service = {
        getGamePieces: function() {   
            return gamePieces;
        },
        addPlayer: function(player) {
            if (players.indexOf(player) == -1)
                players.push(player);
        },
        getPlayers: function() {
            return players;
        },
        updatePlayers: function(player) {
            for (var i=0; i<players.length; i++) {
                if (player.name == players[i].name) {
                    players[i].x = player.x;
                    players[i].y = player.y;
                }
            }
        }
    };
    return service;
})