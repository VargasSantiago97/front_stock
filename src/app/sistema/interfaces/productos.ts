export interface Rubro {
    id: string;
    descripcion: string;
    alias: string;

    datos: {};
    estado: number;

    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string
}

export interface TiposOperaciones {
    id: string;
    descripcion: string;
    alias: string;
}

export interface SubRubro {
    id: string;
    id_rubro: string;
    descripcion: string;
    alias: string;

    datos: {};
    estado: number;

    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string
}

export interface Articulo {
    id: string;
    id_rubro: string;
    id_subRubro: string;
    id_laboratorio: string;
    id_unidadMedida: string;

    codigo: string;
    descripcion: string;
    observaciones: string;
    unidadFundamental: string;
    cantidadUnidadFundamental: number;

    solicitaVencimiento: boolean;
    solicitaLote: boolean;
    activo: boolean;

    datos: {};
    estado: number;

    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string
}