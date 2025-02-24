/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { PaginateModel } from "src/app/core/interfaces/core.interface";

export interface ContactsModel  extends PaginateModel
{   
    data?: Contact[]; 
}
export interface Contact{
    id?: number;
    translation_data?: any[];
    company?: any;
    first_name?: string;
    tel_number?: string;
    tel_country_dial_code_id?: string;
    sectors: string[];
    quotes: any[],
    purchaseHistory?: any[],
    socialActivities?: any[],
    activities?: any[],
    last_name?: string;
    mob_tel_number?: string;
    mob_tel_country_dial_code_id?: string;
    address_building?: string;
    address_street?: string;
    address_town?: string;
    address_county?: string;
    address_city?: string;
    address_postcode?: string;
    email?: string;
    phone?: string;
    logo?: string;
    
}

