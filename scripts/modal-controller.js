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
app.controller('DisputeModalCtrl', function ($scope, $uibModalInstance) {

//    $scope.disputableCards = disputableCards;
    
    //filler 
    $scope.items = ['item1', 'item2', 'item3'];
    $scope.selected = {
        item: $scope.items[0]
    };


    $scope.ok = function () {
        $uibModalInstance.close($scope.selection);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    
    $scope.selection = {};
    
});

app.controller('GameResultsModalCtrl', function ($scope, $uibModalInstance) {

    $scope.exit = function () {
        $uibModalInstance.dismiss('cancel');
    };

});