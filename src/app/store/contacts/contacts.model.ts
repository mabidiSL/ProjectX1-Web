/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { PaginateModel } from "src/app/core/interfaces/core.interface";

export interface CompaniesModel  extends PaginateModel
{   
    data?: Contact[]; 
}
export interface Contact{
    id?: number;
    first_name?: string;
    sectors: string[];
    quotes: any[],
    purchaseHistory?: any[],
    socialActivities?: any[],
    description?: string;
    last_name?: string;
    company_name?: string;
    contacts?: any[];
    owner?: string;
    contact_nbr?: number;
    status?: string;
    email?: string;
    phone?: string;
    logo?: string;
    
}

