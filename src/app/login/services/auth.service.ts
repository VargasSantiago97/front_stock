import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

declare var vars: any;

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    API_URI = vars.API_URI;

    isAuthenticated: any
    user: any

    constructor(
        private http: HttpClient,
        private messageService: MessageService,
        private router: Router
    ) {
        this.existeSesion()
    }

    existeSesion() {
        const token: any = sessionStorage.getItem('stock_token')

        if (!token) { return false }

        const info: any = token.split('.');

        if (!info) { return false }

        if (!info[1]) { return false }

        try {
            atob(info[1])
        } catch (error) {
            return false
        }


        // Decodificar la primera parte en Base64
        const primeraParteDecodificada = atob(info[1]);

        if (!primeraParteDecodificada) { return false }

        // Convertir la cadena decodificada a un objeto JSON
        const objetoJSON = JSON.parse(primeraParteDecodificada);

        if (!objetoJSON) { return false }


        const ya = Date.now()
        const exp = objetoJSON.exp

        this.isAuthenticated = ya < exp;
        this.user = objetoJSON

        localStorage.setItem('stock_user_id', objetoJSON.sub)
        localStorage.setItem('stock_permisos', objetoJSON.permisos)

        return ya < exp
    }

    crearSesion(user: any, pass: any) {
        this.http.post(`${this.API_URI}/login`, { user: user, password: pass }).subscribe(
            (res: any) => {
                if (res.ok) {
                    this.setearSesionOk(res.mensaje)
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error!', detail: res.mensaje })
                    console.error(res)
                }
            },
            (err: any) => {
                console.error(err)
                if (err.status == 400) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Usuario/Contraseña incorrecta' })
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error conectando a backend!', detail: err.message })
                }
            }
        )
    }

    setearSesionOk(token: any) {
        sessionStorage.setItem('stock_session', 'ok')
        sessionStorage.setItem('stock_token', token)

        this.existeSesion()
        this.router.navigate(['/']);
    }

    cerrarSesion(){
        sessionStorage.clear()
  
        this.isAuthenticated = false;
  
        this.router.navigate(['/auth']);
    }

    isLoggedIn(): boolean {
        this.existeSesion()
        //return true;
        return this.isAuthenticated;
    }
    isUser() {
        return this.user;
    }

}
