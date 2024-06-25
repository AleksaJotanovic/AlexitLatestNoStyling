import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../../models/product.model';

@Pipe({
  name: 'ctgFilter',
  standalone: true
})
export class CtgFilterPipe implements PipeTransform {

  transform(value: Product[], input: string): any {
    if (input) {
      return value.filter((val) => val.category.name === input);
    } else {
      return value;
    }
  }

}
