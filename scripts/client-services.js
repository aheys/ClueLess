app.factory('ClientService', function() {
    
    
    /*
    Need to add: Eventually hook up with backend, add Restangular, moving piece should interact with a service, turns should have a service
    */
    
    var testGamePieces = [
                {
                    name: "Miss Scarlet",
                    color: "orange",
                    isTaken: false
                },
                {
                    name: "Col. Mustard",
                    color: "yellow",
                    isTaken: false
                },
                {
                    name: "Mrs. White",
                    color: "white",
                    isTaken: false
                },
                {
                    name: "Mr. Green",
                    color: "lightgreen",
                    isTaken: false
                },
                {
                    name: "Mrs. Peacock",
                    color: "#0066FF",
                    isTaken: false
                },
                {
                    name: "Prof. Plum",
                    color: "purple",
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
        },
        
        MapXYtoLocationId: function (obj) {
            if (obj.x == 0) {
                if (obj.y == 0) {
                    //Study Room
                    return 0;
                }
                else if (obj.y == 1) {
                    //Study-Library Hallway
                    return 10;
                }
                else if (obj.y == 2) {
                    //Library Room
                    return 1;
                }
                else if (obj.y == 3) {
                    //Library-Conservatory Hallway
                    return 12;
                }
                else {  // obj.y == 4
                    //Conservatory Room
                    return 2;
                }
            }
            else if (obj.x == 1) {
                if (obj.y == 0) {
                    //Study-Hall Hallway
                    return 9;
                }
                else if (obj.y == 1) {
                    return null;
                }
                else if (obj.y == 2) {
                    //Library-Billiard Hallway
                    return 11;
                }
                else if (obj.y == 3) {
                    return null;
                }
                else {  // obj.y == 4
                    //Conservatory-Ballroom Hallway
                    return 13;
                }
            }
            else if (obj.x == 2) {
                if (obj.y == 0) {
                    //Hall Room
                    return 8;
                }
                else if (obj.y == 1) {
                    //HallRoom-Billiard Hallway
                    return 14;
                }
                else if (obj.y == 2) {
                    //Billiard Room
                    return 3;
                }
                else if (obj.y == 3) {
                    //Billiard-Ballroom Hallway
                    return 15;
                }
                else {  // obj.y == 4
                    //Ball Room
                    return 4;
                }
            }
            else if (obj.x == 3) {
                if (obj.y == 0) {
                    //HallRoom-Louge Hallway
                    return 18;
                }
                else if (obj.y == 1) {
                    return null;
                }
                else if (obj.y == 2) {
                    //Billiard-Dining Hallway
                    return 16;
                }
                else if (obj.y == 3) {
                    return null;
                }
                else {  // obj.y == 4
                    //Ballroom-Kitchen Hallway
                    return 17;
                }
            }
            else {  // obj.x == 4
                if (obj.y == 0) {
                    //Lounge
                    return 5;
                }
                else if (obj.y == 1) {
                    //Lounge-Dining Hallway
                    return 19;
                }
                else if (obj.y == 2) {
                    //Dining Room
                    return 6;
                }
                else if (obj.y == 3) {
                    //Dining-Kitchen Hallway
                    return 20;
                }
                else {  // obj.y == 4
                    //Kitchen
                    return 7;
                }
            }
        }
    };
    return service;
})