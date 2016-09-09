'use strict';

angular.module('Frontend.Venta', ['ngRoute','angular-jwt','angular-storage'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/venta', {
    templateUrl: 'venta/venta.html',
    controller: 'VentaController'
  });
}])

.controller('VentaController', function($scope, store, jwtHelper, $http, backendAPIservice, $location, $window) {
    $scope.terminado=false;
    $scope.cerrado=false;
    $scope.contado=true;
    $scope.cliente=1;
    $scope.base21=0.00;
    $scope.iva21=0.00;
    $scope.base10=0.00;
    $scope.iva10=0.00; 
    $scope.base4=0.00;
    $scope.iva4=0.00; 
    $scope.total=0.00;        
    $scope.articulopr;
    $scope.respuesta;
    $scope.error; 
    $scope.codigo;
    $scope.cero=0;  
    $scope.prueba;
    $scope.activo;
    $scope.numventa;

    $scope.listaVenta = [];
    $scope.listaProducto = [];
    $scope.listaSocio = [];  
    $scope.listaTipo = [];  
        
    if(store.get('token')){
      var token = store.get('token'); 
      if(!jwtHelper.isTokenExpired(token))
      {           
        backendAPIservice.getProductos().success(function (recibe) {                           
          var codigo=recibe.code;
          console.log(JSON.stringify(codigo));
          $scope.codigo=codigo;
          if($scope.codigo==0) 
          {  
            var productosArray = recibe.response.productos; 
            console.log(JSON.stringify(productosArray));  
            $scope.listaProducto = productosArray;   
            store.set('token',recibe.response.token);         
          }  
          else
          {  
            $scope.cerrado=true;
            var respuesta1 = recibe.response.respuesta;
            console.log(JSON.stringify(respuesta1));
            $scope.respuesta = respuesta1;              
            store.set('token',recibe.response.token);
          }
        });

        backendAPIservice.getTipos().success(function (recibe) {        
          var tiposArray = recibe.response.tipos;
          console.log(JSON.stringify(tiposArray));
          $scope.listaTipo = tiposArray;
          store.set('token',recibe.response.token);
        });        

        backendAPIservice.getClientes().success(function (recibe) {        
          var sociosArray = recibe.response.socios;
          console.log(JSON.stringify(sociosArray));
          $scope.listaSocio = sociosArray;
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

    $scope.Aniadir=function(pid, pnombre, pprecio, piva)
    {
      var elemento; 
      var anadido=false;
      for(elemento in $scope.listaVenta) {
        if($scope.listaVenta[elemento].id == pid) {
          $scope.listaVenta[elemento].cantidad = $scope.listaVenta[elemento].cantidad+1;
          anadido=true;
        }
      } 
      if(anadido==false)
      {
        $scope.listaVenta.push({id:pid, nombre:pnombre, precio:pprecio, iva:piva, cantidad:1 });        
      }
      $scope.Totales();
    };

    $scope.clienteElegido=function(value) {
      if($scope.cliente==1){ $scope.contado=true; }
      if (value.id==$scope.cliente)
      {
        return true;
      } 
      else 
      {
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
      backendAPIservice.postVenta($scope.cliente, $scope.contado, $scope.listaVenta).success(function(recibe){
        var respuesta1 = recibe.response.respuesta;
        var numventa = recibe.response.venta;
        console.log(JSON.stringify(respuesta1));
        console.log(JSON.stringify(numventa));
        $scope.respuesta = respuesta1;
        $scope.numventa = numventa;
        store.set('token',recibe.response.token);
        $scope.terminado=true;
      });
    };

    $scope.Continuar=function() {
      /*html2canvas(document.getElementById('imprimeesto'), {
        onrendered: function (canvas) {
          var data = canvas.toDataURL();
          var docDefinition = {
            content: [{
              image: data,
              width: 500,
            }]
          };
          pdfMake.createPdf(docDefinition).download("Score_Details.pdf");
        }
      })*/
      $scope.terminado=false;
      $scope.contado=true;
      $scope.cerrado=false;
      $scope.cliente=1;
      $scope.cliente2=1;
      $scope.base21=0.00;
      $scope.iva21=0.00;
      $scope.base10=0.00;
      $scope.iva10=0.00; 
      $scope.base4=0.00;
      $scope.iva4=0.00; 
      $scope.total=0.00;        
      $scope.articulopr;
      $scope.respuesta;
      $scope.error; 
      $scope.codigo;
      $scope.cero=0;  
      $scope.prueba;
      $scope.activo;

      $scope.listaVenta = [];
      $scope.listaProducto = [];
      $scope.listaSocio = [];  
      $scope.listaTipo = [];  
          
      if(store.get('token')){
        var token = store.get('token'); 
        if(!jwtHelper.isTokenExpired(token))
        {     
          backendAPIservice.getProductos().success(function (recibe) {       
            var productosArray = recibe.response.productos;            
            store.set('token',recibe.response.token);
            if(recibe.code!=0) 
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

          /*backendAPIservice.getProductos().success(function (recibe) {       
            var productosArray = recibe.response.productos;
            console.log(JSON.stringify(productosArray));  
            $scope.listaProducto = productosArray;
            store.set('token',recibe.response.token);          
          });  */          

          backendAPIservice.getClientes().success(function (recibe) {        
            var sociosArray = recibe.response.socios;
            console.log(JSON.stringify(sociosArray));
            $scope.listaSocio = sociosArray;
            store.set('token',recibe.response.token);
          });

          backendAPIservice.getTipos().success(function (recibe) {        
            var tiposArray = recibe.response.tipos;
            console.log(JSON.stringify(tiposArray));
            $scope.listaTipo = tiposArray;
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
    };

    /*$scope.printDiv=function(divName){
      var printContents = document.getElementById(divName).innerHTML;
      var originalContents = document.body.innerHTML;        
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
    };*/

    /*$scope.printDiv = function(divName) {
      var printContents = document.getElementById(divName).innerHTML;
      var popupWin = window.open('', '_blank', 'width=300,height=300');
      popupWin.document.open();
      popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="app.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
      popupWin.document.close();
    };*/

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
          popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" /></head><body onload="window.print()">' + printContents + '</html>');
          popupWin.document.close();
      }
      popupWin.document.close();

      return true;
    };

});