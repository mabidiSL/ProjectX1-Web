/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaginateModel, Translation } from  'src/app/core/interfaces/core.interface' ;
import { Country } from '../country/country.model';

export interface SpecialDayListModel  extends PaginateModel
{   
    data?: SpecialDay[]; 
}
export interface SpecialDay {
    
        id?: number;
        translation_data?: Translation[];    
        countries?: Country[],
        company_id? : number,
        startDate? :  any ,
        endDate? :  any,
        recursAnnually? : boolean,
        
        }
         