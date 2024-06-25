import { Component, OnInit } from '@angular/core';
import { Courier } from '../../../../models/courier.model';
import { AlexitService } from '../../../services/alexit.service';
import { CartService } from '../../services/cart.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { areObjectsEqual, arePropertiesEmpty, money } from '../../../../middlewares/library';
import { CrudService } from '../../../services/crud.service';
import { User } from '../../../../models/user.model';
import { Router } from '@angular/router';
import { Product } from '../../../../models/product.model';

@Component({
  selector: 'checkout',
  standalone: true,
  imports: [FormsModule, NgxMaskDirective, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
  providers: [provideNgxMask()]
})
export class CheckoutComponent implements OnInit {

  couriers: Courier[] = [];

  user!: User;

  order: any;

  choosenCourier: any = {};

  paymentMethod = { creditCard: false, cashOnDelivery: false };

  creditCardForm: FormGroup = new FormGroup({
    number: new FormControl(''),
    expiryDate: new FormControl(''),
    cvv: new FormControl('')
  });



  constructor(private alexit: AlexitService, private crud: CrudService, private router: Router, private cartService: CartService) { }
  ngOnInit(): void {
    this.order = JSON.parse(String(localStorage.getItem("order")));
    this.alexit.couriers$.subscribe({ next: v => this.couriers = v });
    this.crud.userGet(String(localStorage.getItem("customer_id"))).subscribe(res => this.user = res.data);
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
    } else {
      return false
    }
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

    let productsPurchased: { product: Product, date: string, quantity: string }[] = [];
    for (let item of this.cartService.getCart('cart')) {
      if (!this.user.purchaseHistory.includes({ product: item.product, date: this.order.creationTime, quantity: String(item.quantity) })) {
        productsPurchased.push({ product: item.product, date: this.order.creationTime, quantity: String(item.quantity) });
      }
    }
    this.user = { ...this.user, cart: [], purchaseHistory: productsPurchased };
    if (this.user.cart.length === 0) {
      localStorage.removeItem("cart");
      if (!localStorage.getItem("cart")) {
        this.alexit.updateUser(this.user);
        localStorage.removeItem("order");
      }
    }
    this.cartService.computeCartTotals();
    this.router.navigate(['/']);
  }


}
