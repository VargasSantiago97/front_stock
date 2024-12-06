export interface ArticuloAsociado {
    id: string;
    id_original: string;
    id_articulo: string;
    id_documento: string;

    id_rubro: string;
    id_subRubro: string;
    id_laboratorio: string;
    id_unidadMedida: string;
    id_deposito: string;

    cantidad: number;
    cantidadUnidadFundamental: number;

    solicitaLote: boolean;
    solicitaVencimiento: boolean;
    lote: string;
    vencimiento: string;

    codigo: string;
    descripcion: string;
    observaciones: string;
    unidadFundamental: string;
    cantidadPorUnidadFundamental: number;
    ajuste: 'positivo' | 'negativo';
    documento: 'ingreso' | 'remito' | 'ingreso_devolucion' | 'remito_devolucion' | 'operaciones';

    datos: {};
    estado: number;

    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string
}

export interface DocumentoRemito {
    id?: number
    tipo?: string;
    letra?: string;
    punto?: number;
    numero?: number;
    fecha?: string;
}

export interface Remito {
    id: string;

    fecha: string;
    numero: number;
    punto: number;
    modelo: string; //moliendas

    id_cliente: string;
    codigo: string;
    razon_social: string;
    cuit: number;
    alias: string;
    direccion: string;
    localidad: string;
    provincia: string;
    codigo_postal: string;
    telefono: string;
    correo: string;

    id_autorizado: string;
    autorizado_descripcion: string;
    autorizado_documento: string;
    autorizado_contacto: string;

    id_transporte: string;
    transporte_transporte: string;
    transporte_cuit_transporte: number;
    transporte_chofer: string;
    transporte_cuit_chofer: number;
    transporte_patente_chasis: string;
    transporte_patente_acoplado: string;

    id_establecimiento: string;
    establecimiento_descripcion: string;
    establecimiento_localidad: string;
    establecimiento_provincia: string;

    observaciones: string;
    observaciones_sistema: string;
    total_unidades: string;

    datos: {
        documentos?: DocumentoRemito[]
    };
    estado: number;

    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface RemitoDevolucion extends Remito {
    id_asociado: string;
}

export interface Operaciones {
    id: string;

    fecha: string;
    numero: number;
    punto: number;
    modelo: string; //moliendasndas
    tipo: string;

    id_cliente_egreso: string;
    codigo_egreso: string;
    razon_social_egreso: string;
    cuit_egreso: number;
    alias_egreso: string;

    id_cliente_ingreso: string;
    codigo_ingreso: string;
    razon_social_ingreso: string;
    cuit_ingreso: number;
    alias_ingreso: string;

    observaciones: string;
    observaciones_sistema: string;

    datos: {
        documentos?: DocumentoRemito[]
    };
    estado: number;

    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
}