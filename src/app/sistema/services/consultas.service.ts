import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

declare var vars: any;

@Injectable({
    providedIn: 'root'
})
export class ConsultasService {

    API_URI = vars.API_URI;

    constructor(
        private http: HttpClient,
        private ms: MessageService
    ) { }

    private api_getAll(tabla: string) {
        let token = sessionStorage.getItem('stock_token');

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(`${this.API_URI}/${tabla}`, { headers })
    }

    getAll(tabla: string, fn: any = null) {

        this.api_getAll(tabla).subscribe(
            (res:any) => {
                if(res.mensaje){
                    fn(res.mensaje)
                } else {
                    this.ms.add({ severity: 'error', summary: 'Error!', detail: 'El servidor envio respuesta incorrecta' })
                }
            },
            (err:any) => {
                this.ms.add({ severity: 'error', summary: 'Error!', detail: err.message })
                console.error(err)
            }
        )
    }




}
