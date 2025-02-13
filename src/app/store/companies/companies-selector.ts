// src/app/merchantlist.selector.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {  CompaniesState } from './companies.reducer';

export const selectDataState = createFeatureSelector<CompaniesState>('CompanyList');

export const selectDataCompany = createSelector(
  selectDataState,
  (state: CompaniesState) => state?.Companiesdata || []
);
export const selectDataTotalItems = createSelector(
  selectDataState,
  (state: CompaniesState) => state?.totalItems || 0
);

export const selectedCompany = createSelector(
    selectDataState,
    (state: CompaniesState) =>  state?.selectedCompany || null
);
export const selectDataLoading = createSelector(
  selectDataState,
  (state: CompaniesState) => state?.loading || false
);

export const selectDataError = createSelector(
  selectDataState,
  (state: CompaniesState) => state?.error || null
);
