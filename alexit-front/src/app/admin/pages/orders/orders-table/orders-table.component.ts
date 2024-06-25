import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Order } from '../../../../../models/order.model';
import { AlexitService } from '../../../../services/alexit.service';

@Component({
  selector: 'orders-table',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './orders-table.component.html',
  styleUrl: './orders-table.component.css'
})
export class OrdersTableComponent implements OnInit {


  orders: Order[] = [];




  constructor(private alexit: AlexitService) { }
  ngOnInit(): void {
    this.alexit.orders$.subscribe({
      next: v => {
        this.orders = v.sort((a, b) => new Date(b.creationTime).valueOf() - new Date(a.creationTime).valueOf());
      }, error: (err) => console.log(err)
    });
  }


  delete(id: string) {
    this.alexit.deleteOrder(id)
  }


  toDate(val: string) {
    return new Date(val).toLocaleDateString();
  }
  withCommas(number: number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

}
