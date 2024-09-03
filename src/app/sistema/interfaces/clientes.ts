export interface Cliente {
    id: string;
    cuit: number;
    razon_social: string;
    alias: string;
    direccion: string;
    localidad: string;
    provincia: string;
    codigo_postal: string;

    datos: {};

    estado: number;

    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string
}