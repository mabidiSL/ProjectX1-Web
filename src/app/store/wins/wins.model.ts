/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { PaginateModel, Translation } from "src/app/core/interfaces/core.interface";

export interface WinsModel  extends PaginateModel
{   
    data?: Win[]; 
}
export interface Win{
    id?: number;
    user_id?: number;
    quote_id?: number;
    total_cost?: number;
    translation_data?: Translation[];
    details?: any[];  
    quote?: any;
    createdAt?: any;
}

