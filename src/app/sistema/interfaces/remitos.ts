export interface ArticuloAsociado {
    id: string;
    id_articulo: string;
    id_documento: string;

    id_rubro: string;
    id_subRubro: string;
    id_laboratorio: string;
    id_unidadMedida: string;
    id_deposito: string;

    cantidad:number;
    cantidadUnidadFundamental:number;

    lote:string;
    vencimiento: Date;


    codigo: string;
    descripcion: string;
    observaciones: string;
    unidadFundamental: string;
    cantidadPorUnidadFundamental: number;

    datos: {};
    estado: number;

    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string
}