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

    $scope.instructions = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In luctus, nibh eu aliquam tincidunt, velit nisi efficitur odio, eu interdum odio mi eu neque. Quisque molestie et mi id vulputate. In congue semper magna eu consequat. Vivamus vitae suscipit mauris. Donec vel justo eu est finibus rhoncus. Sed mattis et lorem a vestibulum. Morbi pharetra, sem ac fringilla eleifend, lectus mi pretium dui, ac vehicula erat dui sit amet ligula. Aenean euismod pulvinar elit, vitae cursus purus tempor ac. Donec tempus tellus vitae ipsum aliquam ullamcorper. \n\nCurabitur vitae risus eget velit vestibulum fringilla sed ac tellus. Etiam posuere nibh sed magna dapibus pellentesque. Aliquam tincidunt fringilla est ut consequat. Integer in leo at risus ornare vestibulum. Mauris luctus tempus quam, a tincidunt odio dapibus a. Vestibulum finibus, elit eu suscipit vehicula, purus quam euismod odio, sed lacinia erat dui vel purus. Nulla eu eleifend sapien, et pellentesque sapien. Aliquam porttitor odio purus, et vulputate dui fermentum ac. Fusce in ante tortor. Cras non mollis elit. Donec finibus turpis eu porttitor condimentum. Sed luctus malesuada nisi id semper. Aliquam in lacinia lorem, et condimentum lacus. Aliquam luctus, mi ac pulvinar lacinia, ligula nisi rhoncus nunc, nec hendrerit dolor diam at sapien. Aenean interdum gravida aliquam. Duis augue sem, molestie tincidunt nibh sit amet, maximus mattis magna. \n\nVivamus tincidunt eget eros a elementum. Sed lorem dolor, lobortis vitae justo nec, auctor tincidunt enim. Cras nec commodo nulla. Nulla rutrum bibendum aliquet. In sed tincidunt enim, a placerat lectus. Vestibulum id eleifend tortor. Integer a purus velit. Fusce quam sem, fringilla a enim ac, semper fermentum justo. Pellentesque blandit est lobortis libero volutpat congue. Donec varius tincidunt lacus, nec convallis ante finibus id. Donec sagittis convallis justo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam id tincidunt mi. In quis ultrices neque, et volutpat felis.\n\nUt augue mauris, aliquam nec euismod non, pharetra et metus. Praesent quis sapien placerat, consectetur dui nec, laoreet libero. Sed justo ex, auctor in purus non, bibendum bibendum leo. Ut diam nisl, vehicula ut risus ac, accumsan facilisis mauris. Etiam ut congue metus. Nullam et nibh pellentesque, semper orci in, commodo elit. Maecenas eu nulla dui. Aliquam eleifend diam enim. Ut gravida euismod odio a malesuada. Nam nulla risus, pharetra sit amet facilisis vitae, interdum id velit. Sed rhoncus lectus velit, vel posuere elit maximus cursus. Sed varius semper lacus, sed convallis eros scelerisque at. Nam a purus dolor. Fusce non molestie lectus. Suspendisse at nulla at urna tempor interdum eu at ipsum.\n\nSed vel orci nisi. Ut consequat laoreet sapien, vel interdum lacus ullamcorper viverra. Donec pellentesque ultrices ligula, ac dapibus metus euismod sit amet. Quisque sagittis mauris vel sapien congue, a mollis eros commodo. Integer nunc justo, tincidunt et ipsum ut, rhoncus congue velit. Maecenas lacus lectus, vulputate nec diam id, vehicula molestie augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vel convallis velit. Fusce fringilla velit a cursus pulvinar. In tincidunt nulla a lectus vehicula, in imperdiet libero luctus. Maecenas pulvinar nulla nisi, ac blandit lorem consectetur in. Donec a posuere lorem, at sollicitudin tellus. Quisque in blandit enim.";

    $scope.close = function () {
        $uibModalInstance.close();
    };

});
