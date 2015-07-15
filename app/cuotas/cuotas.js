'use strict';

angular.module('Frontend.Cuotas', ['ngRoute','angular-jwt','angular-storage'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/cuotas', {
    templateUrl: 'cuotas/cuotas.html',
    controller: 'CuotasController'
  });
}])

.controller('CuotasController', function($scope, store, jwtHelper, $http, backendAPIservice, $location) {
    $scope.listaSocios = [];
    $scope.terminado=false;
    $scope.respuesta;
    var d = new Date();    
    $scope.timed = d.getTime()/1000; 
    
    if(store.get('token') && store.get('token')!=" ")
    {
      var token = store.get('token'); 
      $scope.tokenDe = jwtHelper.decodeToken(token);
      if($scope.tokenDe.exp>$scope.timed)
      {     
        backendAPIservice.getSocios().success(function(recibe) {        
          var sociosArray = recibe.response.socios;
          console.log(JSON.stringify(sociosArray));
          $scope.listaSocios = sociosArray;
          store.set('token',recibe.response.token);
        });
      }
      else
      {
        store.set('token'," ");
        $location.path("/login");
      }
    } 
    else 
    {
      store.set('token'," ");
      $location.path("/login");
    }

    $scope.Finalizar=function() {
      backendAPIservice.postCuotas($scope.listaSocios).success(function(recibe){
        var respuesta1 = recibe.response.respuesta;
        console.log(JSON.stringify(respuesta1));
        $scope.respuesta = respuesta1;
        if(recibe.code==0) store.set('token',recibe.response.token);
        $scope.terminado=true;
      });
    }
});
