/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { PaginateModel, Translation } from "src/app/core/interfaces/core.interface";

export interface CompaniesModel  extends PaginateModel
{   
    data?: Company[]; 
}
export interface Company{
    id?: number;
    name?: string;
    sector?: string;
    quotes?: any[];
    address_building?: string;
    address_street?: string;
    address_town?: string;
    address_city?: string;
    address_county?: string;
    address_postcode?: string;
    crm_contacts?: any[];  
    tel_country_dial_code_id?: string;
    tel_number?: string;
    translation_data?: Translation[];
    purchaseHistory?: any[];    
    socialActivities?: any[];
    description?: string;
    web_url?: string;
    address?: string;
    contacts?: any[];
    owner?: string;
    contact_nbr?: number;
    status?: string;
    email?: string;
    phone?: string;
    logo?: string;
    
}

