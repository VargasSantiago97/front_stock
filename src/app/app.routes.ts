import { Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';

import { AuthComponent } from './login/components/auth/auth.component';
import { NotfoundComponent } from './login/components/notfound/notfound.component';
import { InicioComponent } from './sistema/components/inicio/inicio.component';
import { SistemaComponent } from './sistema/sistema.component';
import { ClientesComponent } from './sistema/components/clientes/clientes.component';
import { ProductosComponent } from './sistema/components/productos/productos.component';
import { IngresosComponent } from './sistema/components/ingresos/ingresos.component';
import { EgresosComponent } from './sistema/components/egresos/egresos.component';
import { StockComponent } from './sistema/components/stock/stock.component';
import { DepositosComponent } from './sistema/components/depositos/depositos.component';

export const routes: Routes = [
    { path: '', redirectTo: '/sistema', pathMatch: 'full' },
    { 
        path: 'sistema', component: SistemaComponent, 
        children: [
            { path: '', redirectTo: '/sistema/inicio', pathMatch: 'full' },
            { path: 'inicio', component: InicioComponent },
            { path: 'clientes', component: ClientesComponent },
            { path: 'productos', component: ProductosComponent },
            { path: 'ingresos', component: IngresosComponent },
            { path: 'egresos', component: EgresosComponent },
            { path: 'stock', component: StockComponent },
            { path: 'depositos', component: DepositosComponent }
        ],
        canActivate: [AuthGuard]
    },
    {
        path: 'auth', component: AuthComponent
    },

    { path: 'notfound', component: NotfoundComponent },
    { path: '**', redirectTo: '/notfound' }
];
