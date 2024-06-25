import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Order } from '../../../../../../models/order.model';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'order-details',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent implements OnInit {

  @Output() onUpdate = new EventEmitter<{ updateForm: FormGroup, statusChanged: boolean }>();

  @Output() onSaleGenerate = new EventEmitter();

  @Input() order!: Order;

  @Input() orderStatusList!: { id: number, value: string }[];


  updateForm: FormGroup = new FormGroup({
    isPaid: new FormControl(null),
    orderStatus: new FormControl(''),
    orderStatusMessage: new FormControl('')
  });

  statusChanged: boolean = false;



  ngOnInit(): void {
    this.updateForm.patchValue({
      isPaid: this.order.paid,
      orderStatus: this.order.status
    });
  }



  emitOnUpdate() {
    this.onUpdate.emit({ updateForm: this.updateForm, statusChanged: this.statusChanged });
  }

  emitOnSaleGenerate() {
    this.onSaleGenerate.emit();
  }

  toDate(val: string) {
    return new Date(val);
  }


}
