var app = angular.module('clueApp', ['ngAnimate', 'cgBusy', 'ui.bootstrap']);

app.config(function($logProvider){
    $logProvider.debugEnabled(true);
});
