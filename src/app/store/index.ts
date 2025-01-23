import { ActionReducerMap } from "@ngrx/store";
import { AuthenticationState, authenticationReducer } from "./Authentication/authentication.reducer";
import { LayoutState, layoutReducer } from "./layouts/layouts.reducer";
import { MerchantListReducer, MerchantlistState } from "./merchantsList/merchantlist1.reducer";
import { EmployeeListReducer, EmployeelistState } from "./employee/employee.reducer";
import { StoreListReducer, StorelistState } from "./store/store.reducer";
import { CountryListReducer, CountrylistState } from "./country/country.reducer";
import { AreaListReducer, ArealistState } from "./area/area.reducer";
import { CityListReducer, CitylistState } from "./City/city.reducer";
import { NotificationListReducer, NotificationlistState } from "./notification/notification.reducer";
import { RoleListReducer, RolelistState } from "./Role/role.reducer";
import { SectionListReducer, SectionlistState } from "./section/section.reducer";
import { CustomerListReducer, CustomerlistState } from "./customer/customer.reducer";
import { OfferListReducer, OfferlistState } from "./offer/offer.reducer";
import { LogListReducer, LoglistState } from "./Log/log.reducer";
import { PaymentListReducer, PaymentlistState } from "./payment/payment.reducer";
import { OrderListReducer, OrderlistState } from "./Order/order.reducer";
import { CustomerReviewListReducer, CustomerReviewlistState } from "./customer-reviews/customer-review.reducer";
import { InvoiceListReducer, InvoicelistState } from "./invoices/invoice.reducer";
import { SpecialDayListReducer, SpecialDaylistState } from "./specialDay/special.reducer";
import { FileManagerListReducer, FileManagerlistState } from "./fileManager/file-manager.reducer";


export interface RootReducerState {
    layout: LayoutState;
    auth: AuthenticationState;
  
    MerchantList: MerchantlistState;
    EmployeeList: EmployeelistState;
    StoreList: StorelistState;
    CountryList: CountrylistState;
    AreaList: ArealistState;
    CityList: CitylistState;
    NotificationList: NotificationlistState;
    RoleList: RolelistState;
    SectionList: SectionlistState;
    CustomerList: CustomerlistState;
    OfferList: OfferlistState;
    LogList: LoglistState;
    PaymentList: PaymentlistState;
    OrderList: OrderlistState;
    CustomerReviewList: CustomerReviewlistState;
    InvoiceList: InvoicelistState;
    SpecialDayList: SpecialDaylistState;
    FileManagerList: FileManagerlistState;

    
}

export const rootReducer: ActionReducerMap<RootReducerState> = {
    layout: layoutReducer,
    auth: authenticationReducer,
    MerchantList:MerchantListReducer,
    EmployeeList: EmployeeListReducer,
    StoreList: StoreListReducer,
    CountryList: CountryListReducer,
    AreaList: AreaListReducer,
    CityList: CityListReducer,
    NotificationList: NotificationListReducer,
    RoleList: RoleListReducer,
    SectionList: SectionListReducer,
    CustomerList: CustomerListReducer,
    OfferList: OfferListReducer,
    LogList: LogListReducer,
    PaymentList: PaymentListReducer,
    OrderList: OrderListReducer,
    CustomerReviewList: CustomerReviewListReducer,
    InvoiceList: InvoiceListReducer,
    SpecialDayList: SpecialDayListReducer,
    FileManagerList: FileManagerListReducer


}