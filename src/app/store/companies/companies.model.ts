/* eslint-disable @typescript-eslint/no-unused-vars */
import { PaginateModel, Translation } from "src/app/core/interfaces/core.interface";
import { CityListModel } from "../City/city.model";

export interface CompaniesModel  extends PaginateModel
{   
    data?: Company[]; 
}
export interface Company{
    id?: number;
    name?: string;
    contact_nbr?: string;
    status?: string;
    email?: string;
    phone?: string;
    logo?: string;
    wallet?: number;
    bankName?: string;
    url?: string;
    totalOrder?: number;
    emailVerifiedAt?: string;
    image?: string;
    referCount?: string;
    country?: string;
    city?: CityListModel;
    street?: string;
    building?: string;
    company_registration?: string;
    registrationDate?: string;
    updatedAt?: string;
}

