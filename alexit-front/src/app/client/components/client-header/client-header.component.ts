import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ScrollHandleService } from '../../services/scroll-handle.service';
import { RouterLink } from '@angular/router';
import { Category } from '../../../../models/category.model';
import { AlexitService } from '../../../services/alexit.service';
import { NgStyle } from '@angular/common';
import { PtIfPipe } from '../../../pipes/pt-if.pipe';
import { CustomerRegistrationComponent } from './customer-registration/customer-registration.component';
import { FormGroup } from '@angular/forms';
import { User } from '../../../../models/user.model';
import { v4 as uuid } from 'uuid';
import { Role } from '../../../../models/role.model';
import { AuthService } from '../../../admin/services/auth.service';
import { CartService } from '../../services/cart.service';
import { CrudService } from '../../../services/crud.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'client-header',
  standalone: true,
  imports: [RouterLink, NgStyle, PtIfPipe, CustomerRegistrationComponent],
  templateUrl: './client-header.component.html',
  styleUrl: './client-header.component.css'
})
export class ClientHeaderComponent implements AfterViewInit, OnInit {

  @ViewChild('header') header!: ElementRef<HTMLElement>;
  @ViewChild('afternav') afternav!: ElementRef<HTMLElement>;

  categories: Category[] = [];
  dropdownCategories: Category[] = [];

  isMenuOpened: boolean = false;
  isDropdownOpened: boolean = false;

  hasAccount: boolean = true;
  roles: Role[] = [];
  totalQuantity: number = 0;
  user!: User;


  accountDropdownDisplay: boolean = false;



  constructor(private scrollHandle: ScrollHandleService, private alexit: AlexitService, private auth: AuthService,
    private cartService: CartService, private crud: CrudService, private cookies: CookieService) { }
  ngAfterViewInit(): void {
    this.scrollHandle.setHeaderHeight(this.header.nativeElement.clientHeight);
  }
  ngOnInit(): void {
    this.alexit.categories$.subscribe({ next: v => this.categories = v });
    this.alexit.roles$.subscribe({ next: v => this.roles = v });
    this.cartService.totalQuantity$.subscribe({ next: v => this.totalQuantity = v });

    if (localStorage.getItem("customer_id") && this.cookies.get("customer_token")) {
      this.crud.userGet(String(localStorage.getItem("customer_id"))).subscribe(v => this.user = v.data);
    }
  }




  @HostListener('window:scroll', []) onScroll() {
    this.scrollHandle.headerOnScroll(window.pageYOffset, this.header.nativeElement, this.afternav.nativeElement);
  };

  setDropdownCategories(parentId: string) {
    this.dropdownCategories = this.categories.filter(c => c.parent._id === parentId);
    this.isDropdownOpened = true;
  }


  register(e: { registrationForm: FormGroup }) {
    const customerBody: User = { ...e.registrationForm.value, _id: uuid(), role: this.roles.find(r => r.name === 'Customer') };
    this.alexit.addUser(customerBody);
    e.registrationForm.reset();
  }

  login(e: { loginForm: FormGroup }) {
    this.auth.customerLoginService(e.loginForm.value).subscribe({
      next: v => {
        alert('Customer Login Successfull!');
        localStorage.setItem("customer_id", v.data._id);
        e.loginForm.reset();
        window.location.reload();
      }
    });
  }

  signout() {
    localStorage.removeItem("customer_id");
    this.cookies.delete("customer_token", "/");
    if (!localStorage.getItem("customer_id") && !this.cookies.get("customer_token")) {
      window.location.reload();
    }
  }


}
