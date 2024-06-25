import { Component, OnInit } from '@angular/core';
import { SalesFiltersComponent } from './sales-filters/sales-filters.component';
import { SalesTableComponent } from './sales-table/sales-table.component';
import { Category } from '../../../../models/category.model';
import { Sale } from '../../../../models/sale.model';
import { AlexitService } from '../../../services/alexit.service';
import { salesReportHtml } from '../../../../middlewares/htmls';
import { sum } from '../../../../middlewares/library';

@Component({
  selector: 'sales',
  standalone: true,
  imports: [SalesFiltersComponent, SalesTableComponent],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css'
})
export class SalesComponent implements OnInit {

  sales: Sale[] = [];

  categories: Category[] = [];

  categoryFilter: string = '';

  codeFilter: string = '';

  nameFilter: string = '';

  totals = { quantity: 0, taxBase: 0, vatAmount: 0, saleValue: 0 };

  dateRange = { from: '', to: '' };



  constructor(private alexit: AlexitService) { }

  ngOnInit(): void {
    this.alexit.categories$.subscribe({ next: (val) => this.categories = val, error: (err) => console.log(err) });
    this.alexit.sales$.subscribe({
      next: (val) => {
        this.sales = val.sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf());
        this.initTotals();
        if (this.sales.length > 0) {
          const from = new Date(this.sales[this.sales.length - 1].createdAt).toISOString().substring(0, 10);
          const to = new Date(this.sales[0].createdAt).toISOString().substring(0, 10);
          this.dateRange = { from: from, to: to };
        }
      }, error: (err) => console.log(err),
    });
  }



  initTotals() {
    this.totals.quantity = sum(this.sales, 'quantity');
    this.totals.taxBase = sum(this.sales, 'taxBase');
    this.totals.vatAmount = sum(this.sales, 'vat');
    this.totals.saleValue = sum(this.sales, 'saleValue');
  }

  filterByCategory(e: { categoryFilter: string }) {
    this.categoryFilter = e.categoryFilter;
  }
  filterByCode(e: { codeFilter: string }) {
    this.codeFilter = e.codeFilter;
  }
  filterByName(e: { nameFilter: string }) {
    this.nameFilter = e.nameFilter;
  }
  filterByDateRange() {
    if (this.dateRange.from !== '' && this.dateRange.to !== '') {
      this.alexit.sales$.subscribe({ next: v => this.sales = v });
      const start = new Date(this.dateRange.from);
      const end = new Date(this.dateRange.to);
      end.setDate(end.getDate() + 1);
      this.sales = this.sales.filter(s => (new Date(s.createdAt) >= start && new Date(s.createdAt) <= end));
      this.initTotals();
    } else {
      alert('Must define date range to show sales by data range');
      this.alexit.sales$.subscribe({ next: v => this.sales = v });
    }
  }

  printSalesReport() {
    if (this.dateRange.from !== '' && this.dateRange.to !== '') {
      let x = window.open();
      x?.document.open();
      x?.document.write(salesReportHtml(this.dateRange, this.sales, this.totals));
      x?.print();
      x?.close();
    } else {
      alert('First you must define date range for sales report that you want to print!');
    }
  }

}
