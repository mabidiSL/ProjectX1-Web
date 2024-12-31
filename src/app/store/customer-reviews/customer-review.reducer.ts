// src/app/CustomerReviewlist.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { fetchCustomerReviewlistData, fetchCustomerReviewlistFail, fetchCustomerReviewlistSuccess, getCustomerReviewById, getCustomerReviewByIdFailure, getCustomerReviewByIdSuccess} from './customer-review.action';
import { CustomerReview } from './customer-review.model';

export interface CustomerReviewlistState {
  CustomerReviewListdata: CustomerReview[];
  totalItems: number;
  selectedCustomerReview: CustomerReview;
  loading: boolean;
  error: string;
}

export const initialState: CustomerReviewlistState = {
  CustomerReviewListdata: [],
  totalItems: 0,
  selectedCustomerReview: null,
  loading: false,
  error: null,
};

export const CustomerReviewListReducer = createReducer(
  initialState,
  on(fetchCustomerReviewlistData, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(fetchCustomerReviewlistSuccess, (state, { CustomerReviewListdata }) => ({
    ...state,
    CustomerReviewListdata: CustomerReviewListdata.data,
    totalItems:CustomerReviewListdata.totalItems,
    loading: false,
    error: null
  })),
  on(fetchCustomerReviewlistFail, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  //Handle getting CustomerReview by id
  on(getCustomerReviewById, (state) => ({
    ...state,
    loading: true,
    error: null 
  })),
  // Handle success of getting CustomerReview by ID and store the CustomerReview object in the state
   on(getCustomerReviewByIdSuccess, (state, { customer }) => ({
    ...state,
    selectedCustomerReview: customer,
    loading: false,
    error: null
  })),
// Handle success of getting CustomerReview by ID and store the CustomerReview object in the state
on(getCustomerReviewByIdFailure, (state, { error }) => ({
  ...state,
  error,
  loading: false, 
})),
);
