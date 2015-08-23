'use strict';

angular.module('Frontend.Gestion.Tipos', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/gestion/tipos', {
    templateUrl: 'gestion/tipos/tipos.html',
    controller: 'GestionTiposController'
  });
}])

.controller('GestionTiposController', function($scope, $http, backendAPIservice) {

});
