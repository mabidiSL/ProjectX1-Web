/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, ViewChild, ViewEncapsulation, TemplateRef } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions, EventClickArg, EventApi, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { category,  createEventId } from './data';

import Swal from 'sweetalert2';
import { select, Store } from '@ngrx/store';
import { selectDataLoading, selectDataOffer } from 'src/app/store/offer/offer-selector';
import { combineLatest, filter, forkJoin, map, Observable, take } from 'rxjs';
import { fetchOfferlistData } from 'src/app/store/offer/offer.action';
import { Offer } from 'src/app/store/offer/offer.model';
import multiMonthPlugin from '@fullcalendar/multimonth';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { fetchSpecialDaylistData } from 'src/app/store/specialDay/special.action';
import { selectDataLoadingSpecial, selectDataSpecialDay } from 'src/app/store/specialDay/special-selector';
import { AuthenticationService } from 'src/app/core/services/auth.service';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CalendarComponent implements OnInit {

  modalRef?: BsModalRef;

  // bread crumb items
  breadCrumbItems: Array<object>;

  @ViewChild('modalShow') modalShow: TemplateRef<any>;
  @ViewChild('editmodalShow') editmodalShow: TemplateRef<any>;
  @ViewChild(FullCalendarComponent) calendarComponent: FullCalendarComponent;

  companyId: number =  1;
  formEditData: UntypedFormGroup;
  submitted = false;
  category: any[];
  newEventDate: any;
  editEvent: any;
  calendarEvents: any[] = [];
  offerList: any[] = [];
  eventList: any[] = [];

  loading$: Observable<boolean>;
  loadingDays$: Observable<boolean>;
  loadingState$: Observable<boolean>;
  offerList$: Observable<Offer[]>;
  specialDaysList$: Observable<Offer[]>;

  currentDay: string = null;
  startDateofcurrentDay: string = null;
  endDateofcurrentDay: string = null;
  // event form
  formData: UntypedFormGroup;

  calendarOptions: CalendarOptions = {
    plugins: [
      multiMonthPlugin,
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'multiMonth12Month,dayGridMonth,dayGridWeek,timeGridDay today',
      center: 'title',
      right: 'all special coupon giftcard prevYear,prev,next,nextYear'
    },
    buttonText: {
      multiMonth12Month: 'Year',
      dayGridMonth: 'Month',
      dayGridWeek: 'Week',
      dayGridDay: 'Day',
      all: 'All',
    },
    customButtons: {
    //   todayButton: {
    //     text: 'Today',  // Define the text for the "Today" button
    //     click: () => {
    //       this.calendarComponent.getApi().today();  // Go to today when clicked
    //    },
       
    //  },
    all: {
      text: 'All',
      click: () => {
        this._fetchallEvents();
      }
    },
     coupon: {
      text: 'Coupon',
      click: () => {
        this._fetchOffers('coupon').subscribe({
          next: () => {
              console.log('Offer Data Loaded');
          },
          error: (err) => {
              console.error('Error loading Offers:', err);
          }
      }); 
     },
     // Add a render function to style the button
   
     },
     special: {

      text: 'Special Days',
      click: () => {
        this._fetchSpecialDays('special').subscribe({
          next: () => {
              console.log('Special Days Data Loaded');
          },
          error: (err) => {
              console.error('Error loading Special Days:', err);
          }
      });     }
    }
     ,
     giftcard: {
      text: 'Gift Card',
      click: () => {
        this._fetchOffers('gift-card').subscribe({
          next: () => {
              console.log('Offer Data Loaded');
          },
          error: (err) => {
              console.error('Error loading Offers:', err);
          }
      });  
     }
     },
     
     

},
    nowIndicator: true,
    initialView: "dayGridMonth",
    views: {
      multiMonth12Month: {
        type: 'multiMonth',
        duration: { months: 12 }
      }
    },
    themeSystem: "bootstrap",
    initialEvents: this.offerList,
    weekends: true,
    editable: false,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    //dateClick: this.openModal.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    timeZone: 'UTC',
    eventTimeFormat: { // like '14:30:00'
      hour: '2-digit',
      minute: '2-digit',
      meridiem: true,
      hour12: true
    }
  };
  currentEvents: EventApi[] = [];
  constructor(
    private readonly authservice: AuthenticationService,
    private readonly store: Store,
    private readonly modalService: BsModalService,
    private readonly formBuilder: UntypedFormBuilder
  ) {   
    
    this.authservice.currentUser$.pipe(
      filter(user => user?.companyId != null),  // Ensure we only proceed when companyId is not null
      take(1)  // Take the first emitted value and unsubscribe after that
    ).subscribe(user => {
      this.companyId = user?.companyId;
      console.log('Company ID:', this.companyId);
    });
      this.loading$ = this.store.select(selectDataLoading);
      this.loadingDays$ = this.store.select(selectDataLoadingSpecial);
      this.loadingState$ = combineLatest([this.loading$, this.loadingDays$]).pipe(
        map(([loading, loadingDays]) => loading || loadingDays)
      );
      this.offerList$ = this.store.pipe(select(selectDataOffer)); 
      this.specialDaysList$ = this.store.pipe(select(selectDataSpecialDay));
    //  const  startCurrentMonthDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toLocaleDateString('en-CA');
    //  const endCurrentMonthDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toLocaleDateString('en-CA');
    //  console.log(startCurrentMonthDate, endCurrentMonthDate);
     this.currentDay = new Date().toLocaleDateString('en-CA');
     this.startDateofcurrentDay = new Date(this.currentDay).toLocaleDateString('en-CA');
     this.endDateofcurrentDay = new Date(this.currentDay).toLocaleDateString('en-CA');
    }
  ngOnInit(): void {
   
    this._fetchallEvents();
    this.formData = this.formBuilder.group({
      title: ['', [Validators.required]],
      category: ['', [Validators.required]],
    });

    this.formEditData = this.formBuilder.group({
      editTitle: ['', [Validators.required]],
      editCategory: [],
    });

  }
  private _mergeEvents() {
    // At this point, we have both special days and offers merged into eventList
    console.log('Merged Event List', this.eventList);
    this._fetchData();  // Call any final steps after merging events
  }
  private _fetchallEvents() {
    this.eventList = [];  // Clear the list at the start of a fresh fetch
    forkJoin([this._fetchOffers(null), this._fetchSpecialDays(null)])
    .subscribe({ 
      next:() => {
        console.log("Both fetch operations completed.");

        // After both offers and special days are fetched, process the data
        this._mergeEvents();
      }});
  }
  private _fetchSpecialDays(category: string): Observable<void> {
    return new Observable<void>(observer => {  
      if(this.companyId === null){
      this.companyId = 1;}
        this.store.dispatch(fetchSpecialDaylistData({ page: null, itemsPerPage: null, query:null, startDate: null, endDate: null, company_id: this.companyId }));
        this.specialDaysList$.subscribe({ next:data => {
          const mappedSpecialDays = this._mapSpecialDaysToEvents(data); // Offer the full Special Days list
          if(category === null){
            this.eventList = [...this.eventList, ...mappedSpecialDays.filter(event => 
              !this.eventList.some(e => e.id === event.id)
          )];
          }else{
            this.eventList = mappedSpecialDays;
          }
            observer.next();  // Notify the observer that the fetching is done
            observer.complete();  // Complete the observable
          },
          error: err => {
            console.error("Error fetching special days:", err);
            observer.error(err);  // Notify the observer in case of an error
          }
        });
      });
  }
  
  private _fetchOffers(category: string) : Observable<void>{
    return new Observable<void>(observer => {
    if(this.companyId === 1){
      this.companyId = null;
    }
    this.store.dispatch(fetchOfferlistData({ page: null, itemsPerPage: null, category: category, query:null, startDate: null, endDate: null, company_id: this.companyId, status: 'active' }));
    this.offerList$.subscribe({ next:data => {
      const mappedOffers = this._mapOffersToEvents(data); // Offer the full Offer list
      if(category === null){
        this.eventList = [...this.eventList, ...mappedOffers.filter(event => 
          !this.eventList.some(e => e.id === event.id)
      )];
     }else{
      this.eventList = mappedOffers;
     }
      console.log('Event List',this.eventList);
      observer.next();  // Notify the observer that the fetching is done
      observer.complete();  // Complete the observable
      },
      error: err => {
        console.error("Error fetching offers:", err);
        observer.error(err);  // Notify the observer in case of an error
      }
    });
  });

  }
  //function to map special days to events
  private _mapSpecialDaysToEvents(specialDays: any[]): EventInput[] {
    
    return specialDays.map(special =>{
     const translatedName = special.translation_data?.[0]?.name || 'Unnamed Special Day';
     return {
       id: special.id.toString(),
       title: translatedName,
       start: new Date(special.startDate).toISOString(),
       end: new Date(special.endDate).toISOString(),
       description: special.translation_data?.[0]?.description,
       className:  'bg-warning text-white',
       extendedProps: {
         category: 'Special Day',
         price: 'No Pricing',
         quantity: 0,
         status: null,
         description: special.translation_data?.[0]?.description,
         image: null,
         company: special.company_id
       }
       
     }
    })
 }
  _getEventColor(category: string): string {
    switch (category) {
      case 'gift-card':
        return 'bg-success text-white';
      case 'coupon':
        return 'bg-info text-white';
      default:
        return 'bg-info text-white';
    }
  }
  
  // Function to map offers to calendar events
  _mapOffersToEvents(offers: any[]): EventInput[] {
    return offers.map(offer => {
      const translatedName = offer.translation_data?.[0]?.name || 'Unnamed Offer';
      const storeName = offer.stores?.[0]?.translation_data?.[0]?.name || 'No Store';
      
      return {
        id: offer.id.toString(),
        title: `${translatedName} - ${storeName} [ ${new Date(offer.startDate).toLocaleDateString('en-CA')} to ${new Date(offer.endDate).toLocaleDateString('en-CA')}]`,
        start: new Date(offer.startDate),
        end: new Date(offer.endDate),
        description: offer.translation_data?.[0]?.description,
        className: this._getEventColor(offer.category),
        extendedProps: {
          category: offer.category,
          price: offer.price,
          quantity: offer.quantity,
          status: offer.status,
          description: offer.translation_data?.[0]?.description,
          image: offer.image,
          company: offer.companies?.translation_data?.[0]?.name
        }
      };
    });
  }
  /**
   * Event click modal show
   */
  handleEventClick(clickInfo: EventClickArg) {
    this.editEvent = clickInfo.event;
    console.log(clickInfo.event);
    
    this.formEditData = this.formBuilder.group({
      editTitle: clickInfo.event.title,
      editCategory: clickInfo.event.extendedProps.category,
      editDescription: clickInfo.event.extendedProps.description,

    });
    this.modalRef = this.modalService.show(this.editmodalShow);
  }

  /**
   * Events bind in calender
   * @param events events
   */
  handleEvents(events: EventApi[]) {
    this.currentEvents = events;

  }

 

  get form() {
    return this.formData.controls;
  }

  /**
   * Delete-confirm
   */
  confirm() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.value) {
        this.deleteEventData();
        Swal.fire('Deleted!', 'Event has been deleted.', 'success');
      }
    });
  }

  position() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Event has been saved',
      showConfirmButton: false,
      timer: 1000,
    });
  }

  /**
   * Event add modal
   */
  openModal(event?: any) {
    this.newEventDate = event;
    this.modalRef = this.modalService.show(this.modalShow);
  }

  /**
   * save edit event data
   */
  editEventSave() {
    const editTitle = this.formEditData.get('editTitle').value;
    const editCategory = this.formEditData.get('editCategory').value;

    const editId = this.calendarEvents.findIndex(
      (x) => x.id + '' === this.editEvent.id + ''
    );

    this.editEvent.setProp('title', editTitle);
    this.editEvent.setProp('classNames', editCategory);

    this.calendarEvents[editId] = {
      ...this.editEvent,
      title: editTitle,
      id: this.editEvent.id,
      classNames: editCategory + ' ' + 'text-white',
    };

    this.position();
    this.formEditData = this.formBuilder.group({
      editTitle: '',
      editCategory: '',
    });
    this.modalService.hide();
  }

  /**
   * Delete event
   */
  deleteEventData() {
    this.editEvent.remove();
    this.modalService.hide();
  }

  /**
   * Close event modal
   */
  closeEventModal() {
    this.formData = this.formBuilder.group({
      title: '',
      category: '',
    });
    this.modalService.hide();
  }

  /**
   * Save the event
   */
  saveEvent() {
    if (this.formData.valid) {
      const title = this.formData.get('title').value;
      const className = this.formData.get('category').value;
      const calendarApi = this.newEventDate.view.calendar;
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: this.newEventDate.date,
        end: this.newEventDate.date,
        className: className + ' ' + 'text-white'
      });
      this.position();
      this.formData = this.formBuilder.group({
        title: '',
        category: '',
      });
      this.modalService.hide();
    }
    this.submitted = true;
  }

  /**
   * Fetches the data
   */
  private _fetchData() {
    // Event category
    this.category = category;
    // Calender Event Data
   // this.calendarEvents = calendarEvents;
   //this.calendarEvents = this.offerList;

    // form submit
    this.submitted = false;
  }

  dropList(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.listItems, event.previousIndex, event.currentIndex);
  }
  listItems = ['Event 1', 'Event 2', 'Event 3'];
  handleDrop(event: any): void {
    this.calendarEvents.push({
      title: event.item.data,
      date: event.dateStr,
    });
  }
}
