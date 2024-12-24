import { createAction, props } from '@ngrx/store';
import { Offer, OfferListModel } from './offer.model';

// fetch all list
export const fetchOfferlistData = createAction('[Data] fetch Offerlist',props<{ page: number; itemsPerPage: number,query: string, category: string, status?: string }>());
export const fetchOfferlistSuccess = createAction('[Data] fetch Offerlist success', props<{ OfferListdata: OfferListModel }>())
export const fetchOfferlistFail = createAction('[Data fetch Offerlist failed]', props<{ error: string }>())

// Add Data
export const addOfferlist = createAction('[Data] Add Offerlist',  props<{ newData: Offer , offerType: string}>());
export const addOfferlistSuccess = createAction('[Data] Add Offerlist Success', props<{ newData: Offer }>());
export const addOfferlistFailure = createAction('[Data] Add Offerlist Failure', props<{ error: string }>());

//get Offer by ID
export const getOfferById = createAction('[Data] get Offer', props<{ OfferId: number }>());
export const getOfferByIdSuccess = createAction('[Data] get Offer success', props<{ Offer: Offer }>());
export const getOfferByIdFailure = createAction('[Data] get Offer Failure', props<{ error: string }>());

// Update Data
export const updateOfferlist = createAction('[Data] Update Offerlist', props<{ updatedData: Offer, offerType: string }>());
export const updateOfferlistSuccess = createAction('[Data] Update Offerlist Success', props<{ updatedData: Offer }>());
export const updateOfferlistFailure = createAction('[Data] Update Offerlist Failure', props<{ error: string }>());

// Delete Data
export const deleteOfferlist = createAction('[Data] Delete Offerlist', props<{ OfferId: number }>());
export const deleteOfferlistSuccess = createAction('[Data] Delete Offerlist Success', props<{ OfferId: number }>());
export const deleteOfferlistFailure = createAction('[Data] Delete Offerlist Failure', props<{ error: string }>());