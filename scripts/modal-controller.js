app.controller('SuggestionModalCtrl', function ($scope, $log, $uibModalInstance, type, suspects, weapons, rooms, location) {

    $scope.type = type;

    $scope.ok = function () {
        $uibModalInstance.close($scope.selection);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.weapons = weapons;
    $scope.suspects = suspects;
    
    $scope.rooms = [];
    if (type == "Suggestion")
        $scope.rooms.push(rooms[location]);
    else 
        $scope.rooms=rooms;
                      
    
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
app.controller('DisputeModalCtrl', function ($scope, $log, $uibModalInstance, cards) {

    $scope.cards = cards;

    $scope.selected = $scope.cards[0];
    
    $scope.select = function (card) {
        $scope.selected = card;
    };

    $scope.ok = function () {
        $log.debug("OKing with " + $scope.selected.name);
        $uibModalInstance.close($scope.selected);
    };

});

app.controller('GameResultsModalCtrl', function ($scope, $log, $uibModalInstance, resultsInfo) {

    $scope.resultsInfo = resultsInfo;

    $scope.solutionSet = $scope.resultsInfo.solutionSet;

    $scope.winner = $scope.resultsInfo.winner;

    $log.debug($scope.resultsInfo);

    // Whenever the type is not accusation, this was launched because the game ended. This means the modal
    // is launched for a losing player.
    $scope.isAccusationType = function(){
        return $scope.resultsInfo.type == 'accusation';
    };

    $scope.successfulAccusation = function(){
        $log.debug( $scope.isAccusationType && $scope.resultsInfo.success);
        return $scope.isAccusationType && $scope.resultsInfo.success;
    };

    $scope.continue = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.endGame = function () {
        $uibModalInstance.close('endGame');
    };

    $scope.existLoser = function () {
        $uibModalInstance.dismiss('losingPlayer');
    };

});

app.controller('InstructionsCtrl', function ($scope, $uibModalInstance) {

    $scope.close = function () {
        $uibModalInstance.close();
    };
    
});
