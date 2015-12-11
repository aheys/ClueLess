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
        },
        MapLocationIdToXY: function (location_id) {
            if (location_id == 0)       //Study Room
                return {x: 0, y: 0};
            else if (location_id == 1)  //Library Room
                return {x: 0, y: 2};
            else if (location_id == 2)  //Conservatory Room
                return {x: 0, y: 4};
            else if (location_id == 3)  //Billiard Room
                return {x: 2, y: 2};
            else if (location_id == 4)  //Ball Room
                return {x: 2, y: 4};
            else if (location_id == 5)  //Lounge
                return {x: 4, y: 0};
            else if (location_id == 6)  //Dining Room
                return {x: 2, y: 4};
            else if (location_id == 7)  //Kitchen
                return {x: 4, y: 4};
            else if (location_id == 8)  //Hall Room
                return {x: 2, y: 0};
            else if (location_id == 9)  //Study-Hall Hallway
                return {x: 1, y: 0};
            else if (location_id == 10) //Study-Library Hallway
                return {x: 0, y: 1};
            else if (location_id == 11) //Library-Billiard Hallway
                return {x: 1, y: 2};
            else if (location_id == 12) //Library-Conservatory Hallway
                return {x: 0, y: 3};
            else if (location_id == 13) //Conservatory-Ballroom Hallway
                return {x: 1, y: 4};
            else if (location_id == 14) //HallRoom-Billiard Hallway
                return {x: 2, y: 1};
            else if (location_id == 15) //Billiard-Ballroom Hallway
                return {x: 2, y: 3};
            else if (location_id == 16) //Billiard-Dining Hallway
                return {x: 3, y: 2};
            else if (location_id == 17) //Ballroom-Kitchen Hallway
                return {x: 3, y: 4};
            else if (location_id == 18) //HallRoom-Louge Hallway
                return {x: 3, y: 0};
            else if (location_id == 19) //Lounge-Dining Hallway
                return {x: 4, y: 1};
            else // location_id == 20   //Dining-Kitchen Hallway
                return {x: 4, y: 3};
        }
    };
    return service;
})