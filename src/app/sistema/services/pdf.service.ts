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

    ingreso(id: string): Observable<Blob> {
        let token = sessionStorage.getItem('stock_token');

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(`${this.PDF_URI}/pdf/ingresos/${id}`, { headers, responseType: 'blob' })
    }
}