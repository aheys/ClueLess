var app = angular.module('clueApp', []);

app.directive("gameboard", function() {
    return {
        restrict: "A",
        link: function(scope, element) {
            
            var canvas = element[0];
            var ctx = canvas.getContext('2d');
            var image = new Image();
            image.src = "assets/ClueBoard.PNG";
            var radius = 12; 
            
            var MapSizeX = 5;
            var MapSizeY = 5;
            
            var WIDTH = canvas.width;
            var HEIGHT = canvas.height;
            
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
            }
            
            //Maps player coordinates x: 0..4 y:0..4 to actual rooms coordinates
            var Map = [
                [Rooms.Study, Hallways.SH, Rooms.Hall, Hallways.HL, Rooms.Louge], 
                [Hallways.SL, null, Hallways.HB, null, Hallways.LD],
                [Rooms.Library, Hallways.LB, Rooms.BilliardRoom, Hallways.BD, Rooms.DiningRoom], 
                [Hallways.LC, null, Hallways.BB, null, Hallways.DK],
                [Rooms.Conservatory, Hallways.CB, Rooms.BallRoom, Hallways.BK, Rooms.Kitchen]
            ];

            var player = {
                name: "Player1",
                x: 2,
                y: 2
            };

            image.onload = function() {
                render();
            };

            function render() {
                ctx.clearRect(0, 0, WIDTH, HEIGHT);
                ctx.drawImage(image, 
                              WIDTH / 2 - image.width / 2, 
                              HEIGHT / 2 - image.height / 2);
                drawCircle();
//                drawLines();
            }
            function drawCircle() {
                ctx.beginPath();
                ctx.arc(Map[player.y][player.x].x, Map[player.y][player.x].y,radius,0,2*Math.PI);
//                ctx.arc(Hallways.BD.x, Hallways.BD.y,radius,0,2*Math.PI);
                ctx.fillStyle = "red";
                ctx.fill();
            }
            
            function drawLines() {
                ctx.beginPath();
                
                //vertical lines
                ctx.moveTo(centerX, 0);
                ctx.lineTo(centerX, HEIGHT);
                ctx.moveTo(leftBorder, 0);
                ctx.lineTo(leftBorder, HEIGHT);
                ctx.moveTo(rightBorder, 0);
                ctx.lineTo(rightBorder, HEIGHT);
                
                //horizontal lines
                ctx.moveTo(0, centerY);
                ctx.lineTo(WIDTH, centerY);
                ctx.moveTo(0, topBorder);
                ctx.lineTo(WIDTH, topBorder);
                ctx.moveTo(0, bottomBorder);
                ctx.lineTo(WIDTH, bottomBorder);
                
                ctx.stroke();
            }

            window.addEventListener("keydown", function(event) {
                switch(event.keyCode) {
                    case 87:            //W
                    case 38:            //Up Arrow
                        if (player.y > 0 && player.x%2 == 0) { //cannot move up if at top or in hallways at x=1 or 3 
                            player.y--;
                            console.log('moving up!');
                        }
                        break;
                    case 83:            //S
                    case 40:            //Down Arrow
                        if (player.y < MapSizeY-1 && player.x%2 == 0) { 
                            player.y++;
                            console.log('moving down!');
                        }
                        break;
                    case 65:            //A
                    case 37:            //Left Arrow
                        if (player.x > 0 && player.y%2 == 0) { 
                            player.x--;
                            console.log('moving left!');
                        }
                        break;
                    case 68:            //D
                    case 39:            //Right Arrow
                        if (player.x < MapSizeX-1 && player.y%2 == 0) { 
                            player.x++;
                            console.log('moving right!');
                        }
                        break;
                }              
            });
            
            var FPS = 30;
            setInterval(function() {
              render();
            }, 1000/FPS);
        }
    }
})
