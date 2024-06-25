import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ClientHeaderComponent } from './components/client-header/client-header.component';
import { ClientFooterComponent } from './components/client-footer/client-footer.component';
import { RouterOutlet } from '@angular/router';
import { AlexitService } from '../services/alexit.service';
import { CrudService } from '../services/crud.service';
import { NgStyle } from '@angular/common';
import { CartService } from './services/cart.service';

@Component({
  selector: 'client',
  standalone: true,
  imports: [ClientHeaderComponent, ClientFooterComponent, RouterOutlet, NgStyle],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})
export class ClientComponent implements OnInit {

  pageViews: number = 0;

  @ViewChild('mainRef') main!: ElementRef<HTMLElement>;



  constructor(private alexit: AlexitService, private crud: CrudService, private cartService: CartService) { }
  ngOnInit(): void {
    this.alexit.initCategories();
    this.alexit.initCouriers();
    this.alexit.initProducts();
    this.alexit.initUsers();
    this.alexit.initRoles();
    this.alexit.pageViews$.subscribe({
      next: v => {
        this.pageViews = v;
        if (this.pageViews !== 0) {
          this.pageViews = this.pageViews + 1;
          this.crud.pageViewsPut(this.pageViews).subscribe(() => console.log('Welcome to www.alexit.com'));
        }
      },
      error: (e) => console.log(e)
    });
    this.onInitUsers();
  }


  onInitUsers() {
    if (!localStorage.getItem("customer_id") && !localStorage.getItem("cart")) {
      this.cartService.setCart("cart", []);
    } else if (localStorage.getItem("customer_id") && !localStorage.getItem("cart")) {
      this.crud.userGet(String(localStorage.getItem("customer_id"))).subscribe(v => {
        this.cartService.setCart("cart", v.data.cart);
        this.cartService.computeCartTotals();
      });
    } else if (localStorage.getItem("customer_id") && localStorage.getItem("cart")) {
      this.crud.userGet(String(localStorage.getItem("customer_id"))).subscribe(v => {
        this.cartService.setCart("cart", v.data.cart);
        this.cartService.computeCartTotals();
      });
    } else {
      this.cartService.computeCartTotals();
    }
  }



}