'use strict';

// Declare app level module which depends on views, and components
var Frontend=angular.module('Frontend', [
  //'satellizer',
  'ngRoute',
  'angular-jwt',
  'angular-storage',
  'Frontend.Index',
  'Frontend.services',
  'Frontend.Venta',
  'Frontend.Cierre',
  'Frontend.Devolucion',
  'Frontend.Gestion',
  'Frontend.Informes',
  'Frontend.Cuotas', 
  'Frontend.Login',
]);
Frontend.constant('CONFIG', {
        APIURL: "http://192.168.1.3/TPVCJ1.2/web/app_dev.php/caja/datos",
	//APIURL: "http://ancient-mesa-9870.herokuapp.com/caja/datos",
})
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/venta'});
}]);





