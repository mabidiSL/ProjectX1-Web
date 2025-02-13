import { Modules, Permission } from 'src/app/store/Role/role.models';
import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    
    {
        id: 1,
        label: 'MENUITEMS.DASHBOARD.TEXT',
        icon: 'bx-home-circle',
        link:'/private/dashboard',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Dashboard, claimValue: [Permission.All,Permission.ViewAll]}]
        
    },
    
    {
        id: 2,
        isLayout: true
    },
    {
        id: 40,
        label: 'MENUITEMS.CRMMANAGEMENT.TEXT',
        isTitle: true,
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Crm, claimValue: [Permission.All, Permission.ViewAll, Permission.Create]}]

    },
    {
        id: 41,
        label: 'MENUITEMS.CONTACTS.TEXT',
        icon: 'bx bxs-user-voice',
        link:'/private/contacts/list',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Crm, claimValue: [Permission.All,Permission.ViewAll, Permission.Create]}]

    },
    {
        id: 42,
        label: 'MENUITEMS.COMPANIES.TEXT',
        icon: 'bx bxs-buildings',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Crm, claimValue: [Permission.All, Permission.ViewAll]}],
        link:'/private/companies/list',
    }, 
    {
        id: 3,
        label: 'MENUITEMS.CUSTOMERMANAGEMENT.TEXT',
        isTitle: true,
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Customers, claimValue: [Permission.All, Permission.ViewAll, Permission.Create]}]

    },
    {
        id: 4,
        label: 'MENUITEMS.CUSTOMERS.TEXT',
        icon: 'bxs-user-detail',
        link:'/private/customers/list',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Customers, claimValue: [Permission.All,Permission.ViewAll, Permission.Create]}]

    },
    {
        id: 5,
        label: 'MENUITEMS.CUSTOMERWALLET.TEXT',
        icon: 'bx bx-wallet',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Customer_Wallet, claimValue: [Permission.All, Permission.ViewAll]}],
        link:'/pages/coming-soon',
    }, 
    // {
    //     id: 17,
    //     label: 'MENUITEMS.LOYALTYPOINTS.TEXT',
    //     icon: 'bx bx-bitcoin',
    //     claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Customer_Wallet, claimValue: [Permission.ViewAll]}],
    //     link:'/pages/coming-soon',
    // }, 
    {
        id: 6,
        label: 'MENUITEMS.CUSTOMERINVOICES.TEXT',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Customer_Invoice, claimValue: [Permission.All, Permission.ViewAll, Permission.View]}],
        icon:  'bx bxs-report',
        link:'/private/invoices/list/customer-invoice',
                
    },
    {
        id: 7,
        label: 'MENUITEMS.CUSTOMERSREVIEWS.TEXT',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Customer_Reviews, claimValue: [Permission.All, Permission.ViewAll,  Permission.View]}],
        icon:  'bx bxs-star',
        link:'/private/customer-reviews/list',
                
    },
    {
        id: 8,
        label: 'MENUITEMS.EMPLOYEEMANAGEMENT.TEXT',
        isTitle: true,
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Employees, claimValue: [Permission.All, Permission.ViewAll,Permission.Create]},{claimType: Modules.Role, claimValue: [Permission.Create, Permission.ViewAll]}]

    },
    {
        id: 9,
        label: 'MENUITEMS.EMPLOYEES.TEXT',
        icon: 'bxs-user-pin',
        link: '/private/employees/list',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Employees, claimValue: [Permission.All, Permission.ViewAll,Permission.Create]}],
        // subItems: [
        //     {
        //         id: 3,
        //         label: 'MENUITEMS.EMPLOYEES.LIST.CREATE',
        //         link: '/private/employees/create',
        //         icon:'bx bx-chevron-right',
        //         claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Employees, claimValue: [Permission.Create]}],
        //         parentId: 4
        //     },
        //     {
        //         id: 4,
        //         label: 'MENUITEMS.EMPLOYEES.LIST.EMPLOYEES',
        //         link: '/private/employees',
        //         icon:'bx bx-chevron-right',
        //         claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Employees, claimValue: [Permission.ViewAll]}],
        //         parentId: 4
        //     }
        // ]
       

    },
    {
        id: 10,
        label: 'MENUITEMS.ROLESETUP.TEXT',
        icon: 'bx-shield-quarter',
        link: '/private/roles/list',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Role, claimValue: [Permission.All, Permission.View, Permission.Create, Permission.ViewAll]}],
        // subItems: [
        //     {
        //         id: 3,
        //         label: 'MENUITEMS.ROLESETUP.LIST.CREATE',
        //         link: '/private/roles/create',
        //         icon:'bx bx-chevron-right',
        //         claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Role, claimValue: [Permission.Create]}],
        //         parentId: 5
        //     },
        //     {
        //         id: 4,
        //         label: 'MENUITEMS.ROLESETUP.LIST.ROLES',
        //         link: '/private/roles',
        //         icon:'bx bx-chevron-right',
        //         claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Role, claimValue: [Permission.ViewAll]}],
        //         parentId: 5
        //     }
        // ]
    },
    {
        id: 11,
        label: 'MENUITEMS.MERCHANTMANAGEMENT.TEXT',
        isTitle: true,
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Merchants, claimValue: [Permission.All, Permission.ViewAll,Permission.Create]},{claimType: Modules.Stores, claimValue: [Permission.ViewAll,Permission.Create]},{claimType: Modules.Merchant_Wallet, claimValue: [Permission.ViewAll]},{claimType: Modules.Merchant_Invoices, claimValue: [Permission.ViewAll]},{claimType: Modules.Merchant_Commissions, claimValue: [Permission.ViewAll]}]

    },
    {
        id: 12,
        label: 'MENUITEMS.MERCHANTSLIST.TEXT',
        icon: 'bx bx-store',
        link: '/private/merchants/list',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]}, {claimType: Modules.Merchants, claimValue: [Permission.All, Permission.ViewAll,Permission.Create]}],
        // subItems: [
        //     {
        //         id: 3,
        //         label: 'MENUITEMS.MERCHANTSLIST.LIST.CREATE',
        //         link: '/private/merchants/create',
        //         icon:'bx bx-chevron-right',
        //         claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Merchants, claimValue: [Permission.Create]}],
        //         parentId: 8
        //     },
        //     {
        //         id: 4,
        //         label: 'MENUITEMS.MERCHANTSLIST.LIST.APPROVEDLIST',
        //         link: '/private/merchants/list',
        //         icon:'bx bx-chevron-right',
        //         claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Merchants, claimValue: [Permission.ViewAll]}],
        //         parentId: 8
        //     }
        // ]

        
    },
    {
        id: 13,
        label: 'MENUITEMS.STORES.TEXT',
        icon: 'bx bx-store',
        link: '/private/stores/list',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Stores, claimValue: [Permission.All, Permission.ViewAll, Permission.Create]}],
        // subItems: [
        //     {
        //         id: 3,
        //         label: 'MENUITEMS.STORES.LIST.CREATE',
        //         link: '/private/stores/create',
        //         icon:'bx bx-chevron-right',
        //         claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Stores, claimValue: [Permission.Create]}],
        //         parentId: 4
        //     },
        //     {
        //         id: 4,
        //         label: 'MENUITEMS.STORES.LIST.STORES',
        //         link: '/private/stores',
        //         icon:'bx bx-chevron-right',
        //         claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Stores, claimValue: [Permission.ViewAll]}],
        //         parentId: 4
        //     }
        // ],
        
       
        
    },
    {
        id: 14,
        label: 'MENUITEMS.MERCHANTWALLET.TEXT',
        icon: 'bx bx-wallet-alt',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Merchant_Wallet, claimValue: [Permission.All, Permission.ViewAll]}],
        link:'/pages/coming-soon',
    },
    {
        id: 15,
        label: 'MENUITEMS.MERCHANTINVOICES.TEXT',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Merchant_Invoices, claimValue: [Permission.All, Permission.ViewAll]}],
        icon:  'bx bxs-report',
        link:'/private/invoices/list/merchant-invoice',
                
    },
    {  id: 16,
        label: 'MENUITEMS.MERCHANTSCOMMISSION.TEXT',
        icon: 'bx bx-dollar-circle',
        link:'/pages/coming-soon',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Merchant_Commissions, claimValue: [Permission.All, Permission.ViewAll]}],
      
 },
   

    
   
    {
        id: 17,
        label: 'MENUITEMS.PRODUCTMANAGEMENT.TEXT',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Coupons, claimValue: [Permission.All, Permission.Create, Permission.ViewAll,Permission.Approve , Permission.Decline]},{claimType: Modules.Gift_Cards, claimValue: [Permission.ViewAll, Permission.Create, Permission.Approve, Permission.Decline]}],
        isTitle: true
    }, 
    {
        id: 38,
        label: 'MENUITEMS.CALENDAR.TEXT',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Calendar, claimValue: [Permission.All, Permission.ViewAll]}],
        icon: 'bx-calendar',
        link:'/private/calendar',
                
    },
    {
                id: 18,
                label: 'MENUITEMS.PRODUCTMANAGEMENT.COUPONS.TEXT',
                claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Coupons, claimValue: [Permission.All, Permission.Create, Permission.ViewAll,Permission.Approve , Permission.Decline]}],
                icon: 'bxs-coupon',
                link: '/private/coupons/list',
                

   },
            {
                id: 19,
                label: 'MENUITEMS.PRODUCTMANAGEMENT.GIFTCARDS.TEXT',
                icon: 'bx bxs-gift',
                claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Gift_Cards, claimValue: [Permission.All, Permission.ViewAll, Permission.Create, Permission.Approve, Permission.Decline]}],
                link:'/private/giftCards/list',
               
            }
        ,
        {
            id: 39,
            label: 'MENUITEMS.PRODUCTMANAGEMENT.SPECIALDAYS.TEXT',
            icon: 'bx bxs-cake',
            claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.SpecialDay, claimValue: [Permission.All, Permission.ViewAll, Permission.Create]}],
            link:'/private/special-day/list',
           
        }
    ,
           
        {
            id: 20,
            label: 'MENUITEMS.ORDERMANAGEMENT.TEXT',
            claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Orders, claimValue: [ Permission.All, Permission.ViewAll, Permission.View]}],
            isTitle: true
        }, 
        {
            id: 21,
            label: 'MENUITEMS.ORDERMANAGEMENT.ORDER.TEXT',
            icon: 'bx bxs-basket',
            claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Orders, claimValue: [Permission.All, Permission.ViewAll, Permission.View]}],
            link:'/private/orders/list',
           
        }
   ,
   
    {
        id: 22,
        label: 'MENUITEMS.MARKETINGMANAGEMENT.TEXT',
        icon: 'bx-receipt',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Notification_Management, claimValue: [Permission.All,Permission.ViewAll]},{claimType: Modules.Special_Coupons, claimValue: [Permission.All, Permission.ViewAll]},{claimType: Modules.Marketing_Offers, claimValue: [Permission.All,Permission.ViewAll]},{claimType: Modules.Marketing_Compaigns, claimValue: [Permission.All,Permission.ViewAll]}],
        isTitle: true
    },
    {
        id: 23,
        label: 'MENUITEMS.MARKETINGCOMPAIGNS.TEXT',
        icon: 'bx bxs-megaphone',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Marketing_Compaigns, claimValue: [Permission.All,Permission.ViewAll]}],
        link:'/pages/coming-soon',
        
        
    },
    {
        id: 24,
        label: 'MENUITEMS.MARKETINGOFFERS.TEXT',
        icon: 'bx bxs-discount',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Marketing_Offers, claimValue: [Permission.All, Permission.ViewAll]}],
        link:'/pages/coming-soon',
        
        
    },
    {
        id: 25,
        label: 'MENUITEMS.SPECIALCOUPONS.TEXT',
        icon: 'bx bxs-discount',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Special_Coupons, claimValue: [Permission.All,Permission.ViewAll]}],
        link:'/pages/coming-soon',
               
    },
    {
        id: 26,
        label: 'MENUITEMS.APPNOTIFICATION.TEXT',
        icon: 'bx bxs-bell-ring',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Notification_Management, claimValue: [Permission.All,Permission.ViewAll]}],
        link: '/private/notifications/list'
        
          
    },
    {
        id: 27,
        label: 'MENUITEMS.FINANCIALMANAGEMENT.TEXT',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]}, {claimType: Modules.Payment, claimValue: [Permission.All,Permission.ViewAll]}],
        isTitle: true
                
    },
    
    {
        id: 28,
        label: 'MENUITEMS.PAYMENTS.TEXT',
        icon: 'bx bxl-paypal',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Payment, claimValue: [Permission.All, Permission.ViewAll]}],
        link:'/private/payment/list',
                
    },
    {
        id: 29,
        label: 'MENUITEMS.SYSTEMLADMINISTRATION.TEXT',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Logs, claimValue: [Permission.All, Permission.ViewAll]},{claimType: Modules.System_Administration, claimValue: [Permission.All, Permission.ViewAll]}],
        isTitle:true
               
    },
    {
        id: 30,
        label: 'MENUITEMS.FILEMANAGER.TEXT',
        icon: 'bx bx-file',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.File_Manager, claimValue: [Permission.All,Permission.ViewAll]}],
        link: '/private/file-manager/en',
               
    },
    {
        id: 30,
        label: 'MENUITEMS.COUNTRIES.TEXT',
        icon: 'bx bx-globe',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.System_Administration, claimValue: [Permission.All,Permission.ViewAll]}],
        link: '/private/countries/list',
               
    },
    // {
    //     id: 34,
    //     label: 'MENUITEMS.AREAS.TEXT',
    //     icon: 'dripicons-map',
    //     claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.System_Administration, claimValue: [Permission.ViewAll]}],
    //     link: '/private/areas/list'
               
    // },
    
    {
        id: 31,
        label: 'MENUITEMS.CITIES.TEXT',
        icon: 'bx bxs-city',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.System_Administration, claimValue: [Permission.All,Permission.ViewAll]}],
        link: '/private/cities/list'
               
    },
   
    {
        id: 32,
        label: 'MENUITEMS.BANKS.TEXT',
        icon: 'bx bxs-bank',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.System_Administration, claimValue: [Permission.All,Permission.ViewAll]}],
        link:'/pages/coming-soon',
               
    },
    {
        id: 33,
        label: 'MENUITEMS.CURRENCIES.TEXT',
        icon: 'bx bx-money',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.System_Administration, claimValue: [Permission.All, Permission.ViewAll]}],
        link:'/pages/coming-soon',
               
    },
    {
        id: 34,
        label: 'MENUITEMS.TAX.TEXT',
        icon: 'bx bxs-dollar-circle',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.System_Administration, claimValue: [Permission.All, Permission.ViewAll]}],
        link:'/pages/coming-soon',
                
    },
    
   
    // {
    //     id: 36,
    //     label: 'MENUITEMS.NOTIFICATIONMANAGEMENT.TEXT',
    //     claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Social_Media, claimValue: [Permission.ViewAll]},],
    //     isTitle: true
          
    // },
       
    {
        id: 35,
        label: 'MENUITEMS.SOCIALMEDIASET.TEXT',
        icon:  'bx bxl-facebook-circle',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Social_Media, claimValue: [Permission.All,Permission.ViewAll]},{claimType: Modules.Complaints, claimValue: [Permission.All,Permission.ViewAll]}],
        link:'/pages/coming-soon',
                
    },
    {
        id: 36,
        label: 'MENUITEMS.COMPLAINTS.TEXT',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Complaints, claimValue: [Permission.All,Permission.ViewAll]}],
        icon:  'bx bx-error',
        link:'/pages/coming-soon',
                
    },
    {
        id: 37,
        label: 'MENUITEMS.LOGS.TEXT',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Logs, claimValue: [Permission.All, Permission.ViewAll]}],
        icon:  'bx bx-error',
        link:'/private/logs/list',
                
    },
    
   
    
    
];