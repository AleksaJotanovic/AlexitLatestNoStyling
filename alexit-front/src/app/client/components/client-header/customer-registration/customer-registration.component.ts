import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'customer-registration',
  standalone: true,
  imports: [ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './customer-registration.component.html',
  styleUrl: './customer-registration.component.css',
  providers: [provideNgxMask()]
})
export class CustomerRegistrationComponent {

  @Output() onRegistration = new EventEmitter<{ registrationForm: FormGroup }>();
  @Output() onLogin = new EventEmitter<{ loginForm: FormGroup }>();

  @Input() hasAccount!: boolean;

  registrationForm: FormGroup = new FormGroup({
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]),
    shippingAddress: new FormGroup({
      country: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      street: new FormControl('', [Validators.required]),
      zip: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email])
    })
  });

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });




  emitOnRegistration(registrationForm: FormGroup) {
    this.onRegistration.emit({ registrationForm: registrationForm });
  }

  emitOnLogin(loginForm: FormGroup) {
    this.onLogin.emit({ loginForm: loginForm });
  }


}
