app.directive("gameboard", function() {
    return {
        restrict: "A",
        scope: {
            players: "="  
        },
        link: function($scope, $element) {
            console.log($scope.players);
            
            var canvas = $element[0];
            var ctx = canvas.getContext('2d');
            
            var gameboard = new Image();
            gameboard.src = "assets/ClueBoard.PNG";
            
            var imageSrc = new Array();
            imageSrc[0] = "assets/gamepieces/pieceRed_border00.png";
            imageSrc[1] = "assets/gamepieces/pieceYellow_border00.png";
            imageSrc[2] = "assets/gamepieces/pieceWhite_border00.png";
            imageSrc[3] = "assets/gamepieces/pieceGreen_border00.png";
            imageSrc[4] = "assets/gamepieces/pieceBlue_border00.png";
            imageSrc[5] = "assets/gamepieces/piecePurple_border00.png";
            
            var gamePieces = [];
            for (x=0; x<imageSrc.length; x++) {
                var img = new Image();
                img.src = imageSrc[x];
                gamePieces.push(img);
            }
                                    
            canvas.width = 800;
            canvas.height = 600;
            var WIDTH = canvas.width;
            var HEIGHT = canvas.height;
            
            /*
            Need to add: handle multiple pieces in a room, a button/way to take the secret pathway
            */
            
            //these values are rough and set to line up approximately with the center of the rooms
            var leftBorder = WIDTH / 4 + 57;
            var rightBorder = 3*WIDTH / 4 - 55;
            var topBorder = HEIGHT / 4 + 7;
            var bottomBorder = 3*HEIGHT / 4 - 5;
            var centerX = WIDTH / 2;
            var centerY = HEIGHT / 2;

            var Rooms = {
                Study: {
                    x: leftBorder,
                    y: topBorder   
                },
                Hall: {
                    x: centerX,
                    y: topBorder    
                },
                Louge: {
                    x: rightBorder,
                    y: topBorder   
                },
                Library: {
                    x: leftBorder,
                    y: centerY
                },
                BilliardRoom: {
                    x: centerX,
                    y: centerY
                },
                DiningRoom: {
                    x: rightBorder,
                    y: centerY
                },
                Conservatory: {
                    x: leftBorder,
                    y: bottomBorder
                },
                BallRoom: {
                    x: centerX,
                    y: bottomBorder
                },
                Kitchen: {
                    x: rightBorder,
                    y: bottomBorder
                }
            };
            
            var Hallways = {
                SH: {                           //Study-Hall Hallway
                    x: (leftBorder+centerX)/2,
                    y: topBorder
                },
                HL: {                           //Hall-Louge Hallway
                    x: (rightBorder+centerX)/2,
                    y: topBorder
                },
                SL: {                           //Study-Library Hallway
                    x: leftBorder,
                    y: (topBorder+centerY)/2
                },
                HB: {                           //Hall-Billiard Hallway
                    x: centerX,
                    y: (topBorder+centerY)/2
                },
                LD: {                           //Louge-DiningRoom Hallway
                    x: rightBorder,
                    y: (topBorder+centerY)/2
                },
                LB: {                           //Library-Billiard Hallway
                    x: (leftBorder+centerX)/2,
                    y: centerY
                },
                BD: {                           //Billiard-DiningRoom Hallway
                    x: (rightBorder+centerX)/2,
                    y: centerY
                },
                LC: {                           //Library-Conservatory Hallway
                    x: leftBorder,
                    y: (bottomBorder+centerY)/2
                },
                BB: {                           //Billiard-Ballroom Hallway
                    x: centerX,
                    y: (bottomBorder+centerY)/2
                },
                DK: {                           //DiningRoom-Kitchen Hallway
                    x: rightBorder,
                    y: (bottomBorder+centerY)/2
                },
                CB: {                           //Conservatory-Ballroom Hallway
                    x: (leftBorder+centerX)/2,
                    y: bottomBorder
                },
                BK: {                           //Ballroom-Kitchen Hallway
                    x: (rightBorder+centerX)/2,
                    y: bottomBorder
                }
            };
            
            //Maps player coordinates x: 0..4 y:0..4 to actual rooms coordinates
            var Map = [
                [Rooms.Study, Hallways.SH, Rooms.Hall, Hallways.HL, Rooms.Louge], 
                [Hallways.SL, null, Hallways.HB, null, Hallways.LD],
                [Rooms.Library, Hallways.LB, Rooms.BilliardRoom, Hallways.BD, Rooms.DiningRoom], 
                [Hallways.LC, null, Hallways.BB, null, Hallways.DK],
                [Rooms.Conservatory, Hallways.CB, Rooms.BallRoom, Hallways.BK, Rooms.Kitchen]
            ];
            
            window.onload = function() {
                render();
            };

            function render() {
                ctx.clearRect(0, 0, WIDTH, HEIGHT);
                
                //draw the gameboard
                ctx.drawImage(gameboard, 
                              WIDTH / 2 - gameboard.width / 2, 
                              HEIGHT / 2 - gameboard.height / 2);
                
                //loop through players and draw each piece
                for (var i in $scope.players) {
                    var player = $scope.players[i];
                    ctx.drawImage(gamePieces[i], //player.position ***NEED TO FIX***
                                  Map[player.y][player.x].x - gamePieces[0].width/2 + 12, //offset of 12 due to resizing from 64 px to 40px
                                  Map[player.y][player.x].y - gamePieces[0].height/2 + 12, 
                                  40, 40)
                }
            }
    
            var FPS = 30;
            setInterval(function() {
              render();
            }, 1000/FPS);
        }
    }
})
