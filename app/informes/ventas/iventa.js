'use strict';

angular.module('Frontend.Informes.Ventas', ['ngRoute','angular-jwt','angular-storage'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/informes/ventas', {
    templateUrl: 'informes/ventas/iventa.html',
    controller: 'IVentasController'
  });
}])

.controller('IVentasController', function($scope, store, jwtHelper, $http, backendAPIservice, $location) {
    $scope.listaVentas = [];
    $scope.terminado=false;
    $scope.consulta=false;
    $scope.error=false;
    $scope.fechainicio;
    $scope.fechafin;
    $scope.fechasvalidas=false;
    $scope.respuesta;
    $scope.base21;
    $scope.iva21;
    $scope.base10;
    $scope.iva10;
    $scope.base4;
    $scope.iva4;
    $scope.total;
    $scope.totalbase;
    $scope.totaliva;

    if(store.get('token'))
    {
      var token = store.get('token'); 
      if(jwtHelper.isTokenExpired(token))
      {     
        store.remove('token');
        $location.path("/login");
      }
    } 
    else 
    {
      store.remove('token');
      $location.path("/login");
    } 
    
    $scope.ValidarFecha=function(fechaa, fechab) {
      if(fechaa > fechab) return false;
      else return true;
    };

    //if(store.get('token') && store.get('token')!=" ")
    $scope.BuscarListadoVentas=function(fechainicio, fechafin) {      
    if($scope.ValidarFecha(fechainicio, fechafin)){
      if(store.get('token')){
        var token = store.get('token'); 
        if(!jwtHelper.isTokenExpired(token))
        {           
          backendAPIservice.getBuscaListadoVentas(fechainicio, fechafin).success(function(recibe){
            var codigo = recibe.code;
            console.log(JSON.stringify(codigo)); 
            $scope.codigorecibido=codigo;  
            if($scope.codigorecibido==0)
            {
              var ventasArray = recibe.response.ventas;
              console.log(JSON.stringify(ventasArray));
              $scope.listaVentas = ventasArray;
              $scope.consulta=true;   
              $scope.Totales();
            }
            else
            {
              $scope.respuesta="La venta indicada no existe";
            }
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
    }
    else 
    {
      $scope.respuesta="La fecha de inicio debe ser menor que la fecha de fin";
      $scope.error=true;
    }
    };

    $scope.Totales=function() {
      var elemento; 
      $scope.base21=0.00;
      $scope.iva21=0.00;
      $scope.base10=0.00;
      $scope.iva10=0.00; 
      $scope.base4=0.00;
      $scope.iva4=0.00; 
      for(elemento in $scope.listaVentas) {
        $scope.base21 += $scope.listaVentas[elemento].base21;
        $scope.base10  += $scope.listaVentas[elemento].base10;
        $scope.base4  += $scope.listaVentas[elemento].base4;           
      }
      $scope.iva21 = ($scope.base21 * 21.00 )/100.00;             
      $scope.iva10 = ($scope.base10 * 10.00 )/100.00;             
      $scope.iva4 = ($scope.base4 * 4.00 )/100.00;  
      $scope.totalbase = $scope.base21 + $scope.base10 + $scope.base4;
      $scope.totaliva = $scope.iva21 + $scope.iva10 + $scope.iva4;
      $scope.total = $scope.totalbase + $scope.total;
    };

    $scope.Continuar=function() {
      $scope.error = false;
    };  

    $scope.Salir=function() {
      $location.path("/venta");
    };  


    $scope.printDiv = function(divName) {
      var printContents = document.getElementById(divName).innerHTML;
      var popupWin = window.open('', '_blank', 'width=300,height=300');
      popupWin.document.open();
      popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="app.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
      popupWin.document.close();
      $scope.terminado=false;
    };        

});
