import { Component, Input, OnInit } from '@angular/core';
  import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
  import { ActivatedRoute, Router } from '@angular/router';
  
  import { select, Store } from '@ngrx/store';
  import {  Observable, Subject, takeUntil } from 'rxjs';
  import { fetchCountrylistData } from 'src/app/store/country/country.action';
  import { selectDataCountry } from 'src/app/store/country/country-selector';
  import { selectDataArea } from 'src/app/store/area/area-selector';

import { fetchArealistData } from 'src/app/store/area/area.action';
import { selectCityById, selectDataLoading } from 'src/app/store/City/city-selector';
import { addCitylist, getCityById, updateCitylist } from 'src/app/store/City/city.action';
  
@Component({
  selector: 'app-form-city',
  templateUrl: './form-city.component.html',
  styleUrl: './form-city.component.css'
})
export class FormCityComponent  implements OnInit {
    
    @Input() type: string;
    cityForm: UntypedFormGroup;
    formError: string | null = null;
    formSubmitted = false;
    loading$: Observable<any>;

    private destroy$ = new Subject<void>();
    submitted: any = false;
    error: any = '';
    successmsg: any = false;
    fieldTextType!: boolean;
    imageURL: string | undefined;
    isEditing: boolean = false;
    countries : any[];
    areas : any[];
    filteredAreas: any[];
    
    
    constructor(
      private formBuilder: UntypedFormBuilder,
      private route: ActivatedRoute, 
      private router: Router,
      public store: Store) {
        
        this.loading$ = this.store.pipe(select(selectDataLoading)); 
        this.store.dispatch(fetchCountrylistData({ page: 1, itemsPerPage: 10, status:'active' }));
        this.store.select(selectDataCountry).subscribe(
          countries => {
            this.countries = countries
          });

        this.store.dispatch(fetchArealistData({ page: 1, itemsPerPage: 10, status:'active' }));
        this.store.select(selectDataArea).subscribe(
            areas => {
              this.areas = areas
            })
        this.cityForm = this.formBuilder.group({
          id:[''],
          name: ['', Validators.required],
          name_ar: ['', Validators.required],
          country_id:['', Validators.required],
          area_id:['', Validators.required],
          longitude: ['long'],
          latitude: ['lat']
                     
        });
       }
    
      
    ngOnInit() {
  
      const CityId = this.route.snapshot.params['id'];
      if (CityId) {
        // Dispatch action to retrieve the city by ID
        this.store.dispatch(getCityById({ CityId }));
        
        // Subscribe to the selected city from the city
        this.store
          .pipe(select(selectCityById(CityId)), takeUntil(this.destroy$))
          .subscribe(city => {
            if (city) {
              this.filteredAreas = this.areas;
              this.cityForm.controls['country_id'].setValue(city.area.country_id);
              this.cityForm.patchValue(city);
              this.isEditing = true;
              }
          });
      }
     
    }
    getCountryName(id: any){
      this.filteredAreas = this.areas.filter(area => area.country_id == id);
      return this.countries.find(country => country.id === id)?.name ;
    }
    getAreaName(id: any){
      return this.filteredAreas.find(area => area.id === id)?.name ;
    }
    /**
     * On submit form
     */
    onSubmit() {
      this.formSubmitted = true;

    if (this.cityForm.invalid) {
      this.formError = 'Please complete all required fields.';
      Object.keys(this.cityForm.controls).forEach(control => {
        this.cityForm.get(control).markAsTouched();
      });
      this.focusOnFirstInvalid();
      return;
    }
    this.formError = null;
    
              
        const newData = this.cityForm.value;
      
        if(!this.isEditing)
          { delete newData.id;
            delete newData.country_id;
            
            this.store.dispatch(addCitylist({ newData }));          }
          else
          { 
            this.store.dispatch(updateCitylist({ updatedData: newData }));
          }
    
    }
    private focusOnFirstInvalid() {
      const firstInvalidControl = this.getFirstInvalidControl();
      if (firstInvalidControl) {
        firstInvalidControl.focus();
      }
    }
  
    private getFirstInvalidControl(): HTMLInputElement | null {
      const controls = this.cityForm.controls;
      for (const key in controls) {
        if (controls[key].invalid) {
          const inputElement = document.getElementById(key) as HTMLInputElement;
          if (inputElement) {
            return inputElement;
          }
        }
      }
      return null;
    }
    onChangeCountrySelection(event : any){
      const country = event.target.value;
      if(country){
        this.filteredAreas = this.areas.filter(area => area.country_id == country);
      }
      else
      {
        this.filteredAreas = [];

      }
      
    }
    ngOnDestroy() {
      this.destroy$.next();
      this.destroy$.complete();
    }
    onCancel(){
     
      this.cityForm.reset();
      this.router.navigateByUrl('/private/cities');
    }
    toggleViewMode(){
      this.router.navigateByUrl('/private/cities');
}
  
  }
  
  
