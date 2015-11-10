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
            
            var leftBorder = canvas.width / 4 + 57;
            var rightBorder = 3*canvas.width / 4 - 55;
            var topBorder = canvas.height / 4 + 5;
            var bottomBorder = 3*canvas.height / 4 - 5;
            
            var MapSizeX = 3;
            var MapSizeY = 3;

            var Rooms = {
                Study: {
                    x: leftBorder,
                    y: topBorder   
                },
                Hall: {
                    x: canvas.width / 2,
                    y: topBorder    
                },
                Louge: {
                    x: rightBorder,
                    y: topBorder   
                },
                Library: {
                    x: leftBorder,
                    y: canvas.height / 2
                },
                BilliardRoom: {
                    x: canvas.width / 2,
                    y: canvas.height / 2
                },
                DiningRoom: {
                    x: rightBorder,
                    y: canvas.height / 2
                },
                Conservatory: {
                    x: leftBorder,
                    y: bottomBorder
                },
                BallRoom: {
                    x: canvas.width / 2,
                    y: bottomBorder
                },
                Kitchen: {
                    x: rightBorder,
                    y: bottomBorder
                }
            };
            
            //Maps player coordinates x: 0..2 y:0..2 to actual rooms coordinates
            var Map = [
                [Rooms.Study, Rooms.Hall, Rooms.Louge], 
                [Rooms.Library, Rooms.BilliardRoom, Rooms.DiningRoom], 
                [Rooms.Conservatory, Rooms.BallRoom, Rooms.Kitchen]
            ];
            
            var player = {
                name: "Player1",
                x: 2,
                y: 1
            };
            
            image.onload = function() {
                render();
            };

            function render() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(image, 
                              canvas.width / 2 - image.width / 2, 
                              canvas.height / 2 - image.height / 2);
                drawCircle();
            }
            function drawCircle() {
                ctx.beginPath();
                ctx.arc(Map[player.y][player.x].x, Map[player.y][player.x].y,radius,0,2*Math.PI);
                ctx.fillStyle = "red";
                ctx.fill();
            }

            window.addEventListener("keydown", function(event) {
                switch(event.keyCode) {
                    case 87:            //W
                    case 38:            //Up Arrow
                        if (player.y > 0) { 
                            player.y--;
                            console.log('moving up!');
                        }
                        break;
                    case 83:            //S
                    case 40:            //Down Arrow
                        if (player.y < 2) { 
                            player.y++;
                            console.log('moving down!');
                        }
                        break;
                    case 65:            //A
                    case 37:            //Left Arrow
                        if (player.x > 0) { 
                            player.x--;
                            console.log('moving left!');
                        }
                        break;
                    case 68:            //D
                    case 39:            //Right Arrow
                        if (player.x < 2) { 
                            player.x++;
                            console.log('moving right!');
                        }
                        break;
                }
                console.log(player);
              
            });
            
            var FPS = 30;
            setInterval(function() {
              render();
            }, 1000/FPS);
        }
    }
})
