import { Modules, Permission } from 'src/app/store/Role/role.models';
import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    
    {
        id: 1,
        label: 'MENUITEMS.DASHBOARD.TEXT',
        icon: 'bx-home-circle',
        link:'/private/dashboard',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Dashboard, claimValue: [Permission.ViewAll]}]
        
    },
    {
        id: 2,
        isLayout: true
    },
    {
        id: 3,
        label: 'MENUITEMS.CUSTOMERMANAGEMENT.TEXT',
        isTitle: true,
        claims: [{claimType: Modules.All, claimValue: [Permission.All]}]

    },
    {
        id: 6,
        label: 'MENUITEMS.CUSTOMERS.TEXT',
        icon: 'bxs-user-detail',
        link:'/pages/coming-soon',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Customers, claimValue: [Permission.ViewAll]}]

    },
    {
        id: 17,
        label: 'MENUITEMS.CUSTOMERWALLET.TEXT',
        icon: 'bx bx-wallet',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Customer_Wallet, claimValue: [Permission.ViewAll]}],
        link:'/pages/coming-soon',
    }, 
    {
        id: 17,
        label: 'MENUITEMS.LOYALTYPOINTS.TEXT',
        icon: 'bx bx-bitcoin',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Customer_Wallet, claimValue: [Permission.ViewAll]}],
        link:'/pages/coming-soon',
    }, 
    {
        id: 41,
        label: 'MENUITEMS.CUSTOMERINVOICES.TEXT',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Customer_Invoice, claimValue: [Permission.ViewAll]}],
        icon:  'bx bxs-report',
        link:'/pages/coming-soon',
                
    },
    {
        id: 41,
        label: 'MENUITEMS.CUSTOMERSREVIEWS.TEXT',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Customer_Reviews, claimValue: [Permission.ViewAll]}],
        icon:  'bx bxs-star',
        link:'/pages/coming-soon',
                
    },
    {
        id: 3,
        label: 'MENUITEMS.EMPLOYEEMANAGEMENT.TEXT',
        isTitle: true,
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Employees, claimValue: [Permission.ViewAll,Permission.Create]},{claimType: Modules.Role, claimValue: [Permission.Create, Permission.ViewAll]}]

    },
    {
        id: 4,
        label: 'MENUITEMS.EMPLOYEES.TEXT',
        icon: 'bxs-user-pin',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Employees, claimValue: [Permission.ViewAll,Permission.Create]}],
        subItems: [
            {
                id: 3,
                label: 'MENUITEMS.EMPLOYEES.LIST.CREATE',
                link: '/private/employees/create',
                icon:'bx bx-chevron-right',
                claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Employees, claimValue: [Permission.Create]}],
                parentId: 4
            },
            {
                id: 4,
                label: 'MENUITEMS.EMPLOYEES.LIST.EMPLOYEES',
                link: '/private/employees',
                icon:'bx bx-chevron-right',
                claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Employees, claimValue: [Permission.ViewAll]}],
                parentId: 4
            }
        ]
       

    },
    {
        id: 5,
        label: 'MENUITEMS.ROLESETUP.TEXT',
        icon: 'bx-shield-quarter',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Role, claimValue: [Permission.Create, Permission.ViewAll]}],
        subItems: [
            {
                id: 3,
                label: 'MENUITEMS.ROLESETUP.LIST.CREATE',
                link: '/private/roles/create',
                icon:'bx bx-chevron-right',
                claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Role, claimValue: [Permission.Create]}],
                parentId: 5
            },
            {
                id: 4,
                label: 'MENUITEMS.ROLESETUP.LIST.ROLES',
                link: '/private/roles',
                icon:'bx bx-chevron-right',
                claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Role, claimValue: [Permission.ViewAll]}],
                parentId: 5
            }
        ]
    },
    {
        id: 3,
        label: 'MENUITEMS.MERCHANTMANAGEMENT.TEXT',
        isTitle: true,
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Merchants, claimValue: [Permission.ViewAll,Permission.Create]},{claimType: Modules.Stores, claimValue: [Permission.ViewAll,Permission.Create]},{claimType: Modules.Merchant_Wallet, claimValue: [Permission.ViewAll]},{claimType: Modules.Merchant_Invoices, claimValue: [Permission.ViewAll]},{claimType: Modules.Merchant_Commissions, claimValue: [Permission.ViewAll]}]

    },
    {
        id: 8,
        label: 'MENUITEMS.MERCHANTSLIST.TEXT',
        icon: 'bx bx-store',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]}, {claimType: Modules.Merchants, claimValue: [Permission.ViewAll,Permission.Create]}],
        subItems: [
            {
                id: 3,
                label: 'MENUITEMS.MERCHANTSLIST.LIST.CREATE',
                link: '/private/merchants/create',
                icon:'bx bx-chevron-right',
                claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Merchants, claimValue: [Permission.Create]}],
                parentId: 8
            },
            {
                id: 4,
                label: 'MENUITEMS.MERCHANTSLIST.LIST.APPROVEDLIST',
                link: '/private/merchants/list',
                icon:'bx bx-chevron-right',
                claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Merchants, claimValue: [Permission.ViewAll]}],
                parentId: 8
            }
        ]

        
    },
    {
        id: 10,
        label: 'MENUITEMS.STORES.TEXT',
        icon: 'bx bx-store',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Stores, claimValue: [Permission.ViewAll, Permission.Create]}],
        subItems: [
            {
                id: 3,
                label: 'MENUITEMS.STORES.LIST.CREATE',
                link: '/private/stores/create',
                icon:'bx bx-chevron-right',
                claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Stores, claimValue: [Permission.Create]}],
                parentId: 4
            },
            {
                id: 4,
                label: 'MENUITEMS.STORES.LIST.STORES',
                link: '/private/stores',
                icon:'bx bx-chevron-right',
                claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Stores, claimValue: [Permission.ViewAll]}],
                parentId: 4
            }
        ],
        
       
        
    },
    {
        id: 16,
        label: 'MENUITEMS.MERCHANTWALLET.TEXT',
        icon: 'bx bx-wallet-alt',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Merchant_Wallet, claimValue: [Permission.ViewAll]}],
        link:'/pages/coming-soon',
    },
    {
        id: 42,
        label: 'MENUITEMS.MERCHANTINVOICES.TEXT',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Merchant_Invoices, claimValue: [Permission.ViewAll]}],
        icon:  'bx bxs-report',
        link:'/pages/coming-soon',
                
    },
    {  id: 11,
        label: 'MENUITEMS.MERCHANTSCOMMISSION.TEXT',
        icon: 'bx bx-dollar-circle',
        link:'/pages/coming-soon',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Merchant_Commissions, claimValue: [Permission.ViewAll]}],
      
 },
   

    
   
    {
        id: 13,
        label: 'MENUITEMS.PRODUCTMANAGEMENT.TEXT',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Coupons, claimValue: [Permission.Create, Permission.ViewAll,Permission.Approve , Permission.Decline]},{claimType: Modules.Gift_Cards, claimValue: [Permission.ViewAll, Permission.Create, Permission.Approve, Permission.Decline]}],
        isTitle: true
    }, 
   {
                id: 3,
                label: 'MENUITEMS.PRODUCTMANAGEMENT.COUPONS.TEXT',
                claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Coupons, claimValue: [Permission.Create, Permission.ViewAll,Permission.Approve , Permission.Decline]}],
                icon: 'bxs-coupon',
                parentId: 18,
                subItems: [
                    {
                    id: 21,
                    label: 'MENUITEMS.PRODUCTMANAGEMENT.COUPONS.LIST.CREATE',
                    icon:'bx bx-chevron-right',    
                    link: '/private/coupons/create',
                    claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Coupons, claimValue: [Permission.Create]}],
                   
                   },
                   {
                    id: 21,
                    label: 'MENUITEMS.PRODUCTMANAGEMENT.COUPONS.LIST.COUPONS',
                    icon:'bx bx-chevron-right',    
                    link: '/private/coupons',
                    claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Coupons, claimValue: [Permission.ViewAll]}],
                   
                   },
                   {
                        id: 22,
                        label: 'MENUITEMS.PRODUCTMANAGEMENT.COUPONS.LIST.APPROVALCOUPONS',
                        icon:'bx bx-chevron-right',    
                        link: '/private/coupons/approve',
                        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Coupons, claimValue: [Permission.ViewAll,Permission.Approve, Permission.Decline]}],
                    
                   }
                ]

   },
            {
                id: 4,
                label: 'MENUITEMS.PRODUCTMANAGEMENT.GIFTCARDS.TEXT',
                icon: 'bx bxs-gift',
                claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Gift_Cards, claimValue: [Permission.ViewAll, Permission.Create, Permission.Approve, Permission.Decline]}],
                parentId: 18,
                subItems: [
                    {
                    id: 21,
                    label: 'MENUITEMS.PRODUCTMANAGEMENT.GIFTCARDS.LIST.CREATE',
                    icon:'bx bx-chevron-right',    
                    link: '/private/giftCards/create',
                    claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Gift_Cards, claimValue: [Permission.Create]}],
                   
                   },
                   {
                    id: 21,
                    label: 'MENUITEMS.PRODUCTMANAGEMENT.GIFTCARDS.LIST.GIFTCARDS',
                    icon:'bx bx-chevron-right',    
                    link:'/private/giftCards',
                    claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Gift_Cards, claimValue: [Permission.ViewAll]}],
                   
                   },
                   {
                        id: 22,
                        label: 'MENUITEMS.PRODUCTMANAGEMENT.GIFTCARDS.LIST.APPROVALGIFTCARDS',
                        icon:'bx bx-chevron-right',    
                        link:'/private/giftCards/approve',
                        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Gift_Cards, claimValue: [Permission.ViewAll,Permission.Approve, Permission.Decline]}],
                    
                   }
                ]
            }
        ,
           
    
     
   
   
    {
        id: 25,
        label: 'MENUITEMS.MARKETINGMANAGEMENT.TEXT',
        icon: 'bx-receipt',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Notification_Management, claimValue: [Permission.ViewAll]},{claimType: Modules.Special_Coupons, claimValue: [Permission.ViewAll]},{claimType: Modules.Marketing_Offers, claimValue: [Permission.ViewAll]},{claimType: Modules.Marketing_Compaigns, claimValue: [Permission.ViewAll]}],
        isTitle: true
    },
    {
        id: 26,
        label: 'MENUITEMS.MARKETINGCOMPAIGNS.TEXT',
        icon: 'bx bxs-megaphone',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Marketing_Compaigns, claimValue: [Permission.ViewAll]}],
        link:'/pages/coming-soon',
        
        
    },
    {
        id: 27,
        label: 'MENUITEMS.MARKETINGOFFERS.TEXT',
        icon: 'bx bxs-discount',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Marketing_Offers, claimValue: [Permission.ViewAll]}],
        link:'/pages/coming-soon',
        
        
    },
    {
        id: 28,
        label: 'MENUITEMS.SPECIALCOUPONS.TEXT',
        icon: 'bx bxs-discount',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Special_Coupons, claimValue: [Permission.ViewAll]}],
        link:'/pages/coming-soon',
               
    },
    {
        id: 37,
        label: 'MENUITEMS.APPNOTIFICATION.TEXT',
        icon: 'bx bxs-bell-ring',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Notification_Management, claimValue: [Permission.ViewAll]}],
        link: '/private/notifications'
        
          
    },
    {
        id: 39,
        label: 'MENUITEMS.FINANCIALMANAGEMENT.TEXT',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]}, {claimType: Modules.Payment, claimValue: [Permission.ViewAll]}],
        isTitle: true
                
    },
    
    {
        id: 43,
        label: 'MENUITEMS.PAYMENTS.TEXT',
        icon: 'bx bxl-paypal',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Payment, claimValue: [Permission.ViewAll]}],
        link:'/pages/coming-soon',
                
    },
    {
        id: 29,
        label: 'MENUITEMS.SYSTEMLADMINISTRATION.TEXT',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Logs, claimValue: [Permission.ViewAll]},{claimType: Modules.System_Administration, claimValue: [Permission.ViewAll]}],
        isTitle:true
               
    },
    
    {
        id: 34,
        label: 'MENUITEMS.AREAS.TEXT',
        icon: 'dripicons-map',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.System_Administration, claimValue: [Permission.ViewAll]}],
        link: '/private/areas'
               
    },
    {
        id: 30,
        label: 'MENUITEMS.BANKS.TEXT',
        icon: 'bx bxs-bank',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.System_Administration, claimValue: [Permission.ViewAll]}],
        link:'/pages/coming-soon',
               
    },
    {
        id: 35,
        label: 'MENUITEMS.CITIES.TEXT',
        icon: 'bx bxs-city',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.System_Administration, claimValue: [Permission.ViewAll]}],
        link: '/private/cities'
               
    },
    {
        id: 32,
        label: 'MENUITEMS.COUNTRIES.TEXT',
        icon: 'bx bx-globe',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.System_Administration, claimValue: [Permission.ViewAll]}],
        link: '/private/countries',
               
    },
    {
        id: 31,
        label: 'MENUITEMS.CURRENCIES.TEXT',
        icon: 'bx bx-money',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.System_Administration, claimValue: [Permission.ViewAll]}],
        link:'/pages/coming-soon',
               
    },
    {
        id: 50,
        label: 'MENUITEMS.LOGS.TEXT',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Logs, claimValue: [Permission.ViewAll]}],
        icon:  'bx bx-error',
        link:'/private/logs',
                
    },
    {
        id: 40,
        label: 'MENUITEMS.TAX.TEXT',
        icon: 'bx bxs-dollar-circle',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.System_Administration, claimValue: [Permission.ViewAll]}],
        link:'/pages/coming-soon',
                
    },
    {
        id: 36,
        label: 'MENUITEMS.NOTIFICATIONMANAGEMENT.TEXT',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Social_Media, claimValue: [Permission.ViewAll]},],
        isTitle: true
          
    },
       
    {
        id: 38,
        label: 'MENUITEMS.SOCIALMEDIASET.TEXT',
        icon:  'bx bxl-facebook-circle',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Social_Media, claimValue: [Permission.ViewAll]},{claimType: Modules.Complaints, claimValue: [Permission.ViewAll]}],
        link:'/pages/coming-soon',
                
    },
    {
        id: 48,
        label: 'MENUITEMS.COMPLAINTS.TEXT',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Complaints, claimValue: [Permission.ViewAll]}],
        icon:  'bx bx-error',
        link:'/pages/coming-soon',
                
    },
   
    
   
    
    
];