'use strict';

angular.module('Frontend.Gestion.Socios', ['ngRoute','angular-jwt','angular-storage'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/gestion/socios', {
    templateUrl: 'gestion/socios/socios.html',
    controller: 'GestionSociosController'
  });
}])

.controller('GestionSociosController', function($scope, store, jwtHelper, $http, backendAPIservice, $location) {
    $scope.editando=false; 

    $scope.id=0;
    $scope.nombre; 
    $scope.dni;
    $scope.direccion;
    $scope.poblacion;
    $scope.provincia;
    $scope.cp;
    $scope.fijo;
    $scope.movil;
    $scope.email;
    $scope.activo;
    $scope.saldo;
    $scope.baja;
    $scope.respuesta;

    $scope.listaSocios = []; 
        
    if(store.get('token')){
      var token = store.get('token'); 
      if(!jwtHelper.isTokenExpired(token))
      {     
        backendAPIservice.getListadoSocios().success(function (recibe) {       
          var sociosArray = recibe.response.socios;
          console.log(JSON.stringify(sociosArray));  
          $scope.listaSocios = sociosArray;
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
      for(elemento in $scope.listaSocios) {
        if($scope.listaSocios[elemento].id == pid) {
          $scope.nombre=$scope.listaSocios[elemento].nombre;
          $scope.dni=$scope.listaSocios[elemento].dni;
          $scope.direccion=$scope.listaSocios[elemento].direccion;
          $scope.poblacion=$scope.listaSocios[elemento].poblacion;
          $scope.provincia=$scope.listaSocios[elemento].provincia;
          $scope.cp=$scope.listaSocios[elemento].cp;
          $scope.fijo=$scope.listaSocios[elemento].fijo;
          $scope.movil=$scope.listaSocios[elemento].movil;
          $scope.email=$scope.listaSocios[elemento].email;
          $scope.activo=true;
          $scope.saldo=$scope.listaSocios[elemento].saldo;
          $scope.baja=false;
        }
      } 
    };

    $scope.Anular=function(pid)
    {
      var elemento;
      //Primero, aviso de confirmación
      //Después, cargar los valores en las variables auxiliares y llamar a la función de persistencia
      $scope.id=pid;
      for(elemento in $scope.listaSocios) {
        if($scope.listaSocios[elemento].id == pid) {
          $scope.nombre=$scope.listaSocios[elemento].nombre;
          $scope.dni=$scope.listaSocios[elemento].dni;
          $scope.direccion=$scope.listaSocios[elemento].direccion;
          $scope.poblacion=$scope.listaSocios[elemento].poblacion;
          $scope.provincia=$scope.listaSocios[elemento].provincia;
          $scope.cp=$scope.listaSocios[elemento].cp;
          $scope.fijo=$scope.listaSocios[elemento].fijo;
          $scope.movil=$scope.listaSocios[elemento].movil;
          $scope.email=$scope.listaSocios[elemento].email;
          $scope.saldo=$scope.listaSocios[elemento].saldo;
          $scope.activo=false;
          $scope.listaSocios[elemento].activo=false;
          $scope.baja=true;
        }
      } 
      $scope.Almacenar($scope.id, $scope.nombre, $scope.dni, $scope.direccion, $scope.poblacion, $scope.provincia, $scope.cp, $scope.fijo, $scope.movil, $scope.email, $scope.activo, $scope.saldo, $scope.baja); 
    }

    $scope.Almacenar=function(id, nombre, dni, direccion, poblacion, provincia, cp, fijo, movil, email, activo, saldo, baja)
    {
      //Llamar a la función de persistencia
      backendAPIservice.postSocio(id, nombre, dni, direccion, poblacion, provincia, cp, fijo, movil, email, activo, saldo, baja).success(function(recibe){
        var respuesta1 = recibe.response.respuesta;
        console.log(JSON.stringify(respuesta1));
        $scope.respuesta = respuesta1;
        if(recibe.code==0) store.set('token',recibe.response.token);
      });
      $scope.editando=false;
    };

    $scope.Cancelar=function()
    {
      $scope.editando=false;      
    };


});
