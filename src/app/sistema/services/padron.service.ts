import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

declare var vars: any;

@Injectable({
  providedIn: 'root'
})
export class PadronService {

  PADRON_URI = vars.PADRON_URI;

  constructor(
    private http: HttpClient
  ) { }

  consultaPadron(cuit:any){
    return this.http.get(`${this.PADRON_URI}/padron.php?documento=` + cuit)
  }
}