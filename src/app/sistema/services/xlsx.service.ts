import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { saveAs } from 'file-saver';

declare var vars: any;

@Injectable({
    providedIn: 'root'
})
export class XlsxService {

    XLSX_URI = vars.XLSX_URI

    constructor(private http: HttpClient) { }

    downloadExcelListado(data: any) {
        let token = sessionStorage.getItem('stock_token');

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        this.http.post(`${this.XLSX_URI}/xlsx/ingresos`, data, { headers, responseType: 'blob' }).subscribe((data: Blob) => {
            const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, 'Descarga.xlsx');
        });
    }

    downloadExcelDetalle(data: any) {
        let token = sessionStorage.getItem('stock_token');

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        this.http.post(`${this.XLSX_URI}/xlsx/ingresos/detalles`, data, { headers, responseType: 'blob' }).subscribe((data: Blob) => {
            const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, 'Descarga.xlsx');
        });
    }

}
