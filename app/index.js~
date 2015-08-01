'use strict';

angular.module('Frontend.Index', ['ngRoute','angular-jwt','angular-storage'])

.controller('IndexController',function($scope, store, jwtHelper, $http, backendAPIservice, $location) {
  $scope.token;
  $scope.usuario="Sin conexión"; 
  if(store.get('token')){
    $scope.token = store.get('token');
    try{
      $scope.tokenDe = jwtHelper.decodeToken($scope.token);
      store.set('nombre',$scope.tokenDe.nombre);
      $scope.usuario = store.get('nombre');      
    } catch (Error){ }
    
  }

    $scope.Logout=function() {
      store.remove('token');
      store.remove('nombre');
      $location.path("/login"); 
      $scope.usuario="Sin conexión";      
    };


});
