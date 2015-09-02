'use strict';

angular.module('Frontend.services', ['ngRoute', 'angular-jwt', 'angular-storage'])
  .value('version', '0.1') 
  .factory('backendAPIservice', function($http, CONFIG, store) {

  return{
    getProductos: function() {        
      return $http.get(CONFIG.APIURL+'/todosProductos.json',{'Content-Type': 'application/json'});      
      /*return $http({
        method: 'get',
        url: CONFIG.APIURL+'/todosProductos.json',
        headers: {'Content-Type': 'application/json'}, 
        //headers: {'Content-Type': 'application/json', 'HTTP_AUTHORIZATION': localStorage.getItem('token')},        
      });*/            
    }, 

    getClientes: function() {
      return $http.get(CONFIG.APIURL+'/todosClientes.json',{'Content-Type': 'application/json'});
    },

    getTipos: function() {
      return $http.get(CONFIG.APIURL+'/todosTipos.json',{'Content-Type': 'application/json'});
    },

    postVenta: function(vcliente, vcontado, vcesta) {
      return $http.post(CONFIG.APIURL+'/recibirVenta',{cliente: vcliente, contado: vcontado, cesta: vcesta},
        {'Content-Type': 'application/x-www-form-urlencoded'});
    },

    getCierreVentas: function() {
      return $http.get(CONFIG.APIURL+'/cierreVentas.json',{'Content-Type': 'application/json'});
    }, 

    getCierreLineas: function() {
      return $http.get(CONFIG.APIURL+'/cierreLineas.json',{'Content-Type': 'application/json'});
    },

    getUltimoCierre: function() {
      return $http.get(CONFIG.APIURL+'/ultimoCierre.json',{'Content-Type': 'application/json'});
    },

    postCierre: function(vdejado) {
      return $http.post(CONFIG.APIURL+'/recibirCierre',{dejado: vdejado},{'Content-Type': 'application/x-www-form-urlencoded'});
    },

    getBuscaVenta: function(idventa) {
      return $http.get(CONFIG.APIURL+'/buscaVenta.json/'+idventa,{'Content-Type': 'application/json'});
    },

    getBuscaListaVenta: function(idventa) {
      return $http.get(CONFIG.APIURL+'/buscaListaVenta.json/'+idventa,{'Content-Type': 'application/json'});
    },

    postDevolucion: function(vmodificada, vdiferencia, vsocio, vcontado) {
      return $http.post(CONFIG.APIURL+'/recibirModificada',{modificada: vmodificada, diferencia: vdiferencia, socio: vsocio, contado: vcontado}, 
        {'Content-Type': 'application/x-www-form-urlencoded'});
    },

    getSocios: function() {      
      return $http.get(CONFIG.APIURL+'/todosClientesCuotas.json',{'Content-Type': 'application/json'});
    },

    postCuotas: function(vsocios) {
      return $http.post(CONFIG.APIURL+'/recibirCuotas',{socios: vsocios},{'Content-Type': 'application/x-www-form-urlencoded'});
    },

    postLogin: function(username,password) {
      return $http.post(CONFIG.APIURL+'/login',{username: username, password: password},{'Content-Type': 'application/x-www-form-urlencoded'});
    },

   //////////////////////////GESTION///////////////////////////////

    getListadoProveedores: function() {        
      return $http.get(CONFIG.APIURL+'/listadoProveedores.json',{'Content-Type': 'application/json'});               
    },

    postProveedor: function(vid, vnombre, vnif, vdireccion, vpoblacion, vprovincia, vcp, vfijo, vmovil, vemail, vactivo) {
      return $http.post(CONFIG.APIURL+'/recibeProveedor',{id: vid, nombre: vnombre, nif: vnif, direccion: vdireccion, poblacion: vpoblacion, provincia: vprovincia, cp: vcp, fijo: vfijo, movil: vmovil, email: vemail, activo: vactivo},
        {'Content-Type': 'application/x-www-form-urlencoded'});
    },

    getListadoSocios: function() {        
      return $http.get(CONFIG.APIURL+'/listadoSocios.json',{'Content-Type': 'application/json'});               
    },

    postSocio: function(vid, vnombre, vdni, vdireccion, vpoblacion, vprovincia, vcp, vfijo, vmovil, vemail, vactivo, vsaldo, vbaja) {
      return $http.post(CONFIG.APIURL+'/recibeSocio',{id: vid, nombre: vnombre, dni: vdni, direccion: vdireccion, poblacion: vpoblacion, provincia: vprovincia, cp: vcp, fijo: vfijo, movil: vmovil, email: vemail, activo: vactivo, saldo: vsaldo, baja: vbaja},
        {'Content-Type': 'application/x-www-form-urlencoded'});
    },

    getListadoTipos: function() {        
      return $http.get(CONFIG.APIURL+'/listadoTipos.json',{'Content-Type': 'application/json'});               
    },

    postTipo: function(vid, vnombre, vpadre) {
      return $http.post(CONFIG.APIURL+'/recibeTipo',{id: vid, nombre: vnombre, padre: vpadre},
        {'Content-Type': 'application/x-www-form-urlencoded'});
    },

    getListadoUsuarios: function() {        
      return $http.get(CONFIG.APIURL+'/listadoUsuarios.json',{'Content-Type': 'application/json'});               
    },

    postUsuario: function(vid, vnombre, vdni, vusername, vpassword, vactivo, vbaja, vcambioclave) {
      return $http.post(CONFIG.APIURL+'/recibeUsuario',{id: vid, nombre: vnombre, dni: vdni, username: vusername, password: vpassword, activo: vactivo, baja: vbaja, cambioclave: vcambioclave},
        {'Content-Type': 'application/x-www-form-urlencoded'});
    },

    getListadoProductos: function() {        
      return $http.get(CONFIG.APIURL+'/listadoProductos.json',{'Content-Type': 'application/json'});               
    },

    postProducto: function(vid, vnombre, vtipo, vdescripcion, vstock, vprecio, viva, vactivo, vproveedor, vbaja) {
      return $http.post(CONFIG.APIURL+'/recibeProducto',{id: vid, nombre: vnombre, tipo: vtipo, descripcion: vdescripcion, stock: vstock, precio: vprecio, iva: viva, activo: vactivo, proveedor: vproveedor, baja: vbaja},
        {'Content-Type': 'application/x-www-form-urlencoded'});
    },

   //////////////////////FIN GESTION///////////////////////////////

   //////////////////////INFORMES//////////////////////////////////

    getBuscaListadoVentas: function(fechainicio,fechafin) {
      return $http.get(CONFIG.APIURL+'/buscarListadoVentas.json/'+fechainicio+'/'+fechafin,{'Content-Type': 'application/json'});
    }

   //////////////////FIN INFORMES////////////////////////////////// 
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


