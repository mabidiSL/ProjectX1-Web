/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { PaginateModel, Translation } from "src/app/core/interfaces/core.interface";

export interface QuotesModel  extends PaginateModel
{   
    data?: Quote[]; 
}
export interface Quote{
    id?: number;
    user_id?: number;
    total_cost?: number;
    translation_data?: Translation[];
    details?: any[];  
    user?: any;  
    createdAt?: any;
    
}

