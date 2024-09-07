import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Deposito, Laboratorio, UnidadMedida } from '../../interfaces/variables';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { ConsultasService } from '../../services/consultas.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-variables',
    standalone: true,
    imports: [FormsModule, InputTextModule, CommonModule, DialogModule, DividerModule],
    templateUrl: './variables.component.html',
    styleUrl: './variables.component.css'
})
export class VariablesComponent {

    searchValue_laboratorio: string = ''
    laboratorio: Laboratorio = {
        id: '',
        descripcion: '',
        alias: '',
        datos: {},
        estado: 0,
        createdBy: '',
        updatedBy: '',
        createdAt: '',
        updatedAt: ''
    }
    id_laboratorio: string = ''
    laboratorios: Laboratorio[] = []
    laboratoriosFiltrados: Laboratorio[] = []

    visible_laboratorio: boolean = false

    //###

    searchValue_unidadMedida: string = ''
    unidadMedida: UnidadMedida = {
        id: '',
        descripcion: '',
        alias: '',
        datos: {},
        estado: 0,
        createdBy: '',
        updatedBy: '',
        createdAt: '',
        updatedAt: ''
    }
    id_unidadMedida: string = ''
    unidadMedidas: UnidadMedida[] = []
    unidadMedidasFiltrados: UnidadMedida[] = []

    visible_unidadMedida: boolean = false

    //###

    searchValue_deposito: string = ''
    deposito: Deposito = {
        id: '',
        descripcion: '',
        alias: '',
        datos: {},
        estado: 0,
        createdBy: '',
        updatedBy: '',
        createdAt: '',
        updatedAt: ''
    }
    id_deposito: string = ''
    depositos: Deposito[] = []
    depositosFiltrados: Deposito[] = []

    visible_deposito: boolean = false

    constructor(
        private cs: ConsultasService,
        private ms: MessageService
    ) { }
    ngOnInit() {
        this.buscarLaboratorios()
        this.buscarUnidadMedidas()
        this.buscarDepositos()
    }

    mostrarModalLaboratorio(id:any = null) {
        this.visible_laboratorio = true
        if(id){
            this.laboratorio = this.laboratorios.find((laboratorio:Laboratorio) => { return laboratorio.id == id })!
        } else {
            this.laboratorio = {
                id: '',
                descripcion: '',
                alias: '',
                datos: {},
                estado: 1,
                createdBy: '',
                updatedBy: '',
                createdAt: '',
                updatedAt: ''
            }
        }
    }
    buscarLaboratorios(){
        this.cs.getAll('laboratorios', (data:Laboratorio[]) => {
            this.laboratorios = data
            this.filtroLaboratorio()
        })
    }
    filtroLaboratorio(){
        this.laboratoriosFiltrados = this.laboratorios.filter((laboratorio:Laboratorio) => { return laboratorio.descripcion.toLocaleUpperCase().includes(this.searchValue_laboratorio.toLocaleUpperCase()) })
    }
    guardarLaboratorio(laboratorio:Laboratorio){
        if(laboratorio.id){
            this.cs.update('laboratorios', laboratorio, (cant:any) => {
                this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Registros editados: ' + cant[0] })
                this.visible_laboratorio = false
                this.buscarLaboratorios()
            })
        } else {
            this.cs.create('laboratorios', laboratorio, (id:any) => {
                this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Rubro creado con ID: ' + id })
                this.visible_laboratorio = false
                this.buscarLaboratorios()
            })
        }
    }
    eliminarLaboratorio(id:string){
        this.cs.delete('laboratorios', id, (cant:any) => {
            this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Registros borrados: ' + cant[0] })
            this.visible_laboratorio = false
            this.buscarLaboratorios()
        })
    }


    mostrarModalUnidadMedida(id:any = null) {
        this.visible_unidadMedida = true
        if(id){
            this.unidadMedida = this.unidadMedidas.find((unidadMedida:UnidadMedida) => { return unidadMedida.id == id })!
        } else {
            this.unidadMedida = {
                id: '',
                descripcion: '',
                alias: '',
                datos: {},
                estado: 1,
                createdBy: '',
                updatedBy: '',
                createdAt: '',
                updatedAt: ''
            }
        }
    }
    buscarUnidadMedidas(){
        this.cs.getAll('unidadMedidas', (data:UnidadMedida[]) => {
            this.unidadMedidas = data
            this.filtroUnidadMedida()
        })
    }
    filtroUnidadMedida(){
        this.unidadMedidasFiltrados = this.unidadMedidas.filter((unidadMedida:UnidadMedida) => { return unidadMedida.descripcion.toLocaleUpperCase().includes(this.searchValue_unidadMedida.toLocaleUpperCase()) })
    }
    guardarUnidadMedida(unidadMedida:UnidadMedida){
        if(unidadMedida.id){
            this.cs.update('unidadMedidas', unidadMedida, (cant:any) => {
                this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Registros editados: ' + cant[0] })
                this.visible_unidadMedida = false
                this.buscarUnidadMedidas()
            })
        } else {
            this.cs.create('unidadMedidas', unidadMedida, (id:any) => {
                this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Rubro creado con ID: ' + id })
                this.visible_unidadMedida = false
                this.buscarUnidadMedidas()
            })
        }
    }
    eliminarUnidadMedida(id:string){
        this.cs.delete('unidadMedidas', id, (cant:any) => {
            this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Registros borrados: ' + cant[0] })
            this.visible_unidadMedida = false
            this.buscarUnidadMedidas()
        })
    }


    mostrarModalDeposito(id:any = null) {
        this.visible_deposito = true
        if(id){
            this.deposito = this.depositos.find((deposito:Deposito) => { return deposito.id == id })!
        } else {
            this.deposito = {
                id: '',
                descripcion: '',
                alias: '',
                datos: {},
                estado: 1,
                createdBy: '',
                updatedBy: '',
                createdAt: '',
                updatedAt: ''
            }
        }
    }
    buscarDepositos(){
        this.cs.getAll('depositos', (data:Deposito[]) => {
            this.depositos = data
            this.filtroDeposito()
        })
    }
    filtroDeposito(){
        this.depositosFiltrados = this.depositos.filter((deposito:Deposito) => { return deposito.descripcion.toLocaleUpperCase().includes(this.searchValue_deposito.toLocaleUpperCase()) })
    }
    guardarDeposito(deposito:Deposito){
        if(deposito.id){
            this.cs.update('depositos', deposito, (cant:any) => {
                this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Registros editados: ' + cant[0] })
                this.visible_deposito = false
                this.buscarDepositos()
            })
        } else {
            this.cs.create('depositos', deposito, (id:any) => {
                this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Rubro creado con ID: ' + id })
                this.visible_deposito = false
                this.buscarDepositos()
            })
        }
    }
    eliminarDeposito(id:string){
        this.cs.delete('depositos', id, (cant:any) => {
            this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Registros borrados: ' + cant[0] })
            this.visible_deposito = false
            this.buscarDepositos()
        })
    }
}
