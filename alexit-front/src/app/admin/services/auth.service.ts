import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrls } from '../../../middlewares/api.urls';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn$ = new BehaviorSubject<boolean>(false);



  constructor(private http: HttpClient, private cookies: CookieService) { }



  loginService(loginObj: { email: string, password: string }) {
    return this.http.post<any>(`${apiUrls.authApi}login`, loginObj, { withCredentials: true });
  }

  customerLoginService(loginObj: { email: string, password: string }) {
    return this.http.post<any>(`${apiUrls.authApi}customer-login`, loginObj, { withCredentials: true });
  }

  sendEmailService(email: string) {
    return this.http.post<any>(`${apiUrls.authApi}send-email`, { email: email });
  }


  resetPasswordService(resetObj: any) {
    return this.http.post<any>(`${apiUrls.authApi}reset-password`, resetObj);
  }

  isLoggedIn(): boolean {
    return !localStorage.getItem("user_id") && !this.cookies.get("access_token");
  }

  confirmNewsletterSubscription(email: string) {
    return this.http.post<any>(apiUrls.newsletterApi + 'confirm-subscription', { email: email });
  }

}
