(function () {
    'use-strict';

    var api = require("./../config.json");

    angular
        .module('tramiteApp.services', [])
        .factory('documentoFct', documentoFct)
        .factory('usuarioFct', usuarioFct)
        .factory('messageFct', messageFct);

    function documentoFct ($http, $q) {
        return {
            getSecciones : function () {
				var defered = $q.defer();
		        var promise = defered.promise;

		        $http.get(api.backend+'/seccion')
		            .success(function(data) {
		                defered.resolve(data);
		            })
		            .error(function(err) {
		                defered.reject(err);
		            });

		        return promise;
			},
            getDisposiciones : function () {
				var defered = $q.defer();
		        var promise = defered.promise;

		        $http.get(api.backend+'/disposicion')
		            .success(function(data) {
		                defered.resolve(data);
		            })
		            .error(function(err) {
		                defered.reject(err);
		            });

		        return promise;
			},
            getTipoDocumento : function () {
				var defered = $q.defer();
		        var promise = defered.promise;

		        $http.get(api.backend+'/tipo_documento')
		            .success(function(data) {
		                defered.resolve(data);
		            })
		            .error(function(err) {
		                defered.reject(err);
		            });

		        return promise;
			},
            getUnidades : function (filtro) {
				var defered = $q.defer();
		        var promise = defered.promise;

		        $http.get(api.backend+'/unidad_origen?filtro='+filtro)
		            .success(function(data) {
		                defered.resolve(data);
		            })
		            .error(function(err) {
		                defered.reject(err);
		            });

		        return promise;
			},
            getClasificaciones : function () {
				var defered = $q.defer();
		        var promise = defered.promise;

		        $http.get(api.backend+'/clasificacion')
		            .success(function(data) {
		                defered.resolve(data);
		            })
		            .error(function(err) {
		                defered.reject(err);
		            });

		        return promise;
			},
            getAcciones : function () {
				var defered = $q.defer();
		        var promise = defered.promise;

		        $http.get(api.backend+'/accion')
		            .success(function(data) {
		                defered.resolve(data);
		            })
		            .error(function(err) {
		                defered.reject(err);
		            });

		        return promise;
			},
            saveDocumento : function (documento) {
                var defered = $q.defer();
		        var promise = defered.promise;

		        $http.post(api.backend+'/documento', documento)
		            .success(function(data) {
		                defered.resolve(data);
		            })
		            .error(function(err) {
		                defered.reject(err);
		            });

		        return promise;
            },
            getDocumentos : function (pagina, limite, desde, hasta, numero_registro, unidad_origen, tipo_documento, destino, bandera, estado) {
				var defered = $q.defer();
		        var promise = defered.promise;

		        $http.get(api.backend+'/documento?pagina='+pagina+"&limite="+limite+"&bandera="+bandera+"&desde="+desde+"&hasta="+hasta+"&numero_registro="+numero_registro+"&unidad_origen="+unidad_origen+"&tipo_documento="+tipo_documento+"&estado="+estado+"&destino="+destino)
		            .success(function(data) {
		                defered.resolve(data);
		            })
		            .error(function(err) {
		                defered.reject(err);
		            });

		        return promise;
			},
            changeAdjunto : function (adjunto) {
                var defered = $q.defer();
		        var promise = defered.promise;

		        $http.post(api.backend+'/ServletDocumento', adjunto)
		            .success(function(data) {
		                defered.resolve(data);
		            })
		            .error(function(err) {
		                defered.reject(err);
		            });

		        return promise;
            },
            saveDecreto : function (decreto) {
                var defered = $q.defer();
		        var promise = defered.promise;

		        $http.post(api.backend+'/decreto', decreto)
		            .success(function(data) {
		                defered.resolve(data);
		            })
		            .error(function(err) {
		                defered.reject(err);
		            });

		        return promise;
            },
            getDecretoDocumento : function (documento) {
                var defered = $q.defer();
		        var promise = defered.promise;

		        $http.get(api.backend+'/decreto?documento='+documento)
		            .success(function(data) {
		                defered.resolve(data);
		            })
		            .error(function(err) {
		                defered.reject(err);
		            });

		        return promise;
            },
            updateDocumento : function (documento) {
                var defered = $q.defer();
		        var promise = defered.promise;

		        $http.put(api.backend+'/documento', documento)
		            .success(function(data) {
		                defered.resolve(data);
		            })
		            .error(function(err) {
		                defered.reject(err);
		            });

		        return promise;
            },
            saveDisposicionFinal : function (disposicion) {
                var defered = $q.defer();
		        var promise = defered.promise;

		        $http.post(api.backend+'/disposicion', disposicion)
		            .success(function(data) {
		                defered.resolve(data);
		            })
		            .error(function(err) {
		                defered.reject(err);
		            });

		        return promise;
            }
        };
    }

    function usuarioFct($window, $http, $q) {
        return {
			estaAutenticado: false,
			iniciar_sesion : function (username, password) {
				var data = $.param({
		            usuario: username,
		            contrasena: password
		        });

				return $http.post(api.backend+'/usuario', data).success(function (response) {
					if (response.estado !== 0) {
						$window.sessionStorage.empleado = JSON.stringify(response.usuario[0]);

						return response.estado;
					} else {
						return 0;
					}
				}).error(function (error) {
					return error;
				});
			},
            getUsuarios : function () {
                var defered = $q.defer();
		        var promise = defered.promise;

		        $http.get(api.backend+'/usuario')
		            .success(function(data) {
		                defered.resolve(data);
		            })
		            .error(function(err) {
		                defered.reject(err);
		            });

		        return promise;
            },
            saveUsuario : function (usuario) {
                var defered = $q.defer();
		        var promise = defered.promise;

		        $http.post(api.backend+'/usuario/nuevo', usuario)
		            .success(function(data) {
		                defered.resolve(data);
		            })
		            .error(function(err) {
		                defered.reject(err);
		            });

		        return promise;
            },
            deleteUsuario : function (usuario) {
                var defered = $q.defer();
		        var promise = defered.promise;

		        $http.delete(api.backend+'/usuario?usuario='+usuario)
		            .success(function(data) {
		                defered.resolve(data);
		            })
		            .error(function(err) {
		                defered.reject(err);
		            });

		        return promise;
            }
		};
    }

    function messageFct ($uibModal, $log) {
		return {
		    message : function (message, callback, button) {
				var modalMessage = $uibModal.open({
					animation: true,
					templateUrl: 'views/partials/message_tpl_prtl.html',
					controller: 'messageCtrlPrtl as alert',
					size: 'md',
					keyboard: false,
					resolve: {
					  message: function () {
					    return message;
					  },
					  callback : function(){
					    return callback;
					  },
					  button: function(){
					    return button;
					  }
					}
				});

				modalMessage.result.then(function (band) {
					return band;
				}, function () {
					console.log('Modal dismissed at: ' + new Date());
				});
		    }
		};
	}
})();
