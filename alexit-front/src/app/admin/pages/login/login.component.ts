import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  logIn() {
    this.auth.loginService(this.loginForm.value).subscribe({
      next: (val) => {
        alert("Login successfull!");
        localStorage.setItem("user_id", val.data._id);
        this.auth.isLoggedIn$.next(true);
        this.router.navigate(["admin"]);
        this.loginForm.reset();
      }
    });
  }

}
