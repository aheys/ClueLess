app.controller('SuggestionModalCtrl', function ($scope, $uibModalInstance, type, suspects, weapons, room) {

    $scope.type = type;

    $scope.ok = function () {
        $uibModalInstance.close($scope.selection);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    console.log(room);
    $scope.weapons = weapons;
    $scope.suspects = suspects;
    $scope.room = room;
    
    $scope.selection = {};
    $scope.selection.type = type;
    $scope.selection.suspect=null;
    $scope.selection.weapon=null;
    $scope.selection.room=null;
    
    $scope.addSuspect = function (suspect) {
        $scope.selection.suspect = suspect;
    };
    
    $scope.addWeapon = function (weapon) {
        $scope.selection.weapon = weapon;
    };
    
    $scope.addRoom = function (room) {
        $scope.selection.room = room;
    };

});


//Dispute Modal Controller
//passes in an array of cards that the user can dispute a suggestion made with
app.controller('DisputeModalCtrl', function ($scope, $uibModalInstance, cards) {

    $scope.cards = cards;

    $scope.selected = $scope.cards[0];
    
    $scope.select = function (card) {
        $scope.selected = card;
    }


    $scope.ok = function () {
        console.log("OKing with " + $scope.selected.name);
        $uibModalInstance.close($scope.selected);
    };

});

app.controller('GameResultsModalCtrl', function ($scope, $uibModalInstance) {

    $scope.exit = function () {
        $uibModalInstance.dismiss('cancel');
    };

});