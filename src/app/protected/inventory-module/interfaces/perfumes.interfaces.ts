// INTERFACES PARA LOS PERFUMES Y RESPUESTAS DE LA API/PERFUMES
interface PerfumeBase {
    name: string,
    description: string,
    price: number,
    stock: number,
    ml: number,
    status?: boolean,
    id?: number
    images?: File[] | PerfumeImage[]
};

export interface Perfume extends PerfumeBase {
    brand_id: number,
    gender_id: number
}

export interface PerfumeResponse extends PerfumeBase {
    brand?: Brand,
    gender?: Gender
}

export interface APIPerfumeResponse extends APIBaseResponse {
    perfume?: PerfumeResponse,
    perfumes?: PerfumeResponse[],
    images: PerfumeImage[]
};

export interface PerfumeImage {
    file_name: string,
    url: string,
    size: number
};

// INTERFACES PARA LA MARCA Y RESPUESTAS DE LA API/BRANDS
export interface Brand {
    name: string,
    id?: number
};

export interface BrandResponse extends APIBaseResponse {
    brand?: Brand,
    brands?: Brand[]
};

// INTERFACES PARA EL GÉNERO Y RESPUESTAS DE LA API/GENDERS
export interface Gender {
    id: number,
    name: string,
    code: GenderCode
};

export interface GenderResponse extends APIBaseResponse {
    gender?: Gender,
    genders?: Gender[]
};

declare type GenderCode = "M" | "F" | "U";

// INTERFAZ GENÉRICA PARA EXTENDER LAS RESPUESTAS DE LAS APIS
export interface APIBaseResponse {
    ok: boolean,
    msg?: string
};






