import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { selectDataLoading, selectNotificationById } from 'src/app/store/notification/notification-selector';
import { addNotificationlist, getNotificationById, updateNotificationlist } from 'src/app/store/notification/notification.action';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { DatepickerConfigService } from 'src/app/core/services/date.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/bs-datepicker.config';
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

  notificationlist$: Observable<any[]>;
  loading$: Observable<any>;
  bsConfig: Partial<BsDatepickerConfig>;


  messageDesc: string = '';
  public Editor = ClassicEditor;
  // public config = {
  //   toolbar: [ 'undo', 'redo', '|', 'bold', 'italic' ],
  //   plugins: [
  //       Bold, Essentials, Italic, Mention, Paragraph, SlashCommand, Undo
  //   ]
  // }

  submitted: any = false;
  error: any = '';
  isEditing: boolean = false;
 
  
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute, 
    private router: Router,
    private datepickerConfigService: DatepickerConfigService,
    public store: Store) {
      this.loading$ = this.store.pipe(select(selectDataLoading)); 

      this.notifForm = this.formBuilder.group({
        id: [''],
        cronExpression:[''],
        title: ['', Validators.required],
        description: [''],
        userId: [9]
        
      });
      this.bsConfig = this.datepickerConfigService.getConfig();
     }
  // set the currenr year
  year: number = new Date().getFullYear();
  ngOnInit() {
    

    const notifId = this.route.snapshot.params['id'];
    console.log('Notif ID from snapshot:', notifId);
    if (notifId) {
      // Dispatch action to retrieve the notif by ID
      this.store.dispatch(getNotificationById({ notificationId: notifId }));
      
      // Subscribe to the selected notif from the store
      this.store
        .pipe(select(selectNotificationById(notifId)), takeUntil(this.destroy$))
        .subscribe(Notif => {
          if (Notif) {
            console.log('Retrieved Notif:', Notif);
           
            this.notifForm.patchValue(Notif);
            this.isEditing = true;

          }
        });
    }
   
  }
parseToCronExpression(date : any): any{

  const parseDate = new Date(date);
  const mins = parseDate.getMinutes();
  const hours = parseDate.getHours();
  const day = parseDate.getDate();
  const month = parseDate.getMonth() + 1;
  const year = parseDate.getFullYear();
  const cronExp = `${mins} ${hours} ${day} ${month} ${year}`; 
  return cronExp;
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
      this.focusOnFirstInvalid();
      return;
    }
    this.formError = null;
      const newData = this.notifForm.value;
      
          if(!this.isEditing)
            {           
              const payload = this.notifForm.value;
              delete payload.id;

              const notificationData = {
                userId: "9",
                payload: {
                  title: payload.title,
                  description: payload.description,
                  cronExpression: this.parseToCronExpression(payload.cronExpression)
                }
              };
             
              console.log(notificationData);
              //Dispatch Action
              this.store.dispatch(addNotificationlist({ newData: notificationData}));
        }
        else
        {
          console.log('updating notif');
          this.store.dispatch(updateNotificationlist({ updatedData: newData }));
        }
   
  }
  private focusOnFirstInvalid() {
    const firstInvalidControl = this.getFirstInvalidControl();
    if (firstInvalidControl) {
      firstInvalidControl.focus();
    }
  }

  private getFirstInvalidControl(): HTMLInputElement | null {
    const controls = this.notifForm.controls;
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
  onEditorChange(event: any){
    this.messageDesc = event.editor.getData(); // Get the updated content
    console.log(this.messageDesc); // Check the updated content
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  onCancel(){
    console.log('Form status:', this.notifForm.status);
    console.log('Form errors:', this.notifForm.errors);
    this.notifForm.reset();
    this.router.navigateByUrl('/private/notifications');
  }

}