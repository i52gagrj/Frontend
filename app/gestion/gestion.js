'use strict';

angular.module('Frontend.Gestion', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/gestion', {
    templateUrl: 'gestion/gestion.html',
    controller: 'GestionController'
  });
}])

.controller('GestionController', function($scope, $http, backendAPIservice) {

});
