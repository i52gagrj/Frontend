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
  'Frontend.Gestion.Cuotas',
  'Frontend.Gestion.Productos',
  'Frontend.Gestion.Proveedores',
  'Frontend.Gestion.Socios',
  'Frontend.Gestion.Tipos',
  'Frontend.Gestion.Usuarios', 
  'Frontend.Login',
  'Frontend.Informes.Ventas',
]);
Frontend.constant('CONFIG', {
        //APIURL: "http://192.168.1.3/TPVCJ1.2/web/app.php/caja/datos",
        //APIURL2: "http://192.168.1.3/TPVCJ1.2/web/app.php/caja/gestion",
	APIURL: "http://ancient-mesa-9870.herokuapp.com/caja/datos",
        APIURL2: "http://ancient-mesa-9870.herokuapp.com/caja/gestion",  
})
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/venta'});
}]);




