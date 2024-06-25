import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MyLibraryService {

  constructor() { }


  subtractPercentage(number: number, percentage: number): number {
    const subtractedValue = number - (number * (percentage / 100));
    return subtractedValue;
  }


  money(number: number) {
    return Math.round(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' RSD';
  };



}
