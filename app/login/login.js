'use strict';

angular.module('Frontend.Login', ['ngRoute','angular-jwt','angular-storage'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'LoginController'
  });
}])

.controller('LoginController',function($scope, store, jwtHelper, $http, backendAPIservice, $location) {
  $scope.recibeVenta;

    $scope.Login=function(username,password) {
      backendAPIservice.getLogin(username,password).success(function(response){
        //Recibe token
        //Tratarlo
        //PONERLO EN ALMACENAMIENTO LOCAL (Mirar) 
        var recibe = response;
        console.log(JSON.stringify(recibe));  
        store.set('recibeToken',recibe.token);
        $location.path("/home"); 
      });
    };



});
