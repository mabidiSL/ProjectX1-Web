/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/Sectionlist.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { fetchSectionlistData, fetchSectionlistFail, fetchSectionlistSuccess } from './section.action';

export interface SectionlistState {
  SectionListdata: any[];
  currentPage: number;
  selectedSection: any,
  loading: boolean;
  error: any;
}

export const initialState: SectionlistState = {
  SectionListdata: [],
  currentPage: 1,
  selectedSection: null,
  loading: false,
  error: null,
};

export const SectionListReducer = createReducer(
  initialState,
  on(fetchSectionlistData, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(fetchSectionlistSuccess, (state, { SectionListdata }) => ({
    ...state,
    SectionListdata: SectionListdata,
    loading: false
  })),
  on(fetchSectionlistFail, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
 
);
