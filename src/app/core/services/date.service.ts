import { Injectable } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Injectable({
  providedIn: 'root',
})
export class DatepickerConfigService {
  getConfig(): Partial<BsDatepickerConfig> {
    return {
      isDisabled : false,
      minDate: new Date(), 
      dateInputFormat: 'YYYY-MM-DD', 
    };
  }
}