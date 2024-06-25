import { Component, OnInit } from '@angular/core';
import { Product } from '../../../../../models/product.model';
import { AlexitService } from '../../../../services/alexit.service';
import { ProductCardComponent } from '../../../pages/client-products/client-products-page/product-card/product-card.component';
import { NgFor } from '@angular/common';
import { MyLibraryService } from '../../../../services/my-library.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'products-on-discount',
  standalone: true,
  imports: [ProductCardComponent, NgFor, RouterLink],
  templateUrl: './products-on-discount.component.html',
  styleUrl: './products-on-discount.component.css'
})
export class ProductsOnDiscountComponent implements OnInit {

  products: Product[] = [];



  constructor(private alexit: AlexitService, public $: MyLibraryService) { }
  ngOnInit(): void {
    this.alexit.products$.subscribe({ next: v => this.products = v.filter(p => p.price.onDiscount.state === true) });
  }



  addToCart(e: any) {
    console.log(e);
  }

  addToFavorites(e: any) {
    console.log(e);
  }


}