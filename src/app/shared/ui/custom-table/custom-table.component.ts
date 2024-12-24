/* eslint-disable @angular-eslint/no-output-on-prefix */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild, OnInit, OnChanges } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import {  Observable } from 'rxjs';
import { _User } from 'src/app/store/Authentication/auth.models';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/auth.service';


@Component({
  selector: 'app-custom-table',
  templateUrl: './custom-table.component.html',
  styleUrl: './custom-table.component.css'
})
export class CustomTableComponent implements OnInit, OnChanges  {


  @Input() pageTitle?: string;
  @Input() addButtonLink?: string;
  @Input() addButtonLabel?: string;
  @Input() addButtonPermission?: any[];
  @Input() columns: any[];
  @Input() statusList?: any[];
  @Input() datePicker?: boolean = false;

  @Input() viewButtonLink?: string;
  @Input() viewButtonPermission?: any[];

  @Input() editButtonLink?: string;
  @Input() editButtonPermission?: any[];
  @Input() deleteButtonPermission?: any[];

  @Input() approveButtonPermission?: any[];
  @Input() declineButtonPermission?: any[];

  @Input() ArrayData: any[] = [];
  @Input() totalItems: number ;

  searchTerm : string = '';
  pageSize : number = 10;
  approveAction : boolean = false;
  loading : boolean = false;
  items : any[] = [];

  @Input() checkedStatus?: any;
  @Input() uncheckedStatus?: any;
  @Input() pending?: boolean = false;



  @Output() pageChanged = new EventEmitter();
  @Output() onsearch = new EventEmitter();
  @Output() toggleDropdown = new EventEmitter();
  @Output() applyFilter = new EventEmitter();
  @Output() printData = new EventEmitter();
  @Output() downloadData = new EventEmitter();
  @Output() onChangeEvent = new EventEmitter();
  @Output() onPageSizeChanged = new EventEmitter();

  @Output() onDelete? = new EventEmitter();
  @Output() onApprove? = new EventEmitter();
  @Output() onFilter? = new EventEmitter();

  public currentUser: Observable<_User>;
  filterByStatus: string = null;
  filterByStartDate: Date = null;
  filterByEndDate: Date = null;



   // Tracks the currently sorted column
   sortedColumn: string | null = null;
   // Tracks the sorting direction: 'asc' for ascending or 'desc' for descending
   sortDirection: 'asc' | 'desc' = 'asc';
  
  @ViewChild('removeItemModal', { static: false }) removeItemModal?: ModalDirective;
  idToDelete : any;
  isDropdownOpen: boolean = false;
  isMerchant: boolean = false;

  filteredArray : any[] = [];
  originalArray : any[] = [];


  filters = [
    { value: 'All', label: 'All' },
    { value: 'Name', label: 'Name' },
    { value: 'City', label: 'City' },
    { value: 'Status', label: 'Status' },
    { value: 'Phone', label: 'Phone' }
  ];
  constructor(
    private DatePipe: DatePipe, 
    private router: Router,
    private  translateService : TranslateService, 
    private authService: AuthenticationService

  ) {
    
    //The retreival of arabic attribute from backendside is done in this component according to the language stored in cookie service


    this.authService.currentUser$.subscribe(user => {
      if (user) {
      if(user.role.translation_data[0].name !== 'Admin')
      { this.isMerchant = true;}
    }});
   }

  ngOnInit(){
    

    this.items = [
      { label: this.translateService.instant('Previous'), class: 'prev' },
      { label: this.translateService.instant('Next'), class: 'next' }
    ];
    //this.originalArray = this.ArrayData;
    setTimeout(() => {
    this.filteredArray = this.ArrayData;
    this.loading = false; // Set loading to false once data is ready
  }, 1000);
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes.ArrayData) {
       this.filteredArray = changes.ArrayData.currentValue; // Reset filtered data when ArrayData changes
      //this.searchEvent(); // Reapply search filter if there's a term
    }
  }
  
  getProperty(data: any, propertyPath: string): any {
   

    const keys = propertyPath.split('.');
    let value = keys.reduce((acc, key) => 
      {
        if (key.includes('[') && key.includes(']')) {
            const arrayKey = key.slice(0, key.indexOf('[')); 
            const index = parseInt(key.slice(key.indexOf('[') + 1, key.indexOf(']'))); 
            return acc && acc[arrayKey] ? acc[arrayKey][index] : undefined;
        }
        
        return acc ? acc[key] : undefined;
    }, data);

    this.approveAction = (value === 'pending');

    if (typeof value === 'string') {
      // We will use a regex to verify if the string is in ISO 8601 format
      const iso8601Pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

      // If the value matches the ISO 8601 format, parse it as a Date
      if (iso8601Pattern.test(value)) {
          value = new Date(value);  
      }
  }

  if (value instanceof Date && !isNaN(value.getTime())) {
      return this.DatePipe.transform(value, 'short');  
  }

  return value;
   
  }
  onPageSizeChange(event: any){
    this.onPageSizeChanged.emit(event);
  }
  pageChangedEvent(event: any) {
    this.pageChanged.emit(event);
  }
