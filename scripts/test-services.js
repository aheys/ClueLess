app.factory('TestService', function() {
    
    
    /*
    Need to add: Eventually hook up with backend, add Restangular, moving piece should interact with a service, turns should have a service
    */
    
    var gamePieces = [
                {
                    name: "Miss Scarlet",
                    position: 0,
                    color: "orange",
                    x: 3,
                    y: 0
                },
                {
                    name: "Col. Mustard",
                    position: 1,
                    color: "yellow",
                    x: 4,
                    y: 1
                },
                {
                    name: "Mrs. White",
                    position: 2,
                    color: "white",
                    x: 3,
                    y: 4
                },
                {
                    name: "Mr. Green",
                    position: 3,
                    color: "lightgreen",
                    x: 1,
                    y: 4
                },
                {
                    name: "Mrs. Peacock",
                    position: 4,
                    color: "#0066FF",
                    x: 0,
                    y: 3
                },
                {
                    name: "Prof. Plum",
                    position: 5,
                    color: "purple",
                    x: 0,
                    y: 1
                }
            ];
    var players = [];
    var service = {
        getGamePieces: function() {   
            return gamePieces;
        },
        testAddPlayer: function(player) {
            if (players.indexOf(player) == -1)
                players.push(player);
        },
        testGetPlayers: function() {
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