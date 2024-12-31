/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaginateModel } from "src/app/core/interfaces/core.interface";

export interface CustomerReviewListModel  extends PaginateModel
{   
    data?: CustomerReview[]; 
}
export interface CustomerReview {
    
        id?: number;
        user_id?: number;
        user?: any;
        rating?: number;
        offer_id?: number;
        category?: string;
        company_id?: number;
        store_id?: number;
}