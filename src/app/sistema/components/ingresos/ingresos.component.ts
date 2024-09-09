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


@Component({
    selector: 'app-ingresos',
    standalone: true,
    imports: [TableModule, ButtonModule, DialogModule, CommonModule, DropdownModule, DividerModule, FormsModule, ProgressSpinnerModule, InputTextModule, InputGroupModule, InputGroupAddonModule, InputTextareaModule],
    templateUrl: './ingresos.component.html',
    styleUrl: './ingresos.component.css'
})
export class IngresosComponent {

    pestActiva: string = ''

    visible_ingreso: boolean = false
    visible_cliente: boolean = false
    visible_autorizado: boolean = false
    visible_transporte: boolean = false
    visible_establecimiento: boolean = false

    searchValue_cliente: string = ''
    searchValue_autorizado: string = ''
    searchValue_transporte: string = ''
    searchValue_establecimiento: string = ''

    ingreso: any = {
        id: 0,
        numero: 123,
        punto: 2
    }


    clientes: Cliente[] = []
    clientesFiltrados: Cliente[] = []

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

    constructor(
        private padron: PadronService,
        private ms: MessageService,
        private cs: ConsultasService
    ) { }

    ngOnInit() {
        this.actualizarDatosTabla()
    }

    pestana(pes:string, e:any){
        e.preventDefault()
        this.pestActiva = pes
    }

    actualizarDatosTabla() {
        //
    }



    mostrarModalIngreso(id: any = undefined) {
        this.pestActiva = 'cliente'
        if (id) {
            //buscar datos remito
            //setear no modificable
        } else {
            const fechaActual = new Date();
            const ano = fechaActual.getFullYear();
            const mes = ('0' + (fechaActual.getMonth() + 1)).slice(-2);
            const dia = ('0' + fechaActual.getDate()).slice(-2);

            this.ingreso = {
                fecha: `${ano}-${mes}-${dia}`,
                numero: 123,
                punto: 2,
                modelo: 1
            }
        }
        this.visible_ingreso = true
    }
    guardarIngreso() {
        //if (this.cliente.id) {
        //    this.cs.update('clientes', this.cliente, (cant: any) => {
        //        this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Registros editados: ' + cant[0] })
        //        this.actualizarDatosTabla()
        //    })
        //} else {
        //    this.cs.create('clientes', this.cliente, (id: any) => {
        //        this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Cliente creado con ID: ' + id })
        //        this.actualizarDatosTabla()
        //    })
        //}

        console.log(this.ingreso)
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

        if(continua){
            this.buscarAutorizados()
        }
    }
    asignarAutorizado(autorizado: Autorizado | undefined, continua: boolean = true) {

        this.ingreso.id_autorizado = autorizado?.id
        this.ingreso.autorizado_descripcion = autorizado?.descripcion
        this.ingreso.autorizado_documento = autorizado?.documento
        this.ingreso.autorizado_contacto = autorizado?.contacto

        this.visible_autorizado = false

        if(continua){
            this.buscarTransportes()
        }
    }
    asignarTransporte(transporte: Transporte | undefined, continua: boolean = true){
        this.ingreso.id_transporte = transporte?.id
        this.ingreso.transporte_transporte = transporte?.transporte
        this.ingreso.transporte_cuit_transporte = transporte?.cuit_transporte
        this.ingreso.transporte_chofer = transporte?.chofer
        this.ingreso.transporte_cuit_chofer = transporte?.cuit_chofer
        this.ingreso.transporte_patente_chasis = transporte?.patente_chasis
        this.ingreso.transporte_patente_acoplado = transporte?.patente_acoplado

        this.visible_transporte = false

        if(continua){
            this.buscarEstablecimientos()
        }
    }
    asignarEstablecimiento(establecimiento: Establecimiento | undefined){
        this.ingreso.id_establecimiento = establecimiento?.id
        this.ingreso.establecimiento_descripcion = establecimiento?.descripcion
        this.ingreso.establecimiento_localidad = establecimiento?.localidad
        this.ingreso.establecimiento_provincia = establecimiento?.provincia

        this.visible_establecimiento = false
    }

    filtroCliente() {
        this.clientesFiltrados = this.clientes.filter((cliente: Cliente) => { return cliente.razon_social.toLocaleUpperCase().includes(this.searchValue_cliente.toLocaleUpperCase()) || cliente.alias.toLocaleUpperCase().includes(this.searchValue_cliente.toLocaleUpperCase()) })
    }
    filtroAutorizado() {
        this.autorizadosFiltrados = this.autorizados.filter((autorizado: Autorizado) => { return autorizado.descripcion.toLocaleUpperCase().includes(this.searchValue_autorizado.toLocaleUpperCase()) })
    }
    filtroTransporte(){
        this.transportesFiltrados = this.transportes.filter((transporte: Transporte) => { return transporte.transporte.toLocaleUpperCase().includes(this.searchValue_transporte.toLocaleUpperCase()) || transporte.chofer.toLocaleUpperCase().includes(this.searchValue_transporte.toLocaleUpperCase()) || transporte.patente_chasis.toLocaleUpperCase().includes(this.searchValue_transporte.toLocaleUpperCase()) || transporte.patente_acoplado.toLocaleUpperCase().includes(this.searchValue_transporte.toLocaleUpperCase()) })
    }
    filtroEstablecimiento(){
        this.establecimientosFiltrados = this.establecimientos.filter((establecimiento: Establecimiento) => { return establecimiento.descripcion.toLocaleUpperCase().includes(this.searchValue_establecimiento.toLocaleUpperCase()) })
    }


    buscarAutorizados(mostrar: boolean = false) {
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

}