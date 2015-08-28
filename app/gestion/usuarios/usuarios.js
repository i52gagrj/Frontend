'use strict';

angular.module('Frontend.Gestion.Usuarios', ['ngRoute','angular-jwt','angular-storage'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/gestion/usuarios', {
    templateUrl: 'gestion/usuarios/usuarios.html',
    controller: 'GestionUsuariosController'
  });
}])

.controller('GestionUsuariosController', function($scope, store, jwtHelper, $http, backendAPIservice, $location) {
    $scope.editando=false; 

    $scope.id=0;
    $scope.nombre; 
    $scope.dni;
    $scope.username;
    $scope.password;
    $scope.activo;
    $scope.baja;
    $scope.cambioclave=false;
    $scope.respuesta;

    $scope.listaUsuarios = []; 
        
    if(store.get('token')){
      var token = store.get('token'); 
      if(!jwtHelper.isTokenExpired(token))
      {     
        backendAPIservice.getListadoUsuarios().success(function (recibe) {       
          var usuariosArray = recibe.response.usuarios;
          console.log(JSON.stringify(usuariosArray));  
          $scope.listaUsuarios = usuariosArray;
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
      for(elemento in $scope.listaUsuarios) {
        if($scope.listaUsuarios[elemento].id == pid) {
          $scope.nombre=$scope.listaUsuarios[elemento].nombre;
          $scope.dni=$scope.listaUsuarios[elemento].dni;
          $scope.password=$scope.listaUsuarios[elemento].password;
          $scope.username=$scope.listaUsuarios[elemento].username;
          $scope.activo=$scope.listaUsuarios[elemento].activo;
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
      for(elemento in $scope.listaUsuarios) {
        if($scope.listaUsuarios[elemento].id == pid) {
          $scope.nombre=$scope.listaUsuarios[elemento].nombre;
          $scope.dni=$scope.listaUsuarios[elemento].dni;
          $scope.username=$scope.listaUsuarios[elemento].username;
          $scope.password=$scope.listaUsuarios[elemento].password;
          $scope.activo=false;
          $scope.listaUsuarios[elemento].activo=false;
          $scope.baja=true;
          $scope.cambioclave=false;
        }
      } 
      $scope.Almacenar($scope.id, $scope.nombre, $scope.dni, $scope.username, $scope.password, $scope.activo, $scope.baja, $scope.cambioclave); 
    }

    $scope.Cambiarclave=function()
    {
      $scope.cambioclave=true;
    }

    $scope.Almacenar=function(id, nombre, dni, username, password, activo, saldo, baja, cambioclave)
    {
      //Llamar a la función de persistencia
      backendAPIservice.postUsuario(id, nombre, dni, username, password, activo, saldo, baja, cambioclave).success(function(recibe){
        var respuesta1 = recibe.response.respuesta;
        console.log(JSON.stringify(respuesta1));
        $scope.respuesta = respuesta1;
        if(recibe.code==0) store.set('token',recibe.response.token);
      });
      $scope.editando=false;
    };


});
