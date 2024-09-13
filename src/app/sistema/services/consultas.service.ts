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

    //CONEXION DIRECTA A API
    private api_getAll(tabla: string) {
        let token = sessionStorage.getItem('stock_token');

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(`${this.API_URI}/${tabla}`, { headers })
    }
    private api_create(tabla: string, datos: any) {
        let token = sessionStorage.getItem('stock_token');

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.post(`${this.API_URI}/${tabla}`, datos, { headers })
    }
    private api_update(tabla: string, datos: any) {
        let token = sessionStorage.getItem('stock_token');

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.put(`${this.API_URI}/${tabla}/${datos.id}`, datos, { headers })
    }
    private api_delete(tabla: string, id: string) {
        let token = sessionStorage.getItem('stock_token');

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.delete(`${this.API_URI}/${tabla}/${id}`, { headers })
    }

    //FUNCIONES PUBLICAS

    /**ASD
     * CONSULTA A BASE DE DATOS
     * @param tabla 
     * @param fn_ok [CALLBACK INFO]
     * @param fn_error  [OPCIONAL]
     */
    public getAll(tabla: string, fn_ok: any, fn_error: any = null) {

        this.api_getAll(tabla).subscribe(
            (res: any) => {
                if (res.mensaje) {
                    fn_ok(res.mensaje)
                } else {
                    this.ms.add({ severity: 'error', summary: 'Error!', detail: 'El servidor envio respuesta incorrecta' })
                }
            },
            (err: any) => {
                if (fn_error) {
                    fn_error(err)
                } else {
                    this.ms.add({ severity: 'error', summary: 'Error!', detail: err.message })
                    console.error(err)
                }
            }
        )
    }
    public create(tabla: string, data: any, fn: any = null) {

        var id_user = sessionStorage.getItem('stock_user_id')
        data.createdBy = id_user
        data.updatedBy = id_user

        this.api_create(tabla, data).subscribe(
            (res: any) => {
                if (res.mensaje) {
                    //verificar si es una id
                    if (res.mensaje.length == 36) {
                        fn(res.mensaje)
                    } else {
                        this.ms.add({ severity: 'error', summary: 'Posible error!', detail: 'El servidor no devolvió una ID' })
                    }
                } else {
                    this.ms.add({ severity: 'error', summary: 'Error!', detail: 'El servidor envio respuesta incorrecta' })
                }
            },
            (err: any) => {
                this.ms.add({ severity: 'error', summary: 'Error!', detail: err.message })
                console.error(err)
            }
        )
    }
    public createMultiple(tabla: string, data: any, fn: any = null) {

        var id_user = sessionStorage.getItem('stock_user_id')

        var datos = data.map((dato: any) => {
            return {
                ...dato,
                createdBy: id_user,
                updatedBy: id_user
            }
        })

        this.api_create(`${tabla}/multiple`, datos).subscribe(
            (res: any) => {
                if (res.mensaje) {
                    if (res.mensaje.length) {
                        fn(res.mensaje)
                    } else {
                        this.ms.add({ severity: 'error', summary: 'Posible error!', detail: 'El servidor devolvió un array vacío' })
                    }
                } else {
                    this.ms.add({ severity: 'error', summary: 'Error!', detail: 'El servidor envio respuesta incorrecta' })
                }
            },
            (err: any) => {
                this.ms.add({ severity: 'error', summary: 'Error!', detail: err.message })
                console.error(err)
            }
        )
    }
    public update(tabla: string, data: any, fn: any = null) {

        var id_user = sessionStorage.getItem('stock_user_id')
        data.updatedBy = id_user

        this.api_update(tabla, data).subscribe(
            (res: any) => {
                if (res.mensaje) {
                    fn(res.mensaje)
                } else {
                    this.ms.add({ severity: 'error', summary: 'Error!', detail: 'El servidor envio respuesta incorrecta' })
                }
            },
            (err: any) => {
                this.ms.add({ severity: 'error', summary: 'Error!', detail: err.message })
                console.error(err)
            }
        )
    }
    public delete(tabla: string, id: string, fn: any = null) {
        this.api_delete(tabla, id).subscribe(
            (res: any) => {
                if (res.mensaje) {
                    fn(res.mensaje)
                } else {
                    this.ms.add({ severity: 'error', summary: 'Error!', detail: 'El servidor envio respuesta incorrecta' })
                }
            },
            (err: any) => {
                this.ms.add({ severity: 'error', summary: 'Error!', detail: err.message })
                console.error(err)
            }
        )
    }
}