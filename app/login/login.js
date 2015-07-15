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
  $scope.token;
  $scope.mensaje="";

    $scope.Login=function(username,password) {
      backendAPIservice.postLogin(username,password).success(function(respuesta){
        var recibe = respuesta;
        console.log(JSON.stringify(recibe));  
        store.set('token',recibe.response.token);
        if(recibe.code==0){
          $scope.token=store.get('token'); 
          $location.path("/home"); 
        } 
        else{ 
          store.remove('token');
          $location.path("/login");
          $scope.mensaje=recibe.response.respuesta;
        }
      });
    };

    $scope.Logout=function() {
      store.remove('token');
      $location.path("/login"); 
      $scope.usuario="Sin conexión";      
    };


});
