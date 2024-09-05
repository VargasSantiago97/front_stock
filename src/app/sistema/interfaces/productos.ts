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