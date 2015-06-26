'use strict';

angular.module('Frontend.Cierre', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/cierre', {
    templateUrl: 'cierre/cierre.html',
    controller: 'CierreController'
  });
}])

.controller('CierreController', function($scope, $http, backendAPIservice) {
    $scope.terminado=false;   
    $scope.base21=0.00;
    $scope.iva21=0.00;
    $scope.base10=0.00;
    $scope.iva10=0.00; 
    $scope.base4=0.00;
    $scope.iva4=0.00; 
    $scope.contado=0.00; 
    $scope.prepago=0.00;
    $scope.resto=0.00;   
    

    $scope.anterior = [];      
    $scope.listaVentas = [];
    $scope.listaLineas = [];

    backendAPIservice.getCierreVentas().success(function (response) {        
        var VentasArray = response;
        console.log(JSON.stringify(VentasArray));  
        $scope.listaVentas = VentasArray;
    });

    backendAPIservice.getCierreLineas().success(function (response) {        
        var LineasArray = response;
        console.log(JSON.stringify(LineasArray));
        $scope.listaLineas = LineasArray;
        $scope.Totales();
    });

    backendAPIservice.getUltimoCierre().success(function (response) {        
        var UltimoCierre = response;
        console.log(JSON.stringify(UltimoCierre));
        $scope.anterior = UltimoCierre;
    });

    $scope.Totales=function() {
      var elemento; 
      var linea;
      for(elemento in $scope.listaVentas) {
        for(linea in $scope.listaLineas) {
          if($scope.listaVentas[elemento].id == $scope.listaLineas[linea].venta) {  
            if($scope.listaLineas[linea].iva=="21") {
             $scope.base21 += ($scope.listaLineas[linea].precio * $scope.listaLineas[linea].cantidad);
             $scope.iva21 = ($scope.base21 * 21.00 )/100.00;   
             if($scope.listaVentas[elemento].contado=="Si"){
               $scope.contado += ($scope.listaLineas[linea].precio * $scope.listaLineas[linea].cantidad) * 1.21;
             }
             else {
               $scope.prepago += ($scope.listaLineas[linea].precio * $scope.listaLineas[linea].cantidad) * 1.21;
             }          
            }
            if($scope.listaLineas[linea].iva==10) {
              $scope.base10  += ($scope.listaLineas[linea].precio * $scope.listaLineas[linea].cantidad);
              $scope.iva10 = ($scope.base10 * 10.00 )/100.00;             
              if($scope.listaVentas[elemento].contado=="Si"){
                $scope.contado += ($scope.listaLineas[linea].precio * $scope.listaLineas[linea].cantidad) * 1.10;
              }
              else {
                $scope.prepago += ($scope.listaLineas[linea].precio * $scope.listaLineas[linea].cantidad) * 1.10;
              } 
            }
            if($scope.listaLineas[linea].iva==4) {
              $scope.base4  += ($scope.listaLineas[linea].precio * $scope.listaLineas[linea].cantidad);
              $scope.iva4 = ($scope.base4 * 4.00 )/100.00;             
              if($scope.listaVentas[elemento].contado=="Si"){
                $scope.contado += ($scope.listaLineas[linea].precio * $scope.listaLineas[linea].cantidad) * 1.04;
              }
              else {
                $scope.prepago += ($scope.listaLineas[linea].precio * $scope.listaLineas[linea].cantidad) * 1.04;
              } 
            }
          }          
        }
      }
    };

    $scope.Finalizar=function() {
      backendAPIservice.postCierre($scope.resto).success(function(response){
        console.log(response);
        $scope.terminado=true;
      });
    }

});
