import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { addArealist,  getAreaById, updateArealist } from 'src/app/store/area/area.action';
import { selectAreaById, selectDataLoading } from 'src/app/store/area/area-selector';
import { fetchCountrylistData } from 'src/app/store/country/country.action';
import { selectDataCountry } from 'src/app/store/country/country-selector';
import { CountryListModel } from '../../../store/country/country.model';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { AreaListModel } from 'src/app/store/area/area.model';



@Component({
  selector: 'app-form-area',
  templateUrl: './form-area.component.html',
  styleUrl: './form-area.component.css'
})

export class FormAreaComponent implements OnInit, OnDestroy {
  
  @Input() type: string;
  areaForm: UntypedFormGroup;
  formError: string | null = null;
  formSubmitted = false;
  loading$: Observable<boolean>;

  private destroy$ = new Subject<void>();
  areaFlagBase64 : string;
  submitted: boolean = false;
  error: string = '';
  successmsg: boolean = false;
  fieldTextType!: boolean;
  imageURL: string | undefined;
  isEditing: boolean = false;
  countries : CountryListModel[];
 
  originalAreaData: AreaListModel = {}; 
  @ViewChild('formElement', { static: false }) formElement: ElementRef;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute, 
    private router: Router,
    private formUtilService: FormUtilService,
    public store: Store) {
     
      this.loading$ = this.store.pipe(select(selectDataLoading)); 
      this.store.dispatch(fetchCountrylistData({ page: 1, itemsPerPage: 1000, status:'active' }));

      this.store.select(selectDataCountry).subscribe(
        countries => {
          this.countries = countries
        })

      this.areaForm = this.formBuilder.group({
        id:[''],
        name: ['', Validators.required],
        name_ar: ['', Validators.required],
        country_id:['', Validators.required]
                   
      });
     }
     
  ngOnInit() {

    const AreaId = this.route.snapshot.params['id'];
    if (AreaId) {
      // Dispatch action to retrieve the Area by ID
      this.store.dispatch(getAreaById({ AreaId }));
      
      // Subscribe to the selected Area from the Area
      this.store
        .pipe(select(selectAreaById(AreaId)), takeUntil(this.destroy$))
        .subscribe(Area => {
          if (Area) {
            this.areaForm.patchValue(Area);
            this.isEditing = true;
            }
        });
    }
   
  }
   
  
  /**
   * On submit form
   */
  onSubmit() {
    this.formSubmitted = true;

    if (this.areaForm.invalid) {
      this.formError = 'Please complete all required fields.';
      Object.keys(this.areaForm.controls).forEach(control => {
        this.areaForm.get(control).markAsTouched();
      });
      this.formUtilService.focusOnFirstInvalid(this.areaForm);
      return;
    }
    this.formError = null;
            
      const newData = this.areaForm.value;
    
      if(!this.isEditing)
        { delete newData.id;
          this.store.dispatch(addArealist({ newData }));          }
        else
        {
          const updatedDta = this.formUtilService.detectChanges<AreaListModel>(this.areaForm, this.originalAreaData);
          if (Object.keys(updatedDta).length > 0) {
            updatedDta.id = newData.id;
            console.log(updatedDta);
            this.store.dispatch(updateArealist({ updatedData: updatedDta }));
          }
          else{
            this.formError = 'Nothing has been changed!!!';
            this.formUtilService.scrollToTopOfForm(this.formElement);
          }
        }
      
    
  }
 
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  onCancel(){
    
    this.areaForm.reset();
    this.router.navigateByUrl('/private/areas');
  }
  getCountryName(id: number){
    return this.countries.find(country => country.id === id)?.name ;
  }
  toggleViewMode(){
    this.router.navigateByUrl('/private/areas');

}
}

