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
import { ArticuloAsociado, Operaciones, RemitoDevolucion } from '../../interfaces/remitos';
import { TagModule } from 'primeng/tag';
import { Articulo, Rubro, SubRubro, TiposOperaciones } from '../../interfaces/productos';
import { PdfService } from '../../services/pdf.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { ActivatedRoute } from '@angular/router';
import { ListboxModule } from 'primeng/listbox';
import { XlsxService } from '../../services/xlsx.service';
import { AuthService } from '../../../login/services/auth.service';

declare var vars: any;

@Component({
  selector: 'app-operaciones',
  standalone: true,
  imports: [ListboxModule, TableModule, ButtonModule, DialogModule, CommonModule, DropdownModule, DividerModule, FormsModule, ProgressSpinnerModule, InputTextModule, InputGroupModule, InputGroupAddonModule, InputTextareaModule, TagModule, MultiSelectModule],
  templateUrl: './operaciones.component.html',
  styleUrl: './operaciones.component.css'
})
export class OperacionesComponent {

    modelosRemitos = vars.modelosRemitos;
    puntosVenta = vars.puntosVenta;
    depositoSeleccionado = vars.depositoSeleccionado;

    pestActiva: string = ''

    visible_operacion: boolean = false
    visible_cliente: boolean = false
    visible_articulo: boolean = false
    visible_articulo_egreso: boolean = false
    visible_filtros: boolean = false

    searchValue_cliente: string = ''
    searchValue_articulo: string = ''
    searchValue_articuloEgreso: string = ''

    operacion: Operaciones = {
        id: '',
        fecha: '',
        numero: 0,
        punto: 0,
        modelo: '',
        tipo: '',
        id_cliente_egreso: '',
        codigo_egreso: '',
        razon_social_egreso: '',
        cuit_egreso: 0,
        alias_egreso: '',
        id_cliente_ingreso: '',
        codigo_ingreso: '',
        razon_social_ingreso: '',
        cuit_ingreso: 0,
        alias_ingreso: '',
        observaciones: '',
        observaciones_sistema: '',
        datos: {
            documentos: undefined
        },
        estado: 1,
        createdBy: '',
        updatedBy: '',
        createdAt: '',
        updatedAt: ''
    }
    operaciones: Operaciones[] = []

    dataTabla: any = []
    dataArticulosRemitar: any = []
    dataTablaArticulos: any = []
    dataTablaArticulosRemitar: any = []

    clientes: Cliente[] = []
    clientesFiltrados: Cliente[] = []
    clientesTodos: Cliente[] = []
    selectedClientes: string[] = []
    selectedClientesArticulos: Cliente[] = []

    id_cliente_ingreso: string = ''
    id_cliente_egreso: string = ''

    depositos: Deposito[] = []
    unidadMedidas: UnidadMedida[] = []

    articulos: Articulo[] = []
    articulosFiltrados: Articulo[] = []
    articulosOperacionEgreso: ArticuloAsociado[] = []
    articulosOperacionIngreso: ArticuloAsociado[] = []
    articuloProvisorio: ArticuloAsociado | undefined

    articulosDevolucion: any[] = []

    rubros: Rubro[] = []
    subRubros: SubRubro[] = []
    tiposOperaciones: TiposOperaciones[] = []

    fechaFiltroDesde: string = this.fechaHoy(31)
    fechaFiltroHasta: string = this.fechaHoy()

    fechasFiltradas: string = ''
    clienteFiltrados: string = ''

    ordenarTablaOrden: boolean = true
    ordenarTablaPorAnterior: string = ''
    ordenarTablaPor: string = 'numeroMostrar'

    ordenarTablaOrden_art: boolean = false
    ordenarTablaPorAnterior_art: string = ''
    ordenarTablaPor_art: string = ''

    buscandoCliente: 'ingreso' | 'egreso' | undefined

    constructor(
        private ms: MessageService,
        private cs: ConsultasService,
        private as: AuthService,
        private pdf: PdfService,
        private route: ActivatedRoute,
        private xlsx: XlsxService
    ) { }

