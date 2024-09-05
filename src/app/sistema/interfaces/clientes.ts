export interface Cliente {
    id: string;
    cuit: number;
    codigo: string;
    razon_social: string;
    alias: string;
    direccion: string;
    localidad: string;
    provincia: string;
    codigo_postal: string;
    telefono: string;
    correo: string;

    datos: {};

    estado: number;

    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string
}

export interface Autorizado {
    id: string;
    id_cliente: string;

    descripcion: string;
    documento: string;
    cargo: string;
    contacto: string;

    datos: {};
    estado: number;

    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string
}

export interface Transporte {
    id: string;
    id_cliente: string;

    transporte: string
    cuit_transporte: number
    chofer: string
    cuit_chofer: number
    patente_chasis: string
    patente_acoplado: string

    datos: {};
    estado: number;

    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string
}

export interface Establecimiento {
    id: string;
    id_cliente: string;

    descripcion: string
    localidad: string
    provincia: string

    datos: {};
    estado: number;

    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string
}