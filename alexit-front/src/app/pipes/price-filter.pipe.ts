import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../../models/product.model';

@Pipe({
  name: 'priceFilter',
  standalone: true
})
export class PriceFilterPipe implements PipeTransform {

  transform(value: Product[], input: string): any {
    if (input === 'asc') {
      return value.sort((a, b) => a.price.sale - b.price.sale);
    } else if (input === 'desc') {
      return value.sort((a, b) => b.price.sale - a.price.sale);
    } else if (input === '') {
      return value;
    }
  }

}
