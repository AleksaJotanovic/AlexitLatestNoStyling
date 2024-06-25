import { Component, OnInit } from '@angular/core';
import { AlexitService } from '../../../../services/alexit.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../../../models/product.model';
import { money } from '../../../../../middlewares/library';
import { CartService } from '../../../services/cart.service';
import { CrudService } from '../../../../services/crud.service';
import { User } from '../../../../../models/user.model';

@Component({
  selector: 'product-details',
  standalone: true,
  imports: [],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {

  product!: Product | undefined;



  constructor(private alexit: AlexitService, private route: ActivatedRoute, private cartService: CartService, private crud: CrudService) { }
  ngOnInit(): void {
    this.route.params.subscribe(v => this.alexit.products$.subscribe(prods => {
      const product = prods.find(p => p._id === v['productId']);
      this.product = product ? product : undefined;
    }));

    if (localStorage.getItem('customer_id')) {
      this.crud.userGet(String(localStorage.getItem('customer_id'))).subscribe(v => {
        let user: User = v.data;
        if (this.product) {
          if (!user.previouslyViewed.includes(this.product._id)) {
            user.previouslyViewed.push(this.product._id);
            this.alexit.updateUser(user);
          }
        }
      });
    }
  }



  price(value: number) {
    return money(value);
  }


  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  addToFavorites(id: string) {
    if (localStorage.getItem('customer_id')) {
      this.crud.userGet(String(localStorage.getItem('customer_id'))).subscribe(v => {
        let user: User = v.data;
        if (!user.favoriteProducts.includes(id)) {
          user.favoriteProducts.push(id);
          this.alexit.updateUser(user);
        }
      });
    } else {
      alert('You must be logged in to put product among favorites!');
    }
  }


}
