import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Order } from '../../../../../../models/order.model';
import { RouterLink } from '@angular/router';
import { AlexitService } from '../../../../../services/alexit.service';

@Component({
  selector: 'accounting',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './accounting.component.html',
  styleUrl: './accounting.component.css'
})
export class AccountingComponent implements OnInit {

  @Input() order!: Order;

  @Input() cashier!: string;

  @Output() onAccountingSend = new EventEmitter();

  @Output() onPdfView = new EventEmitter();



  constructor(private alexit: AlexitService) { }

  ngOnInit(): void {
  }



  emitOnAccountingSend() {
    this.onAccountingSend.emit();
  }

  emitOnPdfView() {
    this.onPdfView.emit();
  }

}
