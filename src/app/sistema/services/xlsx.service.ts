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

    downloadExcelListado(data: any, nombre: string = '', ruta: string = '') {
        let token = sessionStorage.getItem('stock_token');

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        this.http.post(`${this.XLSX_URI}/xlsx/${ruta}`, data, { headers, responseType: 'blob' }).subscribe((data: Blob) => {
            const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, `${nombre} - LISTADO - ${this.fechaHoy()}.xlsx`);
        });
    }

    downloadExcelDetalle(data: any, nombre: string = '', ruta: string = '') {
        let token = sessionStorage.getItem('stock_token');

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        this.http.post(`${this.XLSX_URI}/xlsx/${ruta}/detalles`, data, { headers, responseType: 'blob' }).subscribe((result: Blob) => {
            const blob = new Blob([result], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            saveAs(blob, `${nombre} - REPORTE - ${this.fechaHoy()}.xlsx`);
        });
    }

    downloadExcelDatos(data: any, nombre: string = '', ruta: string = '') {
        let token = sessionStorage.getItem('stock_token');

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        this.http.post(`${this.XLSX_URI}/xlsx/${ruta}/datos`, data, { headers, responseType: 'blob' }).subscribe((data: Blob) => {
            const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, `${nombre} - DATOS - ${this.fechaHoy()}.xlsx`);
        });
    }

    private fechaHoy() {
        const fechaActual = new Date();

        const ano = fechaActual.getFullYear();
        const mes = ('0' + (fechaActual.getMonth() + 1)).slice(-2);
        const dia = ('0' + fechaActual.getDate()).slice(-2);

        return `${ano}-${mes}-${dia}`
    }

}
