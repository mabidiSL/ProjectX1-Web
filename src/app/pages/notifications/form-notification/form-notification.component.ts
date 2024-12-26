/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { selectDataLoading, selectedNotification } from 'src/app/store/notification/notification-selector';
import { addNotificationlist, getNotificationById, updateNotificationlist } from 'src/app/store/notification/notification.action';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Notification } from 'src/app/store/notification/notification.model';
import { DatepickerConfigService } from 'src/app/core/services/date.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/bs-datepicker.config';
import { FormUtilService } from 'src/app/core/services/form-util.service';
import { fetchCustomerlistData } from 'src/app/store/customer/customer.action';
import { Customer } from 'src/app/store/customer/customer.model';
import { selectData } from 'src/app/store/customer/customer-selector';
//import { Bold, Essentials, Italic, Mention, Paragraph, Undo } from '@ckeditor';


@Component({
  selector: 'app-form-notification',
  templateUrl: './form-notification.component.html',
  styleUrl: './form-notification.component.css'
})
export class FormNotificationComponent implements OnInit {
  
  @Input() type: string;
  notifForm: UntypedFormGroup;
  formError: string | null = null;
  formSubmitted = false;
  private destroy$ = new Subject<void>();

  notificationlist$: Observable<Notification[]>;
  loading$: Observable<boolean>;
  bsConfig: Partial<BsDatepickerConfig>;
  originalNotificationData: Notification = {}; 
  userList: Customer[];


  messageDesc: string = '';
  public Editor = ClassicEditor;
  

  submitted: boolean = false;
  error: string = '';
  isEditing: boolean = false;
  @ViewChild('formElement', { static: false }) formElement: ElementRef;

  
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute, 
    private router: Router,
    private datepickerConfigService: DatepickerConfigService,
    private formUtilService: FormUtilService,
    public store: Store) {
      this.loading$ = this.store.pipe(select(selectDataLoading)); 
      this.store.dispatch(fetchCustomerlistData({page: 1, itemsPerPage: 1000,query:'', role: 3 }));
      this.notifForm = this.formBuilder.group({
        id: [null],
        title: ['', Validators.required],
        description: ['' , Validators.required],
        title_ar: ['', Validators.required],
        description_ar: ['',  Validators.required],
        user_id: [null]
        
      });
      this.bsConfig = this.datepickerConfigService.getConfig();
     }
  // set the currenr year
  year: number = new Date().getFullYear();
  ngOnInit() {
    
    this.fetchCustomers();
    const notifId = this.route.snapshot.params['id'];
    if (notifId) {
      if (this.type === 'view') {
        this.formUtilService.disableFormControls(this.notifForm);
       }
      // Dispatch action to retrieve the notif by ID
      this.store.dispatch(getNotificationById({ notificationId: notifId }));
      
      // Subscribe to the selected notif from the store
      this.store
        .pipe(select(selectedNotification), takeUntil(this.destroy$))
        .subscribe(Notif => {
          if (Notif) {
            
            this.patchValueForm(Notif);
            this.originalNotificationData = { ...Notif };
            this.isEditing = true;

          }
        });
    }
   
  }
  fetchCustomers(){
    this.store.select(selectData).subscribe(data=>{
      this.userList = data
    });
  }
  patchValueForm(notification: Notification){
    this.notifForm.patchValue(notification);
    this.notifForm.patchValue({
      title: notification.translation_data[0].title,
      title_ar: notification.translation_data[1].title,
      description: notification.translation_data[0].description,
      description_ar: notification.translation_data[1].description

    });

  }

createNotificationFromForm(formValue): Notification{

  const notification = formValue;
  
  notification.translation_data= [];
  const enFields = [
    { field: 'title', name: 'title' },
    { field: 'description', name: 'description' },

       
  ];
  const arFields = [
    { field: 'title_ar', name: 'title' },
    { field: 'description_ar', name: 'description' },

        ];
  
  // Create the English translation if valid
  const enTranslation = this.formUtilService.createTranslation(notification,'en', enFields);
  if (enTranslation) {
    notification.translation_data.push(enTranslation);
  }

  // Create the Arabic translation if valid
  const arTranslation = this.formUtilService.createTranslation(notification,'ar', arFields);
  if (arTranslation) {
    notification.translation_data.push(arTranslation);
  }
  if(notification.translation_data.length <= 0)
    delete notification.translation_data;
     
  // Dynamically remove properties that are undefined or null at the top level of city object
    Object.keys(notification).forEach(key => {
      if (notification[key] === undefined || notification[key] === null) {
        delete notification[key];  // Delete property if it's undefined or null
      }
    });
    delete notification.title;
    delete notification.title_ar;
    delete notification.description;
    delete notification.description_ar;
  
  return notification;
 
}
  /**
   * On submit form
   */
  onSubmit() {
    this.formSubmitted = true;

    if (this.notifForm.invalid) {
      this.formError = 'Please complete all required fields.';
      Object.keys(this.notifForm.controls).forEach(control => {
        this.notifForm.get(control).markAsTouched();
      });
      this.formUtilService.focusOnFirstInvalid(this.notifForm);
      return;
    }
    this.formError = null;
      const newData = this.notifForm.value;
      
        if(!this.isEditing)
        {           
              const payload = this.notifForm.value;
              delete payload.id;             
              //Dispatch Action
              this.store.dispatch(addNotificationlist({ newData: this.createNotificationFromForm(newData)}));
        }
        else
        {
          
          const updatedDta = this.formUtilService.detectChanges(this.notifForm, this.originalNotificationData);

          if (Object.keys(updatedDta).length > 0) {
            updatedDta.id = this.notifForm.value.id;
            this.store.dispatch(updateNotificationlist({ updatedData: this.createNotificationFromForm(updatedDta), route:'' }));
          }
          else{
            this.formError = 'Nothing has been changed!!!';
            this.formUtilService.scrollToTopOfForm(this.formElement);
          }
        }
   
  }
 
  onEditorChange(event: any){
    this.messageDesc = event.editor.getData(); // Get the updated content
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  onCancel(){
   
    this.notifForm.reset();
    this.router.navigateByUrl('/private/notifications/list');
  }
  toggleViewMode(){
    this.router.navigateByUrl('/private/notifications/list');
}

}