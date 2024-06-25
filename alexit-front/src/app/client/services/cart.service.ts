import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../../../models/product.model';
import { AlexitService } from '../../services/alexit.service';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  totalQuantity$ = new BehaviorSubject<number>(0);

  totalPrice$ = new BehaviorSubject<number>(0);



  constructor(private alexit: AlexitService) { }



  updateUserCart() {
    this.alexit.users$.subscribe({
      next: users => {
        let user = users.find(u => u._id === String(localStorage.getItem("customer_id")));
        if (user) {
          user = { ...user, cart: this.getCart("cart") };
          this.alexit.updateUser(user);
        }
      }
    });
  }

  setCart(key: string, array: any[]) {
    localStorage.setItem(key, JSON.stringify(array));
  }

  getCart(key: string): any[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  saveToCart(key: string, objectToAdd: any) {
    const array = this.getCart(key);
    array.push(objectToAdd);
    this.setCart(key, array);
  }

  updateCart(key: string, updatedObject: any) {
    const array = this.getCart(key);
    const index = array.findIndex((obj: any) => obj.id === updatedObject.id);
    if (index !== -1) {
      array[index] = updatedObject;
      this.setCart(key, array);
    }
  }

  removeItem(key: string, objectIdToRemove: string) {
    if (localStorage.getItem("customer_id")) {
      let array = this.getCart(key);
      let user: any;
      this.alexit.users$.subscribe({ next: v => user = v.find(u => u._id === String(localStorage.getItem("customer_id"))) });
      array = array.filter((obj: any) => obj.id !== objectIdToRemove);
      this.setCart(key, array);
      user = { ...user, cart: this.getCart("cart") };
      this.alexit.updateUser(user);
    } else {
      let array = this.getCart(key);
      array = array.filter((obj: any) => obj.id !== objectIdToRemove);
      this.setCart(key, array);
    }
  }


  addToCart(product: Product) {
    if (localStorage.getItem("customer_id")) {
      let productExists = false;
      let user: any;
      this.alexit.users$.subscribe({ next: v => user = v.find(u => u._id === String(localStorage.getItem("customer_id"))) });

      for (let item of this.getCart("cart")) {
        if (item.product._id === product._id) {
          let updateCartObj = { ...item, quantity: (item.quantity += 1) };
          this.updateCart("cart", updateCartObj);
          user = { ...user, cart: this.getCart("cart") };
          this.alexit.updateUser(user);
          productExists = true;
          break;
        }
      }
      if (!productExists) {
        this.saveToCart("cart", { id: uuid(), product: product, quantity: 1 });
        if (user) {
          user = { ...user, cart: this.getCart("cart") };
          this.alexit.updateUser(user);
        }
      }
      this.computeCartTotals();
    } else {
      let productExists = false;
      for (let item of this.getCart("cart")) {
        if (item.product._id === product._id) {
          let updateCartObj = { ...item, quantity: (item.quantity += 1) };
          this.updateCart("cart", updateCartObj);
          productExists = true;
          break;
        }
      }
      if (!productExists) {
        this.saveToCart("cart", { id: uuid(), product: product, quantity: 1 });
      }
      this.computeCartTotals();
    }
  }


  computeCartTotals() {
    let totalQuantityValue = 0;
    let totalPriceValue = 0;
    for (let item of this.getCart("cart")) {
      totalPriceValue += item.quantity * item.product.price.sale;
      totalQuantityValue += item.quantity;
    }
    this.totalQuantity$.next(totalQuantityValue);
    this.totalPrice$.next(totalPriceValue);
  }

  decrementQuantity(item: any) {
    if (localStorage.getItem("customer_id")) {
      let itemUpdateObj = { ...item, quantity: item.quantity -= 1 };
      let user: any;
      this.alexit.users$.subscribe({ next: v => user = v.find(u => u._id === String(localStorage.getItem("customer_id"))) });
      this.updateCart("cart", itemUpdateObj);
      if (item.quantity === 0) {
        this.computeCartTotals();
        this.removeItem("cart", itemUpdateObj.id);
      } else {
        this.computeCartTotals();
      }
      user = { ...user, cart: this.getCart("cart") };
      this.alexit.updateUser(user);
    } else {
      let itemUpdateObj = { ...item, quantity: item.quantity -= 1 };
      this.updateCart("cart", itemUpdateObj);
      if (item.quantity === 0) {
        this.computeCartTotals();
        this.removeItem("cart", itemUpdateObj.id);
      } else {
        this.computeCartTotals();
      }

    }
  }



}
