import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'forget-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent {

  forgetPasswordForm: FormGroup = new FormGroup({
    email: new FormControl('', Validators.compose([Validators.required, Validators.email]))
  })



  constructor(private auth: AuthService) { }



  submit() {
    this.auth.sendEmailService(this.forgetPasswordForm.value.email).subscribe({
      next: (val) => {
        alert(val.message);
        this.forgetPasswordForm.reset();
      }, error: (err) => console.log("Error while sending email: ", err)
    })
  }

}
