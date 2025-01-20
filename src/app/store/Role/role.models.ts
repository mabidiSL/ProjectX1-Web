
import { PaginateModel, Translation } from "src/app/core/interfaces/core.interface";

export interface RoleListModel  extends PaginateModel
{   
    data?: Role[]; 
}
export class Role{
  id?: number ;
  translation_data?: Translation[];
  claims ?: Claim[];
  status ?: Status;
}


export class Claim{
  claimType !: Modules;
  claimValue : Permission[]= [];
}
export enum  Status {
  isActive = 0,
  isDeleted = 1,
  isUpdated = 2,
  isBlackListed = 3,
  isDefault = 4,
  isInactive = 5,
  isExpired = 6,
  isApproved = 7,
  isRejected = 8,
  isPending = 9,
}
export  enum Modules
    {

        All = 0,
        Dashboard = 1,
        Customers = 3,
        Customer_Wallet = 14,
        Customer_Invoice = 18,
        Customer_Reviews = 17,
        Employees = 2,
        Role = 10,    
        Merchants = 4,
        Stores = 5,
        Merchant_Wallet = 11,
        Merchant_Invoices = 12,
        Merchant_Commissions = 13,
        Coupons = 6,
        Gift_Cards = 7,
        Orders = 15,
        Marketing_Compaigns = 27,
        Marketing_Offers = 28,
        Special_Coupons = 9,
        Notification_Management = 19,
        Payment = 20, 
        System_Administration = 30,     
        Social_Media = 35,
        Complaints = 33,
        Logs = 37,
        Calendar = 38,
       
        
       
       


}
export enum Permission {

  All = 1,
  ViewAll = 2,
  View = 3,
  Create = 4,
  Update = 5,
  Delete = 6,
  Hide = 7, 
  Activate = 8,
  Deactivate = 9,
  Approve = 10,
  Print = 11,
  Download = 12,
  Filter = 13,
  Decline = 14
}



