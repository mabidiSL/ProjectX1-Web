// src/app/Paymentlist.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {  addPaymentlist, addPaymentlistFailure, addPaymentlistSuccess, deletePaymentlist, deletePaymentlistFailure, deletePaymentlistSuccess, fetchPaymentlistData, fetchPaymentlistFail, fetchPaymentlistSuccess, getPaymentById, getPaymentByIdFailure, getPaymentByIdSuccess, updatePaymentlist, updatePaymentlistFailure, updatePaymentlistSuccess } from './payment.action';
import { Payment } from './payment.model';

export interface PaymentlistState {
  PaymentListdata: Payment[];
  currentPage: number;
  totalItems: number;
  selectedPayment: Payment;
  loading: boolean;
  error: string;
}

export const initialState: PaymentlistState = {
  PaymentListdata: [],
  currentPage: 1,
  totalItems: 0,
  selectedPayment: null,
  loading: false,
  error: null,
};

export const PaymentListReducer = createReducer(
  initialState,
  on(fetchPaymentlistData, (state, { page }) => ({
    ...state,
    currentPage: page,
    loading: true,
    error: null
  })),
  on(fetchPaymentlistSuccess, (state, { PaymentListdata }) => ({
    ...state,
    PaymentListdata: PaymentListdata.data,
    totalItems: PaymentListdata.totalItems,
    loading: false,
    error: null

  })),
  on(fetchPaymentlistFail, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  //Handle adding Payment 
  on(addPaymentlist, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),

  //Handle adding Payment success
  on(addPaymentlistSuccess, (state, { newData }) => ({
    ...state,
    PaymentListdata: [newData,...state.PaymentListdata ],
    loading: false,
    error: null
  })),
    //Handle adding Payment failure
  on(addPaymentlistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false 
  })),
  //Handle getting Payment by id
  on(getPaymentById, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  // Handle success of getting coupon by ID and store the coupon object in the state
   on(getPaymentByIdSuccess, (state, { coupon }) => ({
    ...state,
    selectedPayment: coupon,
    loading: false,
    error: null
  })),
  // Handle success of getting coupon by ID and store the coupon object in the state
  on(getPaymentByIdFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false, 
  })),
  // Handle updating Payment list
  on(updatePaymentlist, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
// Handle updating Payment success
  on(updatePaymentlistSuccess, (state, { updatedData }) => {
   const PaymentListUpdated = state.PaymentListdata.map(item => item.id === updatedData.id ? updatedData : item );
   return {
      ...state,
      PaymentListdata: PaymentListUpdated,
      loading: false,
      error: null
    };
  }),
  // Handle updating Payment failure
  on(updatePaymentlistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false 
  })),
  // Handle deleting Payment 
  on(deletePaymentlist, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  // Handle the success of deleting a Payment
  on(deletePaymentlistSuccess, (state, { couponId }) => {
    const updatedPaymentList = state.PaymentListdata.filter(Payment => Payment.id !== couponId);
    return { 
    ...state,
    PaymentListdata: updatedPaymentList,
    loading: false,
    error: null
  };
  }),
  // Handle failure of deleting a Payment
  on(deletePaymentlistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
