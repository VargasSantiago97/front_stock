import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';
import { PadronService } from '../../services/padron.service';
import { FormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-clientes',
    standalone: true,
    imports: [TableModule, ButtonModule, DialogModule, CommonModule, DropdownModule, DividerModule, FormsModule, ProgressSpinnerModule],
    templateUrl: './clientes.component.html',
    styleUrl: './clientes.component.css'
})
export class ClientesComponent {
    products!: any[];
    visible: boolean = false;
    spinnerCUIT: boolean = false;

    cliente: any = {}

    autorizados: any = [1, 2, 3]

    constructor(
        private padron: PadronService,
        private ms: MessageService
    ) { }

    ngOnInit() {
        this.products = [
            {
                code: 123,
                name: 'prod',
                category: 'cat',
                quantity: 'cant'
            },
            {
                code: 123,
                name: 'prod',
                category: 'cat',
                quantity: 'cant'
            },
            {
                code: 123,
                name: 'prod',
                category: 'cat',
                quantity: 'cant'
            },
            {
                code: 123,
                name: 'prod',
                category: 'cat',
                quantity: 'cant'
            },
            {
                code: 123,
                name: 'prod',
                category: 'cat',
                quantity: 'cant'
            },
            {
                code: 123,
                name: 'prod',
                category: 'cat',
                quantity: 'cant'
            },
            {
                code: 123,
                name: 'prod',
                category: 'cat',
                quantity: 'cant'
            },
            {
                code: 123,
                name: 'prod',
                category: 'cat',
                quantity: 'cant'
            },
            {
                code: 123,
                name: 'prod',
                category: 'cat',
                quantity: 'cant'
            },
            {
                code: 123,
                name: 'prod',
                category: 'cat',
                quantity: 'cant'
            },
            {
                code: 123,
                name: 'prod',
                category: 'cat',
                quantity: 'cant'
            },
            {
                code: 123,
                name: 'prod',
                category: 'cat',
                quantity: 'cant'
            },
            {
                code: 123,
                name: 'prod',
                category: 'cat',
                quantity: 'cant'
            },
            {
                code: 123,
                name: 'prod',
                category: 'cat',
                quantity: 'cant'
            },
            {
                code: 123,
                name: 'prod',
                category: 'cat',
                quantity: 'cant'
            },
            {
                code: 123,
                name: 'prod',
                category: 'cat',
                quantity: 'cant'
            },
            {
                code: 123,
                name: 'prod',
                category: 'cat',
                quantity: 'cant'
            },
            {
                code: 123,
                name: 'prod',
                category: 'cat',
                quantity: 'cant'
            },
            {
                code: 123,
                name: 'prod',
                category: 'cat',
                quantity: 'cant'
            },
            {
                code: 123,
                name: 'prod',
                category: 'cat',
                quantity: 'cant'
            },
            {
                code: 123,
                name: 'prod',
                category: 'cat',
                quantity: 'cant'
            },
            {
                code: 123,
                name: 'prod',
                category: 'cat',
                quantity: 'cant'
            },
            {
                code: 123,
                name: 'prod',
                category: 'cat',
                quantity: 'cant'
            },
            {
                code: 123,
                name: 'prod',
                category: 'cat',
                quantity: 'cant'
            },
            {
                code: 123,
                name: 'prod',
                category: 'cat',
                quantity: 'cant'
            },
            {
                code: 123,
                name: 'prod',
                category: 'cat',
                quantity: 'cant'
            },
            {
                code: 123,
                name: 'prod',
                category: 'cat',
                quantity: 'cant'
            },
            {
                code: 123,
                name: 'prod',
                category: 'cat',
                quantity: 'cant'
            },
            {
                code: 123,
                name: 'prod',
                category: 'cat',
                quantity: 'cant'
            },
            {
                code: 123,
                name: 'prod',
                category: 'cat',
                quantity: 'cant'
            },
            {
                code: 123,
                name: 'prod',
                category: 'cat',
                quantity: 'cant'
            },
            {
                code: 123,
                name: 'prod',
                category: 'cat',
                quantity: 'cant'
            },
            {
                code: 123,
                name: 'prod',
                category: 'cat',
                quantity: 'cant'
            }
        ]
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

    agregarAutorizado(){
        this.autorizados.push(1)
    }

}
