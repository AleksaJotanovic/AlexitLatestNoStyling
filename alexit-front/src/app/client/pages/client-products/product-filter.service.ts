import { Injectable } from '@angular/core';
import { Product } from '../../../../models/product.model';
import { AlexitService } from '../../../services/alexit.service';

@Injectable({
  providedIn: 'root'
})
export class ProductFilterService {

  constructor(private alexit: AlexitService) { }


  initProducts(products: Product[], categoryId: string) {
    this.alexit.products$.subscribe({ next: prods => products = prods.filter(p => p.category._id === categoryId) });
  }

  cpuFiltersCheck(products: Product[], categoryId: string, manufacturers: string) {
    if (manufacturers !== undefined) {
      let manufacturersArray: string[] = manufacturers.split(",");
      if (manufacturersArray.length > 0) {
        this.initProducts(products, categoryId);
        products = products.filter(p => {
          for (let spec of p.specifications) {
            if (spec.key === 'Brand' && manufacturersArray.includes(spec.value)) {
              return true;
            }
          }
          return false;
        });
      }
    } else {
      this.initProducts(products, categoryId);
    }
  }

}
