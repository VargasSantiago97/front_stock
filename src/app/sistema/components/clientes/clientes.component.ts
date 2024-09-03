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
import { Cliente } from '../../interfaces/clientes';
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

    cliente: Cliente = {
        alias: '',
        id: '',
        cuit: 0,
        razon_social: '',
        direccion: '',
        localidad: '',
        provincia: '',
        codigo_postal: '',
        datos: {},
        estado: 0,
        createdBy: '',
        updatedBy: '',
        createdAt: '',
        updatedAt: ''
    }
    clientes: Cliente[] = [];

    autorizados: any = []
    transportes: any = []
    establecimientos: any = []

    constructor(
        private padron: PadronService,
        private ms: MessageService,
        private cs: ConsultasService
    ) { }

    ngOnInit() {
        this.cs.getAll('clientes', (clientes:Cliente[]) => { this.clientes = clientes; console.log(clientes) })
    }

    showDialog() {
        this.visible = true;
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

    mostrarModalCliente(cliente:Cliente){
        this.cliente = cliente
        this.visible = true
    }




    agregarAutorizado(){
        this.autorizados.push(1)
    }
    agregarTransporte(){
        this.transportes.push(1)
    }
    agregarEstablecimiento(){
        this.establecimientos.push(1)
    }
}