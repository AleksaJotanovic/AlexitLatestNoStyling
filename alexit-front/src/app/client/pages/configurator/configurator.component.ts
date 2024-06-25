import { Component } from '@angular/core';
import { AlexitService } from '../../../services/alexit.service';
import { Product } from '../../../../models/product.model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { User } from '../../../../models/user.model';
import { Courier } from '../../../../models/courier.model';
import { roundToNearestTenth, subPercentage } from '../../../../middlewares/library';

@Component({
  selector: 'configurator',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './configurator.component.html',
  styleUrl: './configurator.component.css'
})
export class ConfiguratorComponent {

  products: Product[] = [];

  users: User[] = [];

  couriers: Courier[] = [];

  configuration: { name: string, cart: Product[] } = { name: '', cart: [] };



  constructor(private alexit: AlexitService, private router: Router) {
    this.alexit.users$.subscribe({ next: (val) => this.users = val, error: (err) => console.log(err) });
    this.alexit.couriers$.subscribe({ next: (val) => this.couriers = val, error: (err) => console.log(err) });
  }



  onModalOpen(modal: HTMLDivElement, e: any) {
    this.alexit.products$.subscribe({ next: v => this.products = v });
    modal.style.display = 'block';
    switch (e.target.id) {
      case 'cpu':
        this.products = this.products.filter(p => p.category.name === 'CPU');
        break;
      case 'cooler':
        this.products = this.products.filter(p => p.category.name === 'Cooler');
        break;
      case 'motherboard':
        this.products = this.products.filter(p => p.category.name === 'Motherboards');
        break;
      case 'gpu':
        this.products = this.products.filter(p => p.category.name === 'GPU');
        break;
      case 'ram':
        this.products = this.products.filter(p => p.category.name === 'RAM');
        break;
      case 'hdd':
        this.products = this.products.filter(p => p.category.name === 'HDD');
        break;
      case 'ssd':
        this.products = this.products.filter(p => p.category.name === 'SSD');
        break;
      case 'computerCase':
        this.products = this.products.filter(p => p.category.name === 'Computer Case');
        break;
      case 'powerSupply':
        this.products = this.products.filter(p => p.category.name === 'Power Supply');
        break;
      case 'monitor':
        this.products = this.products.filter(p => p.category.name === 'Monitors');
        break;
    }
  }


  choose(product: Product) {
    this.configuration.cart.push(product);
  }

  goToPayment() {
    let randomOrderNumber = Math.floor(Math.random() * 1000) + 1000;
    const user = this.users.find(u => u._id === String(localStorage.getItem("customer_id")));

    let orderItems: any[] = [];
    for (let item of this.configuration.cart) {
      orderItems.push({
        product_id: item._id,
        image: item.images[0],
        name: item.name,
        price: item.price.onDiscount.state ? (subPercentage(item.price.sale, item.price.onDiscount.rate)) : item.price.sale,
        quantity: 1,
        weight: roundToNearestTenth(item.weight)
      });
    }

    const totalWeight = orderItems.reduce((prev: number, cur: any) => prev + cur.weight, 0);
    const totalPrice = orderItems.reduce((prev: number, cur: any) => prev + cur.price, 0);

    if (user) {
      const order = {
        number: String(randomOrderNumber),
        user: { _id: user._id, username: user.username, note: '' },
        courier: { _id: '', name: '' },
        pcBuild: true,
        pcBuildName: this.configuration.name,
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
      if (localStorage.getItem("order")) this.router.navigate(["configuration-cart"]);
    } else {
      alert('You must log in to order yuor configuration!');
    }

  }

}
