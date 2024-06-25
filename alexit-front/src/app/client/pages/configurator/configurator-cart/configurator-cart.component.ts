import { Component, OnInit } from '@angular/core';
import { AlexitService } from '../../../../services/alexit.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CrudService } from '../../../../services/crud.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { NgStyle } from '@angular/common';
import { Courier } from '../../../../../models/courier.model';
import { User } from '../../../../../models/user.model';
import { areObjectsEqual, arePropertiesEmpty, money } from '../../../../../middlewares/library';
import { Router } from '@angular/router';
import { AccountlessCustomer } from '../../../../../models/accountless-customer.model';

@Component({
  selector: 'configurator-cart',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgxMaskDirective, NgStyle],
  templateUrl: './configurator-cart.component.html',
  styleUrl: './configurator-cart.component.css',
  providers: [provideNgxMask()]
})
export class ConfiguratorCartComponent implements OnInit {

  creditCardForm: FormGroup = new FormGroup({
    number: new FormControl(''),
    expiryDate: new FormControl(''),
    cvv: new FormControl('')
  });

  couriers: Courier[] = [];

  user!: User;

  order: any;

  choosenCourier: any = {};

  paymentMethod = { creditCard: false, cashOnDelivery: false };



  constructor(private alexit: AlexitService, private crud: CrudService, private router: Router) { }
  ngOnInit(): void {
    this.order = JSON.parse(String(localStorage.getItem("order")));
    this.alexit.couriers$.subscribe({ next: v => this.couriers = v });
    if (localStorage.getItem('customer_id')) {
      this.crud.userGet(String(localStorage.getItem("customer_id"))).subscribe(res => this.user = res.data);
    }
  }



  money(number: number) {
    return money(number);
  }

  arePropertiesEmpty(obj: any) {
    return arePropertiesEmpty(obj);
  }

  addUserCreditCard() {
    this.user = { ...this.user, creditCard: this.creditCardForm.value };
    this.alexit.updateUser(this.user);
  }


  hasUserCreditCard() {
    if (!arePropertiesEmpty(this.creditCardForm.value)) {
      if (areObjectsEqual(this.user.creditCard, this.creditCardForm.value)) {
        return true
      } else {
        return false
      }
    }
    return false
  };

  setCourier() {
    const shipping = this.choosenCourier.pricelist.find((p: any) => (p.weight.min < this.order.weight && p.weight.max > this.order.weight));
    this.order = {
      ...this.order,
      courier: { _id: this.choosenCourier._id, name: this.choosenCourier.name },
      shippingCost: shipping.price,
      grandTotal: this.order.subtotal + shipping.price,
    };
  }


  sendOrder() {
    this.order = {
      ...this.order,
      paymentMethod: this.paymentMethod,
      paid: this.hasUserCreditCard()
    };
    this.alexit.addOrder(this.order);
    localStorage.removeItem("order");
    if (!localStorage.getItem("order")) {
      this.router.navigate(['/']);
    }
  }


}
