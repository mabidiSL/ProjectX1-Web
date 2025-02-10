/* eslint-disable @typescript-eslint/no-unused-vars */
import { PaginateModel, Translation } from "src/app/core/interfaces/core.interface";
import { CityListModel } from "../City/city.model";

export interface MerchantListModel  extends PaginateModel
{   
    data?: Merchant[]; 
}
interface User{
    id?: string;
    username?: string;
    password?: string;
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
export interface Merchant{
id?: number;
f_name?: string;
l_name?: string;
email?: string;
password?: string;
phone?: string;
officeTel?: string;
id_number?: number;
translation_data?: Translation[];
serviceType? :  string ;
supervisorPhone? :  string ;
companyLogo ?: string  ;
merchantPicture? :  string ;
bankAccountNumber ?:  string  
website ?:  string;
whatsup ?: number  ;
facebook? :  string ;
twitter ?: string  ;
instagram? : string  ;
walletId?: number ;
qrCode?: string ;
activationCode?: string ;
sections?: any[];
wallet?: number;
//loyaltyPoint?: number;
bankName?: string ;
city_id ?: number;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
user?: any;
updatedAt? :  string;
createdAt?: string;
}
