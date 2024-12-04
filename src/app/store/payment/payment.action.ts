import { createAction, props } from '@ngrx/store';
import { Payment, PaymentListModel } from './payment.model';

// fetch all list
export const fetchPaymentlistData = createAction('[Data] fetch Paymentlist',props<{ page: number; itemsPerPage: number, status?: string }>());
export const fetchPaymentlistSuccess = createAction('[Data] fetch Paymentlist success', props<{ PaymentListdata: PaymentListModel }>())
export const fetchPaymentlistFail = createAction('[Data fetch Paymentlist failed]', props<{ error: string }>())

// Add Data
export const addPaymentlist = createAction('[Data] Add Paymentlist',  props<{ newData: Payment }>());
export const addPaymentlistSuccess = createAction('[Data] Add Paymentlist Success', props<{ newData: Payment }>());
export const addPaymentlistFailure = createAction('[Data] Add Paymentlist Failure', props<{ error: string }>());

//get coupon by ID
export const getPaymentById = createAction('[Data] get Payment', props<{ couponId: number }>());
export const getPaymentByIdSuccess = createAction('[Data] get Payment success', props<{ coupon: Payment }>());
export const getPaymentByIdFailure = createAction('[Data] get Payment Failure', props<{ error: string }>());

// Update Data
export const updatePaymentlist = createAction('[Data] Update Paymentlist', props<{ updatedData: Payment }>());
export const updatePaymentlistSuccess = createAction('[Data] Update Paymentlist Success', props<{ updatedData: Payment }>());
export const updatePaymentlistFailure = createAction('[Data] Update Paymentlist Failure', props<{ error: string }>());

// Delete Data
export const deletePaymentlist = createAction('[Data] Delete Paymentlist', props<{ couponId: number }>());
export const deletePaymentlistSuccess = createAction('[Data] Delete Paymentlist Success', props<{ couponId: number }>());
export const deletePaymentlistFailure = createAction('[Data] Delete Paymentlist Failure', props<{ error: string }>());