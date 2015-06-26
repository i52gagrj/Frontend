'use strict';

angular.module('Frontend.Cuotas', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/cuotas', {
    templateUrl: 'cuotas/cuotas.html',
    controller: 'CuotasController'
  });
}])

.controller('CuotasController', function($scope, $http, backendAPIservice) {
    $scope.listaSocios = [];
    $scope.terminado=false;

    backendAPIservice.getSocios().success(function (response) {        
        var sociosArray = response;
        console.log(JSON.stringify(sociosArray));
        $scope.listaSocios = sociosArray;
    });

    $scope.Finalizar=function() {
      backendAPIservice.postCuotas($scope.listaSocios).success(function(response){
        console.log(response);
        $scope.terminado=true;
      });
    }
});
