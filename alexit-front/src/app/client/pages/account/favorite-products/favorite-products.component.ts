import { Component, OnInit } from '@angular/core';
import { AlexitService } from '../../../../services/alexit.service';
import { Product } from '../../../../../models/product.model';
import { CrudService } from '../../../../services/crud.service';
import { User } from '../../../../../models/user.model';
import { money } from '../../../../../middlewares/library';

@Component({
  selector: 'favorite-products',
  standalone: true,
  imports: [],
  templateUrl: './favorite-products.component.html',
  styleUrl: './favorite-products.component.css'
})
export class FavoriteProductsComponent implements OnInit {

  products: Product[] = [];



  constructor(private alexit: AlexitService, private crud: CrudService) { }
  ngOnInit(): void {
    this.alexit.products$.subscribe({ next: v => this.products = v });
    this.crud.userGet(String(localStorage.getItem('customer_id'))).subscribe(v => {
      let user: User = v.data;
      let favoritedProduct: string[] = [];
      for (let product of this.products) {
        if (user.favoriteProducts.includes(product._id)) {
          favoritedProduct.push(product._id);
        }
      }
      this.products = this.products.filter(p => favoritedProduct.includes(p._id));
      console.log(this.products);
    });
  }


  price(value: number) {
    return money(value);
  }



}
