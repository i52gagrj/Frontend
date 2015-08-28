'use strict';

angular.module('Frontend.Gestion.Tipos', ['ngRoute','angular-jwt','angular-storage'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/gestion/tipos', {
    templateUrl: 'gestion/tipos/tipos.html',
    controller: 'GestionTiposController'
  });
}])

.controller('GestionTiposController', function($scope, store, jwtHelper, $http, backendAPIservice, $location) {
    $scope.editando=false; 

    $scope.id=0;
    $scope.nombre; 
    $scope.padre;
    $scope.baja;
    $scope.respuesta;

    $scope.listaTipos = []; 
        
    if(store.get('token')){
      var token = store.get('token'); 
      if(!jwtHelper.isTokenExpired(token))
      {     
        backendAPIservice.getListadoTipos().success(function (recibe) {       
          var tiposArray = recibe.response.tipos;
          console.log(JSON.stringify(tiposArray));  
          $scope.listaTipos = tiposArray;
          store.set('token',recibe.response.token);          
        });
      }
      else
      {
        store.remove('token');
        store.set('nombre', "Sin conexion");
        $location.path("/login");
      }
    } 
    else 
    {
      store.remove('token');
      store.set('nombre', "Sin conexion");
      $location.path("/login");
    }

    $scope.Insertar=function()
    {
      $scope.editando=true;
      $scope.id=0;
    };

    $scope.Modificar=function(pid)
    {
      var elemento;
      $scope.editando=true;
      $scope.id=pid;
      for(elemento in $scope.listaTipos) {
        if($scope.listaTipos[elemento].id == pid) {
          $scope.nombre=$scope.listaTipos[elemento].nombre;
          $scope.padre=$scope.listaTipos[elemento].padre;
        }
      } 
    };

    $scope.Almacenar=function(id, nombre, padre)
    {
      //Llamar a la función de persistencia
      backendAPIservice.postTipo(id, nombre, padre).success(function(recibe){
        var respuesta1 = recibe.response.respuesta;
        console.log(JSON.stringify(respuesta1));
        $scope.respuesta = respuesta1;
        if(recibe.code==0) store.set('token',recibe.response.token);
      });
      $scope.editando=false;
    };

});
