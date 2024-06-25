import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../../models/product.model';

@Pipe({
  name: 'publishedFilter',
  standalone: true
})
export class PublishedFilterPipe implements PipeTransform {

  transform(value: Product[], input: any): any {
    if (input === true) {
      return value.filter((val) => val.published === true);
    } else if (input === false) {
      return value.filter((val) => val.published === false)
    } else if (input === null) {
      return value;
    }
  }

}
