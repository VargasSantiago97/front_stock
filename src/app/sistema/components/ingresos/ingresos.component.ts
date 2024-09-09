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

@Component({
    selector: 'app-ingresos',
    standalone: true,
    imports: [TableModule, ButtonModule, DialogModule, CommonModule, DropdownModule, DividerModule, FormsModule, ProgressSpinnerModule, InputTextModule, InputGroupModule, InputGroupAddonModule],
    templateUrl: './ingresos.component.html',
    styleUrl: './ingresos.component.css'
})
export class IngresosComponent {

    visible_ingreso: boolean = true

    ingreso: any = {
        id: 0,
        numero: 123,
        punto: 2
    }


    id_cliente: string = ''
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

    actualizarDatosTabla() {
        //
    }



    mostrarModalIngreso(id: any = undefined) {
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
                punto: 2
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



    buscarAutorizados() {
        this.cs.getAll('autorizados/' + this.id_cliente, (data: Autorizado[]) => {
            this.autorizados = data
        })
    }
    buscarTransporte() {
        this.cs.getAll('transportes/' + this.id_cliente, (data: Transporte[]) => {
            this.transportes = data
        })
    }
    buscarEstablecimientos() {
        this.cs.getAll('establecimientos/' + this.id_cliente, (data: Establecimiento[]) => {
            this.establecimientos = data
        })
    }

}