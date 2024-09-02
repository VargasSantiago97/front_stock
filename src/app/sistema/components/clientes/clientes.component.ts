import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-clientes',
    standalone: true,
    imports: [TableModule],
    templateUrl: './clientes.component.html',
    styleUrl: './clientes.component.css'
})
export class ClientesComponent {
    products!: any[];

    ngOnInit(){
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
            }
        ]
    }
}
