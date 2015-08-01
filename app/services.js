'use strict';

angular.module('Frontend.services', ['ngRoute', 'angular-jwt', 'angular-storage'])
  .value('version', '0.1') 
  .factory('backendAPIservice', function($http, CONFIG, store) {

  return{
    getProductos: function() {        
      //return $http.get(CONFIG.APIURL+'/todosProductos.json');      
      return $http({
        method: 'get',
        url: CONFIG.APIURL+'/todosProductos.json',
        headers: {'Content-Type': 'application/json'}, 
        //headers: {'Content-Type': 'application/json', 'HTTP_AUTHORIZATION': localStorage.getItem('token')},        
        //params: {callback: 'JSON_CALLBACK'},
      });            
    }, 

    getClientes: function() {
      //return $http.jsonp(CONFIG.APIURL+'/todosClientes.json');
      return $http({
        method: 'get',
        url: CONFIG.APIURL+'/todosClientes.json',
        headers: {'Content-Type': 'application/json'},
        //params: {callback: 'JSON_CALLBACK'},
      });
    },

    getTipos: function() {
      //return $http.jsonp(CONFIG.APIURL+'/todosTipos.json');
      return $http({
        method: 'get',
        url: CONFIG.APIURL+'/todosTipos.json',
        headers: {'Content-Type': 'application/json'},
        //params: {callback: 'JSON_CALLBACK'},
      });
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
      return $http.get(CONFIG.APIURL+'/todosClientesCuotas.json');
    },

    postCuotas: function(vsocios) {
      return $http.post(CONFIG.APIURL+'/recibirCuotas',{socios: vsocios});
    },

    postLogin: function(username,password) {
      return $http.post(CONFIG.APIURL+'/login',{username: username, password: password},{'Content-Type': 'application/x-www-form-urlencoded'});
      /*return $http({
        method: 'POST',
        url: CONFIG.APIURL+'/login',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: {username: username, password: password}        
      })*/ 
    } 
  } 
  })
  .config(["$httpProvider", "jwtInterceptorProvider",  function ($httpProvider, jwtInterceptorProvider, store) 
  {
    //if(localStorage.getItem('token')!=0){
      //$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
    
      //en cada petición enviamos el token a través de los headers con el nombre Authorization
      jwtInterceptorProvider.tokenGetter = ['backendAPIservice', function(backendAPIservice) {
        return localStorage.getItem('token');
      }];
      $httpProvider.interceptors.push('jwtInterceptor');
  }])


