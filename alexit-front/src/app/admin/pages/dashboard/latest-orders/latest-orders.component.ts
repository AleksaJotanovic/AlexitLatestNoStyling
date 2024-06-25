import { Component, Input } from '@angular/core';
import { Order } from '../../../../../models/order.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'latest-orders',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './latest-orders.component.html',
  styleUrl: './latest-orders.component.css'
})
export class LatestOrdersComponent {

  @Input() orders!: Order[];



  createdAt(order: Order) {
    return new Date(order.creationTime).toLocaleTimeString();
  }
  commas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

}
