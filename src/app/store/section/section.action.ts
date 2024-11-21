import { createAction, props } from '@ngrx/store';
import { SectionListModel } from './section.model';

// fetch all list
export const fetchSectionlistData = createAction('[Data] fetch Sectionlist',props<{ page: number; itemsPerPage: number, status: string }>());
export const fetchSectionlistSuccess = createAction('[Data] fetch Sectionlist success', props<{ SectionListdata: SectionListModel[] }>())
export const fetchSectionlistFail = createAction('[Data fetch Sectionlist failed]', props<{ error: string }>())


