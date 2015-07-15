'use strict';

angular.module('Frontend.Cierre', ['ngRoute','angular-jwt','angular-storage'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/cierre', {
    templateUrl: 'cierre/cierre.html',
    controller: 'CierreController'
  });
}])

.controller('CierreController', function($scope, store, jwtHelper, $http, backendAPIservice, $location) {
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
    $scope.respuesta;  
    $scope.prueba="Prueba";
    $scope.tokenDe;  
    $scope.total=0.00;

    $scope.anterior=0.00;      
    $scope.listaVentas = [];
    $scope.listaLineas = [];
    
    //if(store.get('token') && store.get('token')!=" "){
    if(store.get('token')){
      var token = store.get('token'); 
      if(!jwtHelper.isTokenExpired(token))
      {
        backendAPIservice.getCierreVentas().success(function (recibe) {        
          var VentasArray = recibe.response.ventas;
          console.log(JSON.stringify(VentasArray));  
          $scope.listaVentas = VentasArray;
          store.set('token',recibe.response.token);
        });

        backendAPIservice.getCierreLineas().success(function (recibe) {        
          var LineasArray = recibe.response.lineas;
          console.log(JSON.stringify(LineasArray));
          $scope.listaLineas = LineasArray;
          store.set('token',recibe.response.token);
          $scope.Totales();
        });

        backendAPIservice.getUltimoCierre().success(function (recibe) {        
          var UltimoCierre = recibe.response.dejado;
          console.log(JSON.stringify(UltimoCierre));
          $scope.anterior = UltimoCierre;
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

    $scope.Totales=function() {
      var elemento; 
      var linea;
      for(elemento in $scope.listaVentas) 
      {
        for(linea in $scope.listaLineas) 
        {
          if($scope.listaVentas[elemento].id == $scope.listaLineas[linea].venta) 
          {  
            if($scope.listaLineas[linea].iva=="21") 
            {
              $scope.base21 += ($scope.listaLineas[linea].precio * $scope.listaLineas[linea].cantidad);
              $scope.iva21 = ($scope.base21 * 21.00 )/100.00;   
              if($scope.listaVentas[elemento].contado=="Si")
              {
                $scope.contado += ($scope.listaLineas[linea].precio * $scope.listaLineas[linea].cantidad) * 1.21;
              }
              else 
              {
                $scope.prepago += ($scope.listaLineas[linea].precio * $scope.listaLineas[linea].cantidad) * 1.21;
              }          
            }

            if($scope.listaLineas[linea].iva==10) 
            {
              $scope.base10  += ($scope.listaLineas[linea].precio * $scope.listaLineas[linea].cantidad);
              $scope.iva10 = ($scope.base10 * 10.00 )/100.00;             
              if($scope.listaVentas[elemento].contado=="Si")
              {
                $scope.contado += ($scope.listaLineas[linea].precio * $scope.listaLineas[linea].cantidad) * 1.10;
              }
              else 
              {
                $scope.prepago += ($scope.listaLineas[linea].precio * $scope.listaLineas[linea].cantidad) * 1.10;
              } 
            }
            if($scope.listaLineas[linea].iva==4) 
            {
              $scope.base4  += ($scope.listaLineas[linea].precio * $scope.listaLineas[linea].cantidad);
              $scope.iva4 = ($scope.base4 * 4.00 )/100.00;             
              if($scope.listaVentas[elemento].contado=="Si")
              {
                $scope.contado += ($scope.listaLineas[linea].precio * $scope.listaLineas[linea].cantidad) * 1.04;
              }
              else 
              {
                $scope.prepago += ($scope.listaLineas[linea].precio * $scope.listaLineas[linea].cantidad) * 1.04;
              } 
            }
          }          
        }
      }
      $scope.total=$scope.contado+($scope.anterior*1);
    };

    $scope.Finalizar=function() {
      backendAPIservice.postCierre($scope.resto).success(function(recibe){
        var respuesta1 = recibe.response.respuesta;
        console.log(JSON.stringify(respuesta1));
        $scope.respuesta = respuesta1;
        if(recibe.code==0) store.set('token',recibe.response.token);
        $scope.terminado=true;
      });
    };

});
