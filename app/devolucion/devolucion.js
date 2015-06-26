'use strict';

angular.module('Frontend.Devolucion', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/devolucion', {
    templateUrl: 'devolucion/devolucion.html',
    controller: 'DevolucionController'
  });
}])

.controller('DevolucionController', function($scope, $http, backendAPIservice) {
    //$scope.cargado=false;   
    $scope.terminado=false;   
    $scope.base21original=0.00;
    $scope.iva21original=0.00;
    $scope.base10original=0.00;
    $scope.iva10original=0.00; 
    $scope.base4original=0.00;
    $scope.iva4original=0.00; 
    $scope.totaloriginal=0.00; 
    $scope.base21modificado=0.00;
    $scope.iva21modificado=0.00;
    $scope.base10modificado=0.00;
    $scope.iva10modificado=0.00; 
    $scope.base4modificado=0.00;
    $scope.iva4modificado=0.00; 
    $scope.totalmodificado=0.00; 
    $scope.diferencia=0.00;  
    $scope.idventa; 
       
    $scope.ventaOriginal = [];
    $scope.lineasModificada = [];
    $scope.lineasOriginal = [];
    $scope.listaProducto = [];

    backendAPIservice.getProductos().success(function (response) {        
        var productosArray = response;
        console.log(JSON.stringify(productosArray));  
        $scope.listaProducto = productosArray;
    });

    $scope.BuscarVenta=function(idventa) {
      backendAPIservice.getBuscaVenta(idventa).success(function(response){
        var recibeVenta = response;
        console.log(JSON.stringify(recibeVenta));  
        $scope.ventaOriginal = recibeVenta;   
        backendAPIservice.getBuscaListaVenta(idventa).success(function(response){
          var recibeLista = response;
          console.log(JSON.stringify(recibeLista));  
          $scope.lineasOriginal = recibeLista;
          $scope.TotalesOriginal();
        });
        backendAPIservice.getBuscaListaVenta(idventa).success(function(response){
          var recibeLista2 = response;
          console.log(JSON.stringify(recibeLista2));  
          $scope.lineasModificada = recibeLista2;
          $scope.TotalesModificado();
          //$scope.cargado==true;
        });
      });
    };

    $scope.TotalesOriginal=function() {
      var elemento; 
      $scope.base21original=0.00;
      $scope.iva21original=0.00;
      $scope.base10original=0.00;
      $scope.iva10original=0.00; 
      $scope.base4original=0.00;
      $scope.iva4original=0.00; 
      $scope.totaloriginal=0.00;
      for(elemento in $scope.lineasOriginal) {
        if($scope.lineasOriginal[elemento].iva=="21") {
         $scope.base21original += ($scope.lineasOriginal[elemento].precio * $scope.lineasOriginal[elemento].cantidad);
         $scope.iva21original = ($scope.base21original * 21.00 )/100.00;             
        };
        if($scope.lineasOriginal[elemento].iva==10) {
         $scope.base10original  += ($scope.lineasOriginal[elemento].precio * $scope.lineasOriginal[elemento].cantidad);
         $scope.iva10original = ($scope.base10original * 10.00 )/100.00;             
        };
        if($scope.lineasOriginal[elemento].iva==4) {
         $scope.base4original  += ($scope.lineasOriginal[elemento].precio * $scope.lineasOriginal[elemento].cantidad);
         $scope.iva4original = ($scope.base4original * 4.00 )/100.00;             
        };          
      }
      $scope.totaloriginal = $scope.base21original + $scope.iva21original + $scope.base10original + $scope.iva10original + $scope.base4original + $scope.iva4original;
    };

    $scope.TotalesModificado=function() {
      var elemento; 
      $scope.base21modificado=0.00;
      $scope.iva21modificado=0.00;
      $scope.base10modificado=0.00;
      $scope.iva10modificado=0.00; 
      $scope.base4modificado=0.00;
      $scope.iva4modificado=0.00; 
      $scope.totalmodificado = 0.00;
      $scope.diferencia = 0.00;
      for(elemento in $scope.lineasModificada) {
        if($scope.lineasModificada[elemento].iva=="21") {
         $scope.base21modificado += ($scope.lineasModificada[elemento].precio * $scope.lineasModificada[elemento].cantidad);
         $scope.iva21modificado = ($scope.base21modificado * 21.00 )/100.00;             
        };
        if($scope.lineasModificada[elemento].iva==10) {
         $scope.base10modificado  += ($scope.lineasModificada[elemento].precio * $scope.lineasModificada[elemento].cantidad);
         $scope.iva10modificado = ($scope.base10modificado * 10.00 )/100.00;             
        };
        if($scope.lineasModificada[elemento].iva==4) {
         $scope.base4modificado  += ($scope.lineasModificada[elemento].precio * $scope.lineasModificada[elemento].cantidad);
         $scope.iva4modificado = ($scope.base4modificado * 4.00 )/100.00;             
        };          
      }
      $scope.totalmodificado = $scope.base21modificado + $scope.iva21modificado + $scope.base10modificado + $scope.iva10modificado + $scope.base4modificado + $scope.iva4modificado;
      $scope.diferencia = $scope.totalmodificado - $scope.totaloriginal;
    };

    $scope.Borrar=function(index) {
      $scope.lineasModificada[index].borrar=true;
      $scope.lineasModificada[index].cantidad=0; 
      $scope.TotalesModificado();
    };    

    $scope.CambiarProducto=function(index) {
      var elemento=0;
      for(elemento in $scope.listaProducto) {
        if($scope.listaProducto[elemento].id == $scope.lineasModificada[index].idproducto){
          $scope.lineasModificada[index].nombre = $scope.listaProducto[elemento].nombre;
          $scope.lineasModificada[index].precio = $scope.listaProducto[elemento].precio;
          $scope.lineasModificada[index].iva = $scope.listaProducto[elemento].iva;
        }    
      }
      $scope.TotalesModificado();
    }; 

    $scope.Finalizar=function() {
      backendAPIservice.postDevolucion($scope.lineasModificada, $scope.diferencia, $scope.ventaOriginal.socio, $scope.ventaOriginal.contado).success(function(response){
        console.log(response);
        $scope.terminado=true;
      });
    }
});
