app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, title, suspects, weapons, rooms) {

    $scope.title = title;

    $scope.ok = function () {
        $uibModalInstance.close($scope.selection);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    console.log(rooms);
    $scope.weapons = weapons;
    $scope.suspects = suspects;
    $scope.rooms = rooms;
    
    $scope.selection = {};
    $scope.selection.suspect=null;
    $scope.selection.weapon=null;
    $scope.selection.room=null;

    $scope.status = {
        isopen1: false,
        isopen2: false,
        isopen3: false
    };

    $scope.toggled = function(open) {
        $log.log('Dropdown is now: ', open);
    };
    
    $scope.addSuspect = function (suspect) {
        $scope.selection.suspect = suspect;
    };
    
    $scope.addWeapon = function (weapon) {
        $scope.selection.weapon = weapon;
    };
    
    $scope.addRoom = function (room) {
        $scope.selection.room = room;
    };

    $scope.toggleDropdown1 = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen1 = !$scope.status.isopen1;
    };

    $scope.toggleDropdown2 = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen2 = !$scope.status.isopen2;
    };

    $scope.toggleDropdown3 = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen3 = !$scope.status.isopen3;
    };
});