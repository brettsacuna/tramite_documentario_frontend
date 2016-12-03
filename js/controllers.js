(function () {
    'use-strict';

    var api = require("./../config.json");

    angular
        .module('tramiteApp.controllers', [])
        .controller('panelCtrl', panelCtrl)
        .controller('asideCtrl', asideCtrl)
        .controller('inicioSesionCtrl', inicioSesionCtrl)
        .controller('pendientesCtrl', pendientesCtrl)
        .controller('usuariosCtrl', usuariosCtrl)
        .controller('nuevoDocumentoCtrlPrtl', nuevoDocumentoCtrlPrtl)
        .controller('editarDocumentoCtrlPrtl', editarDocumentoCtrlPrtl)
        .controller('visualizarAdjuntoCtrlPrtl', visualizarAdjuntoCtrlPrtl)
        .controller('ingresarDecretosCtrlPrtl', ingresarDecretosCtrlPrtl)
        .controller('disposicionFinalCtrlPrtl', disposicionFinalCtrlPrtl)
        .controller('verEstadoCtrlPrtl', verEstadoCtrlPrtl)
        .controller('cambiarAdjuntoCtrlPrtl', cambiarAdjuntoCtrlPrtl)
        .controller('nuevoUsuarioCtrlPrtl', nuevoUsuarioCtrlPrtl)
        .controller('messageCtrlPrtl', messageCtrlPrtl);

    function panelCtrl ($uibModal, documentoFct, $filter, messageFct) {
        var panel = this;

        panel.tipo_busqueda = "0";
        panel.limite = 10;
		panel.pagina_actual = 1;
		panel.total_documentos = 0;
        panel.url_backend = api.backend;

        panel.obtener_documentos = function (opcion) {
			documentoFct.getDocumentos(panel.pagina_actual, panel.limite, ($filter('date')(panel.desde, 'yyyy-MM-dd') || ""), ($filter('date')(panel.hasta, 'yyyy-MM-dd') || ""), (panel.numero_registro || ""), (panel.unidad_origen ? panel.unidad_origen.unidad_id : "0"), (panel.tipo_documento ? panel.tipo_documento.tipo_documento_id : "0"), "0", opcion, 1).then(function (response) {
                panel.documentos = response.data;
				panel.total_documentos = response.total;
			}).catch(function (reason) {
				messageFct.message('Ocurrió un problema --> '+reason);
			});
		};

        panel.obtener_unidades = function (filtro) {
            return documentoFct.getUnidades(filtro).then(function (response) {
				return response.map(function(item){
		          return item;
		        });
			}).catch(function (reason) {
				messageFct.message('Ocurrió un problema --> '+reason);
			});
        };

        panel.obtener_tipo_documento = function () {
            documentoFct.getTipoDocumento().then(function (response) {
                panel.tipos_documento = response;

                panel.obtener_documentos(panel.tipo_busqueda);
            }).catch(function (reason) {
                console.log(reason);
            });
        };

        panel.hoy = function () {
            panel.desde = new Date();
            panel.hasta = new Date();

            panel.obtener_tipo_documento();
        };

        panel.abrir_calendario = function (calendario) {
            if (calendario == 'desde') {
                panel.desde_seleccionado = true;
            } else {
                panel.hasta_seleccionado = true;
            }
        };

        panel.hoy();

        panel.nuevo_documento = function () {
            var modalNuevoDocumento = $uibModal.open({
				templateUrl: 'views/partials/nuevo_documento_tpl_prtl.html',
				controller: 'nuevoDocumentoCtrlPrtl as nuevo_documento',
				size: 'md'
			});

			modalNuevoDocumento.result.then(function (response) {
				if (response) {
				    panel.obtener_documentos(panel.tipo_busqueda);
				}
			}, function () {
				console.log('Modal dismissed at: ' + new Date());
			});
        };

        panel.editar_documento = function (documento) {
            var modalEditarDocumento = $uibModal.open({
				templateUrl: 'views/partials/editar_documento_tpl_prtl.html',
				controller: 'editarDocumentoCtrlPrtl as editar_documento',
				size: 'md',
                resolve : {
                    documento : function () {
                        return documento;
                    }
                }
			});

			modalEditarDocumento.result.then(function (response) {
				if (response) {
				    panel.obtener_documentos(panel.tipo_busqueda);
				}
			}, function () {
				console.log('Modal dismissed at: ' + new Date());
			});
        };

        panel.cambiar_adjunto = function (documento) {
            var modalCambiarAdjunto = $uibModal.open({
				templateUrl: 'views/partials/cambiar_adjunto_tpl_prtl.html',
				controller: 'cambiarAdjuntoCtrlPrtl as cambiar_adjunto',
				size: 'sm',
                resolve : {
                    documento : function () {
                        return documento;
                    }
                }
			});

			modalCambiarAdjunto.result.then(function (response) {
				if (response) {
				    panel.obtener_documentos(panel.tipo_busqueda);
				}
			}, function () {
				console.log('Modal dismissed at: ' + new Date());
			});
        };

        panel.ingresar_decretos = function (documento) {
            var modalIngresarDecretos = $uibModal.open({
				templateUrl: 'views/partials/ingresar_decretos_tpl_prtl.html',
				controller: 'ingresarDecretosCtrlPrtl as ingresar_decretos',
				size: 'md',
                resolve : {
                    documento : function () {
                        return documento;
                    }
                }
			});

			modalIngresarDecretos.result.then(function (response) {
                if (response) {
				    panel.obtener_documentos(panel.tipo_busqueda);
				}
			}, function () {
				console.log('Modal dismissed at: ' + new Date());
			});
        };

        panel.disposicion_final = function (documento) {
            var modalDisposicionFinal = $uibModal.open({
				templateUrl: 'views/partials/disposicion_final_tpl_prtl.html',
				controller: 'disposicionFinalCtrlPrtl as disposicion_final',
				size: 'md',
                resolve : {
                    documento : function () {
                        return documento;
                    }
                }
			});

			modalDisposicionFinal.result.then(function (response) {
                if (response) {
				    panel.obtener_documentos(panel.tipo_busqueda);
				}
			}, function () {
				console.log('Modal dismissed at: ' + new Date());
			});
        };

        panel.ver_estado = function (documento) {
            var modalVerEstado = $uibModal.open({
				templateUrl: 'views/partials/ver_estado_tpl_prtl.html',
				controller: 'verEstadoCtrlPrtl as ver_estado',
				size: 'sm',
                resolve : {
                    documento : function () {
                        return documento;
                    }
                }
			});

			modalVerEstado.result.then(function (response) {
				console.log(response);
			}, function () {
				console.log('Modal dismissed at: ' + new Date());
			});
        };
    }

    function asideCtrl ($timeout, usuarioFct, $window, $rootScope, $state) {
        var aside = this;

        aside.clock = "Cargando fecha y hora ...";
        aside.tickInterval = 1000;

        var tick = function() {
            aside.clock = Date.now();
            $timeout(tick, aside.tickInterval);
        };

        $timeout(tick, aside.tickInterval);

        aside.inicializar = function () {
			var empleado = JSON.parse($window.sessionStorage.empleado);
			$rootScope.empleado = empleado.usuario;
			$rootScope.tipo_empleado = empleado.tipo_usuario;
		};

        aside.inicializar();

        aside.cerrar_sesion = function () {
            usuarioFct.estaAutenticado = false;

            delete $window.sessionStorage.logged_in;
            delete $window.sessionStorage.empleado;

            $rootScope.bandLogOut = true;

            $state.go("acceso.inicio_sesion");
		};
    }

    function inicioSesionCtrl ($timeout, $window, usuarioFct, $state) {
        var inicio_sesion = this;

        inicio_sesion.iniciar_sesion = function (username, password) {
			inicio_sesion.message = null;
			if (username !== undefined && password !== undefined) {
                inicio_sesion.tipo_mensaje = 'primary';
                inicio_sesion.icon = 'eye-open';
                inicio_sesion.mensaje = 'Validando datos.';
                $timeout(function(){
                    usuarioFct.iniciar_sesion(username, password).then(function (response) {
                    	if (response.data.estado == 1) {
	                    	inicio_sesion.tipo_mensaje = 'success';
	                    	inicio_sesion.icon = 'ok';
	                		inicio_sesion.mensaje = 'Datos correctos redireccionando.';

	                		$timeout(function(){
                                $window.sessionStorage.logged_in = true;

                                $state.go("app.panel");
	                        }, 1000);
	                    } else if (response.data.estado == 2) {
	                    	inicio_sesion.tipo_mensaje = 'warning';
	                    	inicio_sesion.icon = 'warning-sign';
	                		inicio_sesion.mensaje = 'Datos incorrectos.';
	                    }  else if (response.data.estado === 0) {
	                    	inicio_sesion.tipo_mensaje = 'danger';
	                    	inicio_sesion.icon = 'remove';
	                		inicio_sesion.mensaje = 'No existe usuario.';
	                    }
                    })
					.catch(function (reason) {
						inicio_sesion.tipo_mensaje = 'default';
						inicio_sesion.icon = 'fire';
	                	inicio_sesion.mensaje = reason.status+' '+reason.statusText;
					});
                }, 1000);
            }
		};
    }

    function pendientesCtrl (documentoFct, messageFct, $uibModal) {
        var pendientes = this;

        pendientes.limite = 10;
		pendientes.pagina_actual = 1;
		pendientes.total_documentos = 0;

        pendientes.obtener_secciones = function () {
            documentoFct.getSecciones().then(function (response) {
                pendientes.secciones = response;
                pendientes.decreto = pendientes.secciones[0];
                pendientes.obtener_documentos(pendientes.secciones[0].seccion_id);
            }).catch(function (reason) {
                console.log(reason);
            });
        };

        pendientes.obtener_documentos = function (destino) {
			documentoFct.getDocumentos(pendientes.pagina_actual, pendientes.limite, "", "", "", "", "", destino, 4, 2).then(function (response) {
                pendientes.documentos = response.data;
				pendientes.total_documentos = response.total;
			}).catch(function (reason) {
				messageFct.message('Ocurrió un problema --> '+reason);
			});
		};

        pendientes.inicializar = function () {
            pendientes.obtener_secciones();
        };

        pendientes.inicializar();

        pendientes.ver_estado = function (documento) {
            var modalVerEstado = $uibModal.open({
				templateUrl: 'views/partials/ver_estado_tpl_prtl.html',
				controller: 'verEstadoCtrlPrtl as ver_estado',
				size: 'sm',
                resolve : {
                    documento : function () {
                        return documento;
                    }
                }
			});

			modalVerEstado.result.then(function (response) {
				console.log(response);
			}, function () {
				console.log('Modal dismissed at: ' + new Date());
			});
        };
    }

    function usuariosCtrl (usuarioFct, $uibModal, messageFct) {
        var usuarios = this;

        usuarios.usuarios = [];

        usuarios.nuevo_usuario = function () {
            var modalNuevoUsuario = $uibModal.open({
				templateUrl: 'views/partials/nuevo_usuario_tpl_prtl.html',
				controller: 'nuevoUsuarioCtrlPrtl as nuevo_usuario',
				size: 'sm'
			});

			modalNuevoUsuario.result.then(function (response) {
				if (response) {
				    usuarios.obtener_usuarios();
				}
			}, function () {
				console.log('Modal dismissed at: ' + new Date());
			});
        };

        usuarios.eliminar_usuario = function (usuario) {
            usuarioFct.deleteUsuario(usuario.usuario_id).then(function (response) {
                if (response.estado == 1) {
                    messageFct.message("Se eliminó correctamente el usuario");
                    usuarios.obtener_usuarios();
                } else {
                    messageFct.message("Ocurrió un error al intentar eliminar el usuario");
                }
            }).catch(function (reason) {
                console.log(reason);
            });
        };

        usuarios.obtener_usuarios = function () {
            usuarioFct.getUsuarios().then(function (response) {
                usuarios.usuarios = response;
            }).catch(function (reason) {
                console.log(reason);
            });
        };

        usuarios.obtener_usuarios();
    }

    function nuevoDocumentoCtrlPrtl ($uibModalInstance, documentoFct, messageFct, $filter, Upload, $window) {
        var nuevo_documento = this;

        nuevo_documento.fecha_documento = new Date();

        nuevo_documento.cerrar = function () {
            $uibModalInstance.dismiss();
        };

        nuevo_documento.abrir_calendario = function () {
            nuevo_documento.fecha_documento_seleccionado = true;
        };

        nuevo_documento.obtener_tipo_documento = function () {
            documentoFct.getTipoDocumento().then(function (response) {
                nuevo_documento.tipos_documento = response;
                nuevo_documento.obtener_secciones();
            }).catch(function (reason) {
                console.log(reason);
            });
        };

        nuevo_documento.obtener_secciones = function () {
            documentoFct.getSecciones().then(function (response) {
                nuevo_documento.secciones = response;
                nuevo_documento.obtener_clasificaciones();
            }).catch(function (reason) {
                console.log(reason);
            });
        };

        nuevo_documento.obtener_clasificaciones = function () {
            documentoFct.getClasificaciones().then(function (response) {
                nuevo_documento.clasificaciones = response;
                nuevo_documento.obtener_acciones();
            }).catch(function (reason) {
                console.log(reason);
            });
        };

        nuevo_documento.obtener_acciones = function () {
            documentoFct.getAcciones().then(function (response) {
                nuevo_documento.acciones = response;
            }).catch(function (reason) {
                console.log(reason);
            });
        };

        nuevo_documento.inicializar = function () {
            nuevo_documento.obtener_tipo_documento();
        };

        nuevo_documento.inicializar();

        nuevo_documento.obtener_unidades = function (filtro) {
            return documentoFct.getUnidades(filtro).then(function (response) {
				return response.map(function(item){
		          return item;
		        });
			}).catch(function (reason) {
				messageFct.message('Ocurrió un problema --> '+reason);
			});
        };

        nuevo_documento.guardar_documento = function(adjunto){
            if (adjunto) {
                nuevo_documento.cargar_adjunto(adjunto);
            } else {
                messageFct.message("Selecciona un adjunto para continuar");
            }
        };

        nuevo_documento.cargar_adjunto = function (file) {
            var empleado = JSON.parse($window.sessionStorage.empleado);

            if (angular.isObject(nuevo_documento.unidad_origen)) {
                var data = {
                    asunto : nuevo_documento.asunto,
                    documento_fecha : $filter('date')(nuevo_documento.fecha_documento, 'yyyy-MM-dd'),
                    tipo_documento_id : nuevo_documento.tipo_documento.tipo_documento_id,
                    documento_numero : nuevo_documento.numero_documento || '000',
                    unidad_id_origen : nuevo_documento.unidad_origen.unidad_id,
                    seccion_id_destino : nuevo_documento.destino.seccion_id,
                    clasificacion_id : nuevo_documento.clasificacion.clasificacion_id,
                    usuario_id : empleado.usuario_id
                };

                Upload.upload({
                    url : api.backend+'/documento',
                    data: {file : file, datos : data}
                }).then(function (resp) {
                    if(resp.data.estado === 1){
                        messageFct.message('Se registró correctamente el documento N° -> '+resp.data.documento.documento_id+' con el adjunto -> '+resp.data.documento.adjunto);

                        $uibModalInstance.close(true);
                    } else {
                        messageFct.message('Ocurrió un error al intentar cargar el archivo');
                    }
                }, function (resp) {
                    console.log('Estado de error : ' + resp.status);
                    nuevo_documento.progreso = undefined;
                }, function (evt) {
                    var progreso_carga = parseInt(100.0 * evt.loaded / evt.total);

                    nuevo_documento.progreso = 'Subiendo : ' + progreso_carga + '% ';
                    nuevo_documento.valor = progreso_carga;
                });
            } else {
                messageFct.message("Seleccione una unidad de origen para continuar");
            }
        };
    }

    function editarDocumentoCtrlPrtl ($uibModalInstance, documento, documentoFct, messageFct, $filter) {
        var editar_documento = this;

        editar_documento.documento = documento;
        editar_documento.unidad_origen = {unidad_id: editar_documento.documento.unidad_id_origen, unidad: editar_documento.documento.unidad};
        editar_documento.numero_documento = editar_documento.documento.documento_numero;
        editar_documento.asunto = editar_documento.documento.asunto;

        editar_documento.fecha_documento = new Date(editar_documento.documento.documento_fecha);

        editar_documento.cerrar = function () {
            $uibModalInstance.dismiss();
        };

        editar_documento.abrir_calendario = function () {
            editar_documento.fecha_documento_seleccionado = true;
        };

        editar_documento.obtener_tipo_documento = function () {
            documentoFct.getTipoDocumento().then(function (response) {
                editar_documento.tipos_documento = response;
                editar_documento.tipo_documento = _.find(editar_documento.tipos_documento, function (objTipoDocumento) {
    				return objTipoDocumento.tipo_documento_id == editar_documento.documento.tipo_documento_id;
    			});
                editar_documento.obtener_secciones();
            }).catch(function (reason) {
                console.log(reason);
            });
        };

        editar_documento.obtener_secciones = function () {
            documentoFct.getSecciones().then(function (response) {
                editar_documento.secciones = response;
                editar_documento.destino = _.find(editar_documento.secciones, function (objSeccion) {
    				return objSeccion.seccion_id == editar_documento.documento.seccion_id_destino;
    			});
                editar_documento.obtener_clasificaciones();
            }).catch(function (reason) {
                console.log(reason);
            });
        };

        editar_documento.obtener_clasificaciones = function () {
            documentoFct.getClasificaciones().then(function (response) {
                editar_documento.clasificaciones = response;
                editar_documento.clasificacion = _.find(editar_documento.clasificaciones, function (objClasificacion) {
    				return objClasificacion.clasificacion_id == editar_documento.documento.clasificacion_id;
    			});
            }).catch(function (reason) {
                console.log(reason);
            });
        };

        editar_documento.inicializar = function () {
            editar_documento.obtener_tipo_documento();
        };

        editar_documento.inicializar();

        editar_documento.obtener_unidades = function (filtro) {
            return documentoFct.getUnidades(filtro).then(function (response) {
				return response.map(function(item){
		          return item;
		        });
			}).catch(function (reason) {
				messageFct.message('Ocurrió un problema --> '+reason);
			});
        };

        editar_documento.guardar_documento = function () {
            if (angular.isObject(editar_documento.unidad_origen)) {
                var data = {
                    asunto : editar_documento.asunto,
                    documento_fecha : $filter('date')(editar_documento.fecha_documento, 'yyyy-MM-dd'),
                    tipo_documento_id : editar_documento.tipo_documento.tipo_documento_id,
                    documento_numero : editar_documento.numero_documento || '000',
                    unidad_id_origen : editar_documento.unidad_origen.unidad_id,
                    seccion_id_destino : editar_documento.destino.seccion_id,
                    clasificacion_id : editar_documento.clasificacion.clasificacion_id,
                    documento_id : editar_documento.documento.documento_id
                };

                documentoFct.updateDocumento(data).then(function (response) {
                    if (response.estado == 1) {
                        messageFct.message("Se modificó correctamente el documento N° -> "+response.documento);

                        $uibModalInstance.close(true);
                    } else {
                        messageFct.message("Ocurrió un error al intentar modificar el documento");
                    }
                }).catch(function (reason) {
                    console.log(reason);
                });
            } else {
                messageFct.message("Seleccione una unidad de origen para continuar");
            }
        };
    }

    function visualizarAdjuntoCtrlPrtl ($scope, $uibModalInstance) {
        var visualizar_adjunto = this;

        visualizar_adjunto.cerrar = function () {
            $uibModalInstance.dismiss();
        };
    }

    function ingresarDecretosCtrlPrtl ($uibModalInstance, documentoFct, documento, $filter, messageFct) {
        var ingresar_decretos = this;

        ingresar_decretos.documento = documento;
        ingresar_decretos.decreto = {};

        ingresar_decretos.cerrar = function () {
            $uibModalInstance.dismiss();
        };

        ingresar_decretos.obtener_secciones = function () {
            documentoFct.getSecciones().then(function (response) {
                ingresar_decretos.secciones_lista = response;
            }).catch(function (reason) {
                console.log(reason);
            });
        };

        ingresar_decretos.obtener_disposiciones = function () {
            documentoFct.getDisposiciones().then(function (response) {
                ingresar_decretos.disposiciones_lista = response;
            }).catch(function (reason) {
                console.log(reason);
            });
        };

        ingresar_decretos.obtener_acciones = function (bandera) {
            documentoFct.getAcciones().then(function (response) {
                ingresar_decretos.acciones_lista = response;

                if (bandera) {
                    ingresar_decretos.accion = _.find(ingresar_decretos.acciones_lista, function (objAccion) {
                        return objAccion.accion_id == bandera;
                    });
                }
            }).catch(function (reason) {
                console.log(reason);
            });
        };

        ingresar_decretos.obtener_decreto = function () {
            documentoFct.getDecretoDocumento(ingresar_decretos.documento.documento_id).then(function (response) {
                ingresar_decretos.obtener_secciones();
                ingresar_decretos.obtener_disposiciones();

                if (response.length === 0) {
                    ingresar_decretos.obtener_acciones();

                    ingresar_decretos.secciones = []; ingresar_decretos.disposiciones = [];
                    ingresar_decretos.accion_formulario = 0;
                } else {
                    ingresar_decretos.obtener_acciones(response.accion_id);

                    ingresar_decretos.secciones = response.secciones; ingresar_decretos.disposiciones = response.disposiciones;
                    ingresar_decretos.accion_formulario = 1; ingresar_decretos.decreto.decreto_id = response.decreto_id; ingresar_decretos.observacion = response.observacion;
                }
            }).catch(function (reason) {
                console.log(reason);
            });
        };

        ingresar_decretos.obtener_decreto();

        ingresar_decretos.agregar_seccion = function (seccion) {
            var flag = _.find(ingresar_decretos.secciones, function (objSeccion) {
				return objSeccion.seccion_id == seccion.seccion_id;
			});

            if (flag) {
                messageFct.message("Ya existe la misma sección por favor seleccione una distinta");
            } else {
                ingresar_decretos.secciones.push(seccion);
                ingresar_decretos.seccion = undefined;
            }
        };

        ingresar_decretos.agregar_disposicion = function (disposicion) {
            var flag = _.find(ingresar_decretos.disposiciones, function (objDisposicion) {
				return objDisposicion.disposicion_id == disposicion.disposicion_id;
			});

            if (flag) {
                messageFct.message("Ya existe la misma disposición registrada porfavor selecciona una diferente");
            } else {
                ingresar_decretos.disposiciones.push(disposicion);
                ingresar_decretos.disposicion = undefined;
            }
        };

        ingresar_decretos.eliminar_seccion = function (seccion) {
            ingresar_decretos.secciones = _.without(ingresar_decretos.secciones, _.findWhere(ingresar_decretos.secciones, {seccion_id: seccion.seccion_id}));
        };

        ingresar_decretos.eliminar_disposicion = function (disposicion) {
            ingresar_decretos.disposiciones = _.without(ingresar_decretos.disposiciones, _.findWhere(ingresar_decretos.disposiciones, {disposicion_id: disposicion.disposicion_id}));
        };

        ingresar_decretos.guardar_decreto = function () {
            var data = $.param({
	            documento_id : ingresar_decretos.documento.documento_id,
                accion_id : ingresar_decretos.accion.accion_id,
                observacion : ingresar_decretos.observacion || null,
                estado : 1,
                secciones : ingresar_decretos.secciones || [],
                disposiciones : ingresar_decretos.disposiciones || [],
                accion : ingresar_decretos.accion_formulario,
                decreto_id : ingresar_decretos.decreto.decreto_id || null
	        });

	        documentoFct.saveDecreto(data).then(function (response) {
                if (response.estado == 1) {
	        		messageFct.message('Se guardó correctamente el decreto');

	        		$uibModalInstance.close(true);
	        	} else {
	        		messageFct.message('Ocurrió un error al intentar guardar el decreto');
	        	}
	        }).catch(function (reason) {
	            console.log(reason);
	        });
        };
    }

    function disposicionFinalCtrlPrtl($uibModalInstance, documentoFct, documento, messageFct) {
        var disposicion_final = this;

        disposicion_final.documento = documento;

        disposicion_final.cerrar = function () {
            $uibModalInstance.dismiss();
        };

        disposicion_final.obtener_tipo_documento = function () {
            documentoFct.getTipoDocumento().then(function (response) {
                disposicion_final.tipos_documento = response;
            }).catch(function (reason) {
                console.log(reason);
            });
        };

        disposicion_final.obtener_tipo_documento();

        disposicion_final.guardar_disposicion_final = function () {
            var data = $.param({
                tipo_documento : disposicion_final.tipo_documento.tipo_documento_id,
                observacion : disposicion_final.observacion,
                documento_id : disposicion_final.documento.documento_id
            });

            documentoFct.saveDisposicionFinal(data).then(function (response) {
                if (response.estado == 1) {
                    messageFct.message("Se guardó correctamente la disposición final del documento N° -> "+response.documento);

                    $uibModalInstance.close(true);
                } else {
                    messageFct.message("Ocurrió un error al intentar modificar el documento");
                }
            }).catch(function (reason) {
                console.log(reason);
            });
        };
    }

    function verEstadoCtrlPrtl ($uibModalInstance, documento) {
        var ver_estado = this;

        ver_estado.documento = documento;

        ver_estado.cerrar = function () {
            $uibModalInstance.dismiss();
        };
    }

    function cambiarAdjuntoCtrlPrtl ($uibModalInstance, Upload, messageFct, documento) {
        var cambiar_adjunto = this;

        cambiar_adjunto.documento = documento;

        cambiar_adjunto.cerrar = function () {
            $uibModalInstance.dismiss();
        };

        cambiar_adjunto.guardar_adjunto = function(adjunto){
            if (adjunto) {
                cambiar_adjunto.cargar_adjunto(adjunto);
            } else {
                messageFct.message("Seleccione un archivo para continuar");
            }
        };

        cambiar_adjunto.cargar_adjunto = function (file) {
            Upload.upload({
                url : api.backend+'/adjunto',
                data: {file : file, documento : cambiar_adjunto.documento.documento_id}
            }).then(function (resp) {
                if(resp.data.estado === 1){
                    messageFct.message('Se cambió de adjunto al documento correctamente N° -> '+resp.data.documento);

                    $uibModalInstance.close(true);
                } else {
                    messageFct.message('Ocurrió un error al intentar cargar el archivo');
                }
            }, function (resp) {
                console.log('Estado de error : ' + resp.status);
            }, function (evt) {
                var progreso_carga = parseInt(100.0 * evt.loaded / evt.total);

                cambiar_adjunto.progreso = 'Subiendo : ' + progreso_carga + '% ';
                cambiar_adjunto.valor = progreso_carga;
            });
        };
    }

    function nuevoUsuarioCtrlPrtl ($uibModalInstance, usuarioFct, messageFct) {
        var nuevo_usuario = this;

        nuevo_usuario.cerrar = function () {
            $uibModalInstance.dismiss();
        };

        nuevo_usuario.guardar_usuario = function () {
            var data = $.param({
                usuario : nuevo_usuario.usuario,
                contrasena : nuevo_usuario.contrasena,
                estado : 1,
                tipo_usuario : 1
            });

            usuarioFct.saveUsuario(data).then(function (response) {
                if (response.estado == 1) {
                    messageFct.message("Se guardó correctamente el usuario");

                    $uibModalInstance.close(true);
                } else {
                    messageFct.message("Ocurrió un error al intentar guardar el usuario");
                }
            }).catch(function (reason) {
                console.log(reason);
            });
        };
    }

    function messageCtrlPrtl ($uibModalInstance, $sce, message, callback, button) {
		var alert = this;

		callback = callback || null;

		alert.button = button;
		alert.message = $sce.trustAsHtml(message);

		alert.close = function () {
			$uibModalInstance.dismiss();
		};

		alert.success = function () {
			$uibModalInstance.close();
		};

		if(callback){
			alert.callback = callback;
		}
	}
})();
