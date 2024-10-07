import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConsultasService } from '../../services/consultas.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-stock',
    standalone: true,
    imports: [ProgressSpinnerModule, FormsModule],
    templateUrl: './stock.component.html',
    styleUrl: './stock.component.css'
})
export class StockComponent {

    visible_scroll: boolean = true

    id_cliente: string | null = '';
    cliente: string = ''

    dataTabla: any = []

    fechaFiltroDesde: string = ''
    fechaFiltroHasta: string = ''
    selectedClientes: any = [
        '43e4eb6b-959e-47aa-b242-a05bf3d36ed0'
    ]
    selectedDepositos: any = []

    value_um: string = "um";

    constructor(
        private route: ActivatedRoute,
        private cs: ConsultasService
    ) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.id_cliente = params.get('id_cliente');

            if(this.id_cliente){
                this.cs.getAll('clientes/' + this.id_cliente, (datos:any) => {
                    this.cliente = datos.razon_social
                })
            }

        });

        setTimeout(() => {
            this.visible_scroll = false
            this.actualizarTabla()
        }, 500)
    }

    actualizarTabla(){
        this.cs.getAllPost(`operaciones/stock`, { fechaDesde: this.fechaFiltroDesde, fechaHasta: this.fechaFiltroHasta, clientes: this.selectedClientes, depositos: this.selectedDepositos }, (e: any) => {
            this.dataTabla = e
    
            console.log(e)
        })
    }

    mostrarNumero(ent: any) {
        var numero = ''
        try {
            numero = ent.toLocaleString('es-ES', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true
            })
        } catch {
            numero = ent
        }
        return numero
    }
}
