import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

declare var vars: any;

@Injectable({
    providedIn: 'root'
})
export class PdfService {

    PDF_URI = vars.PDF_URI;

    constructor(
        private http: HttpClient
    ) { }

    ingreso(id: string, cantidad_copias: number): Observable<Blob> {
        let token = sessionStorage.getItem('stock_token');

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(`${this.PDF_URI}/pdf/ingresos/${id}/${cantidad_copias}`, { headers, responseType: 'blob' })
    }
    
    devolucion(id: string, cantidad_copias: number): Observable<Blob> {
        let token = sessionStorage.getItem('stock_token');

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(`${this.PDF_URI}/pdf/devoluciones/${id}/${cantidad_copias}`, { headers, responseType: 'blob' })
    }
}