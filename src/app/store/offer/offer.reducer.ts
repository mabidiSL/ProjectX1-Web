// src/app/Offerlist.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {  addOfferlist, addOfferlistFailure, addOfferlistSuccess, deleteOfferlist, deleteOfferlistFailure, deleteOfferlistSuccess, fetchOfferlistData, fetchOfferlistFail, fetchOfferlistSuccess, getOfferById, getOfferByIdFailure, getOfferByIdSuccess, updateOfferlist, updateOfferlistFailure, updateOfferlistSuccess } from './offer.action';
import { Offer } from './offer.model';

export interface OfferlistState {
  OfferListdata: Offer[];
  currentPage: number;
  totalItems: number;
  selectedOffer: Offer;
  loading: boolean;
  error: string;
}

export const initialState: OfferlistState = {
  OfferListdata: [],
  currentPage: 1,
  totalItems: 0,
  selectedOffer: null,
  loading: false,
  error: null,
};

export const OfferListReducer = createReducer(
  initialState,
  on(fetchOfferlistData, (state, { page }) => ({
    ...state,
    currentPage: page,
    loading: true,
    error: null
  })),
  on(fetchOfferlistSuccess, (state, { OfferListdata }) => ({
    ...state,
    OfferListdata: OfferListdata.data,
    totalItems: OfferListdata.totalItems,
    loading: false,
    error: null 

  })),
  on(fetchOfferlistFail, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
   //Handle adding Offer 
   on(addOfferlist, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  //Handle adding Offer success
  on(addOfferlistSuccess, (state, { newData }) => ({
    ...state,
    OfferListdata: [newData,...state.OfferListdata ],
    loading: false,
    error: null

  })),
  //Handle adding Offer failure
  on(addOfferlistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false, 
  })),
    //Handle getting Offer by id
    on(getOfferById, (state) => ({
      ...state,
      loading: true,
      error: null 
    })),
  // Handle success of getting Offer by ID and store the Offer object in the state
   on(getOfferByIdSuccess, (state, { Offer }) => ({
    ...state,
    selectedOffer: Offer,
    loading: false,
    error: null

  })),
// Handle failure of getting Offer by ID and store the Offer object in the state
on(getOfferByIdFailure, (state, { error }) => ({
  ...state,
  error,
  loading: false, 
})),
// Handle updating Coupon list
on(updateOfferlist, (state) => ({
  ...state,
  loading: true,
  error: null 
})),
 // Handle updating Offer status
  on(updateOfferlistSuccess, (state, { updatedData }) => {
   const OfferListUpdated = state.OfferListdata.map(item => item.id === updatedData.id ? updatedData : item );
   return {
      ...state,
      OfferListdata: OfferListUpdated,
      loading: false,
      error: null 
    };
  }),
   // Handle updating Offer failure
   on(updateOfferlistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false 
  })),
  // Handle deleting Offer 
  on(deleteOfferlist, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  // Handle the success of deleting a Offer
  on(deleteOfferlistSuccess, (state, { OfferId }) => {
    const updatedOfferList = state.OfferListdata.filter(Offer => Offer.id !== OfferId);
    return { 
    ...state,
    OfferListdata: updatedOfferList,
    loading: false,
    error: null};
  }),
  // Handle failure of deleting a Offer
  on(deleteOfferlistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
