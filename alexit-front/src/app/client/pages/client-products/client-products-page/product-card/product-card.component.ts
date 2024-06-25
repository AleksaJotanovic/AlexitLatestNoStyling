import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../../../../../models/product.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'product-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {

  @Input() product!: Product;

  @Output() onAddToCart = new EventEmitter<{ product: Product }>();
  @Output() onAddToFavorites = new EventEmitter<{ id: string }>();



  emitOnAddToCart() {
    this.onAddToCart.emit({ product: this.product });
  }

  emitOnAddToFavorites(id: string) {
    this.onAddToFavorites.emit({ id: id });
  }

}
