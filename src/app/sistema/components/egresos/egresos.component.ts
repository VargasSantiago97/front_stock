import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';
import { PadronService } from '../../services/padron.service';
import { FormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { Autorizado, Cliente, Establecimiento, Transporte } from '../../interfaces/clientes';
import { ConsultasService } from '../../services/consultas.service';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Deposito, UnidadMedida } from '../../interfaces/variables';
import { ArticuloAsociado, Remito, RemitoDevolucion } from '../../interfaces/remitos';
import { TagModule } from 'primeng/tag';
import { Articulo, Rubro, SubRubro } from '../../interfaces/productos';
import { PdfService } from '../../services/pdf.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { ActivatedRoute } from '@angular/router';
import { ListboxModule } from 'primeng/listbox';
import { XlsxService } from '../../services/xlsx.service';
import { AuthService } from '../../../login/services/auth.service';

declare var vars: any;

@Component({
    selector: 'app-egresos',
    standalone: true,
    imports: [ListboxModule, TableModule, ButtonModule, DialogModule, CommonModule, DropdownModule, DividerModule, FormsModule, ProgressSpinnerModule, InputTextModule, InputGroupModule, InputGroupAddonModule, InputTextareaModule, TagModule, MultiSelectModule],
    templateUrl: './egresos.component.html',
    styleUrl: './egresos.component.css'
})
export class EgresosComponent {

    modelosRemitos = vars.modelosRemitos;
    puntosVenta = vars.puntosVenta;
    depositoSeleccionado = vars.depositoSeleccionado;

    pestActiva: string = ''

    visible_remito: boolean = false
    visible_cliente: boolean = false
    visible_autorizado: boolean = false
    visible_transporte: boolean = false
    visible_establecimiento: boolean = false
    visible_articulo: boolean = true
    visible_totales: boolean = false
    datosTotales: any = []

    visible_devolucion: boolean = false
    visible_filtros: boolean = false


    avisarRegistrosVacios: boolean = true

    searchValue_cliente: string = ''
    searchValue_autorizado: string = ''
    searchValue_transporte: string = ''
    searchValue_establecimiento: string = ''
    searchValue_articulo: string = ''

    remito: Remito = {
        id: '',
        numero: 0,
        punto: 2,
        datos: { documentos: [] },
        fecha: '',
        modelo: '',
        id_cliente: '',
        codigo: '',
        razon_social: '',
        cuit: 0,
        alias: '',
        direccion: '',
        localidad: '',
        provincia: '',
        codigo_postal: '',
        telefono: '',
        correo: '',
        id_autorizado: '',
        autorizado_descripcion: '',
        autorizado_documento: '',
        autorizado_contacto: '',
        id_transporte: '',
        transporte_transporte: '',
        transporte_cuit_transporte: 0,
        transporte_chofer: '',
        transporte_cuit_chofer: 0,
        transporte_patente_chasis: '',
        transporte_patente_acoplado: '',
        id_establecimiento: '',
        establecimiento_descripcion: '',
        establecimiento_localidad: '',
        establecimiento_provincia: '',
        observaciones: '',
        observaciones_sistema: '',
        total_unidades: '',
        estado: 1,
        createdBy: '',
        updatedBy: '',
        createdAt: '',
        updatedAt: ''
    }
    remitos: Remito[] = []
    devolucion: RemitoDevolucion = {
        id: '',
        fecha: '',
        numero: 0,
        punto: 0,
        modelo: '',
        id_cliente: '',
        codigo: '',
        razon_social: '',
        cuit: 0,
        alias: '',
        direccion: '',
        localidad: '',
        provincia: '',
        codigo_postal: '',
        telefono: '',
        correo: '',
        id_autorizado: '',
        autorizado_descripcion: '',
        autorizado_documento: '',
        autorizado_contacto: '',
        id_transporte: '',
        transporte_transporte: '',
        transporte_cuit_transporte: 0,
        transporte_chofer: '',
        transporte_cuit_chofer: 0,
        transporte_patente_chasis: '',
        transporte_patente_acoplado: '',
        id_establecimiento: '',
        establecimiento_descripcion: '',
        establecimiento_localidad: '',
        establecimiento_provincia: '',
        observaciones: '',
        observaciones_sistema: '',
        total_unidades: '',
        datos: {
            documentos: []
        },
        estado: 1,
        createdBy: '',
        updatedBy: '',
        createdAt: '',
        updatedAt: '',
        id_asociado: ''
    }
    devoluciones: RemitoDevolucion[] = []

    dataTabla: any = []
    dataTablaArticulos: any = []

    clientes: Cliente[] = []
    clientesFiltrados: Cliente[] = []
    clientesTodos: Cliente[] = []
    selectedClientes: string[] = []
    selectedClientesArticulos: Cliente[] = []

    id_cliente: string = ''

    autorizado: Autorizado = {
        id: '',
        id_cliente: '',
        descripcion: '',
        documento: '',
        cargo: '',
        contacto: '',
        datos: {},
        estado: 0,
        createdBy: '',
        updatedBy: '',
        createdAt: '',
        updatedAt: ''
    }
    autorizados: Autorizado[] = []
    autorizadosFiltrados: Autorizado[] = []

    transporte: Transporte = {
        id: '',
        id_cliente: '',
        transporte: '',
        cuit_transporte: 0,
        chofer: '',
        cuit_chofer: 0,
        patente_chasis: '',
        patente_acoplado: '',
        datos: {},
        estado: 0,
        createdBy: '',
        updatedBy: '',
        createdAt: '',
        updatedAt: ''
    }
    transportes: Transporte[] = []
    transportesFiltrados: Transporte[] = []

    establecimiento: Establecimiento = {
        id: '',
        id_cliente: '',
        descripcion: '',
        localidad: '',
        provincia: '',
        datos: {},
        estado: 0,
        createdBy: '',
        updatedBy: '',
        createdAt: '',
        updatedAt: ''
    }
    establecimientos: Establecimiento[] = []
    establecimientosFiltrados: Establecimiento[] = []

    depositos: Deposito[] = []
    unidadMedidas: UnidadMedida[] = []

