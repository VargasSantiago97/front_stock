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


@Component({
    selector: 'app-clientes',
    standalone: true,
    imports: [TableModule, ButtonModule, DialogModule, CommonModule, DropdownModule, DividerModule, FormsModule, ProgressSpinnerModule, InputTextModule],
    templateUrl: './clientes.component.html',
    styleUrl: './clientes.component.css'
})

export class ClientesComponent {
    searchValue: string | undefined;

    visible: boolean = false;
    spinnerCUIT: boolean = false;

    cliente_nuevo: Cliente = {
        alias: '',
        id: '',
        cuit: 0,
        codigo: '',
        razon_social: '',
        direccion: '',
        localidad: '',
        provincia: '',
        codigo_postal: '',
        datos: {},
        estado: 1,
        createdBy: '',
        updatedBy: '',
        createdAt: '',
        updatedAt: '',
        telefono: '',
        correo: ''
    }
    cliente: Cliente = { ...this.cliente_nuevo }
    clientes: Cliente[] = [];

    autorizados: Autorizado[] = []
    transportes: Transporte[] = []
    establecimientos: Establecimiento[] = []

    constructor(
        private padron: PadronService,
        private ms: MessageService,
        private cs: ConsultasService
    ) { }

    ngOnInit() {
        this.actualizarDatosTabla()
    }

    actualizarDatosTabla(){
        this.cs.getAll('clientes', (clientes:Cliente[]) => { this.clientes = clientes })
        this.visible = false
    }


    buscarCUIT() {
        this.spinnerCUIT = true
        this.padron.consultaPadron(this.cliente.cuit).subscribe(
            (res: any) => {
                this.spinnerCUIT = false

                if (!res) {
                    this.ms.add({ severity: 'error', summary: 'Error!', detail: 'Verifique los datos ingresados' })
                }

                console.log(res)

                var sugiereAlias = ''
                if (res.tipoPersona == 'FISICA') {
                    if(res.nombre){
                        this.cliente.razon_social = res.apellido + ' ' + res.nombre
                        sugiereAlias = res.apellido + ', ' + res.nombre
                    } else {
                        this.cliente.razon_social = res.apellido
                        sugiereAlias = res.apellido
                    }
                } else {
                    this.cliente.razon_social = res.razonSocial
                    sugiereAlias = res.razonSocial
                }

                console.log(this.cliente)

                if (this.cliente.alias == '' || this.cliente.alias == null) {
                    this.cliente.alias = sugiereAlias
                }


                if (res.domicilio.length) {
                    let domicilio = res.domicilio.find((e: any) => { return e.tipoDomicilio == 'LEGAL/REAL' })
                    if (domicilio) {
                        this.cliente.direccion = domicilio.direccion
                        this.cliente.localidad = domicilio.localidad
                        this.cliente.codigo_postal = domicilio.codigoPostal
                        this.cliente.provincia = domicilio.descripcionProvincia
                    }
                } else if (res.domicilio.tipoDomicilio == 'LEGAL/REAL') {
                    this.cliente.direccion = res.domicilio.direccion
                    this.cliente.localidad = res.domicilio.localidad
                    this.cliente.codigo_postal = res.domicilio.codigoPostal
                    this.cliente.provincia = res.domicilio.descripcionProvincia
                }
            },
            (err: any) => {
                console.error(err)
                this.ms.add({ severity: 'error', summary: 'Error!', detail: 'Error conectando a Backend (AFIP)' })
                this.spinnerCUIT = false
            }
        )
    }

    clear(table: Table) {
        table.clear();
        this.searchValue = ''
    }

    mostrarModalCliente(id:any = undefined){
        if(id){
            this.cliente = { ... this.clientes.find((e:any) => { return e.id == id })! }

            this.buscarAutorizados(id)
            this.buscarTransporte(id)
            this.buscarEstablecimientos(id)
        } else {
            this.cliente = { ...this.cliente_nuevo }
            this.autorizados = []
            this.transportes = []
            this.establecimientos = []
        }
        this.visible = true
    }
    guardarCambiosCliente(){
        if(this.cliente.id){
            this.cs.update('clientes', this.cliente, (cant:any) => {
                this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Registros editados: ' + cant[0] })
                this.actualizarDatosTabla()
            })
        } else {
            this.cs.create('clientes', this.cliente, (id:any) => {
                this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Cliente creado con ID: ' + id })
                this.actualizarDatosTabla()
            })
        }
    }
    eliminarCliente(id:string){
        this.cs.delete('clientes', id, (cant:any) => {
            this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Registros borrados: ' + cant[0] })
            this.actualizarDatosTabla()
        })
    }



    buscarAutorizados(id_cliente:string){
        this.cs.getAll('autorizados/' + id_cliente, (data:Autorizado[]) => {
            this.autorizados = data
        })
    }
    agregarAutorizado(){
        this.autorizados.push({
            id: '',
            id_cliente: this.cliente.id,
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
        })
    }
    guardarAutorizado(autorizado:Autorizado){
        if(autorizado.id){
            this.cs.update('autorizados', autorizado, (cant:any) => {
                this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Registros editados: ' + cant[0] })
            })
        } else {
            this.cs.create('autorizados', autorizado, (id:any) => {
                this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Autorizado creado con ID: ' + id })
                autorizado.id = id
            })
        }
    }
    eliminarAutorizado(id:string){
        this.cs.delete('autorizados', id, (cant:any) => {
            this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Registros borrados: ' + cant[0] })
            this.autorizados = this.autorizados.filter((aut:Autorizado) => { return aut.id != id })
        })
    }


    buscarTransporte(id_cliente:string){
        this.cs.getAll('transportes/' + id_cliente, (data:Transporte[]) => {
            this.transportes = data
        })
    }
    agregarTransporte(){
        this.transportes.push({
            id: '',
            id_cliente: this.cliente.id,
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
        })
    }
    guardarTransporte(transporte:Transporte){
        if(transporte.id){
            this.cs.update('transportes', transporte, (cant:any) => {
                this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Registros editados: ' + cant[0] })
            })
        } else {
            this.cs.create('transportes', transporte, (id:any) => {
                this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Transporte creado con ID: ' + id })
                transporte.id = id
            })
        }
    }
    eliminarTransporte(id:string){
        this.cs.delete('transportes', id, (cant:any) => {
            this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Registros borrados: ' + cant[0] })
            this.transportes = this.transportes.filter((transp:Transporte) => { return transp.id != id })
        })
    }


    buscarEstablecimientos(id_cliente:string){
        this.cs.getAll('establecimientos/' + id_cliente, (data:Establecimiento[]) => {
            this.establecimientos = data
        })
    }
    agregarEstablecimiento(){
        this.establecimientos.push({
            id: '',
            id_cliente: this.cliente.id,
            descripcion: '',
            localidad: '',
            provincia: '',
            datos: {},
            estado: 1,
            createdBy: '',
            updatedBy: '',
            createdAt: '',
            updatedAt: ''
        })
    }
    guardarEstablecimiento(establecimiento:Establecimiento){
        if(establecimiento.id){
            this.cs.update('establecimientos', establecimiento, (cant:any) => {
                this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Registros editados: ' + cant[0] })
            })
        } else {
            this.cs.create('establecimientos', establecimiento, (id:any) => {
                this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Establecimiento creado con ID: ' + id })
                establecimiento.id = id
            })
        }
    }
    eliminarEstablecimiento(id:string){
        this.cs.delete('establecimientos', id, (cant:any) => {
            this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Registros borrados: ' + cant[0] })
            this.establecimientos = this.establecimientos.filter((aut:Establecimiento) => { return aut.id != id })
        })
    }
}