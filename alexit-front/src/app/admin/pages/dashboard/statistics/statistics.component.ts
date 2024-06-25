import { NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { addCharAtIndex, groupByYear } from '../../../../../middlewares/library';
import { StatPeriodPipe } from '../../../pipes/stat-period.pipe';
import { FormsModule } from '@angular/forms';
import { Sale } from '../../../../../models/sale.model';

@Component({
  selector: 'statistics',
  standalone: true,
  imports: [NgStyle, StatPeriodPipe, FormsModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent implements OnInit {

  @Input() sales!: Sale[];
  @Input() statistics!: { month: string; total: number; }[];
  @Output() onYearFilter = new EventEmitter<{ yearFilter: number }>();

  years: number[] = [];
  yearFilter: number = 0;



  ngOnInit(): void {
    if (this.sales.length > 0) {
      this.years = groupByYear(this.sales).map(s => s.fullYear).sort((a, b) => b - a).slice(1)
    };
  }



  barHeight(total: number) {
    const totalString = String(total);
    let value = '';
    if (totalString.length >= 3) {
      value = addCharAtIndex(totalString, '.', 2).substring(0, 5) + '%';
    } else if (totalString.length >= 1 && totalString.length < 3) {
      value = totalString + '%';
    }
    return value;
  };

  lastYear() {
    return new Date(this.sales[this.sales.length - 1].createdAt).getFullYear();
  }

  money(number: number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  emitOnYearFilter() {
    this.onYearFilter.emit({ yearFilter: this.yearFilter });
  }

}
