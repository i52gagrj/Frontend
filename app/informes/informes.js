'use strict';

angular.module('Frontend.Informes', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/informes', {
    templateUrl: 'informes/informes.html',
    controller: 'InformesController'
  });
}])

.controller('InformesController', function($scope, $http, backendAPIservice) {

});
