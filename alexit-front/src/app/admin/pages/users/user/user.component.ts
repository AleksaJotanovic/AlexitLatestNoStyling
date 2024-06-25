import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlexitService } from '../../../../services/alexit.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from '../../../../../models/role.model';
import { User } from '../../../../../models/user.model';

@Component({
  selector: 'user',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {

  roles: Role[] = []

  userForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    role_id: new FormControl('', [Validators.required]),
    shippingAddress: new FormGroup({
      country: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      street: new FormControl('', [Validators.required]),
      zip: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email])
    })
  });


  constructor(private alexit: AlexitService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.alexit.users$.subscribe({
      next: (val) => {
        const user = val.find((v) => v._id === this.route.snapshot.params['id']);
        if (user !== undefined) {
          this.userForm.setValue({
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role_id: user.role._id,
            shippingAddress: user.shippingAddress
          })
        }
      }, error: (err) => console.log('Subscribe error: ', err)
    });
    this.alexit.roles$.subscribe({ next: (val) => this.roles = val, error: (err) => console.log(err) });
  }

  update() {
    const userBody: User = { ...this.userForm.value, _id: this.route.snapshot.params['id'] };
    this.alexit.updateUser(userBody);
    this.userForm.reset();
    this.router.navigate(['admin/users']);
  }

}
