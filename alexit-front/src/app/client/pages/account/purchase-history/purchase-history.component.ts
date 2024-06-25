import { Component, OnInit } from '@angular/core';
import { Product } from '../../../../../models/product.model';
import { AlexitService } from '../../../../services/alexit.service';
import { CrudService } from '../../../../services/crud.service';
import { User } from '../../../../../models/user.model';
import { money } from '../../../../../middlewares/library';

@Component({
  selector: 'purchase-history',
  standalone: true,
  imports: [],
  templateUrl: './purchase-history.component.html',
  styleUrl: './purchase-history.component.css'
})
export class PurchaseHistoryComponent implements OnInit {

  products: Product[] = [];



  constructor(private crud: CrudService) { }
  ngOnInit(): void {
    this.crud.userGet(String(localStorage.getItem('customer_id'))).subscribe(v => {
      let user: User = v.data;
      this.products = user.purchaseHistory.map(v => v.product);
      console.log(this.products);
    });
  }


  price(value: number) {
    return money(value);
  }


}
