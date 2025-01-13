/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })

export class DashboardService {
    constructor(private readonly HttpClient: HttpClient) {
    }
    getStatistics(rateDuration: string,offerViewImpressionDuration: string, offerViewImpressionPeriod: number): Observable<any>{
        const params = {
            rateDuration: rateDuration,
            offerViewImpressionDuration: offerViewImpressionDuration,
            offerViewImpressionPeriod: offerViewImpressionPeriod
        };
        return this.HttpClient.get<any>(`${environment.baseURL}/dashboard`, {params});

    }
    
    getRangeDescription(dateRanges: any[]){
    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
      ];
      // Helper function to calculate the ISO week number
      const getWeekNumber = (date) => {
        const startDate = new Date(date.getFullYear(), 0, 1); // Start of the year
        const days = Math.floor((date.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)); // Days since start of the year
        const weekNumber =  Math.ceil((days + startDate.getDay() + 1) / 7); // ISO Week number
        if (weekNumber > 52) {
            return 1;
          }
          return weekNumber;
     };
      console.log(dateRanges);
      
      // Helper function to calculate the difference in days
      const getDaysDifference = (start, end) => {
        const startDate = new Date(start).getTime();
        const endDate = new Date(end).getTime();
        return Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
      };
      
      
      
      // Mapping logic with sorting
      const mappedRanges = dateRanges
        .map(range => {
          const [start, end] = range.split(" - ");
          const daysDiff = getDaysDifference(start, end);
      
          if (daysDiff >= 28 && daysDiff <= 31) {
            // Likely a month
            const month = new Date(start).getMonth();
            const year = new Date(start).getFullYear();
            return { type: "month", value: monthNames[month], year, order: year * 12 + month }; // Order for sorting
          } else if (daysDiff >= 365 && daysDiff <= 366) {
            // Likely a year
            const year = new Date(start).getFullYear();
            return { type: "year", value: year, order: year }; // Order for sorting
          } else if (daysDiff <= 7) {
           // Likely a week
            const startDate = new Date(start);
            const weekNumber = getWeekNumber(startDate); // Get correct week number
            const year = startDate.getFullYear();
            return { type: "week", value: `Week ${weekNumber}`, year, order: year * 100 + weekNumber }; // Order for sorting
            } else {
                return { type: "unknown", value: "Unknown range", order: Infinity }; // Fallback for unexpected ranges
            }
        })
        .sort((a, b) => a.order - b.order) // Sort by order
        .map(item => item.value); // Extract the final values
      
      console.log(mappedRanges);
      return mappedRanges;
      }
      
}