import { PaginateModel, Translation } from "src/app/core/interfaces/core.interface";
import {  Role } from "../Role/role.models";
import { City } from "../City/city.model";

export interface CustomerListModel  extends PaginateModel
{   
    data?: Customer[]; 
}
export interface Customer {
    
        id?: number;
        translation_data?: Translation[];
        email?: string;
        phone?: string;
        password?: string;
        image?: string;
        country_id?: number;
        city_id?: number; // City;
        city?: City;
        bank_id?: number;
        bankAccountNumber?: string;
        bankName?: string;
        role_id?: number;
        role?: Role;
        createdBy?: string;
        status?: string;//pending,approved,active, inactive, disabled
}