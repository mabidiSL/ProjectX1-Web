import { _User } from "../Authentication/auth.models";

export interface GiftCardListModel {
    
        id?: string;
        name?: string;
        transName?: string;
        termsAndConditions?: string;
        transTermsAndConditions?: string;
        codeGiftCard?: string;
        qrCode?: string;
        urlStore?: string;
        country?: any;// Country;
        area?: any;// Area;
        city?: any; // City;
        quantity?: number;
        merchantId?: string;
        merchant?: _User;
        storeId?: string;
        store?: any;//Store;
        managerName?: string;
        managerPhone?: string;
        startDateGiftCard?: Date;
        endDateGiftCard?: Date;
        contractRepName?: string;
        sectionOrderAppearnance?: string;
        categoryOrderAppearnce?: string;
        merchantLogo?: string;
        GiftCardLogo?: string;
        GiftCardType?: string;// free,discountPercent,discountAmount,servicePrice
        GiftCardValueBeforeDiscount?:number;
        GiftCardValueAfterDiscount?:number;
        PaymentDiscountRate?: number;
        status?: any;//pending,approved,active, expired, closed
        }