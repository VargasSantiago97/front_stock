import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../login/services/auth.service';
import { DockModule } from 'primeng/dock';

@Component({
    selector: 'app-sistema',
    standalone: true,
    imports: [RouterOutlet, DockModule],
    templateUrl: './sistema.component.html',
    styleUrl: './sistema.component.css'
})
export class SistemaComponent {

    user: any

    constructor(
        private authService: AuthService,
        private router: Router
    ){}

    ngOnInit(){
        this.user = this.authService.isUser()
    }

    cerrarSesion(){
        this.authService.cerrarSesion()
    }

    navigate(ruta:any, e:any = null){
        if(e) e.preventDefault();

        document.title = 'STOCK - ' + ruta.toLocaleUpperCase();

        this.router.navigate(['/sistema/' + ruta])
    }
}
