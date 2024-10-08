import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ListboxModule } from 'primeng/listbox';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Table } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { Articulo, Rubro, SubRubro } from '../../interfaces/productos';
import { ConsultasService } from '../../services/consultas.service';
import { MessageService } from 'primeng/api';
import { Laboratorio, UnidadMedida } from '../../interfaces/variables';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'app-productos',
    standalone: true,
    imports: [ListboxModule, FormsModule, TableModule, ButtonModule, DialogModule, CommonModule, DropdownModule, DividerModule, InputTextModule, CheckboxModule, InputTextareaModule, TagModule],
    templateUrl: './productos.component.html',
    styleUrl: './productos.component.css'
})
export class ProductosComponent {

    searchValue: string | undefined; //ELIMINAR

    rubro: Rubro = {
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
    subRubro: SubRubro = {
        id: '',
        id_rubro: '',
        descripcion: '',
        alias: '',
        datos: {},
        estado: 0,
        createdBy: '',
        updatedBy: '',
        createdAt: '',
        updatedAt: ''
    }
    articulo: Articulo = {
        id: '',
        id_rubro: '',
        id_subRubro: '',
        id_laboratorio: '',
        id_unidadMedida: '',
        codigo: '',
        descripcion: '',
        observaciones: '',
        unidadFundamental: '',
        cantidadUnidadFundamental: 1,
        solicitaVencimiento: false,
        solicitaLote: false,
        activo: true,
        datos: {},
        estado: 1,
        createdBy: '',
        updatedBy: '',
        createdAt: '',
        updatedAt: ''
    }

    id_rubro: string = ''
    id_subRubro: string = ''

    rubros: Rubro[] = []
    rubrosFiltrados: Rubro[] = []
    subRubros: SubRubro[] = []
    subRubrosFiltrados: SubRubro[] = []
    articulos: Articulo[] = []

    visible_rubro: boolean = false;
    visible_subRubro: boolean = false;
    visible_articulo: boolean = false;

    searchValue_rubro: string = ''
    searchValue_subRubro: string = ''
    searchValue_laboratorio: string = ''
    searchValue_unidadMedida: string = ''

    unidadMedidas: UnidadMedida[] = []
    unidadMedidasFiltrados: UnidadMedida[] = []
    laboratorios: Laboratorio[] = []
    laboratoriosFiltrados: Laboratorio[] = []



    constructor(
        private cs: ConsultasService,
        private ms: MessageService
    ) { }

    ngOnInit() {
        this.buscarRubros()
        this.buscarLaboratorios()
        this.buscarUnidadMedidas()
    }

    clear(table: Table) {
        table.clear();
        this.searchValue = ''
    }
    mostrarModalCliente(id: any) { } //ELIMINAR
    buscarLaboratorios() {
        this.cs.getAll('laboratorios', (data: Laboratorio[]) => {
            this.laboratorios = data
            this.filtroLaboratorio()
        })
    }
    buscarUnidadMedidas() {
        this.cs.getAll('unidadMedidas', (data: UnidadMedida[]) => {
            this.unidadMedidas = data
            this.filtroUnidadMedida()
        })
    }


    mostrarModalRubro(id: any = null) {
        this.visible_rubro = true
        if (id) {
            this.rubro = this.rubros.find((rubro: Rubro) => { return rubro.id == id })!
        } else {
            this.rubro = {
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
    buscarRubros() {
        this.cs.getAll('rubros', (data: Rubro[]) => {
            this.rubros = data
            this.filtroRubro()
        })
    }
    guardarRubro(rubro: Rubro) {
        if (rubro.id) {
            this.cs.update('rubros', rubro, (cant: any) => {
                this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Registros editados: ' + cant[0] })
                this.visible_rubro = false
                this.buscarRubros()
            })
        } else {
            if(!rubro.alias) return this.ms.add({ severity: 'error', summary: 'Error!', detail: 'Ingrese un alias'});
            if(!rubro.descripcion) return this.ms.add({ severity: 'error', summary: 'Error!', detail: 'Ingrese una descripcion'});


            this.cs.getAll('rubros/buscar/alias/' + rubro.alias, (data: Rubro) => {
                this.ms.add({ severity: 'error', summary: 'Error!', detail: 'Ya existe un Rubro con el alias: ' + rubro.alias })
            }, () => {
                this.cs.create('rubros', rubro, (id: any) => {
                    this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Rubro creado con ID: ' + id })
                    this.visible_rubro = false
                    this.buscarRubros()
                })
            })
        }
    }
    eliminarRubro(id: string) {
        this.cs.delete('rubros', id, (cant: any) => {
            this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Registros borrados: ' + cant[0] })
            this.visible_rubro = false
            this.buscarRubros()
        })
    }
    onChangeRubro(id: string) {
        this.id_rubro = id
        this.id_subRubro = ''
        this.articulos = []

        this.buscarSubRubros()
    }


    mostrarModalSubRubro(id: any = null) {
        if (!this.id_rubro) {
            return this.ms.add({ severity: 'warn', summary: 'Atencion!', detail: 'Seleccione un RUBRO' })
        }

        if (id) {
            this.subRubro = this.subRubros.find((subRubro: SubRubro) => { return subRubro.id == id })!
        } else {
            this.subRubro = {
                id: '',
                id_rubro: this.id_rubro,
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

        this.visible_subRubro = true
    }
    buscarSubRubros() {
        this.cs.getAll('subrubros/' + this.id_rubro, (data: SubRubro[]) => {
            this.subRubros = data
            this.filtroSubRubro()
        })
    }
    guardarSubRubro(subRubro: SubRubro) {
        if (subRubro.id) {
            this.cs.update('subrubros', subRubro, (cant: any) => {
                this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Registros editados: ' + cant[0] })
                this.visible_subRubro = false
                this.buscarSubRubros()
            })
        } else {
            if(!subRubro.alias) return this.ms.add({ severity: 'error', summary: 'Error!', detail: 'Ingrese un alias'});
            if(!subRubro.descripcion) return this.ms.add({ severity: 'error', summary: 'Error!', detail: 'Ingrese una descripcion'});

            this.cs.getAll('subrubros/buscar/alias/' + subRubro.alias, (data: SubRubro) => {
                this.ms.add({ severity: 'error', summary: 'Error!', detail: 'Ya existe un SubRubro con el alias: ' + subRubro.alias })
            }, () => {
                this.cs.create('subrubros', subRubro, (id: any) => {
                    this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'SubRubro creado con ID: ' + id })
                    this.visible_subRubro = false
                    this.buscarSubRubros()
                })
            })
        }
    }
    eliminarSubRubro(id: string) {
        this.cs.delete('subrubros', id, (cant: any) => {
            this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Registros borrados: ' + cant[0] })
            this.visible_subRubro = false
            this.buscarSubRubros()
        })
    }
    onChangeSubRubro(id: string) {
        this.id_subRubro = id
        this.buscarArticulos()
    }


    filtroRubro() {
        this.rubrosFiltrados = this.rubros.filter((rubro: Rubro) => { return rubro.descripcion.toLocaleUpperCase().includes(this.searchValue_rubro.toLocaleUpperCase()) })
    }
    filtroSubRubro() {
        this.subRubrosFiltrados = this.subRubros.filter((subRubro: SubRubro) => { return subRubro.descripcion.toLocaleUpperCase().includes(this.searchValue_subRubro.toLocaleUpperCase()) })
    }
    filtroLaboratorio() {
        this.laboratoriosFiltrados = this.laboratorios.filter((laboratorio: Laboratorio) => { return laboratorio.descripcion.toLocaleUpperCase().includes(this.searchValue_laboratorio.toLocaleUpperCase()) })
    }
    filtroUnidadMedida() {
        this.unidadMedidasFiltrados = this.unidadMedidas.filter((unidadMedida: UnidadMedida) => { return unidadMedida.descripcion.toLocaleUpperCase().includes(this.searchValue_unidadMedida.toLocaleUpperCase()) })
    }


    mostrarModalArticulo(id: any = null) {
        if (!(this.id_rubro && this.id_subRubro)) {
            return this.ms.add({ severity: 'warn', summary: 'Atencion!', detail: 'Seleccione un RUBRO y SUBRUBRO' })
        }
        if (id) {
            this.articulo = this.articulos.find((articulo: Articulo) => { return articulo.id == id })!
        } else {
            this.articulo = {
                id: '',
                id_rubro: this.id_rubro,
                id_subRubro: this.id_subRubro,
                id_laboratorio: '',
                id_unidadMedida: '',
                codigo: '',
                descripcion: '',
                observaciones: '',
                unidadFundamental: 'kilos',
                cantidadUnidadFundamental: 1,
                solicitaVencimiento: false,
                solicitaLote: false,
                activo: true,
                datos: {},
                estado: 1,
                createdBy: '',
                updatedBy: '',
                createdAt: '',
                updatedAt: ''
            }
        }

        this.visible_articulo = true
    }
    buscarArticulos() {
        this.cs.getAll(`articulos/${this.id_rubro}/${this.id_subRubro}`, (data: Articulo[]) => {
            this.articulos = data
        })
    }
    guardarArticulo(articulo: Articulo) {
        if (articulo.id) {
            this.cs.update('articulos', articulo, (cant: any) => {
                this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Registros editados: ' + cant[0] })
                this.visible_articulo = false
                this.buscarArticulos()
            })
        } else {
            if(!articulo.codigo) return this.ms.add({ severity: 'error', summary: 'Error!', detail: 'Ingrese un codigo'});
            if(!articulo.descripcion) return this.ms.add({ severity: 'error', summary: 'Error!', detail: 'Ingrese una descripcion'});


            this.cs.getAll('articulos/buscar/codigo/' + articulo.codigo, (data: Articulo) => {
                this.ms.add({ severity: 'error', summary: 'Error!', detail: 'Ya existe un articulo con el codigo: ' + articulo.codigo })
            }, () => {
                this.cs.create('articulos', articulo, (id: any) => {
                    this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Articulo creado con ID: ' + id })
                    this.visible_articulo = false
                    this.buscarArticulos()
                })
            })
        }
    }
    eliminarArticulo(id: string) {
        this.cs.delete('articulos', id, (cant: any) => {
            this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Registros borrados: ' + cant[0] })
            this.visible_articulo = false
            this.buscarArticulos()
        })
    }



    //HELPERS
    obtenerDescripcionRubro(id: string) {
        return this.rubros.find((rub: Rubro) => { return rub.id == id })?.descripcion
    }
    obtenerDescripcionSubRubro(id: string) {
        return this.subRubros.find((subRub: SubRubro) => { return subRub.id == id })?.descripcion
    }
    obtenerDescripcionUnidadMedida(id: string) {
        return this.unidadMedidas.find((unidadMedida: UnidadMedida) => { return unidadMedida.id == id })?.descripcion
    }
    obtenerDescripcionLaboratorio(id: string) {
        return this.laboratorios.find((laboratorio: Laboratorio) => { return laboratorio.id == id })?.descripcion
    }
}
