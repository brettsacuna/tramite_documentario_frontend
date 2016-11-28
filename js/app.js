(function () {
    'use-strict';

    angular
        .module('tramiteApp', ['tramiteApp.controllers', 'tramiteApp.services', 'tramiteApp.directives', 'ui.bootstrap', 'angular-confirm', 'ui.router', 'oc.lazyLoad', 'ngFileUpload', 'pdf'])
        .run(appRun)
        .config(appConfig);

    function appRun($rootScope, $state, $stateParams, $window, usuarioFct) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
            if (toState.authenticate && !usuarioFct.estaAutenticado && !$window.sessionStorage.logged_in){
                $state.go("acceso.inicio_sesion");
                event.preventDefault();
            } else if (toState.name == "acceso.inicio_sesion" && $window.sessionStorage.logged_in) {
                $state.go("app.panel");
                event.preventDefault();
            }
        });
    }

    function appConfig ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $httpProvider) {
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

        $ocLazyLoadProvider.config({
			debug:false,
			events:true,
		});

        $urlRouterProvider
			.otherwise('/acceso/inicio_sesion');

        $stateProvider
			.state('app', {
				abstract: true,
				url: '/app',
				views: {
					'': {
						templateUrl: './views/layout.html'
					},
                    'aside@': {
						templateUrl: './views/aside.html',
                        controller: 'asideCtrl as aside'
					},
					'content@': {
						templateUrl: './views/content.html'
					}
				}
			})
				.state('app.panel', {
					parent: 'app',
					url: '/panel',
					templateUrl: 'views/pages/panel_tpl.html',
                    authenticate: true,
					data : { title: 'Panel Principal', sub_title: 'Documentos registrados' },
					controller: 'panelCtrl as panel'
				})
                .state('app.pendientes', {
					parent: 'app',
					url: '/pendientes',
					templateUrl: 'views/pages/pendientes_tpl.html',
                    authenticate: true,
					data : { title: 'Listado de documentos pendientes', sub_title: 'Documentos pendientes' },
					controller: 'pendientesCtrl as pendientes'
				})
                .state('app.usuarios', {
					parent: 'app',
					url: '/usuarios',
					templateUrl: 'views/pages/usuarios_tpl.html',
                    authenticate: true,
					data : { title: 'Gestión de usuarios', sub_title: 'Listado de usuarios' },
					controller: 'usuariosCtrl as usuarios'
				})
            .state('acceso', {
    				url: '/acceso',
    				template: '<div class="container" ui-view></div>'
    			})
    				.state('acceso.inicio_sesion', {
    					url: '/inicio_sesion',
    					templateUrl: 'views/pages/inicio_sesion_tpl.html',
    					data : { title: 'Iniciar sesión' },
    					authenticate: false,
    					controller: 'inicioSesionCtrl as inicio_sesion',
    				});
    }
})();
