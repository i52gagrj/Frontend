'use strict';

angular.module('Frontend.Index', ['ngRoute','angular-jwt','angular-storage'])

.controller('IndexController',function($scope, store, jwtHelper, $http, backendAPIservice, $location) {
  $scope.token;
  $scope.usuario="Sin conexión"; 
  if(store.get('token')){
    $scope.token = store.get('token');
    try{
      $scope.tokenDe = jwtHelper.decodeToken($scope.token);
      $scope.usuario = $scope.tokenDe.nombre;
    } catch (Error){ }
    
  }

    $scope.Logout=function() {
      store.remove('recibeToken');
      $location.path("/login"); 
      $scope.usuario="Sin conexión";      
    };


});
