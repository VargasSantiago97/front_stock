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
import { TagModule } from 'primeng/tag';
import { PdfService } from '../../services/pdf.service';
import { Remito, RemitoDevolucion } from '../../interfaces/remitos';

@Component({
    selector: 'app-stock-por-clientes',
    standalone: true,
    imports: [ProgressSpinnerModule, FormsModule, DialogModule, DividerModule, TagModule],
    templateUrl: './stock-por-clientes.component.html',
    styleUrl: './stock-por-clientes.component.css'
})
export class StockPorClientesComponent {

    visible_scroll: boolean = true
    visible_filtros: boolean = false
    visible_movimientos: boolean = false

    dataTabla: any = []
    dataTablaMovimientosProducto: any = []


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


    ordenarTablaOrden: boolean = false
    ordenarTablaPorAnterior: string = ''
    ordenarTablaPor: string = 'fecha'

    constructor(
        private route: ActivatedRoute,
        private cs: ConsultasService,
        private ms: MessageService,
        private pdf: PdfService
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

    verIngreso(id: string) {
        this.pdf.ingreso(id, 3).subscribe((blob: any) => {
            const url = window.URL.createObjectURL(blob);
            const windowFeatures = 'width=800,height=600,menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes';
            window.open(url, '_blank', windowFeatures);
        }, error => {
            console.error('Error al obtener el PDF', error);
        });
    }
    descargarIngreso(id: string) {
        this.pdf.ingreso(id, 1).subscribe((blob: any) => {

            this.cs.getAll('ingresos/' + id, (ingreso: Remito) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `INGRESO DE MERCADERIA ${this.mostrarDocumento(ingreso.punto, ingreso.numero)} - ${ingreso.razon_social}.pdf`;
                a.click();
                window.URL.revokeObjectURL(url);
            })

        }, error => {
            console.error('Error al obtener el PDF', error);
        });
    }

    verDevolucion(id: string) {
        this.pdf.devolucion(id, 3).subscribe((blob: any) => {
            const url = window.URL.createObjectURL(blob);
            const windowFeatures = 'width=800,height=600,menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes';
            window.open(url, '_blank', windowFeatures);
        }, error => {
            console.error('Error al obtener el PDF', error);
        });
    }
    descargarDevolucion(id: string) {
        this.pdf.devolucion(id, 1).subscribe((blob: any) => {

            this.cs.getAll('devoluciones/' + id, (devolucion: RemitoDevolucion) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `DEVOLUCION DE MERCADERIA ${this.mostrarDocumento(devolucion.punto, devolucion.numero)} - ${devolucion.razon_social}.pdf`;
                a.click();
                window.URL.revokeObjectURL(url);
            })

        }, error => {
            console.error('Error al obtener el PDF', error);
        });
    }

    verMovimientosProductos(e: any, id_cliente: string, id_articulo: string) {
        if (e) e.preventDefault();

        this.dataTablaMovimientosProducto = []

        this.actualizarDatosTablaMovimientosProducto(id_cliente, id_articulo)

        this.visible_movimientos = true
    }
    actualizarDatosTablaMovimientosProducto(id_cliente: string, id_articulo: string) {
        

        this.cs.getAll(`operaciones/movimientosPorArticulo/?cliente=${id_cliente}&articulo=${id_articulo}&fechaDesde=${this.fechaFiltroDesde}&fechaHasta=${this.fechaFiltroHasta}`, (e: any) => {
            console.log(e)

            this.dataTablaMovimientosProducto = e

            //BORRAMOS this.ordenarTablaPorAnterior PARA QUE NO SE DE VUELTA EL FILTRO
            this.ordenarTablaPorAnterior = ''
            this.ordenarTabla(this.ordenarTablaPor)
        })

    }

    ordenarTabla(ordenaPor: string) {

        if (this.ordenarTablaPorAnterior == ordenaPor) {
            this.ordenarTablaOrden = !this.ordenarTablaOrden
        }

        this.ordenarTablaPor = ordenaPor

        this.dataTablaMovimientosProducto.sort((a: any, b: any) => {
            if (typeof a[ordenaPor] === 'string') {
                return this.ordenarTablaOrden ? b[ordenaPor].localeCompare(a[ordenaPor]) : a[ordenaPor].localeCompare(b[ordenaPor]);
            }
            return this.ordenarTablaOrden ? (a[ordenaPor] - b[ordenaPor]) : (b[ordenaPor] - a[ordenaPor]);
        });

        this.ordenarTablaPorAnterior = ordenaPor
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
    mostrarDocumento(pto: number, nro: number) {
        return `${String(pto).padStart(4, '0')}-${String(nro).padStart(8, '0')}`
    }
}
