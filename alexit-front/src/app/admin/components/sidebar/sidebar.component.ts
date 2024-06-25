import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  userAllowed: any = jwtDecode(this.cookies.get("access_token"));

  constructor(private cookies: CookieService) { }

  ngOnInit(): void {
  }

}
