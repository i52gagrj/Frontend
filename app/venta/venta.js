'use strict';

angular.module('Frontend.Venta', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/venta', {
    templateUrl: 'venta/venta.html',
    controller: 'VentaController'
  });
}])

.controller('VentaController', function($scope, $http, backendAPIservice) {
    $scope.terminado=false;
    $scope.contado=true;
    $scope.cliente=1;
    $scope.base21=0.00;
    $scope.iva21=0.00;
    $scope.base10=0.00;
    $scope.iva10=0.00; 
    $scope.base4=0.00;
    $scope.iva4=0.00; 
    $scope.total=0.00;

    $scope.listaVenta = [];
    $scope.listaProducto = [];
    $scope.listaSocio = [];

    backendAPIservice.getProductos().success(function (response) {        
        var productosArray = response;
        console.log(JSON.stringify(productosArray));  
        $scope.listaProducto = productosArray;
    });

    backendAPIservice.getClientes().success(function (response) {        
        var sociosArray = response;
        console.log(JSON.stringify(sociosArray));
        $scope.listaSocio = sociosArray;
    });

    $scope.Aniadir=function(pid, pnombre, pprecio, piva)
    {
      $scope.listaVenta.push({id:pid, nombre:pnombre, precio:pprecio, iva:piva, cantidad:1 });
      $scope.Totales();
    };

    $scope.clienteElegido=function(value) {
      if (value.id==$scope.cliente){
        return true;
      } else {
        return false;
      } 
    };   

    $scope.Borrar=function(index) {
      $scope.listaVenta.splice(index, 1);
      $scope.Totales();
    };

    $scope.Totales=function() {
      var elemento; 
      $scope.base21=0.00;
      $scope.iva21=0.00;
      $scope.base10=0.00;
      $scope.iva10=0.00; 
      $scope.base4=0.00;
      $scope.iva4=0.00; 
      for(elemento in $scope.listaVenta) {
        if($scope.listaVenta[elemento].iva=="21") {
         $scope.base21 += ($scope.listaVenta[elemento].precio * $scope.listaVenta[elemento].cantidad);
         $scope.iva21 = ($scope.base21 * 21.00 )/100.00;             
        };
        if($scope.listaVenta[elemento].iva==10) {
         $scope.base10  += ($scope.listaVenta[elemento].precio * $scope.listaVenta[elemento].cantidad);
         $scope.iva10 = ($scope.base10 * 10.00 )/100.00;             
        };
        if($scope.listaVenta[elemento].iva==4) {
         $scope.base4  += ($scope.listaVenta[elemento].precio * $scope.listaVenta[elemento].cantidad);
         $scope.iva4 = ($scope.base4 * 4.00 )/100.00;             
        };          
      }
      $scope.total = $scope.base21 + $scope.iva21 + $scope.base10 + $scope.iva10 + $scope.base4 + $scope.iva4;
    };

    $scope.Finalizar=function() {
      backendAPIservice.postVenta($scope.cliente, $scope.contado, $scope.listaVenta).success(function(response){
        console.log(response);
        $scope.terminado=true;
      });
    }
});
