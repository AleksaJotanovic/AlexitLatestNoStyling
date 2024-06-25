import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../../models/product.model';

@Pipe({
  name: 'stockFilter',
  standalone: true
})
export class StockFilterPipe implements PipeTransform {

  transform(value: Product[], input: any): any {
    if (input === 0) {
      return value.filter((val) => val.inStock === input);
    } else if (input === 1) {
      return value.filter((val) => val.inStock >= input);
    } else if (input === null) {
      return value;
    }
  }

}
