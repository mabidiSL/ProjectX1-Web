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
        label: 'MENUITEMS.USERMANAGEMENT.TEXT',
        isTitle: true,
        claims: [{claimType: Modules.All, claimValue: [Permission.All]}]

    },
    {
        id: 4,
        label: 'MENUITEMS.EMPLOYEES.TEXT',
        icon: 'bxs-user-pin',
        link: '/private/employees',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Employees, claimValue: [Permission.ViewAll]}]
       

    },
    {
        id: 5,
        label: 'MENUITEMS.ROLESETUP.TEXT',
        icon: 'bxs-user-pin',
        link: '/private/roles',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Role, claimValue: [Permission.ViewAll]}]
    },
    {
        id: 6,
        label: 'MENUITEMS.CUSTOMERS.TEXT',
        icon: 'bxs-user-detail',
        link:'/pages/coming-soon',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]}]

    },
    {
        id: 7,
        label: 'MENUITEMS.MERCHANTSMANAGEMENT.TEXT',
        isTitle: true,
        claims: [{claimType: Modules.All, claimValue: [Permission.All]}]

    },
    {
        id: 8,
        label: 'MENUITEMS.MERCHANTSLIST.TEXT',
        link: '/private/merchants/list',
        icon: 'bx bx-store',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]}]

        
    },
    // {
    //     id: 9,
    //     label: 'MENUITEMS.MERCHANTSAPPROVAL.TEXT',
    //     link: '/private/merchants/approve',
    //     icon: 'bx bx-store',
    //     claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Merchants, claimValue: [Permission.Approve, Permission.Decline]}]

        
    // },
     {
        id: 10,
        label: 'MENUITEMS.STORES.TEXT',
        link: '/private/stores',
        icon: 'bx bx-store',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Stores, claimValue: [Permission.ViewAll]}]

        
    },
    // {
    //     id: 10,
    //     label: 'MENUITEMS.PENDINGSTORES.TEXT',
    //     link: '/private/stores/approve',
    //     icon: 'bx bx-store',
    //     claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Stores, claimValue: [Permission.ViewAll,Permission.Approve, Permission.Decline]}]

        
    // },
    {  id: 12,
        label: 'MENUITEMS.OFFERS.TEXT',
        icon:  'bx bxs-offer',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Offers, claimValue: [Permission.ViewAll]}],

        link:'/pages/coming-soon',
        
    },
    {
        id: 18,
        label: 'MENUITEMS.PRODUCTMANAGEMENT.TEXT',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]}],
        isTitle: true
    },
    
    {
        id: 21,
        label: 'MENUITEMS.COUPONMANAGEMENT.TEXT',
        icon: 'bx bxs-coupon',
        link: '/private/coupons',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Coupons, claimValue: [Permission.ViewAll]}],
       
    },
   
    {
        id: 22,
        label: 'MENUITEMS.COUPONAPPROVAL.TEXT',
        icon: 'bx bxs-coupon',
        link: '/private/coupons/approve',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Coupons, claimValue: [Permission.ViewAll,Permission.Approve, Permission.Decline]}],
       
    },
    
    {
        id: 24,
        label: 'MENUITEMS.GIFTS.TEXT',
        icon: 'bx bxs-gift',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Gift_Cards, claimValue: [Permission.ViewAll]}],
        link:'/private/giftCards',
    },
    {
        id: 49,
        label: 'MENUITEMS.PENDINGGIFTS.TEXT',
        icon: 'bx bxs-gift',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Gift_Cards, claimValue: [Permission.ViewAll,Permission.Approve, Permission.Decline]}],
        link:'/private/giftCards/approve',
    },
    {
        id: 19,
        label: 'MENUITEMS.SUBSCRIPTION.TEXT',
        icon:  'bx bx-bell',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Subscriptions, claimValue: [Permission.ViewAll]}],
        link:'/pages/coming-soon',
    },
    {
        id: 20,
        label: 'MENUITEMS.COMPANYSUBSCRIPTION.TEXT',
        icon: 'bx bxs-report',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Company_Subscriptions, claimValue: [Permission.ViewAll]}],
        link:'/pages/coming-soon',
    },
    {
        id: 23,
        label: 'MENUITEMS.PREPRINTEDMEMBERSHIP.TEXT',
        icon: 'bx bxs-user-badge',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.PrePrinted_Membership, claimValue: [Permission.ViewAll]}],
        link:'/pages/coming-soon',
    },
   
    {
        id: 13,
        label: 'MENUITEMS.DEPARTMENTMANAGEMENT.TEXT',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Department, claimValue: [Permission.ViewAll]}],
        isTitle: true
    }, 
    {
        id: 14,
        label: 'MENUITEMS.DEPARTMENTLIST.TEXT',
        icon: 'bx bx-building-house',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Department, claimValue: [Permission.ViewAll]}],
        link:'/pages/coming-soon',
    },          
    {
        id: 15,
        label: 'MENUITEMS.WALLETMANAGEMENT.TEXT',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]}],

        isTitle: true
    }, 
    {
        id: 16,
        label: 'MENUITEMS.MERCHANTWALLET.TEXT',
        icon: 'bx bx-wallet-alt',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Merchant_Wallet, claimValue: [Permission.ViewAll]}],
        link:'/pages/coming-soon',
    }, 
    {
        id: 17,
        label: 'MENUITEMS.CUSTOMERWALLET.TEXT',
        icon: 'bx bx-wallet',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Customer_Wallet, claimValue: [Permission.ViewAll]}],
        link:'/pages/coming-soon',
    }, 
   
    {
        id: 25,
        label: 'MENUITEMS.MARKETINGMANAGEMENT.TEXT',
        icon: 'bx-receipt',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]}],
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
        id: 29,
        label: 'MENUITEMS.SYSTEMLADMINISTRATION.TEXT',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.System_Administration, claimValue: [Permission.ViewAll]}],
        isTitle:true
               
    },
    {
        id: 30,
        label: 'MENUITEMS.BANKS.TEXT',
        icon: 'bx bxs-bank',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.System_Administration, claimValue: [Permission.ViewAll]}],
        link:'/pages/coming-soon',
               
    },
    {
        id: 31,
        label: 'MENUITEMS.CURRENCIES.TEXT',
        icon: 'bx bx-money',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.System_Administration, claimValue: [Permission.ViewAll]}],
        link:'/pages/coming-soon',
               
    },
    {
        id: 32,
        label: 'MENUITEMS.COUNTRIES.TEXT',
        icon: 'bx bx-globe',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.System_Administration, claimValue: [Permission.ViewAll]}],
        link: '/private/countries',
               
    },
    {
        id: 34,
        label: 'MENUITEMS.AREAS.TEXT',
        icon: 'dripicons-map',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.System_Administration, claimValue: [Permission.ViewAll]}],
        link: '/private/areas'
               
    },
    {
        id: 35,
        label: 'MENUITEMS.CITIES.TEXT',
        icon: 'bx bxs-city',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.System_Administration, claimValue: [Permission.ViewAll]}],
        link: '/private/cities'
               
    },
    
    {
        id: 36,
        label: 'MENUITEMS.NOTIFICATIONMANAGEMENT.TEXT',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Notification_Management, claimValue: [Permission.ViewAll]}],
        isTitle: true
          
    },
    {
        id: 37,
        label: 'MENUITEMS.APPNOTIFICATION.TEXT',
        icon: 'bx bxs-bell-ring',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Notification_Management, claimValue: [Permission.ViewAll]}],
        link: '/private/notifications'
        
          
    },
    
    {
        id: 38,
        label: 'MENUITEMS.SOCIALMEDIASET.TEXT',
        icon:  'bx bxl-facebook-circle',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Social_Media, claimValue: [Permission.ViewAll]}],
        link:'/pages/coming-soon',
                
    },
   
    {
        id: 39,
        label: 'MENUITEMS.FINANCIALMANAGEMENT.TEXT',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]}],
        isTitle: true
                
    },
    {
        id: 40,
        label: 'MENUITEMS.TAX.TEXT',
        icon: 'bx bxs-dollar-circle',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.System_Administration, claimValue: [Permission.ViewAll]}],
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
        id: 43,
        label: 'MENUITEMS.PAYMENTS.TEXT',
        icon: 'bx bxl-paypal',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Payment, claimValue: [Permission.ViewAll]}],
        link:'/pages/coming-soon',
                
    },
    {
        id: 44,
        label: 'MENUITEMS.CONTRACTSANDFOLLOWUPS.TEXT',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]}],
        isTitle: true
                
    },
    {
        id: 45,
        label: 'MENUITEMS.CONTRACTS.TEXT',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Contracts, claimValue: [Permission.ViewAll]}],
        icon: 'bx bxs-briefcase-alt-2',
        link:'/pages/coming-soon',
                
    },
    {
        id: 46,
        label: 'MENUITEMS.MISSIONS.TEXT',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Missions, claimValue: [Permission.ViewAll]}],
        icon: 'bx bxs-briefcase-alt-2',
        link:'/pages/coming-soon',
                
    },
    {
        id: 47,
        label: 'MENUITEMS.DELEGATESTATISTICS.TEXT',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Delegate_Statistics, claimValue: [Permission.ViewAll]}],
        icon: 'bx bx-stats',
        link:'/pages/coming-soon',
                
    },
    {
        id: 48,
        label: 'MENUITEMS.COMPLAINTS.TEXT',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Complaints, claimValue: [Permission.ViewAll]}],
        icon:  'bx bx-error',
        link:'/pages/coming-soon',
                
    },
    {
        id: 50,
        label: 'MENUITEMS.LOGS.TEXT',
        claims: [{claimType: Modules.All, claimValue: [Permission.All]},{claimType: Modules.Complaints, claimValue: [Permission.ViewAll]}],
        icon:  'bx bx-error',
        link:'/private/logs',
                
    }
    
];