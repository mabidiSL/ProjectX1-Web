import { createAction, props } from '@ngrx/store';
import { GiftCardListModel } from './giftCard.model';

// fetch all list
export const fetchGiftCardlistData = createAction('[Data] fetch GiftCardlist',props<{ page: number; itemsPerPage: number, status?: string }>());
export const fetchGiftCardlistSuccess = createAction('[Data] fetch GiftCardlist success', props<{ GiftCardListdata: any }>())
export const fetchGiftCardlistFail = createAction('[Data fetch GiftCardlist failed]', props<{ error: string }>())

// Add Data
export const addGiftCardlist = createAction('[Data] Add GiftCardlist',  props<{ newData: GiftCardListModel }>());
export const addGiftCardlistSuccess = createAction('[Data] Add GiftCardlist Success', props<{ newData: any }>());
export const addGiftCardlistFailure = createAction('[Data] Add GiftCardlist Failure', props<{ error: string }>());

//get GiftCard by ID
export const getGiftCardById = createAction('[Data] get GiftCard', props<{ GiftCardId: string }>());
export const getGiftCardByIdSuccess = createAction('[Data] get GiftCard success', props<{ GiftCard: any }>());
export const getGiftCardByIdFailure = createAction('[Data] get GiftCard Failure', props<{ error: string }>());

// Update Data
export const updateGiftCardlist = createAction('[Data] Update GiftCardlist', props<{ updatedData: GiftCardListModel }>());
export const updateGiftCardlistSuccess = createAction('[Data] Update GiftCardlist Success', props<{ updatedData: GiftCardListModel }>());
export const updateGiftCardlistFailure = createAction('[Data] Update GiftCardlist Failure', props<{ error: string }>());

// Delete Data
export const deleteGiftCardlist = createAction('[Data] Delete GiftCardlist', props<{ GiftCardId: string }>());
export const deleteGiftCardlistSuccess = createAction('[Data] Delete GiftCardlist Success', props<{ GiftCardId: string }>());
export const deleteGiftCardlistFailure = createAction('[Data] Delete GiftCardlist Failure', props<{ error: string }>());