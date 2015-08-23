'use strict';

angular.module('Frontend.Gestion.Usuarios', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/gestion/usuarios', {
    templateUrl: 'gestion/usuarios/usuarios.html',
    controller: 'GestionUsuariosController'
  });
}])

.controller('GestionUsuariosController', function($scope, $http, backendAPIservice) {

});
