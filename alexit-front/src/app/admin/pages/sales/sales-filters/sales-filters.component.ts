import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../../../../../models/category.model';
import { FormsModule } from '@angular/forms';
import { SaleByCtgPipe } from '../../../pipes/sale-by-ctg.pipe';
import { CtgIfPipe } from '../../../../pipes/ctg-if.pipe';

@Component({
  selector: 'sales-filters',
  standalone: true,
  imports: [FormsModule, SaleByCtgPipe, CtgIfPipe],
  templateUrl: './sales-filters.component.html',
  styleUrl: './sales-filters.component.css'
})
export class SalesFiltersComponent {

  @Input() categories!: Category[];
  @Input() dateRange!: { from: string; to: string }

  @Output() onCategoryFilter = new EventEmitter<{ categoryFilter: string }>();
  @Output() onCodeFilter = new EventEmitter<{ codeFilter: string }>();
  @Output() onNameFilter = new EventEmitter<{ nameFilter: string }>();
  @Output() onDateRange = new EventEmitter();

  categoryFilter: string = '';
  codeFilter: string = '';
  nameFilter: string = '';



  emitOnCategoryFilter() {
    this.onCategoryFilter.emit({ categoryFilter: this.categoryFilter });
  }
  emitOnCodeFilter() {
    this.onCodeFilter.emit({ codeFilter: this.codeFilter });
  }
  emitOnNameFilter() {
    this.onNameFilter.emit({ nameFilter: this.nameFilter });
  }
  emitOnDateRange() {
    this.onDateRange.emit();
  }

}
