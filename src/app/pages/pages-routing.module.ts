import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultComponent } from './dashboards/default/default.component';
import { RoleGuard } from '../core/guards/role.guard';
import { CalendarComponent } from './calendar/calendar.component';

const routes: Routes = [
   //{ path: '', redirectTo: 'dashboard' },
  {
    path: "",
    component: DefaultComponent
  },
  { path: 'dashboard', component: DefaultComponent },
  { path: 'dashboards', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule) },
  { path: 'contacts', loadChildren: () => import('./contacts/contacts.module').then(m => m.ContactsModule) },
  { path: 'merchants', loadChildren: () => import('./merchants/merchants.module').then(m => m.MerchantsModule),canActivate: [RoleGuard]  },
  { path: 'stores', loadChildren: () => import('./stores/stores.module').then(m => m.StoresModule), canActivate: [RoleGuard] },
  { path: 'coupons',loadChildren: () => import('./coupons/coupons.module').then(m => m.CouponsModule), canActivate: [RoleGuard] },
  { path: 'notifications', loadChildren: () => import('./notifications/notifications.module').then(m => m.NotificationsModule), canActivate: [RoleGuard] },
  { path: 'employees', loadChildren: () => import('./employees/employees.module').then(m => m.EmployeesModule), canActivate: [RoleGuard] },
  { path: 'roles', loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule), canActivate: [RoleGuard] },
  { path: 'countries', loadChildren: () => import('./country/country.module').then(m => m.CountryModule), canActivate: [RoleGuard] },
  { path: 'areas', loadChildren: () => import('./areas/areas.module').then(m => m.AreasModule), canActivate: [RoleGuard] },
  { path: 'cities', loadChildren: () => import('./city/city.module').then(m => m.CityModule), canActivate: [RoleGuard] },
  { path: 'giftCards',loadChildren: () => import('./gift-card/gift-card.module').then(m => m.GiftCardModule), canActivate: [RoleGuard] },
  { path: 'logs',loadChildren: () => import('./logs/logs.module').then(m => m.LogsModule), canActivate: [RoleGuard] },
  { path: 'customers', loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule), canActivate: [RoleGuard] },
  { path: 'customer-reviews', loadChildren: () => import('./customer-reviews/customer-reviews.module').then(m => m.CustomerReviewsModule), canActivate: [RoleGuard] },
  { path: 'payment', loadChildren: () => import('./payment/payment.module').then(m => m.PaymentModule), canActivate: [RoleGuard] },
  { path: 'orders', loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule), canActivate: [RoleGuard] },
  { path: 'invoices', loadChildren: () => import('./invoices/invoices.module').then(m => m.InvoicesModule), canActivate: [RoleGuard] },
  { path: 'calendar', component: CalendarComponent, canActivate: [RoleGuard] },
  { path: 'special-day', loadChildren: () => import('./special-day/special-day.module').then(m => m.SpecialDayModule), canActivate: [RoleGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
