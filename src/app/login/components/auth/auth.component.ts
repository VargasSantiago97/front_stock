import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-auth',
    standalone: true,
    imports: [ButtonModule, FormsModule],
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.css'
})
export class AuthComponent {
    user: any = ''
    password: any = ''

    constructor(
        private auth: AuthService
    ){}

    ngOnInit() {
        if (localStorage.getItem('stock_user')) {
            this.user = localStorage.getItem('stock_user')
        }
    }

    autentificar() {
        if (this.user) { localStorage.setItem('stock_user', this.user) }

        this.auth.crearSesion(this.user, this.password)
        
    }

    preventDefault(e: any = null) {
        if (e) { e.preventDefault() }
    }
}
