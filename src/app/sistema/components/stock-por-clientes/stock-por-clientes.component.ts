import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConsultasService } from '../../services/consultas.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { Cliente } from '../../interfaces/clientes';
import { Deposito, Laboratorio } from '../../interfaces/variables';
import { Articulo, Rubro, SubRubro } from '../../interfaces/productos';


@Component({
    selector: 'app-stock-por-clientes',
    standalone: true,
    imports: [ProgressSpinnerModule, FormsModule, DialogModule, DividerModule],
    templateUrl: './stock-por-clientes.component.html',
    styleUrl: './stock-por-clientes.component.css'
})
export class StockPorClientesComponent {

    visible_scroll: boolean = true
    visible_filtros: boolean = false

    dataTabla: any = []


    clientes: Cliente[] = []
    clientesFiltrados: Cliente[] = []

    depositos: Deposito[] = []
    depositosFiltrados: Deposito[] = []

    articulos: Articulo[] = []
    articulosFiltrados: Articulo[] = []

    rubros: Rubro[] = []
    rubrosFiltrados: Rubro[] = []

    subRubros: SubRubro[] = []
    subRubrosFiltrados: SubRubro[] = []

    laboratorios: Laboratorio[] = []
    laboratoriosFiltrados: Laboratorio[] = []


    fechaFiltroDesde: string = ''
    fechaFiltroHasta: string = ''
    selectedClientes: any = []
    selectedDepositos: any = []
    selectedArticulos: any = []
    selectedRubros: any = []
    selectedSubRubros: any = []
    selectedLaboratorios: any = []

    searchValue_cliente: string = ''
    searchValue_deposito: string = ''
    searchValue_articulo: string = ''
    searchValue_rubro: string = ''
    searchValue_subRubro: string = ''
    searchValue_laboratorio: string = ''


    value_um: string = "um";

    constructor(
        private route: ActivatedRoute,
        private cs: ConsultasService,
        private ms: MessageService
    ) { }

    ngOnInit(): void {
        if (localStorage.getItem('stock_stockPorClienteFechaFiltroDesde')) {
            this.fechaFiltroDesde = localStorage.getItem('stock_stockPorClienteFechaFiltroDesde')!
        }
        if (localStorage.getItem('stock_stockPorClienteFechaFiltroHasta')) {
            this.fechaFiltroHasta = localStorage.getItem('stock_stockPorClienteFechaFiltroHasta')!
        }


        this.route.paramMap.subscribe(params => {
            const id_cliente = params.get('id_cliente');

            if (id_cliente) {
                this.selectedClientes = [id_cliente]
            }

            this.cs.getAll('clientes', (clientes: Cliente[]) => {
                this.clientes = clientes
                this.clienteFiltro()

                this.cs.getAll('depositos', (depositos: Deposito[]) => {
                    this.depositos = depositos
                    this.depositoFiltro()

                    this.cs.getAll('articulos', (articulos: Articulo[]) => {
                        this.articulos = articulos
                        this.articuloFiltro()

                        this.cs.getAll('rubros', (rubros: Rubro[]) => {
                            this.rubros = rubros
                            this.rubroFiltro()

                            this.cs.getAll('subRubros', (subRubros: SubRubro[]) => {
                                this.subRubros = subRubros
                                this.subRubroFiltro()

                                this.cs.getAll('laboratorios', (laboratorios: Laboratorio[]) => {
                                    this.laboratorios = laboratorios
                                    this.laboratorioFiltro()

                                    this.actualizarTabla()
                                })
                            })
                        })
                    })
                })
            })
        });
    }

    actualizarTabla() {
        this.cs.getAllPost(`operaciones/stockPorClientes`, {
            fechaDesde: this.fechaFiltroDesde,
            fechaHasta: this.fechaFiltroHasta,
            clientes: this.selectedClientes,
            depositos: this.selectedDepositos,
            articulos: this.selectedArticulos,
            rubros: this.selectedRubros,
            subRubros: this.selectedSubRubros,
            laboratorios: this.selectedLaboratorios
        }, (e: any) => {
            this.dataTabla = e

            this.visible_scroll = false
            console.log(e)
        })
    }

    clienteFiltro() {
        this.clientesFiltrados = this.clientes.filter((cliente: Cliente) => { return cliente.razon_social.toLocaleUpperCase().includes(this.searchValue_cliente.toLocaleUpperCase()) || cliente.alias.toLocaleUpperCase().includes(this.searchValue_cliente.toLocaleUpperCase()) })
    }
    depositoFiltro() {
        this.depositosFiltrados = this.depositos.filter((deposito: Deposito) => { return deposito.alias.toLocaleUpperCase().includes(this.searchValue_deposito.toLocaleUpperCase()) || deposito.descripcion.toLocaleUpperCase().includes(this.searchValue_deposito.toLocaleUpperCase()) })
    }
    articuloFiltro() {
        this.articulosFiltrados = this.articulos.filter((articulo: Articulo) => { return articulo.descripcion.toLocaleUpperCase().includes(this.searchValue_articulo.toLocaleUpperCase()) || articulo.codigo.toLocaleUpperCase().includes(this.searchValue_articulo.toLocaleUpperCase()) })
    }
    rubroFiltro() {
        this.rubrosFiltrados = this.rubros.filter((rubro: Rubro) => { return rubro.alias.toLocaleUpperCase().includes(this.searchValue_rubro.toLocaleUpperCase()) || rubro.descripcion.toLocaleUpperCase().includes(this.searchValue_rubro.toLocaleUpperCase()) })
    }
    subRubroFiltro() {
        this.subRubrosFiltrados = this.subRubros.filter((subRubro: SubRubro) => { return subRubro.alias.toLocaleUpperCase().includes(this.searchValue_subRubro.toLocaleUpperCase()) || subRubro.descripcion.toLocaleUpperCase().includes(this.searchValue_subRubro.toLocaleUpperCase()) })
    }
    laboratorioFiltro() {
        this.laboratoriosFiltrados = this.laboratorios.filter((laboratorio: Laboratorio) => { return laboratorio.alias.toLocaleUpperCase().includes(this.searchValue_laboratorio.toLocaleUpperCase()) || laboratorio.descripcion.toLocaleUpperCase().includes(this.searchValue_laboratorio.toLocaleUpperCase()) })
    }


    filtrar() {
        this.visible_scroll = true

        this.actualizarTabla()
        this.visible_filtros = false
    }

    fechaFiltro(dias: number) {
        this.fechaFiltroDesde = this.fechaHoy(dias)
        this.fechaFiltroHasta = this.fechaHoy()
    }
    guardarFechas() {
        localStorage.setItem('stock_stockPorClienteFechaFiltroDesde', this.fechaFiltroDesde)
        localStorage.setItem('stock_stockPorClienteFechaFiltroHasta', this.fechaFiltroHasta)
        this.ms.add({ severity: 'success', summary: 'Exito!', detail: 'Fechas guardadas' })
    }

    //HELPERS
    fechaHoy(dias: number = 0) {
        const fechaActual = new Date();

        if (dias) {
            fechaActual.setDate(fechaActual.getDate() - dias)
        }

        const ano = fechaActual.getFullYear();
        const mes = ('0' + (fechaActual.getMonth() + 1)).slice(-2);
        const dia = ('0' + fechaActual.getDate()).slice(-2);

        return `${ano}-${mes}-${dia}`
    }

    mostrarNumero(ent: any) {
        var numero = ''
        try {
            numero = ent.toLocaleString('es-ES', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true
            })
        } catch {
            numero = ent
        }
        return numero
    }
}
