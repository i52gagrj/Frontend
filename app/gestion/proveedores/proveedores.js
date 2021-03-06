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
    $scope.prueba; 

    $scope.id=0;
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
    $scope.respuesta;

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
      for(elemento in $scope.listaProveedores) {
        if($scope.listaProveedores[elemento].id == pid) {
          $scope.nombre=$scope.listaProveedores[elemento].nombre;
          $scope.nif=$scope.listaProveedores[elemento].nif;
          $scope.direccion=$scope.listaProveedores[elemento].direccion;
          $scope.poblacion=$scope.listaProveedores[elemento].poblacion;
          $scope.provincia=$scope.listaProveedores[elemento].provincia;
          $scope.cp=$scope.listaProveedores[elemento].cp;
          $scope.fijo=$scope.listaProveedores[elemento].fijo;
          $scope.movil=$scope.listaProveedores[elemento].movil;
          $scope.email=$scope.listaProveedores[elemento].email;
          $scope.activo=$scope.listaProveedores[elemento].activo;
        }
      } 
    };

    $scope.Anular=function(pid)
    {
      var elemento;
      //Primero, aviso de confirmación
      //Después, cargar los valores en las variables auxiliares y llamar a la función de persistencia
      $scope.id=pid;
      for(elemento in $scope.listaProveedores) {
        if($scope.listaProveedores[elemento].id == pid) {
          $scope.nombre=$scope.listaProveedores[elemento].nombre;
          $scope.nif=$scope.listaProveedores[elemento].nif;
          $scope.direccion=$scope.listaProveedores[elemento].direccion;
          $scope.poblacion=$scope.listaProveedores[elemento].poblacion;
          $scope.provincia=$scope.listaProveedores[elemento].provincia;
          $scope.cp=$scope.listaProveedores[elemento].cp;
          $scope.fijo=$scope.listaProveedores[elemento].fijo;
          $scope.movil=$scope.listaProveedores[elemento].movil;
          $scope.email=$scope.listaProveedores[elemento].email;
          $scope.activo=false;
          $scope.listaProveedores[elemento].activo=false;
        }
      } 
      $scope.Almacenar($scope.id, $scope.nombre, $scope.nif, $scope.direccion, $scope.poblacion, $scope.provincia, $scope.cp, $scope.fijo, $scope.movil, $scope.email, $scope.activo); 
    }

    $scope.Almacenar=function(id, nombre, nif, direccion, poblacion, provincia, cp, fijo, movil, email, activo)
    {
      //Llamar a la función de persistencia
      backendAPIservice.postProveedor(id, nombre, nif, direccion, poblacion, provincia, cp, fijo, movil, email, activo).success(function(recibe){
        var respuesta1 = recibe.response.respuesta;
        console.log(JSON.stringify(respuesta1));
        $scope.respuesta = respuesta1;
        if(recibe.code==0) store.set('token',recibe.response.token);
      });
      $scope.editando=false;
    };


});
