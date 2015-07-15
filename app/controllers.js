//Comprobar si algo de esto se puede usar para el login y el logout

angular  
    .module("Frontend.controllers")
    .controller("LoginController", LoginController);
    .controller("LogoutController", LogoutController);

function LoginController($auth, $location) {  
    var vm = this;
    this.login = function(){
        $auth.login({
            email: vm.email,
            password: vm.password
        })
        .then(function(){
            // Si se ha logueado correctamente, lo tratamos aquí.
            // Podemos también redirigirle a una ruta
            $location.path("/private")
        })
        .catch(function(response){
            // Si ha habido errores llegamos a esta parte
        });
    }
}

function LogoutController($auth, $location) {  
    $auth.logout()
        .then(function() {
            // Desconectamos al usuario y lo redirijimos
            $location.path("/")
        });
}

