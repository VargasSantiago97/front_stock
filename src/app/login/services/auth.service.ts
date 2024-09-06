import { HttpClient } from '@angular/common/http';
import { Injectable, input } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

declare var vars: any;

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    AUTH_URI = vars.AUTH_URI;

    isAuthenticated: any
    user: any

    mensajeSesionActivado: boolean = false

    constructor(
        private http: HttpClient,
        private messageService: MessageService,
        private router: Router
    ) {
        this.existeSesion()
    }

    alertarProntoCierreDeSesion(){
        let user = sessionStorage.getItem('stock_user')
        let password = prompt('ATENCIÓN, LA SESIÓN ESTÁ POR CADUCAR. POR FAVOR, REINGRESE SU CONTRASEÑA.\n\nUSER: ' + user)

        if(password){
            this.crearSesion(user, password, false)
        } else {
            setTimeout(() => {
                this.isLoggedIn() ? null : this.cerrarSesion()
            }, 10000)
        }
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


        //SETEAR MENSAJE PARA ANTICIPAR CIERRE DE SESION.
        if(this.isAuthenticated && !this.mensajeSesionActivado){
            this.mensajeSesionActivado = true

            setTimeout(() => {
                this.alertarProntoCierreDeSesion()
            }, exp-ya-10000)
        }


        sessionStorage.setItem('stock_user_id', objetoJSON.sub)
        sessionStorage.setItem('stock_user', objetoJSON.user)
        sessionStorage.setItem('stock_permisos', objetoJSON.permisos)

        return ya < exp
    }

    crearSesion(user: any, pass: any, redirrecionar: boolean = true) {
        this.http.post(`${this.AUTH_URI}/login`, { user: user, password: pass }).subscribe(
            (res: any) => {
                if (res.ok) {
                    sessionStorage.setItem('stock_session', 'ok')
                    sessionStorage.setItem('stock_token', res.mensaje)

                    this.existeSesion()

                    this.mensajeSesionActivado = false

                    if(redirrecionar){
                        this.router.navigate(['/']);
                    }
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
