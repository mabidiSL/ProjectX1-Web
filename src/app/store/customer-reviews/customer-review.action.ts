import { createAction, props } from '@ngrx/store';
import { CustomerReview, CustomerReviewListModel } from './customer-review.model';

// fetch all list
export const fetchCustomerReviewlistData = createAction('[Data] fetch CustomerReviewlist', props<{ page?: number; itemsPerPage?: number, query?:string, category?: string}>());
export const fetchCustomerReviewlistSuccess = createAction('[Data] fetch CustomerReviewlist success', props<{ CustomerReviewListdata: CustomerReviewListModel}>())
export const fetchCustomerReviewlistFail = createAction('[Data fetch CustomerReviewlist failed]', props<{ error: string }>())

//get CustomerReview by ID
export const getCustomerReviewById = createAction('[Data] get CustomerReview', props<{ customerId: number }>());
export const getCustomerReviewByIdSuccess = createAction('[Data] get CustomerReview success', props<{ customer: CustomerReview }>());
export const getCustomerReviewByIdFailure = createAction('[Data] get CustomerReview Failure', props<{ error: string }>());