    articulos: Articulo[] = []
    articulosFiltrados: Articulo[] = []
    articulosRemito: ArticuloAsociado[] = []
    articuloProvisorio: ArticuloAsociado | undefined

    articulosDevolucion: any[] = []

    rubros: Rubro[] = []
    subRubros: SubRubro[] = []

    documentosAsociados: Remito[] | RemitoDevolucion[] = []

    fechaFiltroDesde: string = this.fechaHoy(31)
    fechaFiltroHasta: string = this.fechaHoy()

    fechasFiltradas: string = ''
    clienteFiltrados: string = ''

    ordenarTablaOrden: boolean = false
    ordenarTablaPorAnterior: string = ''
    ordenarTablaPor: string = ''

    ordenarTablaOrden_art: boolean = false
    ordenarTablaPorAnterior_art: string = ''
    ordenarTablaPor_art: string = ''

    constructor(
        private padron: PadronService,
        private ms: MessageService,
        private cs: ConsultasService,
        private as: AuthService,
        private pdf: PdfService,
        private route: ActivatedRoute,
        private xlsx: XlsxService
    ) { }

    ngOnInit() {
        if (localStorage.getItem('stock_remitosFechaFiltroDesde')) {
            this.fechaFiltroDesde = localStorage.getItem('stock_remitosFechaFiltroDesde')!
        }
        if (localStorage.getItem('stock_remitosFechaFiltroHasta')) {
            this.fechaFiltroHasta = localStorage.getItem('stock_remitosFechaFiltroHasta')!
        }

        this.cs.getAll('depositos', (data: Deposito[]) => { this.depositos = data })
        this.cs.getAll('unidadMedidas', (data: UnidadMedida[]) => { this.unidadMedidas = data })
        this.cs.getAll('rubros', (data: Rubro[]) => { this.rubros = data })
        this.cs.getAll('subRubros', (data: SubRubro[]) => { this.subRubros = data })

        this.cs.getAll('clientes', (data: Cliente[]) => {
            this.clientesTodos = data
            this.clientesFiltrados = data

            const esNuevo = this.route.snapshot.url.some(segment => segment.path === 'nuevo');

            this.route.paramMap.subscribe(params => {
                var id_cliente = params.get('id_cliente');
                if (id_cliente && esNuevo) {
                    this.mostrarModalRemito()
                    this.buscarClientePorId(id_cliente)
                } else if (id_cliente) {
                    this.selectedClientes = [id_cliente]
                }
                this.filtrar()
            });
        })
    }

