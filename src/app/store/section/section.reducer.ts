// src/app/Sectionlist.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {  addSectionlistSuccess, deleteSectionlistFailure, deleteSectionlistSuccess, fetchSectionlistData, fetchSectionlistFail, fetchSectionlistSuccess, getSectionByIdSuccess, updateSectionlistSuccess, updateSectionStatusSuccess } from './section.action';

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
  //Handle adding Section success
  on(addSectionlistSuccess, (state, { newData }) => ({
    ...state,
    SectionListdata: [...state.SectionListdata, newData],
    loading: false
  })),
  // Handle success of getting Section by ID and Section the Section object in the state
  on(getSectionByIdSuccess, (state, { Section }) => ({
    ...state,
    selectedSection: Section
  })),
  // Handle updating status  Section list
  on(updateSectionStatusSuccess, (state, { updatedData }) => {
    return {
      ...state,
      SectionListdata: state.SectionListdata.map(item =>
        item.id === updatedData.id ? { ...item, status: updatedData.status } : item
      )
    };
  }),
// Handle updating Section 
  on(updateSectionlistSuccess, (state, { updatedData }) => {
   const SectionListUpdated = state.SectionListdata.map(item => item.id === updatedData.id ? updatedData : item );
   return {
      ...state,
      SectionListdata: SectionListUpdated
    };
  }),
  // Handle the success of deleting a Section
  on(deleteSectionlistSuccess, (state, { SectionId }) => {
    
    const updatedSectionList = state.SectionListdata.filter(Section => Section.id !== SectionId);
    return { 
    ...state,
    SectionListdata: updatedSectionList};
  }),
  // Handle failure of deleting a Section
  on(deleteSectionlistFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);
