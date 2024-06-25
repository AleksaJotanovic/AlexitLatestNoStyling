import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Sale } from '../../../../../models/sale.model';
import { SaleByCtgPipe } from '../../../pipes/sale-by-ctg.pipe';
import { SaleByCodePipe } from '../../../pipes/sale-by-code.pipe';
import { SaleByNamePipe } from '../../../pipes/sale-by-name.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'sales-table',
  standalone: true,
  imports: [SaleByCtgPipe, SaleByCodePipe, SaleByNamePipe, FormsModule],
  templateUrl: './sales-table.component.html',
  styleUrl: './sales-table.component.css'
})
export class SalesTableComponent {

  @Input() sales!: Sale[];
  @Input() categoryFilter!: string;
  @Input() codeFilter!: string;
  @Input() nameFilter!: string;
  @Input() totals!: { quantity: number; taxBase: number; vatAmount: number; saleValue: number; };

  @Output() onSalesReportPrint = new EventEmitter();



  emitOnSalesReportPrint() {
    this.onSalesReportPrint.emit();
  }

  money(value: number) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

}
