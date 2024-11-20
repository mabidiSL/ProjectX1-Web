import { ActionReducerMap } from "@ngrx/store";
import { AuthenticationState, authenticationReducer } from "./Authentication/authentication.reducer";
import { LayoutState, layoutReducer } from "./layouts/layouts.reducer";
import { MerchantListReducer, MerchantlistState } from "./merchantsList/merchantlist1.reducer";
import { CouponListReducer, CouponlistState } from "./coupon/coupon.reducer";
import { EmployeeListReducer, EmployeelistState } from "./employee/employee.reducer";
import { StoreListReducer, StorelistState } from "./store/store.reducer";
import { CountryListReducer, CountrylistState } from "./country/country.reducer";
import { AreaListReducer, ArealistState } from "./area/area.reducer";
import { CityListReducer, CitylistState } from "./City/city.reducer";
import { NotificationListReducer, NotificationlistState } from "./notification/notification.reducer";
import { RoleListReducer, RolelistState } from "./Role/role.reducer";
import { SectionListReducer, SectionlistState } from "./section/section.reducer";
import { CustomerListReducer, CustomerlistState } from "./customer/customer.reducer";


export interface RootReducerState {
    layout: LayoutState;
    auth: AuthenticationState;
  
    MerchantList: MerchantlistState;
    CouponList: CouponlistState;
    EmployeeList: EmployeelistState;
    StoreList: StorelistState;
    CountryList: CountrylistState;
    AreaList: ArealistState;
    CityList: CitylistState;
    NotificationList: NotificationlistState;
    RoleList: RolelistState;
    SectionList: SectionlistState;
    CustomerList: CustomerlistState;
    
}

export const rootReducer: ActionReducerMap<RootReducerState> = {
    layout: layoutReducer,
    auth: authenticationReducer,
    MerchantList:MerchantListReducer,
    CouponList: CouponListReducer,
    EmployeeList: EmployeeListReducer,
    StoreList: StoreListReducer,
    CountryList: CountryListReducer,
    AreaList: AreaListReducer,
    CityList: CityListReducer,
    NotificationList: NotificationListReducer,
    RoleList: RoleListReducer,
    SectionList: SectionListReducer,
    CustomerList: CustomerListReducer

}