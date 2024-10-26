import { createAction, props } from '@ngrx/store';
import { CouponListModel } from './coupon.model';
import { AnyMxRecord } from 'dns';
import { a2 } from '@fullcalendar/core/internal-common';

// fetch all list
export const fetchCouponlistData = createAction('[Data] fetch Couponlist',props<{ page: number; itemsPerPage: number, status?: string }>());
export const fetchCouponlistSuccess = createAction('[Data] fetch Couponlist success', props<{ CouponListdata: any }>())
export const fetchCouponlistFail = createAction('[Data fetch Couponlist failed]', props<{ error: string }>())

// Add Data
export const addCouponlist = createAction('[Data] Add Couponlist',  props<{ newData: CouponListModel }>());
export const addCouponlistSuccess = createAction('[Data] Add Couponlist Success', props<{ newData: any }>());
export const addCouponlistFailure = createAction('[Data] Add Couponlist Failure', props<{ error: string }>());

//get coupon by ID
export const getCouponById = createAction('[Data] get Coupon', props<{ couponId: string }>());
export const getCouponByIdSuccess = createAction('[Data] get Coupon success', props<{ coupon: any }>());
export const getCouponByIdFailure = createAction('[Data] get Coupon Failure', props<{ error: string }>());

// Update Data
export const updateCouponlist = createAction('[Data] Update Couponlist', props<{ updatedData: CouponListModel }>());
export const updateCouponlistSuccess = createAction('[Data] Update Couponlist Success', props<{ updatedData: CouponListModel }>());
export const updateCouponlistFailure = createAction('[Data] Update Couponlist Failure', props<{ error: string }>());

// Delete Data
export const deleteCouponlist = createAction('[Data] Delete Couponlist', props<{ couponId: string }>());
export const deleteCouponlistSuccess = createAction('[Data] Delete Couponlist Success', props<{ couponId: string }>());
export const deleteCouponlistFailure = createAction('[Data] Delete Couponlist Failure', props<{ error: string }>());