/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaginateModel } from "src/app/core/interfaces/core.interface";


export interface PaymentListModel  extends PaginateModel
{   
    data?: Payment[]; 
}
export interface Payment {
    
        id?: number;
        apiKey?: string;
        publishedKey?: string;
        clientId?: string;
        clientSecret?: string;
        accessToken?: string;
        logo?: string;
        payment_gateway_title?: string;  
        type?: string;// offline, online
        status?: string;//active, notActive
        }