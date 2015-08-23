'use strict';

angular.module('Frontend.Gestion.Socios', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/gestion/socios', {
    templateUrl: 'gestion/socios/socios.html',
    controller: 'GestionSociosController'
  });
}])

.controller('GestionSociosController', function($scope, $http, backendAPIservice) {

});
