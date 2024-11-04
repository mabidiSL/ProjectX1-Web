export interface MerchantListModel {
    
     id?: string;
     merchantLogo ?: string  ;
     merchantPicture? :  string ;
     categoryId?: string;
     merchantCategory ?:   string;
     merchantName ?:  string ;
     serviceType? :  string ;
     supervisorName ?:  string ;
     supervisorPhone? :  string ;
     bankAccountNumber ?:  string  
     registerCode ?:  string  
     website ?:  string;
     whatsup ?: string  ;
     facebook? :  string ;
     twitter ?: string  ;
     instagram? : string  ;
     walletId?: string ;
     qrCode?: string ;
     startDateContract? : string;
     endDateContract? : string;
     fileContract? : string;
     sectionId?: string;
     merchantSection ?:  string ;
     stores: any[] ;
     offers: any[] ;
     userId? : string;
     user?: User;
     updatedAt? :  string;
     createdAt?: string;


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
    user_type?: string;
    city?: string;
    street?: string;
    building?: string;
    company_registration?: string;
    registrationDate?: string;
    updatedAt?: string;
}
export interface Merchant{
id?: number;
username?: string;
email?: string;
password?: string;
phone?: string;
id_number?: number;
merchantName ?:  string ;
merchantName_ar?:  string ;
serviceType? :  string ;
supervisorName ?:  string ;
supervisorName_ar?:  string ;
supervisorPhone? :  string ;
merchantLogo ?: string  ;
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
section_id?: number;
wallet?: number;
loyaltyPoint?: number;
bankName?: string ;
city_id ?: number;
updatedAt? :  string;
createdAt?: string;
}
