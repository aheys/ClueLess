var app = angular.module('clueApp', ['restangular', 'ngAnimate', 'cgBusy', 'ui.bootstrap']);

// route configurations
app.config(['RestangularProvider', function (RestangularProvider) {
    
    //Local Ruby Server
    //RestangularProvider.setBaseUrl('http://localhost:3000');
    
    //Cloud Ruby Server
    RestangularProvider.setBaseUrl('https://clueless-server.herokuapp.com/');
}]);
