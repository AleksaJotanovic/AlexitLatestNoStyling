import { Component, OnInit } from '@angular/core';
import { Product } from '../../../../../models/product.model';
import { money } from '../../../../../middlewares/library';
import { CrudService } from '../../../../services/crud.service';
import { AlexitService } from '../../../../services/alexit.service';
import { User } from '../../../../../models/user.model';

@Component({
  selector: 'previously-viewed',
  standalone: true,
  imports: [],
  templateUrl: './previously-viewed.component.html',
  styleUrl: './previously-viewed.component.css'
})
export class PreviouslyViewedComponent implements OnInit {

  products: Product[] = [];



  constructor(private crud: CrudService, private alexit: AlexitService) { }
  ngOnInit(): void {
    this.alexit.products$.subscribe({ next: v => this.products = v });
    this.crud.userGet(String(localStorage.getItem('customer_id'))).subscribe(v => {
      let user: User = v.data;
      let prevViewedProds: string[] = [];
      for (let product of this.products) {
        if (user.previouslyViewed.includes(product._id)) {
          prevViewedProds.push(product._id);
        }
      }
      this.products = this.products.filter(p => prevViewedProds.includes(p._id));
    });
  }


  price(value: number) {
    return money(value);
  }


}
