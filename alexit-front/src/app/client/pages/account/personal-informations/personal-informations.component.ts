import { Component } from '@angular/core';
import { CrudService } from '../../../../services/crud.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { passwordMatch } from '../../../../admin/validators/confirm-password.validator';
import * as bcrypt from 'bcryptjs';
import { NgClass } from '@angular/common';
import { AlexitService } from '../../../../services/alexit.service';
import { User } from '../../../../../models/user.model';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';


@Component({
  selector: 'personal-informations',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgxMaskDirective],
  templateUrl: './personal-informations.component.html',
  styleUrl: './personal-informations.component.css',
  providers: [provideNgxMask()]
})
export class PersonalInformationsComponent {

  user!: User;
  passwordMatching: boolean = false;

  userForm: FormGroup = new FormGroup({
    username: new FormControl(""),
    firstname: new FormControl(""),
    lastname: new FormControl(""),
    email: new FormControl(""),
    shippingAddress: new FormGroup({
      country: new FormControl(""),
      city: new FormControl(""),
      street: new FormControl(""),
      zip: new FormControl(""),
      phone: new FormControl(""),
      email: new FormControl("")
    }),
    creditCard: new FormGroup({
      number: new FormControl(""),
      expiryDate: new FormControl(""),
      cvv: new FormControl("")
    })
  });

  passwordForm: FormGroup = new FormGroup({
    currentPassword: new FormControl(""),
    newPassword: new FormControl(""),
    confirmPassword: new FormControl("")
  }, passwordMatch("newPassword", "confirmPassword"));



  constructor(private crud: CrudService, private alexit: AlexitService) { }
  ngOnInit(): void {
    this.crud.userGet(String(localStorage.getItem("customer_id"))).subscribe(v => {
      this.user = v.data;
      this.userForm.setValue({
        username: v.data.username,
        firstname: v.data.firstname,
        lastname: v.data.lastname,
        email: v.data.email,
        shippingAddress: {
          country: v.data.shippingAddress.country,
          city: v.data.shippingAddress.city,
          street: v.data.shippingAddress.street,
          zip: v.data.shippingAddress.zip,
          phone: v.data.shippingAddress.phone,
          email: v.data.shippingAddress.email
        },
        creditCard: {
          number: v.data.creditCard.number,
          expiryDate: v.data.creditCard.expiryDate,
          cvv: v.data.creditCard.cvv,
        }
      });
    });
  }




  get currentPasswordValue() {
    return this.passwordForm.get('currentPassword')?.value;
  }

  get newPasswordValue() {
    return this.passwordForm.get('newPassword')?.value;
  }

  get newPasswordControl() {
    return this.passwordForm.get('newPassword');
  }

  get confirmPasswordControl() {
    return this.passwordForm.get('confirmPassword');
  }




  async checkCurrentPassword() {
    await bcrypt.compare(this.currentPasswordValue, this.user.password).then(v => {
      if (v === true) {
        this.passwordMatching = true;
      } else {
        this.passwordMatching = false;
      }
    });
  }


  async savePassword() {
    await bcrypt.genSalt(10).then(saltValue => {
      bcrypt.hash(this.confirmPasswordControl?.value, saltValue).then(hashValue => {
        const user: User = { ...this.user, password: hashValue };
        this.alexit.updateUser(user);
      });
    });
  }


  saveUserChanges() {
    const user: User = {
      ...this.user,
      username: this.userForm.value.username,
      firstname: this.userForm.value.firstname,
      lastname: this.userForm.value.lastname,
      email: this.userForm.value.email,
      shippingAddress: {
        country: this.userForm.value.shippingAddress.country,
        city: this.userForm.value.shippingAddress.city,
        street: this.userForm.value.shippingAddress.street,
        zip: this.userForm.value.shippingAddress.zip,
        phone: this.userForm.value.shippingAddress.phone,
        email: this.userForm.value.shippingAddress.email
      },
      creditCard: {
        number: this.userForm.value.creditCard.number,
        expiryDate: this.userForm.value.creditCard.expiryDate,
        cvv: this.userForm.value.creditCard.cvv,
      }
    };
    this.alexit.updateUser(user);
  }



  getNewPasswordError() {
    const control: any = this.newPasswordControl;
    return control.hasError('required')
      ? 'Please enter a valid password'
      : control.hasError('minlength')
        ? 'The minimum password length is 8 characters'
        : control.hasError('maxlength')
          ? 'The maximum password length is 32 characters'
          : control.hasError('invalidPasswordMinLowerCaseLetters')
            ? 'The password must have at least 2 lower case letters [a-z]'
            : '';
  }

  getConfirmPasswordError() {
    const control: any = this.confirmPasswordControl;
    return control.hasError('required')
      ? 'Please confirm the  password'
      : control.hasError('passwordMismatch')
        ? 'The passwords do not match'
        : '';
  }

  disableButton() {
    if (!this.newPasswordValue && !this.confirmPasswordControl?.value && !this.passwordMatching) {
      return true;
    } else if (this.newPasswordValue && this.confirmPasswordControl?.value && this.passwordMatching) {
      return false
    }
    return true;
  }



}
