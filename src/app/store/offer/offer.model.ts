/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaginateModel, Translation } from  'src/app/core/interfaces/core.interface' ;

export interface OfferListModel  extends PaginateModel
{   
    data?: Offer[]; 
}
export interface Offer {
    
        id?: number;
        translation_data?: Translation[];    
        category? :  string ,
        quantity? : number,
        company_id? : number,
        startDate? :  any ,
        endDate? :  any ,
        image? : string,
        contractRepName? : string ,
        stores? : any[],
        price?: number,
        giftCardValue? : number,
        discount? : number,
        nbr_of_use? : number,
        couponType? :  string ,
        couponValueBeforeDiscount? : number,
        couponValueAfterDiscount? : number,
        paymentDiscountRate? : number,
        isElectronic? : boolean,
        status?: string
        
        }
         