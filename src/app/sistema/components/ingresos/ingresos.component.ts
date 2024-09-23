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

declare var vars: any;

@Component({
    selector: 'app-ingresos',
    standalone: true,
    imports: [TableModule, ButtonModule, DialogModule, CommonModule, DropdownModule, DividerModule, FormsModule, ProgressSpinnerModule, InputTextModule, InputGroupModule, InputGroupAddonModule, InputTextareaModule, TagModule, MultiSelectModule],
    templateUrl: './ingresos.component.html',
    styleUrl: './ingresos.component.css'
})
export class IngresosComponent {

    modelosRemitos = vars.modelosRemitos;
    puntosVenta = vars.puntosVenta;
    depositoSeleccionado = vars.depositoSeleccionado;

    pestActiva: string = ''

    visible_ingreso: boolean = false
    visible_cliente: boolean = false
    visible_autorizado: boolean = false
    visible_transporte: boolean = false
    visible_establecimiento: boolean = false
    visible_articulo: boolean = false
    visible_totales: boolean = false
    datosTotales: any = []

    visible_devolucion: boolean = false

    permite_secuencia_lote: boolean = false
    cantidad_secuencia_lote: number = 1
    digitos_secuencia_lote: number = 3

    avisarRegistrosVacios: boolean = true

    searchValue_cliente: string = ''
    searchValue_autorizado: string = ''
    searchValue_transporte: string = ''
    searchValue_establecimiento: string = ''
    searchValue_articulo: string = ''