    verRemito(id: string) {
        this.pdf.remito(id, 3).subscribe((blob: any) => {
            const url = window.URL.createObjectURL(blob);
            const windowFeatures = 'width=800,height=600,menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes';
            window.open(url, '_blank', windowFeatures);
        }, error => {
            console.error('Error al obtener el PDF', error);
        });
    }
    descargarRemito(id: string) {
        this.pdf.remito(id, 1).subscribe((blob: any) => {

            this.cs.getAll('remitos/' + id, (remito: Remito) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `REMITO ${this.mostrarDocumento(remito.punto, remito.numero)} - ${remito.razon_social}.pdf`;
                a.click();
                window.URL.revokeObjectURL(url);
            })

        }, error => {
            console.error('Error al obtener el PDF', error);
        });
    }

    verDevolucion(id: string) {
        this.pdf.devolucionRemito(id, 3).subscribe((blob: any) => {
            const url = window.URL.createObjectURL(blob);
            const windowFeatures = 'width=800,height=600,menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes';
            window.open(url, '_blank', windowFeatures);
        }, error => {
            console.error('Error al obtener el PDF', error);
        });
    }
    descargarDevolucion(id: string) {
        this.pdf.devolucionRemito(id, 1).subscribe((blob: any) => {

            this.cs.getAll('egresosDevoluciones/' + id, (devolucion: RemitoDevolucion) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `REMITO DEVOLUCION ${this.mostrarDocumento(devolucion.punto, devolucion.numero)} - ${devolucion.razon_social}.pdf`;
                a.click();
                window.URL.revokeObjectURL(url);
            })

        }, error => {
            console.error('Error al obtener el PDF', error);
        });
    }

    pestana(pes: string, e: any) {
        e.preventDefault()
        this.pestActiva = pes
    }

    actualizarDatosTabla() {
        this.dataTabla = []

        this.cs.getAllPost(`operaciones/egresos/?fechaDesde=${this.fechaFiltroDesde}&fechaHasta=${this.fechaFiltroHasta}`, { clientes: this.selectedClientes }, (e: any) => {
            this.dataTabla = e
        })

    }


    mostrarModalRemito(id: any = undefined) {
        this.pestActiva = 'cliente'
        if (id) {
            this.articulosRemito = []

            this.cs.getAll('egresos/' + id, (dato: Remito) => {
                this.remito = dato
            })

            this.cs.getAll('articulosAsociados/buscar/' + id, (datos: ArticuloAsociado[]) => {
                this.articulosRemito = datos
            })

            this.cs.getAll(`egresosDevoluciones/buscar/asociado/${id}`, (datos: RemitoDevolucion[]) => {
                this.documentosAsociados = datos
            })
        } else {
            this.remito = {
                id: '',
                numero: 0,
                punto: this.puntosVenta[0].punto,
                datos: { documentos: [] },
                fecha: this.fechaHoy(),
                modelo: this.modelosRemitos[0].alias,
                id_cliente: '',
                codigo: '',
                razon_social: '',
                cuit: 0,
                alias: '',
                direccion: '',
                localidad: '',
                provincia: '',
                codigo_postal: '',
                telefono: '',
                correo: '',
                id_autorizado: '',
                autorizado_descripcion: '',
                autorizado_documento: '',
                autorizado_contacto: '',
                id_transporte: '',
                transporte_transporte: '',
                transporte_cuit_transporte: 0,
                transporte_chofer: '',
                transporte_cuit_chofer: 0,
                transporte_patente_chasis: '',
                transporte_patente_acoplado: '',
                id_establecimiento: '',
                establecimiento_descripcion: '',
                establecimiento_localidad: '',
                establecimiento_provincia: '',
                observaciones: '',
                observaciones_sistema: '',
                total_unidades: '',
                estado: 1,
                createdBy: '',
                updatedBy: '',
                createdAt: '',
                updatedAt: ''
            }

            this.articulosRemito = []
        }
        this.visible_remito = true
        this.id_cliente = ''
    }
    guardarRemito(tipo: 'D' | 'M' | null = null) {
        var cantidadRegistros = this.articulosRemito.length
        var cantidadRegistrosId = this.articulosRemito.filter((e: ArticuloAsociado) => e.id_articulo).length
        if (!this.remito.id_cliente) {
            return this.ms.add({ severity: 'error', summary: 'Atencion!', detail: 'No asignó un cliente' })
        }
        if (!cantidadRegistros) {
            return this.ms.add({ severity: 'error', summary: 'Atencion!', detail: 'Agregar al menos un articulo' })
        }
        if (!cantidadRegistrosId) {
            return this.ms.add({ severity: 'error', summary: 'Atencion!', detail: 'Agregar al menos un articulo' })
        }
        if ((cantidadRegistros > cantidadRegistrosId) && this.avisarRegistrosVacios) {
            this.avisarRegistrosVacios = false
            setTimeout(() => {
                this.avisarRegistrosVacios = true
            }, 5000);

            return this.ms.add({ severity: 'warn', summary: 'Atencion!', detail: 'Existes articulos que están vacíos. Presione nuevamente para confirmar' })
        }

        this.cs.getAll('egresos/buscar/siguiente/' + this.remito.punto, (ultNum: number) => {
            this.remito.numero = ultNum

            this.cs.create('egresos', this.remito, (id_ingreso_creado: any) => {
                this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Remito creado con ID: ' + id_ingreso_creado })
                this.remito.id = id_ingreso_creado

                var artRemitos = this.articulosRemito.map((artRemitos: ArticuloAsociado) => {
                    const { id, ...resto } = artRemitos;

                    return {
                        ...resto,
                        id_documento: id_ingreso_creado
                    }
                })

                this.cs.createMultiple('articulosAsociados', artRemitos, (mensaje: any) => {
                    this.ms.add({ severity: 'success', summary: 'Exito!', detail: mensaje.length + ' registros de articulos creados' })
                    this.actualizarDatosTabla()

                    if (tipo == 'D') {
                        this.descargarRemito(id_ingreso_creado)
                        this.visible_remito = false
                    }
                    if (tipo == 'M') {
                        this.verRemito(id_ingreso_creado)
                        this.visible_remito = false
                    }
                })

            })

        }, (err: any) => {
            this.ms.add({ severity: 'error', summary: 'Error obteniendo numero de remito', detail: err.message })
        })
    }


    mostrarModalDevolucion({ id_remito = '', id_devolucion = '' } = {}) {
        this.pestActiva = 'cliente'
        if (id_remito) {
            this.cs.getAll('egresos/' + id_remito, (dato: Remito) => {
                this.devolucion = {
                    ...dato,
                    id: '',
                    id_asociado: id_remito,
                    fecha: this.fechaHoy(),
                    numero: 0,
                    total_unidades: '',
                    observaciones_sistema: '',
                    observaciones: '',
                    datos: { documentos: [] }
                }

                this.id_cliente = dato.id_cliente

                this.cs.getAll('articulosAsociados/devolucion/' + id_remito, (datos: any) => {
                    this.articulosDevolucion = datos
                })
            })
        } else if (id_devolucion) {
            //BUSCAMOS Y MOSTRAMOS LA DEVOLUCION
            this.articulosDevolucion = []

            this.cs.getAll('egresosDevoluciones/' + id_devolucion, (dato: RemitoDevolucion) => {
                this.devolucion = dato
            })

            this.cs.getAll('articulosAsociados/buscar/' + id_devolucion, (datos: ArticuloAsociado[]) => {
                this.articulosDevolucion = datos
            })
        } else {
            //creamos nueva devolucion, para esto habria que seleccionar el cliente y el remito a devolver
        }
        this.visible_devolucion = true

    }
    guardarDevolucion(tipo: 'D' | 'M' | null = null) {
        var cantidadRegistros = this.articulosDevolucion.filter((artDev) => artDev.cantidadDevolver).length

        if (!cantidadRegistros) {
            return this.ms.add({ severity: 'error', summary: 'Atencion!', detail: 'Agregar cantidad a al menos un articulo' })
        }

        this.cs.getAll('egresosDevoluciones/buscar/siguiente/' + this.devolucion.punto, (ultNum: number) => {
            this.devolucion.numero = ultNum

            this.cs.create('egresosDevoluciones', this.devolucion, (id_devolucion_creado: any) => {
                this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Devolucion creada con ID: ' + id_devolucion_creado })
                this.devolucion.id = id_devolucion_creado

                var artDevs = this.articulosDevolucion.filter((artDev) => artDev.cantidadDevolver).map((artDev: any) => {
                    const { id, ...resto } = artDev;

                    return {
                        ...resto,
                        cantidad: artDev.cantidadDevolver,
                        cantidadUnidadFundamental: artDev.cantidadDevolverUnidadFundamental,
                        id_documento: id_devolucion_creado,
                        id_original: id,
                        ajuste: 'positivo',
                        documento: 'remito_devolucion'
                    }
                },)

                this.cs.createMultiple('articulosAsociados', artDevs, (mensaje: any) => {
                    this.ms.add({ severity: 'success', summary: 'Exito!', detail: mensaje.length + ' registros de articulos creados' })
                    this.actualizarDatosTabla()

                    if (tipo == 'D') {
                        this.descargarDevolucion(id_devolucion_creado)
                        this.visible_devolucion = false
                    }
                    if (tipo == 'M') {
                        this.verDevolucion(id_devolucion_creado)
                        this.visible_devolucion = false
                    }
                })

            })

        }, (err: any) => {
            this.ms.add({ severity: 'error', summary: 'Error obteniendo numero de devolucion', detail: err.message })
        })
    }

    mostrarModalArticulos(){
        this.visible_articulo = true
    }
    buscarArticulosParaRemitar(){
        const selectedClientes = this.selectedClientesArticulos.map((sc: Cliente) => {
            return sc.id
        })

        this.cs.getAllPost(`operaciones/articulosRemito`, { id_clientes: selectedClientes }, (e: any) => {
            console.table(e)
            this.dataTablaArticulos = e
        })
    }

    mostrarModalFiltro() {
        this.visible_filtros = true
    }

    buscarClientePorId(id: string) {
        this.cs.getAll('clientes/' + id, (data: Cliente) => {
            this.asignarCliente(data)
        })
    }
    buscarClientePorCodigo() {
        if (!this.remito.codigo) {
            return this.ms.add({ severity: 'warn', summary: 'Atencion!', detail: 'Ingrese un CODIGO' })
        }

        this.cs.getAll('clientes/codigo/' + this.remito.codigo, (data: Cliente) => {
            this.asignarCliente(data)
        }, (err: any) => {
            this.cs.getAll('clientes/buscar/' + this.remito.codigo, (data: Cliente[]) => {
                if (data.length == 1) {
                    this.asignarCliente(data[0])
                }
                else if (data.length > 1) {
                    this.clientes = data
                    this.searchValue_cliente = ''
                    this.filtroCliente()
                    this.visible_cliente = true
                } else {
                    this.ms.add({ severity: 'error', summary: 'Error!', detail: 'No se encontró ningún cliente con ese código' })
                }
            })
        })
    }
    asignarCliente(cliente: Cliente, continua: boolean = true) {
        this.id_cliente = cliente.id

        this.remito.id_cliente = cliente.id
        this.remito.cuit = cliente.cuit
        this.remito.codigo = cliente.codigo
        this.remito.razon_social = cliente.razon_social
        this.remito.alias = cliente.alias
        this.remito.direccion = cliente.direccion
        this.remito.localidad = cliente.localidad
        this.remito.provincia = cliente.provincia
        this.remito.codigo_postal = cliente.codigo_postal
        this.remito.telefono = cliente.telefono
        this.remito.correo = cliente.correo

        this.visible_cliente = false

        this.selectedClientesArticulos = [ cliente ]
        this.buscarArticulosParaRemitar()

        if (continua) {
            this.buscarAutorizados()
        }
    }
    asignarAutorizado(autorizado: Autorizado | undefined, continua: boolean = true) {

        if (autorizado) {
            this.remito.id_autorizado = autorizado?.id
            this.remito.autorizado_descripcion = autorizado?.descripcion
            this.remito.autorizado_documento = autorizado?.documento
            this.remito.autorizado_contacto = autorizado?.contacto

            this.devolucion.id_autorizado = autorizado?.id
            this.devolucion.autorizado_descripcion = autorizado?.descripcion
            this.devolucion.autorizado_documento = autorizado?.documento
            this.devolucion.autorizado_contacto = autorizado?.contacto
        } else {
            this.remito.id_autorizado = ''
            this.remito.autorizado_descripcion = ''
            this.remito.autorizado_documento = ''
            this.remito.autorizado_contacto = ''

            this.devolucion.id_autorizado = ''
            this.devolucion.autorizado_descripcion = ''
            this.devolucion.autorizado_documento = ''
            this.devolucion.autorizado_contacto = ''
        }

        this.visible_autorizado = false

        if (continua) {
            this.buscarTransportes()
        }
    }
    asignarTransporte(transporte: Transporte | undefined, continua: boolean = true) {
        if (transporte) {
            this.remito.id_transporte = transporte?.id
            this.remito.transporte_transporte = transporte?.transporte
            this.remito.transporte_cuit_transporte = transporte?.cuit_transporte
            this.remito.transporte_chofer = transporte?.chofer
            this.remito.transporte_cuit_chofer = transporte?.cuit_chofer
            this.remito.transporte_patente_chasis = transporte?.patente_chasis
            this.remito.transporte_patente_acoplado = transporte?.patente_acoplado

            this.devolucion.id_transporte = transporte?.id
            this.devolucion.transporte_transporte = transporte?.transporte
            this.devolucion.transporte_cuit_transporte = transporte?.cuit_transporte
            this.devolucion.transporte_chofer = transporte?.chofer
            this.devolucion.transporte_cuit_chofer = transporte?.cuit_chofer
            this.devolucion.transporte_patente_chasis = transporte?.patente_chasis
            this.devolucion.transporte_patente_acoplado = transporte?.patente_acoplado
        } else {
            this.remito.id_transporte = ''
            this.remito.transporte_transporte = ''
            this.remito.transporte_cuit_transporte = 0
            this.remito.transporte_chofer = ''
            this.remito.transporte_cuit_chofer = 0
            this.remito.transporte_patente_chasis = ''
            this.remito.transporte_patente_acoplado = ''

            this.devolucion.id_transporte = ''
            this.devolucion.transporte_transporte = ''
            this.devolucion.transporte_cuit_transporte = 0
            this.devolucion.transporte_chofer = ''
            this.devolucion.transporte_cuit_chofer = 0
            this.devolucion.transporte_patente_chasis = ''
            this.devolucion.transporte_patente_acoplado = ''
        }


        this.visible_transporte = false

        if (continua) {
            this.buscarEstablecimientos()
        }
    }
    asignarEstablecimiento(establecimiento: Establecimiento | undefined) {
        if (establecimiento) {
            this.remito.id_establecimiento = establecimiento?.id
            this.remito.establecimiento_descripcion = establecimiento?.descripcion
            this.remito.establecimiento_localidad = establecimiento?.localidad
            this.remito.establecimiento_provincia = establecimiento?.provincia

            this.devolucion.id_establecimiento = establecimiento?.id
            this.devolucion.establecimiento_descripcion = establecimiento?.descripcion
            this.devolucion.establecimiento_localidad = establecimiento?.localidad
            this.devolucion.establecimiento_provincia = establecimiento?.provincia
        } else {
            this.remito.id_establecimiento = ''
            this.remito.establecimiento_descripcion = ''
            this.remito.establecimiento_localidad = ''
            this.remito.establecimiento_provincia = ''

            this.devolucion.id_establecimiento = ''
            this.devolucion.establecimiento_descripcion = ''
            this.devolucion.establecimiento_localidad = ''
            this.devolucion.establecimiento_provincia = ''
        }

        this.visible_establecimiento = false
        this.mostrarModalArticulos()
    }


    filtroCliente() {
        this.clientesFiltrados = this.clientes.filter((cliente: Cliente) => { return cliente.razon_social.toLocaleUpperCase().includes(this.searchValue_cliente.toLocaleUpperCase()) || cliente.alias.toLocaleUpperCase().includes(this.searchValue_cliente.toLocaleUpperCase()) })
    }
    filtroAutorizado() {
        this.autorizadosFiltrados = this.autorizados.filter((autorizado: Autorizado) => { return autorizado.descripcion.toLocaleUpperCase().includes(this.searchValue_autorizado.toLocaleUpperCase()) })
    }
    filtroTransporte() {
        this.transportesFiltrados = this.transportes.filter((transporte: Transporte) => { return transporte.transporte.toLocaleUpperCase().includes(this.searchValue_transporte.toLocaleUpperCase()) || transporte.chofer.toLocaleUpperCase().includes(this.searchValue_transporte.toLocaleUpperCase()) || transporte.patente_chasis.toLocaleUpperCase().includes(this.searchValue_transporte.toLocaleUpperCase()) || transporte.patente_acoplado.toLocaleUpperCase().includes(this.searchValue_transporte.toLocaleUpperCase()) })
    }
    filtroEstablecimiento() {
        this.establecimientosFiltrados = this.establecimientos.filter((establecimiento: Establecimiento) => { return establecimiento.descripcion.toLocaleUpperCase().includes(this.searchValue_establecimiento.toLocaleUpperCase()) })
    }
    filtroArticulo() {
        this.articulosFiltrados = this.articulos.filter((articulo: Articulo) => { return articulo.descripcion.toLocaleUpperCase().includes(this.searchValue_articulo.toLocaleUpperCase()) })
    }


    buscarAutorizados(mostrar: boolean = false) {
        if (!this.id_cliente) {
            return this.ms.add({ severity: 'warn', summary: 'Atencion!', detail: 'Seleccione un cliente' })
        }
        this.cs.getAll('autorizados/' + this.id_cliente, (data: Autorizado[]) => {

            if (data.length > 0 || mostrar) {
                this.autorizados = data
                this.searchValue_autorizado = ''
                this.autorizado = {
                    id: '',
                    id_cliente: this.id_cliente,
                    descripcion: '',
                    documento: '',
                    cargo: '',
                    contacto: '',
                    datos: {},
                    estado: 1,
                    createdBy: '',
                    updatedBy: '',
                    createdAt: '',
                    updatedAt: ''
                }
                this.filtroAutorizado()
                this.visible_autorizado = true
            } else {
                this.asignarAutorizado(undefined)
            }

        })
    }
    buscarTransportes(mostrar: boolean = false) {
        if (!this.id_cliente) {
            return this.ms.add({ severity: 'warn', summary: 'Atencion!', detail: 'Seleccione un cliente' })
        }
        this.cs.getAll('transportes/' + this.id_cliente, (data: Transporte[]) => {
            if (data.length > 0 || mostrar) {
                this.transportes = data
                this.searchValue_transporte = ''
                this.transporte = {
                    id: '',
                    id_cliente: this.id_cliente,
                    transporte: '',
                    cuit_transporte: 0,
                    chofer: '',
                    cuit_chofer: 0,
                    patente_chasis: '',
                    patente_acoplado: '',
                    datos: {},
                    estado: 1,
                    createdBy: '',
                    updatedBy: '',
                    createdAt: '',
                    updatedAt: ''
                }
                this.filtroTransporte()
                this.visible_transporte = true
            } else {
                this.asignarTransporte(undefined)
            }
        })
    }
    buscarEstablecimientos(mostrar: boolean = false) {
        if (!this.id_cliente) {
            return this.ms.add({ severity: 'warn', summary: 'Atencion!', detail: 'Seleccione un cliente' })
        }
        this.cs.getAll('establecimientos/' + this.id_cliente, (data: Establecimiento[]) => {
            if (data.length > 0 || mostrar) {
                this.establecimientos = data
                this.searchValue_establecimiento = ''
                this.establecimiento = {
                    id: '',
                    id_cliente: this.id_cliente,
                    descripcion: '',
                    localidad: '',
                    provincia: '',
                    datos: {},
                    estado: 1,
                    createdBy: '',
                    updatedBy: '',
                    createdAt: '',
                    updatedAt: ''
                }
                this.filtroEstablecimiento()
                this.visible_establecimiento = true
            } else {
                this.asignarEstablecimiento(undefined)
            }
        })
    }


    agregarAutorizado() {
        this.autorizado = {
            id: '1',
            id_cliente: this.id_cliente,
            descripcion: '',
            documento: '',
            cargo: '',
            contacto: '',
            datos: {},
            estado: 1,
            createdBy: '',
            updatedBy: '',
            createdAt: '',
            updatedAt: ''
        }
    }
    guardarAutorizado() {
        this.cs.create('autorizados', this.autorizado, (id: any) => {
            this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Autorizado creado con ID: ' + id })
            this.asignarAutorizado(this.autorizado)
        })

    }
    agregarTransporte() {
        this.transporte = {
            id: '1',
            id_cliente: this.id_cliente,
            transporte: '',
            cuit_transporte: 0,
            chofer: '',
            cuit_chofer: 0,
            patente_chasis: '',
            patente_acoplado: '',
            datos: {},
            estado: 1,
            createdBy: '',
            updatedBy: '',
            createdAt: '',
            updatedAt: ''
        }
    }
    guardarTransporte() {
        this.cs.create('transportes', this.transporte, (id: any) => {
            this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Transporte creado con ID: ' + id })
            this.asignarTransporte(this.transporte)
        })

    }
    agregarEstablecimiento() {
        this.establecimiento = {
            id: '1',
            id_cliente: this.id_cliente,
            descripcion: '',
            localidad: '',
            provincia: '',
            datos: {},
            estado: 1,
            createdBy: '',
            updatedBy: '',
            createdAt: '',
            updatedAt: ''
        }
    }
    guardarEstablecimiento() {
        this.cs.create('establecimientos', this.establecimiento, (id: any) => {
            this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Establecimiento creado con ID: ' + id })
            this.asignarEstablecimiento(this.establecimiento)
        })

    }


    buscarArticuloPorCodigo(art: ArticuloAsociado) {
        if (!art.codigo) {
            return this.ms.add({ severity: 'warn', summary: 'Atencion!', detail: 'Ingrese un CODIGO' })
        }

        this.cs.getAll('articulos/buscar/codigo/' + art.codigo, (data: Articulo) => {
            this.asignarArticulo(art, data)
        }, (err: any) => {
            this.cs.getAll('articulos/buscar/descripcion/' + art.codigo, (data: Articulo[]) => {
                if (data.length == 1) {
                    this.asignarArticulo(art, data[0])
                }
                else if (data.length > 1) {
                    this.articulos = data
                    this.searchValue_articulo = ''
                    this.filtroArticulo()
                    this.visible_articulo = true
                    this.articuloProvisorio = art
                } else {
                    art = {
                        id: art.id,
                        id_original: '',
                        id_articulo: '',
                        id_documento: '',
                        id_rubro: '',
                        id_subRubro: '',
                        id_laboratorio: '',
                        id_unidadMedida: '',
                        id_deposito: '',
                        cantidad: 0,
                        cantidadUnidadFundamental: 0,
                        solicitaLote: false,
                        solicitaVencimiento: false,
                        lote: '',
                        vencimiento: this.fechaHoy(),
                        codigo: '',
                        descripcion: '',
                        observaciones: '',
                        unidadFundamental: '',
                        cantidadPorUnidadFundamental: 0,
                        ajuste: 'negativo',
                        documento: 'remito',
                        datos: {},
                        estado: 1,
                        createdBy: '',
                        updatedBy: '',
                        createdAt: '',
                        updatedAt: ''
                    }
                    this.ms.add({ severity: 'error', summary: 'Error!', detail: 'No se encontró ningún articulo con ese código o descripción' })
                }
            })
        })
    }
    asignarArticulo(art: ArticuloAsociado, datos: Articulo) {

        art.id_articulo = datos.id
        art.codigo = datos.codigo
        art.descripcion = datos.descripcion
        art.id_unidadMedida = datos.id_unidadMedida
        art.unidadFundamental = datos.unidadFundamental
        art.cantidadPorUnidadFundamental = datos.cantidadUnidadFundamental
        art.solicitaLote = datos.solicitaLote
        art.solicitaVencimiento = datos.solicitaVencimiento
        art.id_rubro = datos.id_rubro
        art.id_subRubro = datos.id_subRubro
        art.id_laboratorio = datos.id_laboratorio
        art.observaciones = datos.observaciones

        art.vencimiento = datos.solicitaVencimiento ? this.fechaHoy() : ''

        this.visible_articulo = false

        console.log(art)
        console.log(datos)

    }


    eliminarArticulo(id: string) {
        this.articulosRemito = this.articulosRemito.filter((art: ArticuloAsociado) => { return art.id != id });
    }
    verTotalesArticulosRemito() {
        if (this.articulosRemito.length == 0) {
            return this.ms.add({ severity: 'warn', summary: 'Atencion!', detail: 'No hay articulos' })
        }

        this.datosTotales = Object.values(this.articulosRemito.reduce((rubroAcc: any, item: ArticuloAsociado) => {
            // Si el rubro no existe en el acumulador, lo agregamos
            if (!rubroAcc.some((rub: any) => rub.id_rubro == item.id_rubro)) {
                rubroAcc.push({
                    id_rubro: item.id_rubro,
                    rubro: this.obtenerDescripcionRubro(item.id_rubro),
                    datos: [],
                    totales: 0,
                    litros: 0,
                    kilos: 0,
                    unidades: 0
                });
            }

            const rubro = rubroAcc.find((rub: any) => rub.id_rubro == item.id_rubro)

            // Buscamos el subrubro en los datos del rubro actual
            let subrubro = rubro.datos.find((sub: any) => sub.id_subRubro === item.id_subRubro);

            // Si no existe el subrubro, lo creamos
            if (!subrubro) {
                subrubro = {
                    id_subRubro: item.id_subRubro,
                    subRubro: this.obtenerDescripcionSubRubro(item.id_subRubro),
                    datos: [],
                    totales: 0,
                    litros: 0,
                    kilos: 0,
                    unidades: 0
                };
                rubro.datos.push(subrubro);
            }

            // Agregamos el item al subrubro y actualizamos los totales
            let articulo = subrubro.datos.find((art: any) => art.id_articulo === item.id_articulo)

            if (!articulo) {
                articulo = {
                    id_articulo: item.id_articulo,
                    descripcion: item.descripcion,
                    cantidad: 0,
                    unidadMedida: this.obtenerDescripcionUnidadMedida(item.id_unidadMedida),
                    litros: 0,
                    kilos: 0,
                    unidades: 0
                }
                subrubro.datos.push(articulo);
            }

            articulo.cantidad += item.cantidad
            subrubro.totales += item.cantidad;
            rubro.totales += item.cantidad;

            articulo[item.unidadFundamental] += item.cantidadUnidadFundamental
            subrubro[item.unidadFundamental] += item.cantidadUnidadFundamental;
            rubro[item.unidadFundamental] += item.cantidadUnidadFundamental;

            return rubroAcc;
        }, []));

        this.visible_totales = true
    }


    //DOCUMENTOS
    agregarDocumento() {
        let ultimoId = this.remito.datos.documentos?.reduce((max: number, curr: any) => {
            return curr.id > max ? curr.id : max
        }, 0)

        this.remito.datos.documentos?.push({
            id: ultimoId ? ultimoId + 1 : 1,
            tipo: 'remito',
            letra: 'R',
            punto: 1,
            numero: 1,
            fecha: this.fechaHoy()
        })

        let ultimoIdDev = this.devolucion.datos.documentos?.reduce((max: number, curr: any) => {
            return curr.id > max ? curr.id : max
        }, 0)

        this.devolucion.datos.documentos?.push({
            id: ultimoIdDev ? ultimoIdDev + 1 : 1,
            tipo: 'remito',
            letra: 'R',
            punto: 1,
            numero: 1,
            fecha: this.fechaHoy()
        })
    }
    eliminarDocumento(id: any) {
        if (this.remito.datos.documentos?.length) {
            this.remito.datos.documentos = this.remito.datos.documentos.filter((e: any) => e.id != id)
        }
        if (this.devolucion.datos.documentos?.length) {
            this.devolucion.datos.documentos = this.devolucion.datos.documentos.filter((e: any) => e.id != id)
        }
    }

    //DEVOLUCIONES
    seleccionarDevolverTodoRemito(art: any = null) {
        if (art) {
            art.cantidadRemitar = art.cantidad

            art.cantidadRemitarUnidadFundamental = art.cantidadUnidadFundamental
        }
    }
    seleccionarDevolverTodo(art: any = null) {
        if (art) {
            var cantidadDisponible = art.cantidad - art.salidas + art.entradas
            art.cantidadDevolver = cantidadDisponible

            var cantidadUFDisponible = art.cantidadUnidadFundamental - art.salidas_uf + art.entradas_uf
            art.cantidadDevolverUnidadFundamental = cantidadUFDisponible
        } else {
            this.articulosDevolucion.forEach((art: any) => {
                var cantidadDisponible = art.cantidad - art.salidas + art.entradas
                art.cantidadDevolver = cantidadDisponible

                var cantidadUFDisponible = art.cantidadUnidadFundamental - art.salidas_uf + art.entradas_uf
                art.cantidadDevolverUnidadFundamental = cantidadUFDisponible
            })
        }

        this.devolucion.total_unidades = this.totalesArticulosDevolucion()
    }

    //HELPERS
    obtenerDescripcionRubro(id: string) {
        return this.rubros.find((rub: Rubro) => { return rub.id == id })?.descripcion
    }
    obtenerDescripcionSubRubro(id: string) {
        return this.subRubros.find((subRub: Rubro) => { return subRub.id == id })?.descripcion
    }
    obtenerDescripcionUnidadMedida(id: string) {
        return this.unidadMedidas.find((unidadMedida: UnidadMedida) => { return unidadMedida.id == id })?.alias
    }
    obtenerDescripcionDeposito(id: string) {
        return this.depositos.find((deposito: Deposito) => { return deposito.id == id })?.alias
    }
    //obtenerDescripcionLaboratorio(id: string) {
    //    return this.laboratorios.find((laboratorio: Laboratorio) => { return laboratorio.id == id })?.descripcion
    //}

    fechaHoy(dias: number = 0) {
        const fechaActual = new Date();

        if (dias) {
            fechaActual.setDate(fechaActual.getDate() - dias)
        }

        const ano = fechaActual.getFullYear();
        const mes = ('0' + (fechaActual.getMonth() + 1)).slice(-2);
        const dia = ('0' + fechaActual.getDate()).slice(-2);

        return `${ano}-${mes}-${dia}`
    }
    mostrarNumero(ent: any) {
        var numero = ''
        try {
            numero = ent.toLocaleString('es-ES', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })
        } catch {
            numero = ent
        }
        return numero
    }
    mostrarDocumento(pto: number, nro: number) {
        return `${String(pto).padStart(4, '0')}-${String(nro).padStart(8, '0')}`
    }
    totalesArticulosIngreso() {
        var cantidad = 0
        var kilos = 0
        var litros = 0
        var unidades = 0

        this.articulosRemito.map((item: ArticuloAsociado) => {

            cantidad += item.cantidad

            if (item.unidadFundamental == 'kilos') {
                kilos += item.cantidadUnidadFundamental
            } else if (item.unidadFundamental == 'litros') {
                litros += item.cantidadUnidadFundamental
            } else if (item.unidadFundamental == 'unidades') {
                unidades += item.cantidadUnidadFundamental
            }

        });

        return `${cantidad} unidades.${(kilos || litros || unidades) ? 'Equivale a' : ''}${kilos ? ' ~' + kilos + ' kilos.' : ''}${litros ? ' ~' + litros + ' litros.' : ''}${unidades ? ' ~' + unidades + ' unidades.' : ''}`
    }
    totalesArticulosDevolucion(): string {
        var cantidad = 0
        var kilos = 0
        var litros = 0
        var unidades = 0

        this.articulosDevolucion.map((item: any) => {

            cantidad += (item.cantidadDevolver ? item.cantidadDevolver : 0)

            if (item.unidadFundamental == 'kilos') {
                kilos += (item.cantidadDevolverUnidadFundamental ? item.cantidadDevolverUnidadFundamental : 0)
            } else if (item.unidadFundamental == 'litros') {
                litros += (item.cantidadDevolverUnidadFundamental ? item.cantidadDevolverUnidadFundamental : 0)
            } else if (item.unidadFundamental == 'unidades') {
                unidades += (item.cantidadDevolverUnidadFundamental ? item.cantidadDevolverUnidadFundamental : 0)
            }
        });

        return `${cantidad} unidades.${(kilos || litros || unidades) ? 'Equivale a' : ''}${kilos ? ' ~' + kilos + ' kilos.' : ''}${litros ? ' ~' + litros + ' litros.' : ''}${unidades ? ' ~' + unidades + ' unidades.' : ''}`
    }

    calcularUnidadFundamental(art: ArticuloAsociado) {
        art.cantidadUnidadFundamental = Math.round(art.cantidad * art.cantidadPorUnidadFundamental * 100) / 100

        this.remito.total_unidades = this.totalesArticulosIngreso()
    }
    calcularUnidadFundamentalDevolucion(art: any) {
        art.cantidadDevolverUnidadFundamental = Math.round(art.cantidadDevolver * art.cantidadPorUnidadFundamental * 100) / 100

        this.verificarMax(art)
        this.verificarMaxUF(art)
    }
    calcularUnidadFundamentalRemito(art: any) {
        art.cantidadRemitarUnidadFundamental = Math.round(art.cantidadRemitar * art.cantidadPorUnidadFundamental * 100) / 100

        //verificar max
        if (art.cantidadRemitar > art.cantidad) {
            this.ms.add({ severity: 'warn', summary: 'Atencion!', detail: 'La cantidad maxima disponible a remitar es: ' + art.cantidad })
            art.cantidadRemitar = art.cantidad
        }
        if (art.cantidadRemitar < 0) {
            art.cantidadRemitar = 0
        }

        this.verificarMaxUFRemitar(art)
    }
    verificarMax(a: any) {
        var cantidadDisponible = a.cantidad - a.salidas + a.entradas

        if (a.cantidadDevolver > cantidadDisponible) {
            this.ms.add({ severity: 'warn', summary: 'Atencion!', detail: 'La cantidad maxima disponible a devolver es: ' + cantidadDisponible })
            a.cantidadDevolver = cantidadDisponible
        }
        if (a.cantidadDevolver < 0) {
            a.cantidadDevolver = 0
        }
    }
    verificarMaxUF(a: any) {
        var cantidadUFDisponible = a.cantidadUnidadFundamental - a.salidas_uf + a.entradas_uf

        if (a.cantidadDevolverUnidadFundamental > cantidadUFDisponible) {
            this.ms.add({ severity: 'warn', summary: 'Atencion!', detail: 'La cantidad maxima disponible a devolver (UF) es: ' + cantidadUFDisponible })
            a.cantidadDevolverUnidadFundamental = cantidadUFDisponible
        }
        if (a.cantidadDevolverUnidadFundamental < 0) {
            a.cantidadDevolverUnidadFundamental = 0
        }

        this.devolucion.total_unidades = this.totalesArticulosDevolucion()
    }
    verificarMaxUFRemitar(a: any) {

        if (a.cantidadRemitarUnidadFundamental > a.cantidadUnidadFundamental) {
            this.ms.add({ severity: 'warn', summary: 'Atencion!', detail: 'La cantidad maxima disponible a remitar (UF) es: ' + a.cantidadUnidadFundamental })
            a.cantidadRemitarUnidadFundamental = a.cantidadUnidadFundamental
        }
        if (a.cantidadRemitarUnidadFundamental < 0) {
            a.cantidadRemitarUnidadFundamental = 0
        }
    }

    fechaFiltro(dias: number) {
        this.fechaFiltroDesde = this.fechaHoy(dias)
        this.fechaFiltroHasta = this.fechaHoy()
    }
    clienteFiltro() {
        this.clientesFiltrados = this.clientesTodos.filter((cliente: Cliente) => { return cliente.razon_social.toLocaleUpperCase().includes(this.searchValue_cliente.toLocaleUpperCase()) || cliente.alias.toLocaleUpperCase().includes(this.searchValue_cliente.toLocaleUpperCase()) })
    }

    filtrar() {
        this.actualizarDatosTabla()
        this.visible_filtros = false

        this.fechasFiltradas = this.fechaFiltroDesde
        if (this.fechaFiltroDesde != this.fechaFiltroHasta) {
            this.fechasFiltradas = `Desde ${this.fechaFiltroDesde} hasta ${this.fechaFiltroHasta}`
        }

        this.clienteFiltrados = '[TODOS]'
        if (this.selectedClientes.length) {
            if (this.selectedClientes.length != this.clientesTodos.length) {
                var clientesSeleccionados: any = []
                this.selectedClientes.forEach((client: string) => {
                    var cliente = this.clientesTodos.find((e: Cliente) => e.id == client)!
                    clientesSeleccionados.push(cliente.razon_social)
                })
                this.clienteFiltrados = clientesSeleccionados.join('; ')
            }
        }
    }
    ordenarTabla(ordenaPor: string) {

        if (this.ordenarTablaPorAnterior == ordenaPor) {
            this.ordenarTablaOrden = !this.ordenarTablaOrden
        }

        this.ordenarTablaPor = ordenaPor

        this.dataTabla.sort((a: any, b: any) => {
            if (typeof a[ordenaPor] === 'string') {
                return this.ordenarTablaOrden ? b[ordenaPor].localeCompare(a[ordenaPor]) : a[ordenaPor].localeCompare(b[ordenaPor]);
            }
            return this.ordenarTablaOrden ? (a[ordenaPor] - b[ordenaPor]) : (b[ordenaPor] - a[ordenaPor]);
        });

        this.ordenarTablaPorAnterior = ordenaPor
    }
    ordenarTablaArticulos(ordenaPor: string) {

        if (this.ordenarTablaPorAnterior_art == ordenaPor) this.ordenarTablaOrden_art = !this.ordenarTablaOrden_art;

        this.ordenarTablaPor_art = ordenaPor

        this.dataTablaArticulos.sort((a: any, b: any) => {
            if (typeof a[ordenaPor] === 'string') {
                return this.ordenarTablaOrden_art ? b[ordenaPor].localeCompare(a[ordenaPor]) : a[ordenaPor].localeCompare(b[ordenaPor]);
            }
            return this.ordenarTablaOrden_art ? (a[ordenaPor] - b[ordenaPor]) : (b[ordenaPor] - a[ordenaPor]);
        });

        this.ordenarTablaPorAnterior_art = ordenaPor
    }
    guardarFechas() {
        localStorage.setItem('stock_remitosFechaFiltroDesde', this.fechaFiltroDesde)
        localStorage.setItem('stock_remitosFechaFiltroHasta', this.fechaFiltroHasta)
        this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Fechas guardadas' })
    }

    //INFORMES
    listadoXLSX() {
        this.xlsx.downloadExcelListado({ datos: this.dataTabla, fecha: this.fechasFiltradas, clientes: this.clienteFiltrados });
    }
    detalleXLSX() {
        var user = this.as.isUser()
        this.xlsx.downloadExcelDetalle({ datos: this.dataTabla, fecha: this.fechasFiltradas, clientes: this.clienteFiltrados, usuario: user.descripcion });
    }
    datosXLSX() {
        this.xlsx.downloadExcelDatos({ datos: this.dataTabla, fecha: this.fechasFiltradas, clientes: this.clienteFiltrados });
    }
}