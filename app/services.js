'use strict';

angular.module('Frontend.services', ['ngRoute', 'angular-jwt', 'angular-storage'])
  .value('version', '0.1') 
  .factory('backendAPIservice', function($http, CONFIG, store) {

  return{
    //Se ha sustituido la petición $http.jsonp por $http.get, al tratarse de una petición dentro del mismo servidor.
    //Se deberá modificar la dirección indicada en el momento de desplegar la aplicación en un servidor.

    getProductos: function() {
      return $http.get(CONFIG.APIURL+'/todosProductos.json?callback=JSON_CALLBACK');
    }, 

    getClientes: function() {
      return $http.get(CONFIG.APIURL+'/todosClientes.json?callback=JSON_CALLBACK');
    },

    getTipos: function() {
      return $http.get(CONFIG.APIURL+'/todosTipos.json?callback=JSON_CALLBACK');
    },

    postVenta: function(vcliente, vcontado, vcesta) {
      return $http.post(CONFIG.APIURL+'/recibirVenta',{cliente: vcliente, contado: vcontado, cesta: vcesta});
    },

    getCierreVentas: function() {
      return $http.get(CONFIG.APIURL+'/cierreVentas.json?callback=JSON_CALLBACK');
    }, 

    getCierreLineas: function() {
      return $http.get(CONFIG.APIURL+'/cierreLineas.json?callback=JSON_CALLBACK');
    },

    getUltimoCierre: function() {
      return $http.get(CONFIG.APIURL+'/ultimoCierre.json?callback=JSON_CALLBACK');
    },

    postCierre: function(vdejado) {
      return $http.post(CONFIG.APIURL+'/recibirCierre',{dejado: vdejado});
    },

    getBuscaVenta: function(idventa) {
      return $http.get(CONFIG.APIURL+'/buscaVenta.json/'+idventa);
    },

    getBuscaListaVenta: function(idventa) {
      return $http.get(CONFIG.APIURL+'/buscaListaVenta.json/'+idventa);
    },

    postDevolucion: function(vmodificada, vdiferencia, vsocio, vcontado) {
      return $http.post(CONFIG.APIURL+'/recibirModificada',{modificada: vmodificada, diferencia: vdiferencia, socio: vsocio, contado: vcontado});
    },

    getSocios: function() {      
      return $http.get(CONFIG.APIURL+'/todosClientesCuotas.json?callback=JSON_CALLBACK');
    },

    postCuotas: function(vsocios) {
      return $http.post(CONFIG.APIURL+'/recibirCuotas',{socios: vsocios});
    },

    postLogin: function(username,password) {
      return $http.post(CONFIG.APIURL+'/login',{username: username, password: password});
    } 
  } 
  })
  .config(["$httpProvider", "jwtInterceptorProvider",  function ($httpProvider, jwtInterceptorProvider, store) 
  {
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
    
    //en cada petición enviamos el token a través de los headers con el nombre Authorization
    jwtInterceptorProvider.tokenGetter = ['backendAPIservice', function(backendAPIservice) {
      return localStorage.getItem('token');
    }];
    $httpProvider.interceptors.push('jwtInterceptor');
  }])

