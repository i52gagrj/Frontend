'use strict';

angular.module('Frontend.Gestion.Proveedores', ['ngRoute','angular-jwt','angular-storage'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/gestion/proveedores', {
    templateUrl: 'gestion/proveedores/proveedores.html',
    controller: 'GestionProveedoresController'
  });
}])

.controller('GestionProveedoresController', function($scope, store, jwtHelper, $http, backendAPIservice, $location) {
    $scope.editando=false; 
    $scope.proveedor;
    $scope.id;
    $scope.nombre; 
    $scope.nif;
    $scope.direccion;
    $scope.poblacion;
    $scope.provincia;
    $scope.cp;
    $scope.fijo;
    $scope.movil;
    $scope.email;
    $scope.activo;

    $scope.listaProveedores = []; 
        
    if(store.get('token')){
      var token = store.get('token'); 
      if(!jwtHelper.isTokenExpired(token))
      {     
        backendAPIservice.getListadoProveedores().success(function (recibe) {       
          var proveedoresArray = recibe.response.proveedores;
          console.log(JSON.stringify(proveedoresArray));  
          $scope.listaProveedores = proveedoresArray;
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
      $location.path("/login");
    }

});
