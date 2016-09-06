'use strict';

angular.module('Frontend.Devolucion', ['ngRoute','angular-jwt','angular-storage'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/devolucion', {
    templateUrl: 'devolucion/devolucion.html',
    controller: 'DevolucionController'
  });
}])

.controller('DevolucionController', function($scope, store, jwtHelper, $http, backendAPIservice, $location) {
    //$scope.cargado=false;   
    $scope.terminado=false;   
    $scope.error=false;   
    $scope.cerrado=false;   
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
    $scope.codigo; 
    $scope.respuesta; 
       
    $scope.ventaOriginal = [];
    $scope.lineasModificada = [];
    $scope.lineasOriginal = [];
    $scope.listaProducto = [];

    //if(store.get('token') && store.get('token')!=" ")
    if(store.get('token'))
    {
      var token = store.get('token'); 
      if(!jwtHelper.isTokenExpired(token))
      {
        backendAPIservice.getProductos().success(function (recibe) {       
          var productosArray = recibe.response.productos;            
          store.set('token',recibe.response.token);
          var codigo1=recibe.code;
          console.log(JSON.stringify(codigo1));
          $scope.codigo=codigo1
          if($scope.codigo!=0) 
          {  
            $scope.cerrado=true;
            var respuesta1 = recibe.response.respuesta;
            console.log(JSON.stringify(respuesta1));
            $scope.respuesta = respuesta1;
          }  
          else
          {  
            console.log(JSON.stringify(productosArray));  
            $scope.listaProducto = productosArray;              
          }
        });        
      }
      else
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

    $scope.BuscarVenta=function(idventa) {
      //if(store.get('token') && store.get('token')!=" "){
      $scope.error=false;  
      if(store.get('token')){
        var token = store.get('token'); 
        if(!jwtHelper.isTokenExpired(token))
        { 
          backendAPIservice.getBuscaVenta(idventa).success(function(recibe){
            var codigo = recibe.code;
            console.log(JSON.stringify(codigo)); 
            $scope.codigo=codigo;  
            if($scope.codigo==0)
            { 
              $scope.error = false;             
              var recibeVenta = recibe.response.venta;
              console.log(JSON.stringify(recibeVenta));
              $scope.ventaOriginal = recibeVenta;   
              backendAPIservice.getBuscaListaVenta(idventa).success(function(recibe){
                var recibeLista = recibe.response.lineas;
                console.log(JSON.stringify(recibeLista));  
                $scope.lineasOriginal = recibeLista;
                store.set('token',recibe.response.token);
                $scope.TotalesOriginal();
              });
              backendAPIservice.getBuscaListaVenta(idventa).success(function(recibe){
                var recibeLista2 = recibe.response.lineas;
                console.log(JSON.stringify(recibeLista2));  
                $scope.lineasModificada = recibeLista2;
                store.set('token',recibe.response.token);
                $scope.TotalesModificado();
                //$scope.cargado==true;
              });
            }
            else              
            {
              var respuesta = recibe.response.respuesta;
              console.log(JSON.stringify(respuesta));
              $scope.respuesta = respuesta;
              if($scope.codigo==4) {$scope.error=true;}
              if($scope.codigo==3) {$scope.cerrado=true;}
              //if($scope.codigorecibido==5) $scope.respuesta="La caja ya está cerrada, la devolución no se puede tramitar";                            
            }
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
      backendAPIservice.postDevolucion($scope.lineasModificada, $scope.diferencia, $scope.ventaOriginal.socio, $scope.ventaOriginal.contado).success(function(recibe){
        var respuesta1 = recibe.response.respuesta;
        console.log(JSON.stringify(respuesta1));
        $scope.respuesta = respuesta1;
        if(recibe.code==0) store.set('token',recibe.response.token);
        $scope.terminado=true;
      });
    };

    $scope.Continuar=function() {
      $scope.error=false;
    };

    $scope.printDiv = function (divName) {

      var printContents = document.getElementById(divName).innerHTML;
      var originalContents = document.body.innerHTML;      

      if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
          var popupWin = window.open('', '_blank', 'width=600,height=600,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
          popupWin.window.focus();
          popupWin.document.write('<!DOCTYPE html><html><head>' +
              '<link rel="stylesheet" type="text/css" href="app.css" />' +
              '</head><body onload="window.print()"><div class="reward-body">' + printContents + '</div></html>');
          popupWin.onbeforeunload = function (event) {
              popupWin.close();
              return '.\n';
          };
          popupWin.onabort = function (event) {
              popupWin.document.close();
              popupWin.close();
          }
      } else {
          var popupWin = window.open('', '_blank', 'width=800,height=600');
          popupWin.document.open();
          popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="app.css" /></head><body onload="window.print()">' + printContents + '</html>');
          popupWin.document.close();
      }
      popupWin.document.close();
      $location.path("/venta");
      //return true;
    };
});