sortData(column: string): void {
  if (this.sortedColumn === column) {
    // Toggle sorting direction if the same column is clicked
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    // Set new column and default to ascending
    this.sortedColumn = column;
    this.sortDirection = 'asc';
  }

  // Perform the sorting
  this.filteredArray.sort((a, b) => {
    const valueA = a[column];
    const valueB = b[column];

    // Handle null or undefined values
    if (valueA == null || valueB == null) {
      return valueA == null ? (this.sortDirection === 'asc' ? 1 : -1) : (this.sortDirection === 'asc' ? -1 : 1);
    }

    // Handle date comparison
    if (Date.parse(valueA) && Date.parse(valueB)) {
      const dateA = new Date(valueA).getTime();
      const dateB = new Date(valueB).getTime();
      return this.sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }

    // Handle numeric comparison
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return this.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
    }

    // Handle string comparison (case insensitive)
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      const compareResult = valueA.trim().toLowerCase().localeCompare(valueB.trim().toLowerCase());
      return this.sortDirection === 'asc' ? compareResult : -compareResult;
    }

    // Fallback for other data types
    return 0;
  });
}

  // searchEvent() {
  //   if (this.searchTerm) {
  //     this.filteredArray = this.ArrayData.filter(item => 
  //       this.columns.some(column => 
  //         this.getProperty(item, column.property)?.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
  //       )
  //     );
  //   } else {
  //     this.filteredArray = this.ArrayData; 
  //   }
  // }
    
  searchEvent(){
    this.onsearch.emit(this.searchTerm)
  }

  toggleDropdownEvent() {
    this.isDropdownOpen = !this.isDropdownOpen ;
  }

  applyFilterEvent(filter: string) {
    this.applyFilter.emit(filter);
  }

  printDataEvent() {
    this.printData.emit();
  }

  // downloadDataEvent() {
  //   this.downloadData.emit();
  // }

  onChangeEventEmit(data: any, event1:any) {
    const target = event1.target as HTMLElement; // Ensure you have the correct type
    const isChecked = target.classList.contains('checked');
   
    const event = {checked: !isChecked};
    this.onChangeEvent.emit({ data, event } );
  }
  approveItem(item: any, action: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: action == 'approve' ?  'Yes, Approve it!':  'Yes, Decline it!'
      
    }).then(result => {
      if (result.isConfirmed) {
        item.status = action == 'approve' ?  'active':  'refused';
        this.onApprove.emit(item);
        //this.onChangeEvent.emit({item , action});
       
      }
    });
  }

  //Delete Data
  deleteData(id: any) {
    this.idToDelete = id;
    this.removeItemModal?.show();
  }

  onConfirm() {
    this.removeItemModal?.hide();
    this.onDelete.emit(this.idToDelete);
  }

  downloadDataEvent() {
    const pdf = new jsPDF();

    pdf.setFontSize(18); // Set font size for title
    pdf.text('Hello World', 14, 22);

    // Capture the HTML content of the table
    const tableElement = document.getElementById('userList-table'); // Use the ID of your table
    if (tableElement) {
      html2canvas(tableElement).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 190; // Adjust width as needed
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        const position = 0;
        // Add the image to the PDF
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        pdf.save('download.pdf'); // Save the PDF
      });
    }
  }
  navigateToView(data: any) {

  if(this.pending !== undefined){

    this.router.navigate([`${this.viewButtonLink}`, data.id], { 
      state: { fromPending: this.pending }
    });
  }
  else{
    this.router.navigate([`${this.viewButtonLink}`, data.id]);
  }
}
selectStatus(event: any){
  if(event)
    this.filterByStatus = event.target.value
     console.log(event.target.value);
  
}
selectStartDate(event: any){
  if(event)
    this.filterByStartDate = event.target.value
     console.log(event.target.value);
  
}
selectEndDate(event: any){
  if(event)
    this.filterByEndDate = event.target.value
     console.log(event.target.value);
  
}
Filter(){
  if(this.filterByStatus || this.filterByStartDate || this.filterByEndDate)
    this.onFilter.emit({status:this.filterByStatus, startdate:this.filterByStartDate, enddate: this.filterByEndDate} );

}
}