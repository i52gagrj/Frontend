'use strict';

angular.module('Frontend.Gestion.Productos', ['ngRoute','angular-jwt','angular-storage'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/gestion/productos', {
    templateUrl: 'gestion/productos/productos.html',
    controller: 'GestionProductosController'
  });
}])

.controller('GestionProductosController', function($scope, store, jwtHelper, $http, backendAPIservice, $location) {
    $scope.editando=false; 

    $scope.id=0;
    $scope.nombre; 
    $scope.tipo;
    $scope.descripcion;
    $scope.stock;

    $scope.precio;
    $scope.iva;
    $scope.activo;
    $scope.proveedor=" ";
    $scope.baja; 

    $scope.listaProductos = [];
    $scope.listaTipo = [];
    $scope.listaProveedores = [];
 
        
    if(store.get('token')){
      var token = store.get('token'); 
      if(!jwtHelper.isTokenExpired(token))
      {     
        backendAPIservice.getListadoProductos().success(function (recibe) {       
          var productosArray = recibe.response.productos;
          console.log(JSON.stringify(productosArray));  
          $scope.listaProductos = productosArray;
          store.set('token',recibe.response.token);          
        });

        backendAPIservice.getTipos().success(function (recibe) {        
          var tiposArray = recibe.response.tipos;
          console.log(JSON.stringify(tiposArray));
          $scope.listaTipo = tiposArray;
          store.set('token',recibe.response.token);
        });

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
      for(elemento in $scope.listaProductos) {
        if($scope.listaProductos[elemento].id == pid) {
          $scope.nombre=$scope.listaProductos[elemento].nombre;
          $scope.tipo=$scope.listaProductos[elemento].tipo;
          $scope.descripcion=$scope.listaProductos[elemento].descripcion;
          $scope.stock=$scope.listaProductos[elemento].stock;
          $scope.precio=$scope.listaProductos[elemento].precio;
          $scope.iva=$scope.listaProductos[elemento].iva;
          $scope.activo=$scope.listaProductos[elemento].activo;
          $scope.proveedor=$scope.listaProductos[elemento].proveedor;          
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
      for(elemento in $scope.listaProductos) {
        if($scope.listaProductos[elemento].id == pid) {
          $scope.nombre=$scope.listaProductos[elemento].nombre;
          $scope.tipo=$scope.listaProductos[elemento].tipo;
          $scope.descripcion=$scope.listaProductos[elemento].descripcion;
          $scope.stock=$scope.listaProductos[elemento].stock;
          $scope.precio=$scope.listaProductos[elemento].precio;
          $scope.iva=$scope.listaProductos[elemento].iva;
          $scope.activo=false;
          $scope.proveedor=$scope.listaProductos[elemento].proveedor;
          $scope.baja=true;
        }
      } 
      $scope.Almacenar($scope.id, $scope.nombre, $scope.tipo, $scope.descripcion, $scope.stock, $scope.precio, $scope.iva, $scope.activo, $scope.proveedor, $scope.baja); 
    }

    $scope.Cambiarclave=function()
    {
      $scope.cambioclave=true;
    }

    $scope.Almacenar=function(id, nombre, tipo, descripcion, stock, precio, iva, activo, proveedor, baja)
    {
      //Llamar a la función de persistencia
      backendAPIservice.postProducto(id, nombre, tipo, descripcion, stock, precio, iva, activo, proveedor, baja).success(function(recibe){
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
