import { Component, Input } from '@angular/core';
import { Order } from '../../../../../../models/order.model';

@Component({
  selector: 'items',
  standalone: true,
  imports: [],
  templateUrl: './items.component.html',
  styleUrl: './items.component.css'
})
export class ItemsComponent {

  @Input() order!: Order;

}
