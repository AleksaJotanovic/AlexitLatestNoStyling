import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AdminHeaderComponent } from './components/admin-header/admin-header.component';
import { RouterOutlet } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AlexitService } from '../services/alexit.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'admin',
  standalone: true,
  imports: [SidebarComponent, RouterOutlet, AdminHeaderComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {

  userAllowed: any = jwtDecode(this.cookies.get("access_token"));



  constructor(private alexit: AlexitService, private cookies: CookieService) { }
  ngOnInit(): void {
    this.alexit.initCategories();
    this.alexit.initProducts();
    this.alexit.initOrders();
    this.alexit.initCouriers();
    this.alexit.initSales();
    this.alexit.initPageViews();
    this.alexit.initUsers();
    this.alexit.initRoles();
    this.alexit.initSubscribers();
  }


}
