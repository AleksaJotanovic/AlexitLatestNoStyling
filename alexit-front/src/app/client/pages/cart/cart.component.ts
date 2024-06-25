import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlexitService } from '../../../services/alexit.service';
import { Courier } from '../../../../models/courier.model';
import { Product } from '../../../../models/product.model';
import { User } from '../../../../models/user.model';
import { RoleFilterPipe } from '../../../pipes/role-filter.pipe';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { roundToNearestTenth, subPercentage } from '../../../../middlewares/library';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'cart',
  standalone: true,
  imports: [ReactiveFormsModule, RoleFilterPipe, FormsModule, NgxMaskDirective],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
  providers: [provideNgxMask()]
})
export class CartComponent implements OnInit {

  users: User[] = [];

  couriers: Courier[] = [];

  cart: { id: string; product: Product; quantity: number; }[] = [];

  totalPrice: number = 0;



  constructor(private alexit: AlexitService, private cartService: CartService, private router: Router) { }
  ngOnInit(): void {
    this.alexit.users$.subscribe({ next: (val) => this.users = val, error: (err) => console.log(err) });
    this.alexit.couriers$.subscribe({ next: (val) => this.couriers = val, error: (err) => console.log(err) });
    this.cart = this.cartService.getCart("cart");
    this.cartService.totalPrice$.subscribe({ next: v => this.totalPrice = v });
  }



  withCommas(number: number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' RSD';
  }

  incrementQuantity(product: Product) {
    this.cartService.addToCart(product);
    this.cart = this.cartService.getCart("cart");
  }

  decrementQuantity(item: any) {
    this.cartService.decrementQuantity(item);
    this.cart = this.cartService.getCart("cart");
  }

  remove(id: string) {
    this.cartService.removeItem("cart", id);
    this.cart = this.cartService.getCart("cart");
  }

  goToPayment() {
    let randomOrderNumber = Math.floor(Math.random() * 1000) + 1000;
    const user = this.users.find(u => u._id === String(localStorage.getItem("customer_id")));

    let orderItems: any[] = [];
    for (let item of this.cart) {
      orderItems.push({
        product_id: item.product._id,
        image: item.product.images[0],
        name: item.product.name,
        price: item.product.price.onDiscount.state ? (subPercentage(item.product.price.sale, item.product.price.onDiscount.rate) * item.quantity) : item.product.price.sale * item.quantity,
        quantity: item.quantity,
        weight: roundToNearestTenth(item.product.weight * item.quantity)
      });
    }

    const totalWeight = orderItems.reduce((prev: number, cur: any) => prev + cur.weight, 0);
    const totalPrice = orderItems.reduce((prev: number, cur: any) => prev + cur.price, 0);

    if (user) {
      const order = {
        number: String(randomOrderNumber),
        user: { _id: user._id, username: user.username, note: '' },
        courier: { _id: '', name: '' },
        pcBuild: false,
        pcBuildName: '',
        status: this.alexit.orderStatusList[0].value,
        paymentMethod: { creditCard: false, cashOnDelivery: false },
        paid: false,
        shipping: {
          country: user.shippingAddress.country,
          city: user.shippingAddress.city,
          street: user.shippingAddress.street,
          zip: user.shippingAddress.zip,
          phone: user.shippingAddress.phone,
          email: user.shippingAddress.email
        },
        items: orderItems,
        weight: totalWeight % 1 !== 0 ? totalWeight.toFixed(1) : totalWeight,
        subtotal: totalPrice,
        shippingCost: 0,
        grandTotal: 0,
        creationTime: String(new Date()),
      };
      localStorage.setItem("order", JSON.stringify(order));
      this.router.navigate(['checkout']);
    } else {
      alert('You must be logged in to continue your shopping!')
    }

  }

}
