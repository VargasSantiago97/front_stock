import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../login/services/auth.service';

@Component({
    selector: 'app-sistema',
    standalone: true,
    imports: [RouterOutlet],
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

        this.router.navigate(['/sistema/' + ruta])
    }
}
