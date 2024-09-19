import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConsultasService } from '../../services/consultas.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
    selector: 'app-stock',
    standalone: true,
    imports: [ProgressSpinnerModule],
    templateUrl: './stock.component.html',
    styleUrl: './stock.component.css'
})
export class StockComponent {

    visible_scroll: boolean = true

    id_cliente: string | null = '';
    cliente: string = ''

    constructor(
        private route: ActivatedRoute,
        private cs: ConsultasService
    ) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.id_cliente = params.get('id_cliente');
            console.log(this.id_cliente);

            if(this.id_cliente){
                this.cs.getAll('clientes/' + this.id_cliente, (datos:any) => {
                    console.log(datos.razon_social)
    
                    this.cliente = datos.razon_social
                })
            }

        });

        setTimeout(() => { this.visible_scroll = false }, 200)
    }
}
