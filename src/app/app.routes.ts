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
            { path: 'inicio', component: InicioComponent, canActivate: [AuthGuard] },
            { path: 'clientes', component: ClientesComponent, canActivate: [AuthGuard] },
            { path: 'productos', component: ProductosComponent, canActivate: [AuthGuard] },
            { path: 'ingresos', component: IngresosComponent, canActivate: [AuthGuard] },
            { path: 'egresos', component: EgresosComponent, canActivate: [AuthGuard] },
            { path: 'stock', component: StockComponent, canActivate: [AuthGuard] },
            { path: 'depositos', component: DepositosComponent, canActivate: [AuthGuard] }
        ],
        canActivate: [AuthGuard]
    },
    {
        path: 'auth', component: AuthComponent
    },

    { path: 'notfound', component: NotfoundComponent },
    { path: '**', redirectTo: '/notfound' }
];