    ingreso: Remito = {
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
    ingresos: Remito[] = []
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

    clientes: Cliente[] = []
    clientesFiltrados: Cliente[] = []
    clientesTodos: Cliente[] = []
    selectedClientes: Cliente[] = []

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
    articulosIngreso: ArticuloAsociado[] = []
    articuloProvisorio: ArticuloAsociado | undefined

    articulosDevolucion: any[] = []

    rubros: Rubro[] = []
    subRubros: SubRubro[] = []

    constructor(
        private padron: PadronService,
        private ms: MessageService,
        private cs: ConsultasService,
        private pdf: PdfService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.actualizarDatosTabla()

        this.cs.getAll('depositos', (data: Deposito[]) => { this.depositos = data })
        this.cs.getAll('unidadMedidas', (data: UnidadMedida[]) => { this.unidadMedidas = data })
        this.cs.getAll('rubros', (data: Rubro[]) => { this.rubros = data })
        this.cs.getAll('subRubros', (data: SubRubro[]) => { this.subRubros = data })
        this.cs.getAll('clientes', (data: Cliente[]) => { this.clientesTodos = data })

        this.cs.getAll('articulosAsociados', (data: any[]) => { console.log(data) })

        this.route.paramMap.subscribe(params => {
            var id_cliente = params.get('id_cliente');
            if (id_cliente) {
                this.mostrarModalIngreso()
                this.buscarClientePorId(id_cliente)
            }
        });
    }



    verIngreso(id: string) {
        this.pdf.ingreso(id, 3).subscribe((blob: any) => {
            const url = window.URL.createObjectURL(blob);
            const windowFeatures = 'width=800,height=600,menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes';
            window.open(url, '_blank', windowFeatures);
        }, error => {
            console.error('Error al obtener el PDF', error);
        });
    }
    descargarIngreso(id: string) {
        this.pdf.ingreso(id, 1).subscribe((blob: any) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `remito_${id}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
        }, error => {
            console.error('Error al obtener el PDF', error);
        });
    }

    verDevolucion(id: string) {
        this.pdf.ingreso(id, 3).subscribe((blob: any) => {
            const url = window.URL.createObjectURL(blob);
            const windowFeatures = 'width=800,height=600,menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes';
            window.open(url, '_blank', windowFeatures);
        }, error => {
            console.error('Error al obtener el PDF', error);
        });
    }
    descargarDevolucion(id: string) {
        this.pdf.ingreso(id, 1).subscribe((blob: any) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `remito_${id}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
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
        this.cs.getAll('ingresos', (dataIngresos: Remito[]) => {
            this.cs.getAll('devoluciones', (dataDevoluciones: RemitoDevolucion[]) => {
                dataIngresos.forEach((ing:Remito) => this.dataTabla.push({ ...ing, tipo:'INGRESO' }))
                dataDevoluciones.forEach((dev:Remito) => this.dataTabla.push({ ...dev, tipo:'DEVOLUCION' }))
            })
        })
    }


    mostrarModalIngreso(id: any = undefined) {
        this.pestActiva = 'cliente'
        if (id) {
            this.articulosIngreso = []

            this.cs.getAll('ingresos/' + id, (dato: Remito) => {
                this.ingreso = dato
            })

            this.cs.getAll('articulosAsociados/buscar/' + id, (datos: ArticuloAsociado[]) => {
                this.articulosIngreso = datos
            })
        } else {
            this.ingreso = {
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

            this.articulosIngreso = []
        }
        this.permite_secuencia_lote = false
        this.visible_ingreso = true
        this.id_cliente = ''
    }
    guardarIngreso(tipo: 'D' | 'M' | null = null) {
        var cantidadRegistros = this.articulosIngreso.length
        var cantidadRegistrosId = this.articulosIngreso.filter((e: ArticuloAsociado) => e.id_articulo).length
        if (!this.ingreso.id_cliente) {
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

        this.cs.getAll('ingresos/buscar/ultimo/' + this.ingreso.punto, (ultNum: number) => {
            this.ingreso.numero = ultNum + 1

            this.cs.create('ingresos', this.ingreso, (id_ingreso_creado: any) => {
                this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Ingreso creado con ID: ' + id_ingreso_creado })
                this.ingreso.id = id_ingreso_creado

                var artIngs = this.articulosIngreso.map((artIng: ArticuloAsociado) => {
                    const { id, ...resto } = artIng;

                    return {
                        ...resto,
                        id_documento: id_ingreso_creado
                    }
                })

                this.cs.createMultiple('articulosAsociados', artIngs, (mensaje: any) => {
                    this.ms.add({ severity: 'success', summary: 'Exito!', detail: mensaje.length + ' registros de articulos creados' })
                    this.actualizarDatosTabla()

                    if (tipo == 'D') {
                        this.descargarIngreso(id_ingreso_creado)
                        this.visible_ingreso = false
                    }
                    if (tipo == 'M') {
                        this.verIngreso(id_ingreso_creado)
                        this.visible_ingreso = false
                    }
                })

            })

        }, (err: any) => {
            this.ms.add({ severity: 'error', summary: 'Error obteniendo numero de remito', detail: err.message })
        })
    }


    mostrarModalDevolucion({ id_ingreso = '', id_devolucion = '' } = {}) {
        this.pestActiva = 'cliente'
        if (id_ingreso) {
            this.cs.getAll('ingresos/' + id_ingreso, (dato: Remito) => {
                this.devolucion = {
                    ...dato,
                    id: '',
                    id_asociado: id_ingreso,
                    fecha: this.fechaHoy(),
                    numero: 0,
                    total_unidades: '',
                    observaciones_sistema: '',
                    observaciones: '',
                    datos: { documentos: [] }
                }

                this.id_cliente = dato.id_cliente

                this.cs.getAll('articulosAsociados/devolucion/' + id_ingreso, (datos: any) => {
                    this.articulosDevolucion = datos
                })
            })
        } else if (id_devolucion) {
            //BUSCAMOS Y MOSTRAMOS LA DEVOLUCION
            this.articulosDevolucion = []

            this.cs.getAll('devoluciones/' + id_devolucion, (dato: RemitoDevolucion) => {
                this.devolucion = dato
            })

            this.cs.getAll('articulosAsociados/buscar/' + id_devolucion, (datos: ArticuloAsociado[]) => {
                this.articulosDevolucion = datos
            })
        } else {
            //creamos nueva devolucion, para esto habria que seleccionar el cliente y el ingreso a devolver
        }
        this.visible_devolucion = true

    }
    guardarDevolucion(tipo: 'D' | 'M' | null = null) {
        var cantidadRegistros = this.articulosDevolucion.filter((artDev) => artDev.cantidadDevolver).length

        if (!cantidadRegistros) {
            return this.ms.add({ severity: 'error', summary: 'Atencion!', detail: 'Agregar cantidad a al menos un articulo' })
        }

        this.cs.getAll('devoluciones/buscar/ultimo/' + this.devolucion.punto, (ultNum: number) => {
            this.devolucion.numero = ultNum + 1

            this.cs.create('devoluciones', this.devolucion, (id_devolucion_creado: any) => {
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
                        ajuste: 'negativo',
                        documento: 'ingreso_devolucion'
                    }
                })

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

    buscarClientePorId(id: string) {
        this.cs.getAll('clientes/' + id, (data: Cliente) => {
            this.asignarCliente(data)
        })
    }
    buscarClientePorCodigo() {
        if (!this.ingreso.codigo) {
            return this.ms.add({ severity: 'warn', summary: 'Atencion!', detail: 'Ingrese un CODIGO' })
        }

        this.cs.getAll('clientes/codigo/' + this.ingreso.codigo, (data: Cliente) => {
            this.asignarCliente(data)
        }, (err: any) => {
            this.cs.getAll('clientes/buscar/' + this.ingreso.codigo, (data: Cliente[]) => {
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

        this.ingreso.id_cliente = cliente.id
        this.ingreso.cuit = cliente.cuit
        this.ingreso.codigo = cliente.codigo
        this.ingreso.razon_social = cliente.razon_social
        this.ingreso.alias = cliente.alias
        this.ingreso.direccion = cliente.direccion
        this.ingreso.localidad = cliente.localidad
        this.ingreso.provincia = cliente.provincia
        this.ingreso.codigo_postal = cliente.codigo_postal
        this.ingreso.telefono = cliente.telefono
        this.ingreso.correo = cliente.correo

        this.visible_cliente = false

        if (continua) {
            this.buscarAutorizados()
        }
    }
    asignarAutorizado(autorizado: Autorizado | undefined, continua: boolean = true) {

        if (autorizado) {
            this.ingreso.id_autorizado = autorizado?.id
            this.ingreso.autorizado_descripcion = autorizado?.descripcion
            this.ingreso.autorizado_documento = autorizado?.documento
            this.ingreso.autorizado_contacto = autorizado?.contacto

            this.devolucion.id_autorizado = autorizado?.id
            this.devolucion.autorizado_descripcion = autorizado?.descripcion
            this.devolucion.autorizado_documento = autorizado?.documento
            this.devolucion.autorizado_contacto = autorizado?.contacto
        } else {
            this.ingreso.id_autorizado = ''
            this.ingreso.autorizado_descripcion = ''
            this.ingreso.autorizado_documento = ''
            this.ingreso.autorizado_contacto = ''

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
            this.ingreso.id_transporte = transporte?.id
            this.ingreso.transporte_transporte = transporte?.transporte
            this.ingreso.transporte_cuit_transporte = transporte?.cuit_transporte
            this.ingreso.transporte_chofer = transporte?.chofer
            this.ingreso.transporte_cuit_chofer = transporte?.cuit_chofer
            this.ingreso.transporte_patente_chasis = transporte?.patente_chasis
            this.ingreso.transporte_patente_acoplado = transporte?.patente_acoplado

            this.devolucion.id_transporte = transporte?.id
            this.devolucion.transporte_transporte = transporte?.transporte
            this.devolucion.transporte_cuit_transporte = transporte?.cuit_transporte
            this.devolucion.transporte_chofer = transporte?.chofer
            this.devolucion.transporte_cuit_chofer = transporte?.cuit_chofer
            this.devolucion.transporte_patente_chasis = transporte?.patente_chasis
            this.devolucion.transporte_patente_acoplado = transporte?.patente_acoplado
        } else {
            this.ingreso.id_transporte = ''
            this.ingreso.transporte_transporte = ''
            this.ingreso.transporte_cuit_transporte = 0
            this.ingreso.transporte_chofer = ''
            this.ingreso.transporte_cuit_chofer = 0
            this.ingreso.transporte_patente_chasis = ''
            this.ingreso.transporte_patente_acoplado = ''

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
            this.ingreso.id_establecimiento = establecimiento?.id
            this.ingreso.establecimiento_descripcion = establecimiento?.descripcion
            this.ingreso.establecimiento_localidad = establecimiento?.localidad
            this.ingreso.establecimiento_provincia = establecimiento?.provincia

            this.devolucion.id_establecimiento = establecimiento?.id
            this.devolucion.establecimiento_descripcion = establecimiento?.descripcion
            this.devolucion.establecimiento_localidad = establecimiento?.localidad
            this.devolucion.establecimiento_provincia = establecimiento?.provincia
        } else {
            this.ingreso.id_establecimiento = ''
            this.ingreso.establecimiento_descripcion = ''
            this.ingreso.establecimiento_localidad = ''
            this.ingreso.establecimiento_provincia = ''

            this.devolucion.id_establecimiento = ''
            this.devolucion.establecimiento_descripcion = ''
            this.devolucion.establecimiento_localidad = ''
            this.devolucion.establecimiento_provincia = ''
        }

        this.visible_establecimiento = false
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

    //ARTICULOS
    agregarArticulos() {
        if (this.articulosIngreso.some((art: ArticuloAsociado) => { return !art.id_articulo })) {
            return this.ms.add({ severity: 'info', summary: 'Atencion!', detail: 'Existen Complete los datos vacios' })
        }

        let ultimoId = this.articulosIngreso.reduce((max: number, curr: ArticuloAsociado) => {
            return parseInt(curr.id) > max ? parseInt(curr.id) : max
        }, 0)

        this.articulosIngreso.push({
            id: (ultimoId + 1).toString(),
            id_original: '',
            id_articulo: '',
            id_documento: '',
            id_rubro: '',
            id_subRubro: '',
            id_laboratorio: '',
            id_unidadMedida: '',
            id_deposito: this.depositoSeleccionado,
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
            ajuste: 'positivo',
            documento: 'ingreso',
            datos: {},
            estado: 1,
            createdBy: '',
            updatedBy: '',
            createdAt: '',
            updatedAt: ''
        })

        this.permite_secuencia_lote = false
    }
    agregarArticulosSecuencia() {

        let ultimo = this.articulosIngreso.reduce((anterior: ArticuloAsociado, curr: ArticuloAsociado) => {
            return parseInt(curr.id) > parseInt(anterior.id) ? curr : anterior
        })

        let serie = ultimo.lote.slice(-this.digitos_secuencia_lote)
        let serie_base = ultimo.lote.slice(0, -this.digitos_secuencia_lote);

        let numero_serie = 0
        try {
            numero_serie = parseInt(serie) ? parseInt(serie) : 0
        } catch {
            numero_serie = 0
        }

        for (let index = 0; index < this.cantidad_secuencia_lote; index++) {

            this.articulosIngreso.push({
                ...ultimo,
                id: (parseInt(ultimo.id) + index + 1).toString(),
                lote: serie_base + (numero_serie + index + 1).toString().padStart(this.digitos_secuencia_lote, '0')

            })
        }
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
                        ajuste: 'positivo',
                        documento: 'ingreso',
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
        this.permite_secuencia_lote = datos.solicitaLote

        console.log(art)
        console.log(datos)

    }


    eliminarArticulo(id: string) {
        this.articulosIngreso = this.articulosIngreso.filter((art: ArticuloAsociado) => { return art.id != id });
        this.permite_secuencia_lote = false
    }
    verTotalesArticulosIngreso() {
        if (this.articulosIngreso.length == 0) {
            return this.ms.add({ severity: 'warn', summary: 'Atencion!', detail: 'No hay articulos' })
        }

        this.datosTotales = Object.values(this.articulosIngreso.reduce((rubroAcc: any, item: ArticuloAsociado) => {
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
        let ultimoId = this.ingreso.datos.documentos?.reduce((max: number, curr: any) => {
            return curr.id > max ? curr.id : max
        }, 0)

        this.ingreso.datos.documentos?.push({
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
        if (this.ingreso.datos.documentos?.length) {
            this.ingreso.datos.documentos = this.ingreso.datos.documentos.filter((e: any) => e.id != id)
        }
        if (this.devolucion.datos.documentos?.length) {
            this.devolucion.datos.documentos = this.devolucion.datos.documentos.filter((e: any) => e.id != id)
        }
    }

    //DEVOLUCIONES
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
    //obtenerDescripcionLaboratorio(id: string) {
    //    return this.laboratorios.find((laboratorio: Laboratorio) => { return laboratorio.id == id })?.descripcion
    //}

    fechaHoy() {
        const fechaActual = new Date();
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

        this.articulosIngreso.map((item: ArticuloAsociado) => {

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
        //var cantidad = 0
        //var kilos = 0
        //var litros = 0
        //var unidades = 0

        //this.articulosIngreso.map((item: ArticuloAsociado) => {

        //    cantidad += item.cantidad

        //    if (item.unidadFundamental == 'kilos') {
        //        kilos += item.cantidadUnidadFundamental
        //    } else if (item.unidadFundamental == 'litros') {
        //        litros += item.cantidadUnidadFundamental
        //    } else if (item.unidadFundamental == 'unidades') {
        //        unidades += item.cantidadUnidadFundamental
        //    }

        //});

        //return `${cantidad} unidades.${(kilos || litros || unidades) ? 'Equivale a' : ''}${kilos ? ' ~' + kilos + ' kilos.' : ''}${litros ? ' ~' + litros + ' litros.' : ''}${unidades ? ' ~' + unidades + ' unidades.' : ''}`
        return ``
    }

    calcularUnidadFundamental(art: ArticuloAsociado) {
        art.cantidadUnidadFundamental = Math.round(art.cantidad * art.cantidadPorUnidadFundamental * 100) / 100

        this.ingreso.total_unidades = this.totalesArticulosIngreso()
    }
    calcularUnidadFundamentalDevolucion(art: any) {
        art.cantidadDevolverUnidadFundamental = Math.round(art.cantidadDevolver * art.cantidadPorUnidadFundamental * 100) / 100

        this.verificarMax(art)
        this.verificarMaxUF(art)

        this.devolucion.total_unidades = this.totalesArticulosDevolucion()
    }
    verificarMax(a: any) {
        var cantidadDisponible = a.cantidad - a.salidas + a.entradas

        if (a.cantidadDevolver > cantidadDisponible) {
            this.ms.add({ severity: 'warn', summary: 'Atencion!', detail: 'La cantidad maxima disponible a devolver es: ' + cantidadDisponible })
            a.cantidadDevolver = cantidadDisponible
        }
        if(a.cantidadDevolver < 0){
            a.cantidadDevolver = 0
        }
    }
    verificarMaxUF(a: any) {
        var cantidadUFDisponible = a.cantidadUnidadFundamental - a.salidas_uf + a.entradas_uf

        if (a.cantidadDevolverUnidadFundamental > cantidadUFDisponible) {
            this.ms.add({ severity: 'warn', summary: 'Atencion!', detail: 'La cantidad maxima disponible a devolver (UF) es: ' + cantidadUFDisponible })
            a.cantidadDevolverUnidadFundamental = cantidadUFDisponible
        }
        if(a.cantidadDevolverUnidadFundamental < 0){
            a.cantidadDevolverUnidadFundamental = 0
        }
    }
}