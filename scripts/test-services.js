app.factory('TestService', function() {
    
    
    /*
    Need to add: Eventually hook up with backend, add Restangular, moving piece should interact with a service, turns should have a service
    */
    
    var testGamePieces = [
                {
                    name: "Miss Scarlet",
                    position: 0,
                    color: "orange",
                    x: 3,
                    y: 0,
                    isTaken: false
                },
                {
                    name: "Col. Mustard",
                    position: 1,
                    color: "yellow",
                    x: 4,
                    y: 1,
                    isTaken: false
                },
                {
                    name: "Mrs. White",
                    position: 2,
                    color: "white",
                    x: 3,
                    y: 4,
                    isTaken: false
                },
                {
                    name: "Mr. Green",
                    position: 3,
                    color: "lightgreen",
                    x: 1,
                    y: 4,
                    isTaken: false
                },
                {
                    name: "Mrs. Peacock",
                    position: 4,
                    color: "#0066FF",
                    x: 0,
                    y: 3,
                    isTaken: false
                },
                {
                    name: "Prof. Plum",
                    position: 5,
                    color: "purple",
                    x: 0,
                    y: 1,
                    isTaken: false
                }
            ];
    var testPlayers = [];
    var service = {
        testGetGamePieces: function() {   
            return testGamePieces;
        },
        testAddPlayer: function(player) {
            if (testPlayers.indexOf(player) == -1)
                testPlayers.push(player);
        },
        testGetPlayers: function() {
            return testPlayers;
        },
        testUpdatePlayers: function(player) {
            for (var i=0; i<testPlayers.length; i++) {
                if (player.name == testPlayers[i].name) {
                    testPlayers[i].x = player.x;
                    testPlayers[i].y = player.y;
                }
            }
        }
    };
    return service;
})