    ngOnInit() {
        if (localStorage.getItem('stock_operacionesFechaFiltroDesde')) {
            this.fechaFiltroDesde = localStorage.getItem('stock_operacionesFechaFiltroDesde')!
        }
        if (localStorage.getItem('stock_operacionesFechaFiltroHasta')) {
            this.fechaFiltroHasta = localStorage.getItem('stock_operacionesFechaFiltroHasta')!
        }

        this.cs.getAll('tiposOperaciones', (data: any) => { this.tiposOperaciones = data })

        this.cs.getAll('depositos', (data: Deposito[]) => { this.depositos = data })
        this.cs.getAll('unidadMedidas', (data: UnidadMedida[]) => { this.unidadMedidas = data })
        this.cs.getAll('rubros', (data: Rubro[]) => { this.rubros = data })
        this.cs.getAll('subRubros', (data: SubRubro[]) => { this.subRubros = data })

        this.cs.getAll('clientes', (data: Cliente[]) => {
            this.clientesTodos = data
            this.clientesFiltrados = data

            this.filtrar()
        })
    }

    verOperacion(id: string) {
        this.pdf.operacion(id, 3).subscribe((blob: any) => {
            const url = window.URL.createObjectURL(blob);
            const windowFeatures = 'width=800,height=600,menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes';
            window.open(url, '_blank', windowFeatures);
        }, error => {
            console.error('Error al obtener el PDF', error);
        });
    }
    descargarOperacion(id: string) {
        this.pdf.operacion(id, 1).subscribe((blob: any) => {

            this.cs.getAll('operaciones/' + id, (operacion: Operaciones) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Operacion ${this.mostrarDocumento(operacion.punto, operacion.numero)} - EG ${operacion.razon_social_egreso} - IN ${operacion.razon_social_ingreso}.pdf`;
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

        this.cs.getAllPost(`operaciones/operaciones/?fechaDesde=${this.fechaFiltroDesde}&fechaHasta=${this.fechaFiltroHasta}`, { clientes: this.selectedClientes }, (e: any) => {
            this.dataTabla = e

            //BORRAMOS this.ordenarTablaPorAnterior PARA QUE NO SE DE VUELTA EL FILTRO
            this.ordenarTablaPorAnterior = ''
            this.ordenarTabla(this.ordenarTablaPor)
        })
    }


    mostrarModalOperacion(id: any = undefined) {
        this.pestActiva = 'cliente'
        this.dataArticulosRemitar = []
        this.dataTablaArticulosRemitar = []
        this.dataTablaArticulos = []
        if (id) {
            this.articulosOperacionIngreso = []
            this.articulosOperacionEgreso = []

            this.cs.getAll('operaciones/' + id, (dato: Operaciones) => {
                this.operacion = dato
            })

            this.cs.getAll('articulosAsociados/buscar/' + id, (datos: ArticuloAsociado[]) => {
                this.articulosOperacionIngreso = datos.filter((e:ArticuloAsociado) => { return e.ajuste == 'positivo' })
                this.dataTablaArticulosRemitar = datos.filter((e:ArticuloAsociado) => { return e.ajuste == 'negativo' })
            })

        } else {
            this.operacion = {
                id: '',
                numero: 0,
                punto: this.puntosVenta[0].punto,
                datos: { documentos: [] },
                fecha: this.fechaHoy(),
                modelo: this.modelosRemitos[0].alias,
                tipo: 'Clasificacion',

                id_cliente_ingreso: '',
                codigo_ingreso: '',
                razon_social_ingreso: '',
                cuit_ingreso: 0,
                alias_ingreso: '',

                id_cliente_egreso: '',
                codigo_egreso: '',
                razon_social_egreso: '',
                cuit_egreso: 0,
                alias_egreso: '',

                observaciones: '',
                observaciones_sistema: '',
                estado: 1,

                createdBy: '',
                updatedBy: '',
                createdAt: '',
                updatedAt: ''
            }

            this.articulosOperacionIngreso = []
            this.articulosOperacionEgreso = []
        }
        this.visible_operacion = true
        this.id_cliente_ingreso = ''
        this.id_cliente_egreso = ''
    }
    guardarOperacion(tipo: 'D' | 'M' | null = null) {
        if(!this.id_cliente_egreso && !this.id_cliente_ingreso){
            return this.ms.add({ severity: 'info', summary: 'Atención', detail: 'Por favor, seleccione un cliente para entrada o salida de mercadería' })
        }

        const cantIng = this.dataTablaArticulosRemitar.filter((e: ArticuloAsociado) => e.id_articulo).length
        const cantEgr = this.articulosOperacionIngreso.filter((e: ArticuloAsociado) => e.id_articulo).length
        
        if(!cantIng && !cantEgr){
            return this.ms.add({ severity: 'info', summary: 'Atención', detail: 'Por favor, seleccione al menos un artículo para Entrada o Salida' })
        }

        this.cs.getAll('operaciones/buscar/siguiente/' + this.operacion.punto, (ultNum: number) => {
            this.operacion.numero = ultNum

            this.cs.create('operaciones', this.operacion, (id_operacion_creado: any) => {
                this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Operacion creado con ID: ' + id_operacion_creado })
                this.operacion.id = id_operacion_creado
                //
                var artOpEgr = this.dataTablaArticulosRemitar.filter((e: ArticuloAsociado) => e.id_articulo).map((artIng: ArticuloAsociado) => {
                    const { id, ...resto } = artIng;

                    return {
                        ...resto,
                        ajuste: 'negativo',
                        documento: 'operaciones',
                        id_documento: id_operacion_creado
                    }
                })
                var artOpIng = this.articulosOperacionIngreso.filter((e: ArticuloAsociado) => e.id_articulo).map((artIng: ArticuloAsociado) => {
                    const { id, ...resto } = artIng;

                    return {
                        ...resto,
                        ajuste: 'positivo',
                        documento: 'operaciones',
                        id_documento: id_operacion_creado
                    }
                })

                this.cs.createMultiple('articulosAsociados', [ ...artOpEgr, ...artOpIng ], (mensaje: any) => {
                    this.ms.add({ severity: 'success', summary: 'Exito!', detail: mensaje.length + ' registros de articulos creados' })
                    this.actualizarDatosTabla()

                    if (tipo == 'D') {
                        this.descargarOperacion(id_operacion_creado)
                        this.visible_operacion = false
                    }
                    if (tipo == 'M') {
                        this.verOperacion(id_operacion_creado)
                        this.visible_operacion = false
                    }
                })

            })

        }, (err: any) => {
            this.ms.add({ severity: 'error', summary: 'Error obteniendo ultimo numero de operacion. No se guardará', detail: err.message })
        })
    }


    mostrarModalFiltro() {
        this.visible_filtros = true
    }

    buscarClienteIngresoPorCodigo() {
        if (!this.operacion.codigo_ingreso) {
            return this.ms.add({ severity: 'warn', summary: 'Atencion!', detail: 'Ingrese un CODIGO' })
        }

        this.buscandoCliente = 'ingreso'

        this.cs.getAll('clientes/codigo/' + this.operacion.codigo_ingreso, (data: Cliente) => {
            this.asignarClienteIngreso(data)
        }, (err: any) => {
            this.cs.getAll('clientes/buscar/' + this.operacion.codigo_ingreso, (data: Cliente[]) => {
                if (data.length == 1) {
                    this.asignarClienteIngreso(data[0])
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
    buscarClienteEgresoPorCodigo() {
        if (!this.operacion.codigo_egreso) {
            return this.ms.add({ severity: 'warn', summary: 'Atencion!', detail: 'Ingrese un CODIGO' })
        }

        this.buscandoCliente = 'egreso'

        this.cs.getAll('clientes/codigo/' + this.operacion.codigo_egreso, (data: Cliente) => {
            this.asignarClienteEgreso(data)
        }, (err: any) => {
            this.cs.getAll('clientes/buscar/' + this.operacion.codigo_egreso, (data: Cliente[]) => {
                if (data.length == 1) {
                    this.asignarClienteEgreso(data[0])
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
    asignarClienteIngreso(cliente: Cliente) {
        this.id_cliente_ingreso = cliente.id

        this.operacion.id_cliente_ingreso = cliente.id
        this.operacion.cuit_ingreso = cliente.cuit
        this.operacion.codigo_ingreso = cliente.codigo
        this.operacion.razon_social_ingreso = cliente.razon_social
        this.operacion.alias_ingreso = cliente.alias

        this.visible_cliente = false
    }
    asignarClienteEgreso(cliente: Cliente) {
        this.id_cliente_egreso = cliente.id

        this.operacion.id_cliente_egreso = cliente.id
        this.operacion.cuit_egreso = cliente.cuit
        this.operacion.codigo_egreso = cliente.codigo
        this.operacion.razon_social_egreso = cliente.razon_social
        this.operacion.alias_egreso = cliente.alias

        this.visible_cliente = false
    }


    filtroCliente() {
        this.clientesFiltrados = this.clientes.filter((cliente: Cliente) => { return cliente.razon_social.toLocaleUpperCase().includes(this.searchValue_cliente.toLocaleUpperCase()) || cliente.alias.toLocaleUpperCase().includes(this.searchValue_cliente.toLocaleUpperCase()) })
    }
    filtroArticulo() {
        this.articulosFiltrados = this.articulos.filter((articulo: Articulo) => { return articulo.descripcion.toLocaleUpperCase().includes(this.searchValue_articulo.toLocaleUpperCase()) })
    }
    filtroArticuloEgreso() {
        this.dataTablaArticulos = this.dataArticulosRemitar.filter((articulo: any) => { return articulo.codigo.toLocaleUpperCase().includes(this.searchValue_articuloEgreso.toLocaleUpperCase()) || articulo.descripcion.toLocaleUpperCase().includes(this.searchValue_articuloEgreso.toLocaleUpperCase()) || articulo.lote.toLocaleUpperCase().includes(this.searchValue_articuloEgreso.toLocaleUpperCase()) })
    }


    //ARTICULOS
    agregarArticulosIngreso() {
        if (this.articulosOperacionIngreso.some((art: ArticuloAsociado) => { return !art.id_articulo })) {
            return this.ms.add({ severity: 'info', summary: 'Atencion!', detail: 'Existen Complete los datos vacios' })
        }

        let ultimoId = this.articulosOperacionIngreso.reduce((max: number, curr: ArticuloAsociado) => {
            return parseInt(curr.id) > max ? parseInt(curr.id) : max
        }, 0)

        this.articulosOperacionIngreso.push({
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
            documento: 'operaciones',
            datos: {},
            estado: 1,
            createdBy: '',
            updatedBy: '',
            createdAt: '',
            updatedAt: ''
        })
    }
    agregarArticulosEgreso() {
        if (this.articulosOperacionEgreso.some((art: ArticuloAsociado) => { return !art.id_articulo })) {
            return this.ms.add({ severity: 'info', summary: 'Atencion!', detail: 'Existen Complete los datos vacios' })
        }

        let ultimoId = this.articulosOperacionEgreso.reduce((max: number, curr: ArticuloAsociado) => {
            return parseInt(curr.id) > max ? parseInt(curr.id) : max
        }, 0)

        this.articulosOperacionEgreso.push({
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
            ajuste: 'negativo',
            documento: 'operaciones',
            datos: {},
            estado: 1,
            createdBy: '',
            updatedBy: '',
            createdAt: '',
            updatedAt: ''
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
                        ajuste: 'positivo',
                        documento: 'operaciones',
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

    }
    eliminarArticuloIngreso(id: string) {
        this.articulosOperacionIngreso = this.articulosOperacionIngreso.filter((art: ArticuloAsociado) => { return art.id != id });
    }
    eliminarArticuloEgreso(id: string) {
        this.articulosOperacionEgreso = this.articulosOperacionEgreso.filter((art: ArticuloAsociado) => { return art.id != id });
    }

    //DOCUMENTOS
    agregarDocumento() {
        let ultimoId = this.operacion.datos.documentos?.reduce((max: number, curr: any) => {
            return curr.id > max ? curr.id : max
        }, 0)

        this.operacion.datos.documentos?.push({
            id: ultimoId ? ultimoId + 1 : 1,
            tipo: 'remito',
            letra: 'R',
            punto: 1,
            numero: 1,
            fecha: this.fechaHoy()
        })
    }
    eliminarDocumento(id: any) {
        if (this.operacion.datos.documentos?.length) {
            this.operacion.datos.documentos = this.operacion.datos.documentos.filter((e: any) => e.id != id)
        }
    }



    //ARTICULOS EGRESOS:
    mostrarModalAsociarArticulos(){
        this.visible_articulo_egreso = true
        this.buscarArticulosParaRemitar()
    }
    buscarArticulosParaRemitar(){
        const selectedClientes = [ this.id_cliente_egreso ]

        this.cs.getAllPost(`operaciones/articulosRemito`, { id_clientes: selectedClientes }, (e: any) => {
            this.dataArticulosRemitar = e.map((f:any) => {
                return {
                    ...f,
                    numeroDocumento: this.mostrarDocumento(f.punto, f.numero),
                    deposito: this.obtenerDescripcionDeposito(f.id_deposito),
                    unidadMedida: this.obtenerDescripcionUnidadMedida(f.id_unidadMedida)
                }
            })

            this.filtroArticuloEgreso()
        })
    }
    setearArticulosSeleccionados(){
        this.dataTablaArticulosRemitar = this.dataArticulosRemitar.filter((e:any) => e.cantidadRemitar).map((e:any) => {
            return {
                ...e,
                documento: 'operaciones',
                ajuste: "negativo",
                cantidad: e.cantidadRemitar,
                cantidadUnidadFundamental: e.cantidadRemitarUnidadFundamental,
                id_original: e.id
            }
        })

        this.visible_articulo_egreso = false
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
    seleccionarDevolverTodoRemito(art: any = null) {
        if (art) {
            var articuloDB = this.dataArticulosRemitar.find((e:any) => e.id == art.id )

            articuloDB.cantidadRemitar = art.cantidad
            articuloDB.cantidadRemitarUnidadFundamental = art.cantidadUnidadFundamental

            art.cantidadRemitar = art.cantidad
            art.cantidadRemitarUnidadFundamental = art.cantidadUnidadFundamental
        } else {
            this.dataTablaArticulos.forEach((art: any) => {
                var articuloDB = this.dataArticulosRemitar.find((e:any) => e.id == art.id )

                articuloDB.cantidadRemitar = art.cantidad
                articuloDB.cantidadRemitarUnidadFundamental = art.cantidadUnidadFundamental
                
                art.cantidadRemitar = art.cantidad
                art.cantidadRemitarUnidadFundamental = art.cantidadUnidadFundamental
            })
        }
    }
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

    calcularUnidadFundamental(art: ArticuloAsociado) {
        if(art.cantidad < 0) art.cantidad = 0;

        art.cantidadUnidadFundamental = Math.round(art.cantidad * art.cantidadPorUnidadFundamental * 100) / 100
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
    guardarFechas() {
        localStorage.setItem('stock_operacionesFechaFiltroDesde', this.fechaFiltroDesde)
        localStorage.setItem('stock_operacionesFechaFiltroHasta', this.fechaFiltroHasta)
        this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Fechas guardadas' })
    }

    //INFORMES
    listadoXLSX() {
        this.xlsx.downloadExcelListado({ datos: this.dataTabla, fecha: this.fechasFiltradas, clientes: this.clienteFiltrados }, 'INGRESOS');
    }
    detalleXLSX() {
        var user = this.as.isUser()
        this.xlsx.downloadExcelDetalle({ datos: this.dataTabla, fecha: this.fechasFiltradas, clientes: this.clienteFiltrados, usuario: user.descripcion }, 'INGRESOS');
    }
    datosXLSX() {
        this.xlsx.downloadExcelDatos({ datos: this.dataTabla, fecha: this.fechasFiltradas, clientes: this.clienteFiltrados }, 'INGRESOS');
    }
}